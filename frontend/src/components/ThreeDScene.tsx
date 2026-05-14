"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Points, PointMaterial, Torus, Line } from "@react-three/drei";
import * as THREE from "three";

function NeuralNetwork({ count = 40 }) {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < count; i++) {
      p.push(new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ));
    }
    return p;
  }, [count]);

  const lines = useMemo(() => {
    const l = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if (points[i].distanceTo(points[j]) < 3) {
          l.push([points[i], points[j]]);
        }
      }
    }
    return l;
  }, [points]);

  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {lines.map((points, i) => (
        <Line
          key={i}
          points={points}
          color="#06b6d4"
          lineWidth={0.5}
          transparent
          opacity={0.1}
        />
      ))}
      <Points positions={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))} stride={3}>
        <PointMaterial
          transparent
          color="#22d3ee"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.5}
        />
      </Points>
    </group>
  );
}

function NeuralCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.2;
      coreRef.current.rotation.y = t * 0.3;
      coreRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.5;
      ring1Ref.current.rotation.x = t * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.3;
      ring2Ref.current.rotation.y = t * 0.4;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = t * 0.6;
      ring3Ref.current.rotation.z = t * 0.1;
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[1.2, 64, 64]} ref={coreRef}>
          <MeshDistortMaterial
            color="#06b6d4"
            attach="material"
            distort={0.5}
            speed={4}
            roughness={0.1}
            metalness={1}
            transparent
            opacity={0.3}
            wireframe
          />
        </Sphere>
        
        {/* Glowing Energy Core */}
        <Sphere args={[0.4, 32, 32]}>
          <meshStandardMaterial 
            color="#22d3ee" 
            emissive="#06b6d4" 
            emissiveIntensity={10} 
            transparent 
            opacity={0.9} 
          />
        </Sphere>

        {/* Rotating Holographic Rings */}
        <Torus args={[1.8, 0.015, 16, 100]} ref={ring1Ref}>
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.4} />
        </Torus>
        <Torus args={[2.2, 0.01, 16, 100]} ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#2563eb" transparent opacity={0.3} />
        </Torus>
        <Torus args={[2.8, 0.005, 16, 100]} ref={ring3Ref} rotation={[0, Math.PI / 4, 0]}>
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.2} />
        </Torus>
      </Float>
    </group>
  );
}

function MedicalParticles({ count = 4000 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = r * Math.cos(phi);
    }
    return p;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <Points ref={pointsRef} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#06b6d4"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.2}
      />
    </Points>
  );
}

function SceneContent() {
  const { mouse } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, (mouse.x * Math.PI) / 12, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, (-mouse.y * Math.PI) / 12, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      <NeuralCore />
      <NeuralNetwork />
      <MedicalParticles />
    </group>
  );
}

export default function ThreeDScene() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 40 }}>
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={3} color="#06b6d4" />
        <pointLight position={[-10, -10, -10]} intensity={2} color="#2563eb" />
        <spotLight position={[0, 10, 0]} intensity={2} color="#ffffff" angle={0.5} penumbra={1} />
        <SceneContent />
      </Canvas>
    </div>
  );
}
