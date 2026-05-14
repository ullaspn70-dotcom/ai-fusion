"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export interface BiometricReading {
  heartRate: number;
  rrIntervals: number[];
  timestamp: number;
  source: "bluetooth" | "camera";
  confidence: number;
}

export interface ScanReport {
  id: string;
  date: string;
  avgHeartRate: number;
  minHeartRate: number;
  maxHeartRate: number;
  hrvScore: number;
  readinessScore: number;
  duration: number;
  readings: BiometricReading[];
  selectedOrgan: string | null;
  organHealth: Record<string, number>;
}

// --- Web Bluetooth Heart Rate Service ---
export function useBluetoothHR() {
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [connected, setConnected] = useState(false);
  const [heartRate, setHeartRate] = useState(0);
  const [rrIntervals, setRrIntervals] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);

  const connect = useCallback(async () => {
    try {
      setError(null);
      const dev = await navigator.bluetooth.requestDevice({
        filters: [{ services: ["heart_rate"] }],
        optionalServices: ["battery_service"],
      });
      setDevice(dev);

      const server = await dev.gatt!.connect();
      const service = await server.getPrimaryService("heart_rate");
      const characteristic = await service.getCharacteristic("heart_rate_measurement");
      characteristicRef.current = characteristic;

      await characteristic.startNotifications();
      characteristic.addEventListener("characteristicvaluechanged", (event: Event) => {
        const value = (event.target as BluetoothRemoteGATTCharacteristic).value!;
        const flags = value.getUint8(0);
        const is16Bit = (flags & 0x01) !== 0;
        const hr = is16Bit ? value.getUint16(1, true) : value.getUint8(1);
        setHeartRate(hr);

        const hasRR = (flags & 0x10) !== 0;
        if (hasRR) {
          const rrs: number[] = [];
          let offset = is16Bit ? 3 : 2;
          while (offset < value.byteLength) {
            rrs.push(value.getUint16(offset, true));
            offset += 2;
          }
          setRrIntervals(rrs);
        }
      });

      setConnected(true);
    } catch (err: any) {
      setError(err?.message || "Failed to connect to Bluetooth device");
      setConnected(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (device?.gatt?.connected) {
      device.gatt.disconnect();
    }
    setConnected(false);
    setDevice(null);
    setHeartRate(0);
  }, [device]);

  return { connect, disconnect, connected, heartRate, rrIntervals, error, deviceName: device?.name };
}

// --- Camera-Based Heart Rate (rPPG) ---
export function useCameraHR() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [heartRate, setHeartRate] = useState(0);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const signalBuffer = useRef<number[]>([]);
  const frameRef = useRef<number>(0);

  const start = useCallback(async (video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
    try {
      setError(null);
      videoRef.current = video;
      canvasRef.current = canvas;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 320, height: 240 },
      });
      video.srcObject = stream;
      await video.play();
      setActive(true);
      signalBuffer.current = [];
      processFrames();
    } catch (err: any) {
      setError(err?.message || "Camera access denied");
    }
  }, []);

  const processFrames = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !active) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const measure = () => {
      if (!videoRef.current || !canvasRef.current) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Sample green channel from forehead region (center-top of frame)
      const regionX = Math.floor(canvas.width * 0.35);
      const regionY = Math.floor(canvas.height * 0.15);
      const regionW = Math.floor(canvas.width * 0.3);
      const regionH = Math.floor(canvas.height * 0.15);

      const imageData = ctx.getImageData(regionX, regionY, regionW, regionH);
      const pixels = imageData.data;

      let greenSum = 0;
      let count = 0;
      for (let i = 1; i < pixels.length; i += 4) {
        greenSum += pixels[i]; // Green channel
        count++;
      }
      const avgGreen = greenSum / count;
      signalBuffer.current.push(avgGreen);

      // Keep last 300 frames (~10 seconds at 30fps)
      if (signalBuffer.current.length > 300) {
        signalBuffer.current.shift();
      }

      // Estimate HR from signal every 150 frames
      if (signalBuffer.current.length >= 150 && signalBuffer.current.length % 30 === 0) {
        const hr = estimateHRFromSignal(signalBuffer.current);
        if (hr > 40 && hr < 200) {
          setHeartRate(Math.round(hr));
        }
      }

      frameRef.current = requestAnimationFrame(measure);
    };

    frameRef.current = requestAnimationFrame(measure);
  }, [active]);

  const stop = useCallback(() => {
    setActive(false);
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setHeartRate(0);
  }, []);

  return { start, stop, active, heartRate, error };
}

function estimateHRFromSignal(signal: number[]): number {
  // Simple peak detection for rPPG
  // Bandpass: remove DC component
  const mean = signal.reduce((a, b) => a + b, 0) / signal.length;
  const centered = signal.map((v) => v - mean);

  // Count zero-crossings (rough frequency estimation)
  let crossings = 0;
  for (let i = 1; i < centered.length; i++) {
    if ((centered[i - 1] < 0 && centered[i] >= 0) || (centered[i - 1] >= 0 && centered[i] < 0)) {
      crossings++;
    }
  }

  const durationSeconds = signal.length / 30; // assuming ~30 fps
  const frequency = crossings / 2 / durationSeconds; // zero-crossings / 2 = cycles
  return frequency * 60; // Convert Hz to BPM
}

// --- HRV Calculator ---
export function computeHRV(rrIntervals: number[]): number {
  if (rrIntervals.length < 2) return 0;
  let sumSquaredDiff = 0;
  for (let i = 1; i < rrIntervals.length; i++) {
    const diff = rrIntervals[i] - rrIntervals[i - 1];
    sumSquaredDiff += diff * diff;
  }
  return Math.sqrt(sumSquaredDiff / (rrIntervals.length - 1)); // RMSSD
}

// --- Readiness Engine ---
export function computeReadiness(currentHR: number, currentHRV: number, baselineHR = 70, baselineHRV = 40): number {
  const hrDeviation = (baselineHR - currentHR) / baselineHR;
  const hrScore = Math.max(0, Math.min(100, 50 + hrDeviation * 100));
  const hrvDeviation = (currentHRV - baselineHRV) / baselineHRV;
  const hrvScore = Math.max(0, Math.min(100, 50 + hrvDeviation * 100));
  return Math.round(hrScore * 0.4 + hrvScore * 0.6);
}

// --- Report Storage (IndexedDB) ---
const DB_NAME = "vitalis_reports";
const STORE_NAME = "reports";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveReport(report: ScanReport): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(report);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllReports(): Promise<ScanReport[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteReport(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
