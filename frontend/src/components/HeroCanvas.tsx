"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";

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
    <div ref={containerRef} className="absolute inset-0 -z-10 h-full w-full">
      <Canvas 
        dpr={[1, 1.5]} 
        gl={{ 
          antialias: false, 
          powerPreference: "high-performance",
          preserveDrawingBuffer: false
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            console.warn('HeroCanvas: WebGL context lost.');
          }, false);
          gl.domElement.addEventListener('webglcontextrestored', () => {
            console.log('HeroCanvas: WebGL context restored.');
          }, false);
        }}
        camera={{ position: [0, 0, 5], fov: 75 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#06b6d4" />
        <AnimatedSphere />
      </Canvas>
    </div>
  );
}

