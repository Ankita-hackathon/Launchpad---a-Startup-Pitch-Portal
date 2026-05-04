import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

export default function NeuralNetwork() {
  const group = useRef();
  const linesRef = useRef();
  const pointsRef = useRef();
  const { theme } = useTheme();

  const particleCount = 150; // Number of nodes
  const maxDistance = 1.0; // Distance to form a connection

  // Generate particles and lines mathematically
  const { particles, lines, colors } = useMemo(() => {
    const particles = new Float32Array(particleCount * 3);
    const lines = [];
    const colors = [];

    // Generate random positions in a sphere
    for (let i = 0; i < particleCount; i++) {
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 * Math.cbrt(Math.random());

      particles[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particles[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particles[i * 3 + 2] = r * Math.cos(phi);
    }

    // Connect particles that are close together
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = particles[i * 3] - particles[j * 3];
        const dy = particles[i * 3 + 1] - particles[j * 3 + 1];
        const dz = particles[i * 3 + 2] - particles[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDistance) {
          lines.push(
            particles[i * 3], particles[i * 3 + 1], particles[i * 3 + 2],
            particles[j * 3], particles[j * 3 + 1], particles[j * 3 + 2]
          );
          
          // Mix our brand colors (Purple and Blue) for the connections
          const mix = Math.random();
          const color = new THREE.Color().lerpColors(
            new THREE.Color('#a855f7'), // Electric Purple
            new THREE.Color('#3b82f6'), // Electric Blue
            mix
          );
          
          // Add color twice for both ends of the line segment
          colors.push(color.r, color.g, color.b);
          colors.push(color.r, color.g, color.b);
        }
      }
    }

    return {
      particles,
      lines: new Float32Array(lines),
      colors: new Float32Array(colors)
    };
  }, [particleCount, maxDistance]);

  useFrame((state, delta) => {
    // Create a pulsing electrical effect by animating line opacity with sine waves
    if (linesRef.current) {
      linesRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
    }
    
    // Pulse the nodes slightly out of sync with the lines
    if (pointsRef.current) {
      pointsRef.current.material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 1.5) * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={group}>
        
        {/* The glowing idea nodes */}
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particles.length / 3}
              array={particles}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.06}
            color={theme === 'light' ? '#3b82f6' : '#ffffff'}
            transparent
            blending={theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending}
            sizeAttenuation
            depthWrite={false}
          />
        </points>

        {/* The electrical connections between mentors and students */}
        <lineSegments ref={linesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={lines.length / 3}
              array={lines}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={colors.length / 3}
              array={colors}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            vertexColors
            transparent
            blending={theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
        
      </group>
    </Float>
  );
}
