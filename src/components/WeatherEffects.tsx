
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WeatherEffectsProps {
  weatherType: "thunder" | "rain" | "fire" | "wind" | "magic";
}

export const WeatherEffects: React.FC<WeatherEffectsProps> = ({ weatherType }) => {
  const rainRef = useRef<THREE.Points>(null);
  const thunderRef = useRef<THREE.PointLight>(null);
  const fireRef = useRef<THREE.Points>(null);
  const windRef = useRef<THREE.Points>(null);
  const magicRef = useRef<THREE.Points>(null);
  
  // Rain particles
  const rainParticles = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Position in a wide area above the camera
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = Math.random() * 50 + 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      
      // Random falling velocity
      velocities[i] = 0.1 + Math.random() * 0.3;
    }
    
    return { positions, velocities };
  }, []);
  
  // Fire particles
  const fireParticles = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    const colorOptions = [
      new THREE.Color(0xff3300), // Orange-red
      new THREE.Color(0xff9900), // Orange
      new THREE.Color(0xffcc00), // Yellow
    ];
    
    for (let i = 0; i < count; i++) {
      // Position in a circle at the bottom
      const radius = 20 * Math.sqrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      
      positions[i * 3] = radius * Math.cos(theta);
      positions[i * 3 + 1] = -20; // Start below
      positions[i * 3 + 2] = radius * Math.sin(theta);
      
      // Random size
      sizes[i] = 0.2 + Math.random() * 0.8;
      
      // Random color from fire palette
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Random velocity (mostly upward)
      velocities[i * 3] = (Math.random() - 0.5) * 0.1;
      velocities[i * 3 + 1] = 0.1 + Math.random() * 0.3;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    
    return { positions, sizes, colors, velocities };
  }, []);
  
  // Wind particles
  const windParticles = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Position randomly throughout the scene
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      
      // Random size
      sizes[i] = 0.1 + Math.random() * 0.3;
    }
    
    return { positions, sizes };
  }, []);
  
  // Magic particles
  const magicParticles = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    
    const colorOptions = [
      new THREE.Color(0xff00ff), // Magenta
      new THREE.Color(0x00ffff), // Cyan
      new THREE.Color(0xffff00), // Yellow
      new THREE.Color(0x8800ff), // Purple
      new THREE.Color(0x00ff88), // Turquoise
    ];
    
    for (let i = 0; i < count; i++) {
      // Position in a sphere
      const radius = 30 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Random size
      sizes[i] = 0.3 + Math.random() * 1.0;
      
      // Random color from magic palette
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Random phase for animation
      phases[i] = Math.random() * Math.PI * 2;
    }
    
    return { positions, colors, sizes, phases };
  }, []);
  
  // Animation frame updates
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Rain animation
    if (rainRef.current && weatherType === "rain") {
      const positions = rainRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < rainParticles.positions.length / 3; i++) {
        // Update Y position based on velocity
        positions[i * 3 + 1] -= rainParticles.velocities[i];
        
        // Reset particle if it falls below a certain point
        if (positions[i * 3 + 1] < -30) {
          positions[i * 3 + 1] = Math.random() * 50 + 30;
        }
      }
      
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    // Thunder animation
    if (thunderRef.current && weatherType === "thunder") {
      // Random lighting flashes
      if (Math.random() < 0.01) {
        thunderRef.current.intensity = 2 + Math.random() * 3;
        setTimeout(() => {
          if (thunderRef.current) thunderRef.current.intensity = 0;
        }, 100);
      }
    }
    
    // Fire animation
    if (fireRef.current && weatherType === "fire") {
      const positions = fireRef.current.geometry.attributes.position.array as Float32Array;
      const sizes = fireRef.current.geometry.attributes.size.array as Float32Array;
      const colors = fireRef.current.geometry.attributes.color.array as Float32Array;
      
      for (let i = 0; i < fireParticles.positions.length / 3; i++) {
        // Update position
        positions[i * 3] += fireParticles.velocities[i * 3];
        positions[i * 3 + 1] += fireParticles.velocities[i * 3 + 1];
        positions[i * 3 + 2] += fireParticles.velocities[i * 3 + 2];
        
        // Make particles "flicker"
        sizes[i] *= 0.99 + Math.random() * 0.03;
        
        // If it rises too high or becomes too small, reset it
        if (positions[i * 3 + 1] > 30 || sizes[i] < 0.1) {
          const radius = 20 * Math.sqrt(Math.random());
          const theta = Math.random() * Math.PI * 2;
          
          positions[i * 3] = radius * Math.cos(theta);
          positions[i * 3 + 1] = -20;
          positions[i * 3 + 2] = radius * Math.sin(theta);
          
          sizes[i] = 0.2 + Math.random() * 0.8;
          
          // Fade color when resetting
          if (i % 3 === 0) {
            colors[i * 3] = 1.0;     // Red
            colors[i * 3 + 1] = 0.3 + Math.random() * 0.4; // Green
            colors[i * 3 + 2] = 0.0; // Blue
          }
        }
      }
      
      fireRef.current.geometry.attributes.position.needsUpdate = true;
      fireRef.current.geometry.attributes.size.needsUpdate = true;
      fireRef.current.geometry.attributes.color.needsUpdate = true;
    }
    
    // Wind animation
    if (windRef.current && weatherType === "wind") {
      const positions = windRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < windParticles.positions.length / 3; i++) {
        // Move particles with wind pattern
        positions[i * 3] += 0.2 + Math.sin(time + i) * 0.05;
        positions[i * 3 + 1] += Math.cos(time + i * 0.1) * 0.05;
        positions[i * 3 + 2] += Math.sin(time * 0.5 + i * 0.2) * 0.05;
        
        // Reset if out of bounds
        if (positions[i * 3] > 50) {
          positions[i * 3] = -50;
        }
      }
      
      windRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    // Magic animation
    if (magicRef.current && weatherType === "magic") {
      const positions = magicRef.current.geometry.attributes.position.array as Float32Array;
      const colors = magicRef.current.geometry.attributes.color.array as Float32Array;
      const sizes = magicRef.current.geometry.attributes.size.array as Float32Array;
      const phases = magicParticles.phases;
      
      for (let i = 0; i < magicParticles.positions.length / 3; i++) {
        // Create orbiting/swirling patterns
        const radius = Math.sqrt(
          Math.pow(magicParticles.positions[i * 3], 2) + 
          Math.pow(magicParticles.positions[i * 3 + 1], 2) + 
          Math.pow(magicParticles.positions[i * 3 + 2], 2)
        );
        
        // Original spherical coordinates
        let theta = Math.atan2(
          magicParticles.positions[i * 3 + 1], 
          magicParticles.positions[i * 3]
        );
        
        let phi = Math.acos(magicParticles.positions[i * 3 + 2] / radius);
        
        // Update angles based on time and particle's phase
        theta += 0.01 * Math.sin(time * 0.2 + phases[i]);
        phi += 0.005 * Math.cos(time * 0.1 + phases[i]);
        
        // Convert back to Cartesian coordinates
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        // Pulse size
        sizes[i] = magicParticles.sizes[i] * (0.8 + 0.4 * Math.sin(time * 2 + phases[i]));
        
        // Shift colors
        const colorShift = (Math.sin(time + phases[i]) + 1) / 2; // 0 to 1
        colors[i * 3] = 0.5 + 0.5 * Math.sin(colorShift * Math.PI);
        colors[i * 3 + 1] = 0.5 + 0.5 * Math.sin((colorShift + 0.33) * Math.PI);
        colors[i * 3 + 2] = 0.5 + 0.5 * Math.sin((colorShift + 0.66) * Math.PI);
      }
      
      magicRef.current.geometry.attributes.position.needsUpdate = true;
      magicRef.current.geometry.attributes.color.needsUpdate = true;
      magicRef.current.geometry.attributes.size.needsUpdate = true;
    }
  });
  
  return (
    <>
      {/* Rain effect */}
      {weatherType === "rain" && (
        <points ref={rainRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={rainParticles.positions.length / 3}
              array={rainParticles.positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            attach="material"
            size={0.2}
            color="#aaddff"
            transparent
            opacity={0.6}
          />
        </points>
      )}
      
      {/* Thunder effect */}
      {weatherType === "thunder" && (
        <>
          <pointLight 
            ref={thunderRef} 
            position={[0, 30, 0]} 
            intensity={0} 
            distance={100} 
            color="#ffffff" 
          />
        </>
      )}
      
      {/* Fire effect */}
      {weatherType === "fire" && (
        <>
          <points ref={fireRef}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={fireParticles.positions.length / 3}
                array={fireParticles.positions}
                itemSize={3}
              />
              <bufferAttribute
                attach="attributes-size"
                count={fireParticles.sizes.length}
                array={fireParticles.sizes}
                itemSize={1}
              />
              <bufferAttribute
                attach="attributes-color"
                count={fireParticles.colors.length / 3}
                array={fireParticles.colors}
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial
              attach="material"
              size={0.5}
              vertexColors
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </points>
          <pointLight
            position={[0, 0, 0]}
            intensity={2}
            distance={50}
            color="#ff5500"
          />
        </>
      )}
      
      {/* Wind effect */}
      {weatherType === "wind" && (
        <points ref={windRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={windParticles.positions.length / 3}
              array={windParticles.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-size"
              count={windParticles.sizes.length}
              array={windParticles.sizes}
              itemSize={1}
            />
          </bufferGeometry>
          <pointsMaterial
            attach="material"
            size={0.3}
            color="#ffffff"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
      
      {/* Magic effect */}
      {weatherType === "magic" && (
        <>
          <points ref={magicRef}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={magicParticles.positions.length / 3}
                array={magicParticles.positions}
                itemSize={3}
              />
              <bufferAttribute
                attach="attributes-color"
                count={magicParticles.colors.length / 3}
                array={magicParticles.colors}
                itemSize={3}
              />
              <bufferAttribute
                attach="attributes-size"
                count={magicParticles.sizes.length}
                array={magicParticles.sizes}
                itemSize={1}
              />
            </bufferGeometry>
            <pointsMaterial
              attach="material"
              size={1.0}
              vertexColors
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
              sizeAttenuation
            />
          </points>
          <pointLight
            position={[0, 0, 0]}
            intensity={1.5}
            distance={50}
            color="#ff00ff"
          />
        </>
      )}
    </>
  );
};
