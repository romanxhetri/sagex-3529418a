
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { WeatherEffects } from './WeatherEffects';

// Planet component with animated rotation
const Planet = ({ position, size, color, rotation = 0.001 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotation;
    }
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.7} 
        metalness={0.3} 
        emissive={color} 
        emissiveIntensity={0.2} 
      />
    </mesh>
  );
};

// Glowing nebula
const Nebula = () => {
  const { scene } = useThree();
  const particlesRef = useRef<THREE.Points>(null);
  
  useEffect(() => {
    // Create nebula
    const geometry = new THREE.BufferGeometry();
    const count = 10000;
    
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const colorOptions = [
      new THREE.Color("#ff00ff"),
      new THREE.Color("#00ffff"),
      new THREE.Color("#8800ff"),
      new THREE.Color("#ff0088"),
    ];
    
    for (let i = 0; i < count; i++) {
      // Position in a cloud-like distribution
      const radius = 20 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI - Math.PI / 2;
      
      positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);
      
      // Random color from options
      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.15,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [scene]);
  
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry attach="geometry">
        {Array(5000).fill(null).map((_, i) => {
          const r = 30 + Math.random() * 30;
          const theta = 2 * Math.PI * Math.random();
          const phi = Math.acos(2 * Math.random() - 1);
          const x = r * Math.sin(phi) * Math.cos(theta);
          const y = r * Math.sin(phi) * Math.sin(theta);
          const z = r * Math.cos(phi);
          return (
            <position 
              key={i} 
              attach={`attributes-position-${i}`} 
              args={[x, y, z]} 
            />
          );
        })}
      </bufferGeometry>
      <pointsMaterial 
        attach="material" 
        size={0.2} 
        sizeAttenuation={true} 
        color="white" 
        transparent 
        opacity={0.8}
      />
    </points>
  );
};

// Glowing mist
const GlowingMist = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });
  
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[40, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(0x8800ff) },
        }}
        vertexShader={`
          varying vec2 vUv;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor;
          varying vec2 vUv;
          varying vec3 vPosition;
          
          float noise(vec3 p) {
            return fract(sin(dot(p, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
          }
          
          void main() {
            float n = noise(vPosition * 0.01 + uTime * 0.05);
            float alpha = smoothstep(0.6, 0.0, length(vPosition) / 40.0) * (0.2 + n * 0.05);
            gl_FragColor = vec4(uColor, alpha);
          }
        `}
      />
    </mesh>
  );
};

interface UniverseBackgroundProps {
  weatherType?: "thunder" | "rain" | "fire" | "wind" | "magic";
}

export const UniverseBackground: React.FC<UniverseBackgroundProps> = ({ weatherType = "thunder" }) => {
  return (
    <div className="fixed inset-0 z-0 opacity-90">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 60], fov: 50 }}
        className="bg-black"
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        {/* Ambient lighting */}
        <ambientLight intensity={0.3} />
        
        {/* Directional light representing a distant bright light */}
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={0.8} 
          color="#ffffff" 
        />
        
        {/* Dynamic weather effects */}
        <WeatherEffects weatherType={weatherType} />
        
        {/* Starfield background */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* Glowing nebula effect */}
        <Nebula />
        
        {/* Glowing mist */}
        <GlowingMist />
        
        {/* Distant planets */}
        <Planet position={[-30, 10, -20]} size={2} color="#ff8800" rotation={0.0005} />
        <Planet position={[25, -8, -30]} size={3.5} color="#00ccff" rotation={0.0003} />
        <Planet position={[0, 20, -40]} size={1.5} color="#ff00cc" rotation={0.001} />
        <Planet position={[-15, -15, -25]} size={1} color="#88ff00" rotation={0.002} />
        
        {/* Controls for user interaction */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableRotate={true}
          rotateSpeed={0.1}
          autoRotate={true}
          autoRotateSpeed={0.1}
        />
      </Canvas>
    </div>
  );
};
