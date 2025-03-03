
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export const LaptopScene: React.FC = () => {
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

    // Load character texture
    const textureLoader = new THREE.TextureLoader();
    const characterTexture = textureLoader.load('/lovable-uploads/ea966c60-7759-4367-be89-e92d7c48cf0e.png');
    
    // Create background plane with character
    const planeGeometry = new THREE.PlaneGeometry(16, 9);
    const planeMaterial = new THREE.MeshBasicMaterial({ 
      map: characterTexture,
      transparent: true,
      opacity: 0.5
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.z = -5;
    scene.add(plane);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create particles for glitter effect
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Random positions throughout the scene
      particlePositions[i] = (Math.random() - 0.5) * 20;
      particlePositions[i + 1] = (Math.random() - 0.5) * 20;
      particlePositions[i + 2] = (Math.random() - 0.5) * 10 - 2;

      // Purple/gold color palette
      const color = new THREE.Color();
      const hue = Math.random() > 0.5 ? 0.7 + Math.random() * 0.1 : 0.1 + Math.random() * 0.1;
      color.setHSL(hue, 1, 0.5 + Math.random() * 0.5);
      
      particleColors[i] = color.r;
      particleColors[i + 1] = color.g;
      particleColors[i + 2] = color.b;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    particleGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(particleColors, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Position camera
    camera.position.z = 5;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the character plane slightly
      plane.rotation.z += 0.001;
      
      // Make particles sparkle
      const particlePositions = particles.geometry.attributes.position.array as Float32Array;
      const particleColors = particles.geometry.attributes.color.array as Float32Array;
      
      for (let i = 0; i < particleCount * 3; i += 3) {
        // Slowly move particles
        particlePositions[i] += Math.sin(Date.now() * 0.001 + i) * 0.005;
        particlePositions[i + 1] += Math.cos(Date.now() * 0.001 + i) * 0.005;
        
        // Slowly change colors
        const color = new THREE.Color();
        const time = Date.now() * 0.001;
        const hue = Math.sin(time + i) * 0.1 + 0.7; // Oscillate around purple
        color.setHSL(hue, 1, 0.5 + Math.sin(time + i * 0.1) * 0.3);
        
        particleColors[i] = color.r;
        particleColors[i + 1] = color.g;
        particleColors[i + 2] = color.b;
      }
      
      particles.geometry.attributes.position.needsUpdate = true;
      particles.geometry.attributes.color.needsUpdate = true;

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
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="fixed top-0 left-0 -z-10" />;
};
