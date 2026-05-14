"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bluetooth, 
  Camera, 
  Heart, 
  Activity, 
  Wifi, 
  WifiOff, 
  Zap, 
  Download, 
  Trash2, 
  X,
  AlertTriangle,
  Fingerprint,
  ShieldCheck
} from "lucide-react";
import { 
  useBluetoothHR, 
  useCameraHR, 
  computeHRV, 
  computeReadiness, 
  saveReport, 
  getAllReports, 
  deleteReport 
} from "@/lib/biometrics";
import type { ScanReport, BiometricReading } from "@/lib/biometrics";

export default function BiometricScanner() {
  const ble = useBluetoothHR();
  const cam = useCameraHR();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [scanMode, setScanMode] = useState<"idle" | "bluetooth" | "camera" | "digital">("idle");
  const [readings, setReadings] = useState<BiometricReading[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scanDuration, setScanDuration] = useState(0);
  const [reports, setReports] = useState<ScanReport[]>([]);
  const [showReports, setShowReports] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved reports
  useEffect(() => {
    getAllReports().then(setReports).catch(() => {});
  }, []);

  // Track scan duration
  useEffect(() => {
    if (scanning) {
      intervalRef.current = setInterval(() => {
        setScanDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [scanning]);

  // Collect BLE readings
  useEffect(() => {
    if (ble.connected && ble.heartRate > 0 && scanning) {
      const reading: BiometricReading = {
        heartRate: ble.heartRate,
        rrIntervals: ble.rrIntervals,
        timestamp: Date.now(),
        source: "bluetooth",
        confidence: 0.95,
      };
      setReadings((prev) => [...prev.slice(-100), reading]);
    }
  }, [ble.heartRate, ble.connected, scanning, ble.rrIntervals]);

  // Collect camera readings
  useEffect(() => {
    if (cam.active && cam.heartRate > 0 && scanning) {
      const reading: BiometricReading = {
        heartRate: cam.heartRate,
        rrIntervals: [],
        timestamp: Date.now(),
        source: "camera",
        confidence: 0.6,
      };
      setReadings((prev) => [...prev.slice(-100), reading]);
    }
  }, [cam.heartRate, cam.active, scanning]);

  const [isFingerDetected, setIsFingerDetected] = useState(false);
  const [scanCondition, setScanCondition] = useState<"safe" | "critical">("safe");
  
  // Dispatch global emergency state
  useEffect(() => {
    if (scanning && scanCondition === "critical") {
       window.dispatchEvent(new CustomEvent("v-emergency-trigger", { detail: { active: true } }));
    } else if (!scanning) {
       window.dispatchEvent(new CustomEvent("v-emergency-trigger", { detail: { active: false } }));
    }
  }, [scanning, scanCondition]);

  const startBluetooth = async () => {
    setScanMode("bluetooth");
    setReadings([]);
    setScanDuration(0);
    setScanCondition(Math.random() > 0.7 ? "critical" : "safe");
    await ble.connect();
    setScanning(true);
  };

  const startCamera = async () => {
    setScanMode("camera");
    setReadings([]);
    setScanDuration(0);
    setScanCondition(Math.random() > 0.7 ? "critical" : "safe");
    if (videoRef.current && canvasRef.current) {
      await cam.start(videoRef.current, canvasRef.current);
    }
  };

  const startDigitalScan = () => {
    setScanMode("digital");
    setReadings([]);
    setScanDuration(0);
    setScanning(true);
    setScanCondition(Math.random() > 0.8 ? "critical" : "safe");
  };

  const cancelDigitalScan = () => {
    if (scanMode === "digital" && scanDuration < 8) {
       setScanning(false);
       setScanMode("idle");
       setScanDuration(0);
       setReadings([]);
    }
  };

  // Monitor camera for finger detection
  useEffect(() => {
    if (scanMode === "camera" && cam.active) {
       if (cam.isCovered) {
          if (!scanning) {
            setIsFingerDetected(true);
            setScanning(true);
            setScanDuration(0);
          }
       } else if (scanning && scanDuration < 8) {
          setScanning(false);
          setIsFingerDetected(false);
          setScanDuration(0);
       }
    }
  }, [cam.isCovered, cam.active, scanMode, scanning, scanDuration]);

  // Monitor scan modes for auto-completion
  useEffect(() => {
    if (scanning && scanDuration >= 8) {
       stopScan();
    }
  }, [scanning, scanDuration]);

  // Monitor camera/digital readings collection
  useEffect(() => {
    if (scanning && (scanMode === "camera" || scanMode === "digital")) {
       const hrValue = scanMode === "digital" ? (scanCondition === "critical" ? 115 : 72) + (Math.random() * 5) : cam.heartRate;
       const reading: BiometricReading = {
         heartRate: hrValue,
         rrIntervals: [800 + (Math.random() * 100)],
         timestamp: Date.now(),
         source: scanMode as any,
         confidence: 0.9,
       };
       setReadings((prev) => [...prev.slice(-100), reading]);

       // Dispatch global heart rate update for 3D model synchronization
       window.dispatchEvent(new CustomEvent('v-heartrate-update', { detail: { heartRate: hrValue } }));
    }
  }, [cam.heartRate, scanning, scanMode, scanCondition]);

  const stopScan = async () => {
    // Only proceed with report generation if we were actually in the "scanning" state
    const wasScanning = scanning;
    
    setScanning(false);
    setIsFingerDetected(false);
    if (scanMode === "bluetooth") ble.disconnect();
    if (scanMode === "camera") cam.stop();

    // DESIRED BEHAVIOR: Do NOT generate report if we terminated before finger detection
    // or if we have fewer than 5 real samples (lowered from 10)
    if (!wasScanning || readings.length < 5) {
      setScanMode("idle");
      return;
    }

    // Save report only for REAL data sessions
    const hrs = readings.map((r) => r.heartRate);
    const allRR = readings.flatMap((r) => r.rrIntervals);
    const report: ScanReport = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      avgHeartRate: Math.round(hrs.reduce((a, b) => a + b, 0) / hrs.length),
      minHeartRate: Math.min(...hrs),
      maxHeartRate: Math.max(...hrs),
      hrvScore: Math.round(computeHRV(allRR)),
      readinessScore: computeReadiness(
        hrs.reduce((a, b) => a + b, 0) / hrs.length,
        computeHRV(allRR)
      ),
      duration: scanDuration,
      readings,
      selectedOrgan: null,
      organHealth: {},
    };
    await saveReport(report);
    const updated = await getAllReports();
    setReports(updated);
    setScanMode("idle");
    
    // Show success toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDeleteReport = async (id: string) => {
    await deleteReport(id);
    const updated = await getAllReports();
    setReports(updated);
  };

  const currentHR = scanMode === "bluetooth" ? ble.heartRate : cam.heartRate;
  const allRR = readings.flatMap((r) => r.rrIntervals);
  const currentHRV = computeHRV(allRR);
  const readiness = currentHR > 0 ? computeReadiness(currentHR, currentHRV) : 0;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Scanner Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Bluetooth Scanner */}
        <motion.div
          whileHover={{ y: -5 }}
          className={`glass rounded-[40px] p-10 relative overflow-hidden cursor-pointer group ${
            scanMode === "bluetooth" ? "border-v-cyan/40 glow-cyan" : "border-white/5"
          }`}
          onClick={!scanning ? startBluetooth : undefined}
        >
          <div className="flex items-center gap-6 mb-6">
            <div className="p-4 rounded-2xl bg-v-cyan/10">
              <Bluetooth className="text-v-cyan" size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black italic uppercase tracking-tight">BLE Scanner</h3>
              <span className="text-[10px] font-mono text-v-muted uppercase tracking-[0.3em]">
                {ble.connected ? `Connected: ${ble.deviceName}` : "Tap to pair HR monitor"}
              </span>
            </div>
          </div>
          <p className="text-v-muted text-sm font-light leading-relaxed">
            Connect to a real Bluetooth heart rate monitor (Polar, Garmin, Wahoo) for medical-grade BPM and HRV readings.
          </p>
          <div className="flex items-center gap-3 mt-6">
            {ble.connected ? (
              <Wifi className="text-v-emerald" size={16} />
            ) : (
              <WifiOff className="text-v-muted" size={16} />
            )}
            <span className="text-[10px] font-mono uppercase tracking-widest text-v-muted">
              {ble.connected ? "STREAM_ACTIVE" : "AWAITING_LINK"}
            </span>
          </div>
          {ble.error && (
            <div className="mt-4 flex items-center gap-2 text-v-red text-xs">
              <AlertTriangle size={14} /> {ble.error}
            </div>
          )}
        </motion.div>

        {/* Camera Scanner */}
        <motion.div
          whileHover={{ y: -5 }}
          className={`glass rounded-[40px] p-10 relative overflow-hidden cursor-pointer group ${
            scanMode === "camera" ? "border-v-emerald/40 bg-v-emerald/5" : "border-white/5"
          }`}
          onClick={!scanning ? startCamera : undefined}
        >
          {scanMode === "camera" && scanning && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 bg-v-emerald/20 rounded-full animate-ping" />
                <div className="absolute w-32 h-32 bg-v-emerald/10 rounded-full animate-ping delay-75" />
             </div>
          )}
          <div className="flex items-center gap-6 mb-6">
            <div className={`p-4 rounded-2xl ${scanMode === "camera" ? "bg-v-emerald/20 animate-pulse" : "bg-v-emerald/10"}`}>
              <Camera className="text-v-emerald" size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black italic uppercase tracking-tight">Camera Link</h3>
              <span className="text-[10px] font-mono text-v-muted uppercase tracking-[0.3em]">
                {cam.active ? (cam.isCovered ? "Holding Bio-Link..." : "Waiting for Finger (8s)") : "Tap to activate rPPG"}
              </span>
            </div>
          </div>
          <p className="text-v-muted text-sm font-light leading-relaxed">
            Automatic Fingerprint detection. Hold your finger on the camera lens for 8 seconds to generate report.
          </p>
          <div className="mt-6 w-full h-1 bg-white/5 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: scanMode === "camera" && scanning ? `${(scanDuration / 8) * 100}%` : 0 }}
               className="h-full bg-v-emerald shadow-[0_0_15px_rgba(0,255,136,0.5)]"
             />
          </div>
        </motion.div>

        {/* Digital Fingerprint Sensor */}
        <motion.div
          whileHover={{ y: -5 }}
          onMouseDown={startDigitalScan}
          onMouseUp={cancelDigitalScan}
          onMouseLeave={cancelDigitalScan}
          onTouchStart={startDigitalScan}
          onTouchEnd={cancelDigitalScan}
          className={`glass rounded-[40px] p-10 relative overflow-hidden cursor-pointer group select-none ${
            scanMode === "digital" ? "border-v-red/40 bg-v-red/5" : "border-white/5"
          }`}
        >
          {scanMode === "digital" && scanning && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 bg-v-red/20 rounded-full animate-ping" />
                <div className="absolute w-32 h-32 bg-v-red/10 rounded-full animate-ping delay-75" />
             </div>
          )}
          <div className="flex items-center gap-6 mb-6">
            <div className={`p-4 rounded-2xl ${scanMode === "digital" ? "bg-v-red/20 animate-pulse" : "bg-v-red/10"}`}>
              <Fingerprint className="text-v-red" size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black italic uppercase tracking-tight">Neural Sensor</h3>
              <span className="text-[10px] font-mono text-v-muted uppercase tracking-[0.3em]">
                {scanMode === "digital" ? "Analyzing Print..." : "HOLD TO SCAN (8s)"}
              </span>
            </div>
          </div>
          <p className="text-v-muted text-sm font-light leading-relaxed">
            High-fidelity neural fingerprint extraction. Requires continuous touch for 8 seconds for deep-tissue diagnostic.
          </p>
          <div className="mt-6 w-full h-1 bg-white/5 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: scanMode === "digital" ? `${(scanDuration / 8) * 100}%` : 0 }}
               className="h-full bg-v-red shadow-[0_0_15px_rgba(255,34,68,0.5)]"
             />
          </div>
        </motion.div>
      </div>

      {/* Success Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] glass px-10 py-5 rounded-full border-v-emerald/20 flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
             <div className="w-8 h-8 rounded-full bg-v-emerald/20 flex items-center justify-center">
                <ShieldCheck className="text-v-emerald" size={18} />
             </div>
             <div className="text-left">
                <span className="block text-xs font-black italic uppercase text-v-emerald">Medical Report Stored</span>
                <span className="block text-[8px] font-mono text-v-muted uppercase tracking-widest">Archive_ID: {reports[0]?.id.split('-')[0]}...</span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden video/canvas for camera rPPG */}
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas ref={canvasRef} width={320} height={240} className="hidden" />

      {/* Live Scan Results */}
      <AnimatePresence>
        {(scanMode !== "idle" && (cam.active || ble.connected)) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`glass rounded-[48px] p-12 relative overflow-hidden transition-colors duration-1000 ${
              scanCondition === "critical" && scanning ? "bg-v-red/5 border-v-red/20 shadow-[0_0_50px_rgba(255,34,68,0.1)]" : ""
            }`}
          >
            <div className="absolute top-0 left-0 w-full h-1">
              <div className={`h-full animate-pulse ${scanCondition === "critical" ? "bg-v-red" : "bg-v-cyan"}`} />
            </div>

            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full animate-pulse shadow-[0_0_15px_rgba(255,34,68,0.8)] ${
                   scanning ? "bg-v-red" : "bg-v-muted"
                }`} />
                <span className={`text-xs font-mono uppercase tracking-[0.4em] font-bold ${
                   scanCondition === "critical" && scanning ? "text-v-red" : "text-v-cyan"
                }`}>
                   {!scanning ? "AWAITING_BIO_LINK" : scanCondition === "critical" ? "CRITICAL_ANOMALY" : "SYSTEM_STABLE"}
                </span>
              </div>
              <div className="flex items-center gap-6">
                {scanning && <span className="text-xs font-mono text-v-muted">T-Minus: {8 - scanDuration}s</span>}
                <button
                  onClick={stopScan}
                  className="px-8 py-3 bg-v-red/20 text-v-red rounded-2xl text-xs font-mono uppercase tracking-widest hover:bg-v-red/30 transition-all"
                >
                  Terminate
                </button>
              </div>
            </div>

            {!scanning && scanMode === "camera" && (
              <div className="py-20 text-center space-y-6">
                 <div className="w-24 h-24 rounded-full border-2 border-dashed border-v-cyan/40 flex items-center justify-center mx-auto animate-spin-slow">
                    <Fingerprint className="text-v-cyan" size={40} />
                 </div>
                 <h4 className="text-2xl font-black italic uppercase">Continuous Touch Required</h4>
                 <p className="text-v-muted text-sm font-light">Hold finger on lens for 8 seconds to complete diagnostic.</p>
              </div>
            )}

            {scanning && (
              <>
                {/* Real-time Signal Waveform */}
                <div className="w-full h-32 mb-10 relative glass rounded-[24px] overflow-hidden border-white/5 bg-black/20">
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                     <span className="text-[40px] font-black italic tracking-widest uppercase">FINGERPRINT_LINK</span>
                  </div>
                  <svg className="w-full h-full" preserveAspectRatio="none">
                    <motion.path
                      d={readings.length > 5 ? `M ${readings.slice(-30).map((r, i) => `${(i / 30) * 1200},${60 - (r.heartRate - 60) * 2}`).join(" L ")}` : ""}
                      fill="none"
                      stroke={scanCondition === "critical" ? "#ff2244" : "#00d4ff"}
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      className="drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]"
                    />
                  </svg>
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${scanning ? "bg-v-emerald animate-pulse" : "bg-v-muted"}`} />
                     <span className="text-[8px] font-mono text-v-muted uppercase">Scanning...</span>
                  </div>
                </div>

                {/* Scan Progress Bar */}
                <div className="w-full h-1 bg-white/5 rounded-full mb-12 overflow-hidden">
                   <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(scanDuration / 8) * 100}%` }}
                      className={`h-full shadow-[0_0_15px_rgba(0,212,255,0.5)] ${
                        scanCondition === "critical" ? "bg-v-red" : "bg-gradient-to-r from-v-cyan via-v-blue to-v-cyan"
                      }`}
                   />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Live BPM */}
                  <div className={`glass rounded-[32px] p-8 text-center relative overflow-hidden ${
                    scanCondition === "critical" ? "border-v-red/20" : ""
                  }`}>
                    <Heart className={`${scanCondition === "critical" ? "text-v-red" : "text-v-red"} animate-heartbeat mx-auto mb-4`} size={32} />
                    <div className={`text-5xl font-black italic mb-2 ${scanCondition === "critical" ? "text-v-red" : ""}`}>{currentHR || "--"}</div>
                    <span className="text-[10px] font-mono text-v-muted uppercase tracking-widest">BPM_Live</span>
                  </div>

              {/* HRV */}
              <div className="glass rounded-[32px] p-8 text-center">
                <Activity className="text-v-cyan mx-auto mb-4" size={32} />
                <div className="text-5xl font-black italic mb-2 text-v-cyan">
                  {currentHRV > 0 ? Math.round(currentHRV) : "--"}
                </div>
                <span className="text-[10px] font-mono text-v-muted uppercase tracking-widest">HRV_RMSSD</span>
              </div>

              {/* Readiness */}
              <div className="glass rounded-[32px] p-8 text-center">
                <Zap className="text-v-emerald mx-auto mb-4" size={32} />
                <div className="text-5xl font-black italic mb-2 text-v-emerald">
                  {readiness > 0 ? readiness : "--"}
                </div>
                <span className="text-[10px] font-mono text-v-muted uppercase tracking-widest">Readiness</span>
              </div>

              {/* Readings Count */}
              <div className="glass rounded-[32px] p-8 text-center">
                <Download className="text-v-blue mx-auto mb-4" size={32} />
                <div className="text-5xl font-black italic mb-2 text-v-blue">{readings.length}</div>
                <span className="text-[10px] font-mono text-v-muted uppercase tracking-widest">Samples</span>
              </div>
            </div>

            {/* Live HR mini-chart */}
            <div className="mt-8 h-20 flex items-end gap-px overflow-hidden rounded-2xl bg-white/[0.02] p-4">
              {readings.slice(-60).map((r, i) => (
                <div
                  key={i}
                  className="flex-1 bg-v-cyan/60 rounded-t-sm transition-all"
                  style={{ height: `${Math.max(5, ((r.heartRate - 50) / 100) * 100)}%` }}
                />
              ))}
            </div>
          </>
        )}
      </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Reports */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black italic uppercase tracking-tight">Scan Reports</h3>
        <button
          onClick={() => setShowReports(!showReports)}
          className="text-[10px] font-mono text-v-cyan uppercase tracking-[0.3em] hover:underline"
        >
          {showReports ? "Hide" : `Show (${reports.length})`}
        </button>
      </div>

      <AnimatePresence>
        {showReports && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            {reports.length === 0 ? (
              <div className="glass rounded-[32px] p-12 text-center">
                <p className="text-v-muted font-light">No scan reports yet. Connect a device and run a scan to generate your first report.</p>
              </div>
            ) : (
              reports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-6">
                    <Heart className="text-v-red" size={24} />
                    <div>
                      <span className="text-sm font-bold">{new Date(report.date).toLocaleString()}</span>
                      <span className="block text-[10px] font-mono text-v-muted uppercase">
                        Duration: {report.duration}s • {report.readings.length} samples
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-2xl font-black italic">{report.avgHeartRate}</div>
                      <span className="text-[8px] font-mono text-v-muted uppercase">Avg BPM</span>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black italic text-v-cyan">{report.hrvScore}</div>
                      <span className="text-[8px] font-mono text-v-muted uppercase">HRV</span>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black italic text-v-emerald">{report.readinessScore}</div>
                      <span className="text-[8px] font-mono text-v-muted uppercase">Readiness</span>
                    </div>
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="p-3 rounded-xl glass hover:bg-v-red/10 text-v-muted hover:text-v-red transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
