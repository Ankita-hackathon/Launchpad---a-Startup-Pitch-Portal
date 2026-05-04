import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function RingPortal() {
  const group = useRef();
  const ring1 = useRef();
  const ring2 = useRef();
  const ring3 = useRef();
  const particles = useRef();

  // Create spiral particles
  const particlePositions = React.useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 20;
      const radius = 1.5 + Math.sin(t * Math.PI * 6) * 0.5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (t - 0.5) * 4;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ring1.current) ring1.current.rotation.x = t * 0.5;
    if (ring2.current) ring2.current.rotation.y = t * 0.7;
    if (ring3.current) { ring3.current.rotation.x = -t * 0.3; ring3.current.rotation.z = t * 0.4; }
    if (group.current) group.current.rotation.y = t * 0.1;
    if (particles.current) particles.current.rotation.y = -t * 0.05;
  });

  return (
    <group ref={group}>
      {/* Spiral particles */}
      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={300} array={particlePositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.04} color="#a855f7" transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>

      {/* Ring 1 - Purple */}
      <mesh ref={ring1}>
        <torusGeometry args={[1.8, 0.03, 16, 100]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.8} />
      </mesh>

      {/* Ring 2 - Blue */}
      <mesh ref={ring2}>
        <torusGeometry args={[2.2, 0.02, 16, 100]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.6} />
      </mesh>

      {/* Ring 3 - Cyan */}
      <mesh ref={ring3}>
        <torusGeometry args={[2.6, 0.015, 16, 100]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.4} />
      </mesh>

      {/* Core glow sphere */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}
