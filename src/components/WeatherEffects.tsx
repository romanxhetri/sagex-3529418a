
import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

interface WeatherEffectsProps {
  weatherType: "thunder" | "rain" | "fire" | "wind";
}

export const WeatherEffects: React.FC<WeatherEffectsProps> = ({ weatherType }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    setMounted(true);

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    camera.position.z = 5;

    // Particles for different weather effects
    const createParticles = () => {
      // Clear existing particles
      scene.children.forEach(child => {
        if (child instanceof THREE.Points) {
          scene.remove(child);
        }
      });

      let particleGeometry, particleMaterial, particles;

      switch (weatherType) {
        case "thunder":
          // Lightning bolts
          const lightningGroup = new THREE.Group();
          
          const createLightning = () => {
            const points = [];
            const segments = 10;
            
            for (let i = 0; i <= segments; i++) {
              const y = 10 - i * 2;
              const xVariation = i === 0 || i === segments ? 0 : (Math.random() - 0.5) * 3;
              points.push(new THREE.Vector3(xVariation, y, 0));
            }
            
            const lightningGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const lightningMaterial = new THREE.LineBasicMaterial({ 
              color: 0xaaddff,
              linewidth: 3
            });
            
            return new THREE.Line(lightningGeometry, lightningMaterial);
          };
          
          // Create multiple lightning bolts
          for (let i = 0; i < 3; i++) {
            const lightning = createLightning();
            lightning.position.x = (Math.random() - 0.5) * 20;
            lightning.position.z = (Math.random() - 0.5) * 5;
            lightning.visible = false;
            lightningGroup.add(lightning);
          }
          
          scene.add(lightningGroup);
          
          // Lightning flash animation
          const animateLightning = () => {
            lightningGroup.children.forEach(lightning => {
              lightning.visible = false;
            });
            
            // Random flash
            if (Math.random() > 0.95) {
              const randomIndex = Math.floor(Math.random() * lightningGroup.children.length);
              const lightning = lightningGroup.children[randomIndex];
              lightning.visible = true;
              
              // Create a brief flash of light in the scene
              const flash = new THREE.PointLight(0xaaddff, 100, 20);
              flash.position.copy(lightning.position);
              scene.add(flash);
              
              // Remove the flash after a short time
              setTimeout(() => {
                scene.remove(flash);
              }, 100 + Math.random() * 50);
            }
            
            requestAnimationFrame(animateLightning);
          };
          
          animateLightning();
          break;

        case "rain":
          // Rain drops
          particleGeometry = new THREE.BufferGeometry();
          const rainCount = 15000;
          const positions = new Float32Array(rainCount * 3);
          const rainVelocities = new Float32Array(rainCount);
          
          for (let i = 0; i < rainCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 100; // x
            positions[i + 1] = Math.random() * 100; // y
            positions[i + 2] = (Math.random() - 0.5) * 100; // z
            
            rainVelocities[i / 3] = 0.1 + Math.random() * 0.3;
          }
          
          particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          particleMaterial = new THREE.PointsMaterial({
            color: 0x5599ff,
            size: 0.1,
            transparent: true,
            opacity: 0.6
          });
          
          particles = new THREE.Points(particleGeometry, particleMaterial);
          scene.add(particles);
          
          // Rain animation
          const animateRain = () => {
            const positions = particles.geometry.attributes.position.array as Float32Array;
            
            for (let i = 0; i < positions.length; i += 3) {
              // Update y position (falling rain)
              positions[i + 1] -= rainVelocities[i / 3];
              
              // Reset rain drop when it falls below the scene
              if (positions[i + 1] < -50) {
                positions[i + 1] = 50;
              }
            }
            
            particles.geometry.attributes.position.needsUpdate = true;
            requestAnimationFrame(animateRain);
          };
          
          animateRain();
          break;

        case "fire":
          // Fire particles
          const fireGroup = new THREE.Group();
          
          // Create base for fire
          const baseGeometry = new THREE.ConeGeometry(2, 4, 8);
          const baseMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff5500,
            transparent: true,
            opacity: 0.7
          });
          const baseCone = new THREE.Mesh(baseGeometry, baseMaterial);
          baseCone.position.y = -2;
          fireGroup.add(baseCone);
          
          // Create fire particles
          const fireParticleCount = 1000;
          particleGeometry = new THREE.BufferGeometry();
          const firePositions = new Float32Array(fireParticleCount * 3);
          const fireSizes = new Float32Array(fireParticleCount);
          const fireColors = new Float32Array(fireParticleCount * 3);
          
          for (let i = 0; i < fireParticleCount; i++) {
            const i3 = i * 3;
            const radius = Math.random() * 1.5;
            const theta = Math.random() * Math.PI * 2;
            const y = Math.random() * 4;
            
            firePositions[i3] = radius * Math.cos(theta);
            firePositions[i3 + 1] = y - 2; // Center at the base cone's position
            firePositions[i3 + 2] = radius * Math.sin(theta);
            
            fireSizes[i] = 0.1 + Math.random() * 0.2;
            
            // Color gradient: red -> orange -> yellow
            const colorRatio = y / 4;
            fireColors[i3] = 1.0; // R
            fireColors[i3 + 1] = 0.3 + colorRatio * 0.7; // G
            fireColors[i3 + 2] = colorRatio * 0.5; // B
          }
          
          particleGeometry.setAttribute('position', new THREE.BufferAttribute(firePositions, 3));
          particleGeometry.setAttribute('size', new THREE.BufferAttribute(fireSizes, 1));
          particleGeometry.setAttribute('color', new THREE.BufferAttribute(fireColors, 3));
          
          const fireShaderMaterial = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
          });
          
          const fireParticles = new THREE.Points(particleGeometry, fireShaderMaterial);
          fireGroup.add(fireParticles);
          scene.add(fireGroup);
          
          // Add a point light to illuminate the scene
          const fireLight = new THREE.PointLight(0xff5500, 1, 10);
          fireLight.position.set(0, 0, 0);
          fireGroup.add(fireLight);
          
          // Fire animation
          const animateFire = () => {
            const positions = fireParticles.geometry.attributes.position.array as Float32Array;
            
            for (let i = 0; i < positions.length; i += 3) {
              // Move particles upward
              positions[i + 1] += 0.03 + Math.random() * 0.05;
              
              // Add some random horizontal movement
              positions[i] += (Math.random() - 0.5) * 0.05;
              positions[i + 2] += (Math.random() - 0.5) * 0.05;
              
              // Reset particles that go too high
              if (positions[i + 1] > 3) {
                const radius = Math.random() * 1.5;
                const theta = Math.random() * Math.PI * 2;
                
                positions[i] = radius * Math.cos(theta);
                positions[i + 1] = -2 + Math.random() * 0.5;
                positions[i + 2] = radius * Math.sin(theta);
              }
            }
            
            fireParticles.geometry.attributes.position.needsUpdate = true;
            
            // Pulsate the light
            fireLight.intensity = 1 + Math.sin(Date.now() * 0.01) * 0.5;
            
            requestAnimationFrame(animateFire);
          };
          
          animateFire();
          break;

        case "wind":
          // Wind particles
          particleGeometry = new THREE.BufferGeometry();
          const windCount = 3000;
          const windPositions = new Float32Array(windCount * 3);
          
          for (let i = 0; i < windCount * 3; i += 3) {
            windPositions[i] = (Math.random() - 0.5) * 100; // x
            windPositions[i + 1] = (Math.random() - 0.5) * 50; // y
            windPositions[i + 2] = (Math.random() - 0.5) * 100; // z
          }
          
          particleGeometry.setAttribute('position', new THREE.BufferAttribute(windPositions, 3));
          particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.2,
            transparent: true,
            opacity: 0.3
          });
          
          particles = new THREE.Points(particleGeometry, particleMaterial);
          scene.add(particles);
          
          // Wind animation
          const windSpeed = 0.3;
          let windTime = 0;
          
          const animateWind = () => {
            windTime += 0.01;
            
            const positions = particles.geometry.attributes.position.array as Float32Array;
            
            for (let i = 0; i < positions.length; i += 3) {
              // Create wave-like patterns for wind
              positions[i] += Math.sin(windTime + i * 0.1) * 0.05 + windSpeed;
              positions[i + 1] += Math.cos(windTime + i * 0.05) * 0.05;
              
              // Reset wind particles when they move too far
              if (positions[i] > 50) {
                positions[i] = -50;
                positions[i + 1] = (Math.random() - 0.5) * 50;
                positions[i + 2] = (Math.random() - 0.5) * 100;
              }
            }
            
            particles.geometry.attributes.position.needsUpdate = true;
            requestAnimationFrame(animateWind);
          };
          
          animateWind();
          break;
      }
    };

    createParticles();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // Dispose of geometries and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          } else if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          }
        }
      });
    };
  }, [weatherType]);

  return <div ref={containerRef} className="absolute inset-0 z-0" style={{ pointerEvents: "none" }} />;
};
