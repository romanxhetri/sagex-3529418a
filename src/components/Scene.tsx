
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export const Scene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create thunder light
    const thunderLight = new THREE.PointLight(0x4444ff, 0, 500);
    thunderLight.position.set(0, 100, 0);
    scene.add(thunderLight);

    // Create particles for rain
    const rainGeometry = new THREE.BufferGeometry();
    const rainCount = 15000;
    const rainPositions = new Float32Array(rainCount * 3);
    const rainVelocities = new Float32Array(rainCount);

    for (let i = 0; i < rainCount * 3; i += 3) {
      rainPositions[i] = Math.random() * 400 - 200;
      rainPositions[i + 1] = Math.random() * 500 - 250;
      rainPositions[i + 2] = Math.random() * 400 - 200;
      rainVelocities[i / 3] = 0.1 + Math.random() * 0.3;
    }

    rainGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(rainPositions, 3)
    );

    const rainMaterial = new THREE.PointsMaterial({
      color: 0xaaaaff,
      size: 0.1,
      transparent: true,
      opacity: 0.6,
    });

    const rain = new THREE.Points(rainGeometry, rainMaterial);
    scene.add(rain);

    // Create fire particles
    const fireGeometry = new THREE.BufferGeometry();
    const fireCount = 2000;
    const firePositions = new Float32Array(fireCount * 3);
    const fireColors = new Float32Array(fireCount * 3);

    for (let i = 0; i < fireCount * 3; i += 3) {
      const x = Math.random() * 20 - 10;
      const y = Math.random() * 20;
      const z = Math.random() * 20 - 10;
      firePositions[i] = x;
      firePositions[i + 1] = y;
      firePositions[i + 2] = z;

      // Create gradient from yellow to red
      const color = new THREE.Color();
      color.setHSL(0.05 + Math.random() * 0.05, 1, 0.5 + Math.random() * 0.5);
      fireColors[i] = color.r;
      fireColors[i + 1] = color.g;
      fireColors[i + 2] = color.b;
    }

    fireGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(firePositions, 3)
    );
    fireGeometry.setAttribute("color", new THREE.BufferAttribute(fireColors, 3));

    const fireMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const fire = new THREE.Points(fireGeometry, fireMaterial);
    fire.position.set(-20, -10, -20);
    scene.add(fire);

    // Create background particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 5;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: 0x8a2be2,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Position camera
    camera.position.z = 3;

    // Thunder effect timer
    let lastThunderTime = 0;
    const thunderInterval = 5000; // 5 seconds

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Update rain
      const rainPositions = rain.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < rainPositions.length; i += 3) {
        rainPositions[i + 1] -= rainVelocities[i / 3];
        if (rainPositions[i + 1] < -250) {
          rainPositions[i + 1] = 250;
        }
      }
      rain.geometry.attributes.position.needsUpdate = true;

      // Update fire
      const firePositions = fire.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < firePositions.length; i += 3) {
        firePositions[i + 1] += Math.random() * 0.1;
        if (firePositions[i + 1] > 20) {
          firePositions[i + 1] = 0;
        }
      }
      fire.geometry.attributes.position.needsUpdate = true;

      // Thunder effect
      const time = Date.now();
      if (time - lastThunderTime > thunderInterval) {
        thunderLight.intensity = 2;
        setTimeout(() => {
          thunderLight.intensity = 0;
        }, 150);
        lastThunderTime = time;
      }

      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div ref={mountRef} className="fixed top-0 left-0 -z-10" />;
};
