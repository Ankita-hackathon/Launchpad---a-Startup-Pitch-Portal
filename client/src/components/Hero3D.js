import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, Environment, Lightformer } from '@react-three/drei';

export default function Hero3D() {
  const mesh = useRef();

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.2;
      mesh.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <>
      {/* Custom Environment to create stunning reflections on the glass */}
      <Environment resolution={512}>
        <group rotation={[-Math.PI / 4, -0.3, 0]}>
          <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 0.1, 1]} />
          <Lightformer rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[20, 0.5, 1]} />
          <Lightformer rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 1, 1]} />
          {/* Inject brand colors into the reflections */}
          <Lightformer color="#a855f7" intensity={5} rotation-y={Math.PI / 2} position={[-5, 2, -1]} scale={[20, 1, 1]} />
          <Lightformer color="#3b82f6" intensity={5} rotation-y={-Math.PI / 2} position={[10, -2, 0]} scale={[20, 1, 1]} />
        </group>
      </Environment>

      <Float speed={2.5} rotationIntensity={1} floatIntensity={2}>
        <mesh ref={mesh} scale={1.2}>
          <torusKnotGeometry args={[1, 0.35, 128, 64]} />
          <MeshTransmissionMaterial 
            backside
            samples={4}
            thickness={1.5}
            chromaticAberration={0.06}
            anisotropy={1}
            distortion={0.2}
            distortionScale={0.5}
            temporalDistortion={0.1}
            color="#ffffff"
            resolution={512}
          />
        </mesh>
      </Float>
    </>
  );
}
