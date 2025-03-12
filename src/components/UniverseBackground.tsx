import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { WeatherEffects } from "./WeatherEffects";

interface UniverseBackgroundProps {
  weatherType: "thunder" | "rain" | "fire" | "wind" | "magic";
}

export const UniverseBackground: React.FC<UniverseBackgroundProps> = ({ weatherType }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Performance optimizations
    THREE.Cache.enabled = true;
    
    // Create scene with fog for depth
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000911, 0.0025);
    
    // Create camera with optimized settings
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    
    // Create renderer with optimizations
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, // Disable for performance
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 1.5 : 1); // Cap pixel ratio
    containerRef.current.appendChild(renderer.domElement);
    
    // Add optimized lighting
    const ambientLight = new THREE.AmbientLight(0x0f0f20, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x4060ff, 2);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // Create stars with instanced mesh for performance
    const starsCount = 2000; // Reduced count for performance
    const starGeometry = new THREE.SphereGeometry(0.1, 3, 3); // Simplified geometry
    const starMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8
    });
    
    // Use instanced mesh for stars
    const starInstancedMesh = new THREE.InstancedMesh(
      starGeometry,
      starMaterial,
      starsCount
    );
    
    const dummy = new THREE.Object3D();
    
    for (let i = 0; i < starsCount; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      );
      dummy.scale.setScalar(Math.random() * 0.5 + 0.5);
      dummy.updateMatrix();
      starInstancedMesh.setMatrixAt(i, dummy.matrix);
    }
    
    scene.add(starInstancedMesh);
    
    // Create optimized planets
    const createPlanet = (radius: number, color: number, position: [number, number, number], detail: number = 16, rings = false) => {
      const planetGeometry = new THREE.SphereGeometry(radius, detail, detail);
      const planetMaterial = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.7,
        metalness: 0.2
      });
      
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      planet.position.set(...position);
      
      if (rings) {
        const ringGeometry = new THREE.RingGeometry(radius * 1.5, radius * 2, 16);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        planet.add(ring);
      }
      
      return planet;
    };
    
    // Add planets with optimized polygon count
    const planet1 = createPlanet(2, 0x1a66ff, [-15, 5, -20], 12);
    const planet2 = createPlanet(3, 0xff5e2d, [20, -5, -30], 16, true);
    const planet3 = createPlanet(1.5, 0x46b778, [8, 10, -15], 12);
    
    scene.add(planet1, planet2, planet3);
    
    // Create UFO with optimized geometry
    const createUFO = () => {
      const ufoGroup = new THREE.Group();
      
      // UFO body
      const bodyGeometry = new THREE.SphereGeometry(1, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.6);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.8,
        roughness: 0.2
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.rotation.x = Math.PI;
      
      // UFO cabin
      const cabinGeometry = new THREE.SphereGeometry(0.5, 16, 8);
      const cabinMaterial = new THREE.MeshStandardMaterial({
        color: 0x66ccff,
        transparent: true,
        opacity: 0.8
      });
      const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
      cabin.position.y = 0.3;
      
      // UFO ring
      const ringGeometry = new THREE.TorusGeometry(1.2, 0.2, 8, 16);
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444,
        metalness: 0.7,
        roughness: 0.3
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      
      // UFO lights (reduced count for performance)
      const lightColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
      for (let i = 0; i < 4; i++) {
        const lightGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const lightMaterial = new THREE.MeshBasicMaterial({
          color: lightColors[i % lightColors.length]
        });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        
        const angle = (i / 4) * Math.PI * 2;
        light.position.set(Math.cos(angle) * 1.2, -0.1, Math.sin(angle) * 1.2);
        
        ufoGroup.add(light);
      }
      
      ufoGroup.add(body, cabin, ring);
      ufoGroup.position.set(-10, 8, -10);
      
      return ufoGroup;
    };
    
    const ufo = createUFO();
    scene.add(ufo);
    
    // Create optimized spaceship
    const createSpaceship = () => {
      const shipGroup = new THREE.Group();
      
      // Ship body
      const bodyGeometry = new THREE.ConeGeometry(0.5, 2, 8);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        metalness: 0.7,
        roughness: 0.2
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.rotation.x = Math.PI / 2;
      
      // Ship wings
      const wingGeometry = new THREE.BoxGeometry(2, 0.1, 0.5);
      const wingMaterial = new THREE.MeshStandardMaterial({
        color: 0x777777,
        metalness: 0.5,
        roughness: 0.5
      });
      const wings = new THREE.Mesh(wingGeometry, wingMaterial);
      
      // Ship engines
      const engineGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 8);
      const engineMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.8,
        roughness: 0.2
      });
      
      const engine1 = new THREE.Mesh(engineGeometry, engineMaterial);
      engine1.position.set(0.5, 0, 0.6);
      engine1.rotation.x = Math.PI / 2;
      
      const engine2 = new THREE.Mesh(engineGeometry, engineMaterial);
      engine2.position.set(-0.5, 0, 0.6);
      engine2.rotation.x = Math.PI / 2;
      
      // Engine flames
      const flameGeometry = new THREE.ConeGeometry(0.15, 0.5, 8);
      const flameMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6600,
        transparent: true,
        opacity: 0.8
      });
      
      const flame1 = new THREE.Mesh(flameGeometry, flameMaterial);
      flame1.position.set(0.5, 0, 0.9);
      flame1.rotation.x = -Math.PI / 2;
      
      const flame2 = new THREE.Mesh(flameGeometry, flameMaterial);
      flame2.position.set(-0.5, 0, 0.9);
      flame2.rotation.x = -Math.PI / 2;
      
      shipGroup.add(body, wings, engine1, engine2, flame1, flame2);
      shipGroup.position.set(15, -8, -5);
      shipGroup.rotation.y = -Math.PI / 4;
      
      return shipGroup;
    };
    
    const spaceship = createSpaceship();
    scene.add(spaceship);
    
    // Animation with requestAnimationFrame throttling for 200+ FPS target
    let time = 0;
    let lastTime = 0;
    const animate = (currentTime: number) => {
      requestAnimationFrame(animate);
      
      // Limit update rate for high-refresh displays (targeting 200fps)
      const elapsed = currentTime - lastTime;
      if (elapsed < 5) { // ~200fps (1000ms / 200fps = 5ms per frame)
        return;
      }
      lastTime = currentTime;
      
      // Rotate planets
      planet1.rotation.y += 0.002;
      planet2.rotation.y += 0.001;
      planet3.rotation.y += 0.003;
      
      // Move UFO
      time += 0.005;
      ufo.position.x = Math.sin(time * 0.5) * 15;
      ufo.position.z = Math.cos(time * 0.3) * 15 - 5;
      ufo.rotation.y += 0.01;
      
      // Move spaceship
      spaceship.position.x = Math.cos(time * 0.7) * 15;
      spaceship.position.z = Math.sin(time * 0.5) * 10 - 5;
      spaceship.rotation.z = Math.sin(time * 0.2) * 0.1;
      
      // Twinkle stars (apply to instanced mesh)
      for (let i = 0; i < 50; i++) { // Only update a subset of stars each frame
        const idx = Math.floor(Math.random() * starsCount);
        const matrix = new THREE.Matrix4();
        starInstancedMesh.getMatrixAt(idx, matrix);
        
        // Extract position from matrix
        const position = new THREE.Vector3();
        position.setFromMatrixPosition(matrix);
        
        // Calculate scale factor based on time and position
        const scale = Math.sin(time + position.x * 10) * 0.2 + 0.8;
        
        // Update matrix
        dummy.position.copy(position);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        starInstancedMesh.setMatrixAt(idx, dummy.matrix);
      }
      starInstancedMesh.instanceMatrix.needsUpdate = true;
      
      renderer.render(scene, camera);
    };
    
    // Start animation with timestamp
    animate(0);
    
    // Handle window resize with debouncing
    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of resources
      renderer.dispose();
      
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else if (object.material) {
            object.material.dispose();
          }
        }
      });
    };
  }, []);
  
  return (
    <div className="fixed inset-0 -z-10">
      <div ref={containerRef} className="absolute inset-0" />
      <WeatherEffects weatherType={weatherType} />
    </div>
  );
};

