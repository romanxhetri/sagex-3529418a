
import React, { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { WeatherEffects } from "./WeatherEffects";

export const DynamicUniverseBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentWeather, setCurrentWeather] = useState<"thunder" | "rain" | "fire" | "wind">("thunder");
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // Create stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.8
    });
    
    const starsCount = 3000;
    const starsPositions = new Float32Array(starsCount * 3);
    
    for (let i = 0; i < starsCount * 3; i += 3) {
      starsPositions[i] = (Math.random() - 0.5) * 100;
      starsPositions[i + 1] = (Math.random() - 0.5) * 100;
      starsPositions[i + 2] = (Math.random() - 0.5) * 100;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    // Create planets
    const createPlanet = (radius: number, color: number, position: [number, number, number], rings = false) => {
      const planetGeometry = new THREE.SphereGeometry(radius, 32, 32);
      const planetMaterial = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.7,
        metalness: 0.1
      });
      
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      planet.position.set(...position);
      
      if (rings) {
        const ringGeometry = new THREE.RingGeometry(radius * 1.5, radius * 2, 32);
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
    
    // Add planets
    const planet1 = createPlanet(2, 0x1a66ff, [-15, 5, -20]);
    const planet2 = createPlanet(3, 0xff5e2d, [20, -5, -30], true);
    const planet3 = createPlanet(1.5, 0x46b778, [8, 10, -15]);
    
    scene.add(planet1, planet2, planet3);
    
    // Create UFO
    const createUFO = () => {
      const ufoGroup = new THREE.Group();
      
      // UFO body
      const bodyGeometry = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.6);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.8,
        roughness: 0.2
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.rotation.x = Math.PI;
      
      // UFO cabin
      const cabinGeometry = new THREE.SphereGeometry(0.5, 32, 16);
      const cabinMaterial = new THREE.MeshStandardMaterial({
        color: 0x66ccff,
        transparent: true,
        opacity: 0.8
      });
      const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
      cabin.position.y = 0.3;
      
      // UFO ring
      const ringGeometry = new THREE.TorusGeometry(1.2, 0.2, 16, 32);
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444,
        metalness: 0.7,
        roughness: 0.3
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      
      // UFO lights
      const lightColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
      for (let i = 0; i < 6; i++) {
        const lightGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const lightMaterial = new THREE.MeshBasicMaterial({
          color: lightColors[i % lightColors.length]
        });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        
        const angle = (i / 6) * Math.PI * 2;
        light.position.set(Math.cos(angle) * 1.2, -0.1, Math.sin(angle) * 1.2);
        
        ufoGroup.add(light);
      }
      
      ufoGroup.add(body, cabin, ring);
      ufoGroup.position.set(-10, 8, -10);
      
      return ufoGroup;
    };
    
    const ufo = createUFO();
    scene.add(ufo);
    
    // Create spaceship
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
      const engineGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16);
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
      const flameGeometry = new THREE.ConeGeometry(0.15, 0.5, 16);
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
    
    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate planets
      planet1.rotation.y += 0.005;
      planet2.rotation.y += 0.003;
      planet3.rotation.y += 0.007;
      
      // Move UFO
      time += 0.01;
      ufo.position.x = Math.sin(time * 0.5) * 15;
      ufo.position.z = Math.cos(time * 0.3) * 15 - 5;
      ufo.rotation.y += 0.02;
      
      // Move spaceship
      spaceship.position.x = Math.cos(time * 0.7) * 15;
      spaceship.position.z = Math.sin(time * 0.5) * 10 - 5;
      spaceship.rotation.z = Math.sin(time * 0.2) * 0.1;
      
      // Twinkle stars
      const positions = stars.geometry.attributes.position;
      for (let i = 0; i < starsCount; i++) {
        const i3 = i * 3;
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);
        
        const scale = Math.sin(x * 100 + time) * 0.1 + 0.9;
        positions.setXYZ(i, x, y, z);
      }
      positions.needsUpdate = true;
      
      renderer.render(scene, camera);
    };
    
    // Start animation
    animate();
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cycle through weather effects every 5 seconds
    const weatherInterval = setInterval(() => {
      setCurrentWeather(prev => {
        switch(prev) {
          case "thunder": return "rain";
          case "rain": return "fire";
          case "fire": return "wind";
          case "wind": return "thunder";
          default: return "thunder";
        }
      });
    }, 5000);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(weatherInterval);
      
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of resources
      renderer.dispose();
      
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, []);
  
  return (
    <div className="fixed inset-0 -z-10">
      <div ref={containerRef} className="absolute inset-0" />
      <WeatherEffects weatherType={currentWeather} />
    </div>
  );
};
