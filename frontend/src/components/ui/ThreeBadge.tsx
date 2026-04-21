"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshWobbleMaterial, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

interface BadgeProps {
  rank: string;
}

function BadgeModel({ rank }: { rank: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.z += 0.005;
    }
  });

  const config = useMemo(() => {
    const r = rank.toLowerCase();
    if (r.includes("bronze")) return { color: "#cd7f32", geometry: <octahedronGeometry args={[1, 0]} />, distort: 0 };
    if (r.includes("silver")) return { color: "#c0c0c0", geometry: <icosahedronGeometry args={[1, 0]} />, distort: 0 };
    if (r.includes("gold")) return { color: "#ffd700", geometry: <torusKnotGeometry args={[0.7, 0.2, 128, 16]} />, distort: 0 };
    if (r.includes("platinum")) return { color: "#e5e4e2", geometry: <dodecahedronGeometry args={[1, 0]} />, distort: 0.2 };
    if (r.includes("diamond")) return { color: "#b9f2ff", geometry: <tetrahedronGeometry args={[1, 0]} />, distort: 0.4 };
    if (r.includes("nexus")) return { color: "#6366f1", geometry: <sphereGeometry args={[1, 64, 64]} />, distort: 0.6 };
    return { color: "#4f46e5", geometry: <boxGeometry args={[1, 1, 1]} />, distort: 0 };
  }, [rank]);

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        {config.geometry}
        {config.distort > 0 ? (
          <MeshDistortMaterial
            color={config.color}
            speed={2}
            distort={config.distort}
            radius={1}
          />
        ) : (
          <MeshWobbleMaterial
            color={config.color}
            speed={1}
            factor={0.2}
          />
        )}
      </mesh>
    </Float>
  );
}

export default function ThreeBadge({ rank }: BadgeProps) {
  return (
    <div className="h-48 w-48 relative">
       {/* Glow Effect */}
       <div className="absolute inset-0 bg-indigo-500/10 blur-[50px] rounded-full animate-pulse" />
       
       <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          
          <BadgeModel rank={rank} />
          
          <OrbitControls enableZoom={false} enablePan={false} />
       </Canvas>
    </div>
  );
}
