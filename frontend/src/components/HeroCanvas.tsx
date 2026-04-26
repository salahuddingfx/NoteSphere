"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useInView } from "framer-motion";

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = time * 0.2;
    meshRef.current.rotation.y = time * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={2.4}>
        <MeshDistortMaterial
          color="#4338ca"
          attach="material"
          distort={0.4}
          speed={1.5}
          roughness={0}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out", delay: 0.5 }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
      {isInView && !hasError ? (
        <Canvas 
          dpr={[1, 1.5]} 
          gl={{ 
            antialias: false, 
            powerPreference: "low-power",
            failIfMajorPerformanceCaveat: true
          }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (event) => {
              event.preventDefault();
              setHasError(true);
              console.warn('HeroCanvas: WebGL context lost.');
            }, false);
          }}
          onError={() => setHasError(true)}
          camera={{ position: [0, 0, 5], fov: 75 }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#06b6d4" />
          <AnimatedSphere />
        </Canvas>
      ) : (
        <div className="absolute inset-0 bg-black">
           <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600 rounded-full blur-[120px] animate-pulse delay-700" />
           </div>
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_70%)]" />
        </div>
      )}
    </div>
  );
}

