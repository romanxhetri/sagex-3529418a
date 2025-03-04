import React, { useRef, useEffect } from "react";
import * as THREE from "three";

// Define interfaces for the imported classes to satisfy TypeScript
interface OrbitControlsType {
  new (camera: THREE.Camera, domElement: HTMLElement): {
    enabled: boolean;
    enableDamping: boolean;
    dampingFactor: number;
    screenSpacePanning: boolean;
    minDistance: number;
    maxDistance: number;
    maxPolarAngle: number;
    update: () => void;
  }
}

interface GLTFLoaderType {
  new (): {
    load: (url: string, onLoad: (gltf: any) => void, onProgress?: (event: ProgressEvent) => void, onError?: (event: ErrorEvent) => void) => void;
    setDRACOLoader: (dracoLoader: any) => void;
  }
}

interface DRACOLoaderType {
  new (): {
    setDecoderPath: (path: string) => void;
    preload: () => void;
  }
}

// Use dynamic imports and type assertions
let OrbitControls: OrbitControlsType;
let GLTFLoader: GLTFLoaderType;
let DRACOLoader: DRACOLoaderType;

// We'll initialize these in the useEffect hook

export const MagicalUniverseScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animeModelRef = useRef<THREE.Group | null>(null);
  const draggingRef = useRef(false);
  const originalPositionRef = useRef<THREE.Vector3 | null>(null);
  const shootingStarsRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Dynamically import the required modules
    const loadModules = async () => {
      try {
        // Load the modules
        const orbitControlsModule = await import("three/examples/jsm/controls/OrbitControls");
        const gltfLoaderModule = await import("three/examples/jsm/loaders/GLTFLoader");
        const dracoLoaderModule = await import("three/examples/jsm/loaders/DRACOLoader");
        
        // Assign to our variables
        OrbitControls = orbitControlsModule.OrbitControls as unknown as OrbitControlsType;
        GLTFLoader = gltfLoaderModule.GLTFLoader as unknown as GLTFLoaderType;
        DRACOLoader = dracoLoaderModule.DRACOLoader as unknown as DRACOLoaderType;
        
        // Initialize the scene once modules are loaded
        initScene();
      } catch (error) {
        console.error("Failed to load Three.js modules:", error);
      }
    };

    // Load modules
    loadModules();

    // Scene initialization function
    const initScene = () => {
      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000016);
      scene.fog = new THREE.FogExp2(0x0c0c1e, 0.001);
      
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
      );
      camera.position.set(0, 10, 30);
      
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
      renderer.shadowMap.enabled = true;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.5;
      mountRef.current?.appendChild(renderer.domElement);

      // Add orbit controls for interactive camera
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false;
      controls.minDistance = 10;
      controls.maxDistance = 500;
      controls.maxPolarAngle = Math.PI / 2;
      controls.enabled = false; // Disable by default, enable only when dragging models

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
      directionalLight.position.set(10, 10, 10);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      const purpleLight = new THREE.PointLight(0x9900ff, 5, 100);
      purpleLight.position.set(-20, 15, 10);
      scene.add(purpleLight);

      const blueLight = new THREE.PointLight(0x0066ff, 5, 100);
      blueLight.position.set(20, 15, 10);
      scene.add(blueLight);

      // Create stars
      const starGeometry = new THREE.BufferGeometry();
      const starCount = 15000;
      const starPositions = new Float32Array(starCount * 3);
      const starColors = new Float32Array(starCount * 3);
      const starSizes = new Float32Array(starCount);

      for (let i = 0; i < starCount * 3; i += 3) {
        starPositions[i] = (Math.random() - 0.5) * 2000;
        starPositions[i + 1] = (Math.random() - 0.5) * 2000;
        starPositions[i + 2] = (Math.random() - 0.5) * 2000;

        // Create colorful stars
        const color = new THREE.Color();
        const hue = Math.random();
        color.setHSL(hue, 0.9, 0.7);
        starColors[i] = color.r;
        starColors[i + 1] = color.g;
        starColors[i + 2] = color.b;
        
        // Random sizes for stars
        starSizes[i / 3] = Math.random() * 2 + 0.5;
      }

      starGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(starPositions, 3)
      );
      starGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(starColors, 3)
      );
      starGeometry.setAttribute(
        "size",
        new THREE.BufferAttribute(starSizes, 1)
      );

      const starMaterial = new THREE.PointsMaterial({
        size: 2.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
      });

      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);

      // Create shooting stars
      const shootingStarGeometry = new THREE.BufferGeometry();
      const shootingStarCount = 50;
      const shootingStarPositions = new Float32Array(shootingStarCount * 3);
      const shootingStarVelocities = new Float32Array(shootingStarCount * 3);
      const shootingStarColors = new Float32Array(shootingStarCount * 3);
      const shootingStarSizes = new Float32Array(shootingStarCount);
      const shootingStarLifetimes = new Float32Array(shootingStarCount);
      
      for (let i = 0; i < shootingStarCount; i++) {
        const i3 = i * 3;
        shootingStarPositions[i3] = (Math.random() - 0.5) * 2000;
        shootingStarPositions[i3 + 1] = (Math.random() - 0.5) * 2000;
        shootingStarPositions[i3 + 2] = (Math.random() - 0.5) * 2000;
        
        // Velocities
        shootingStarVelocities[i3] = (Math.random() - 0.5) * 10;
        shootingStarVelocities[i3 + 1] = (Math.random() - 0.5) * 10;
        shootingStarVelocities[i3 + 2] = (Math.random() - 0.5) * 10;
        
        // Colors
        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.2 + 0.5, 0.9, 0.7); // Blueish to purplish colors
        shootingStarColors[i3] = color.r;
        shootingStarColors[i3 + 1] = color.g;
        shootingStarColors[i3 + 2] = color.b;
        
        // Size and lifetime
        shootingStarSizes[i] = Math.random() * 4 + 2;
        shootingStarLifetimes[i] = Math.random() * 100;
      }
      
      shootingStarGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(shootingStarPositions, 3)
      );
      shootingStarGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(shootingStarColors, 3)
      );
      
      const shootingStarMaterial = new THREE.PointsMaterial({
        size: 4,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });
      
      const shootingStars = new THREE.Points(shootingStarGeometry, shootingStarMaterial);
      scene.add(shootingStars);
      shootingStarsRef.current = shootingStars;

      // Store all nebula animations
      const nebulaAnimations: (() => void)[] = [];

      // Create nebulas (colorful clouds)
      for (let i = 0; i < 10; i++) {
        // Create a more complex geometry for nebulas
        const nebulaGeometry = new THREE.IcosahedronGeometry(Math.random() * 40 + 20, 2);
        
        // Create a shader material for more ethereal look
        const nebulaMaterial = new THREE.MeshPhongMaterial({
          color: new THREE.Color().setHSL(Math.random(), 0.8, 0.5),
          transparent: true,
          opacity: 0.2,
          side: THREE.DoubleSide,
          wireframe: Math.random() > 0.7,
          emissive: new THREE.Color().setHSL(Math.random(), 0.9, 0.4),
          emissiveIntensity: 0.5,
        });
        
        const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
        nebula.position.set(
          (Math.random() - 0.5) * 800,
          (Math.random() - 0.5) * 800,
          (Math.random() - 0.5) * 800
        );
        nebula.rotation.set(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        );
        nebula.scale.set(
          1 + Math.random() * 5,
          1 + Math.random() * 5,
          1 + Math.random() * 5
        );
        scene.add(nebula);
        
        // Animate nebulas
        const nebulaSpeed = Math.random() * 0.0005 + 0.0002;
        const nebulaDirection = new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize();
        
        const animateNebula = () => {
          nebula.rotation.x += nebulaSpeed;
          nebula.rotation.y += nebulaSpeed * 0.8;
          nebula.position.addScaledVector(nebulaDirection, nebulaSpeed * 10);
          
          // If nebula goes too far, reset its position
          if (nebula.position.length() > 1000) {
            nebula.position.set(
              (Math.random() - 0.5) * 800,
              (Math.random() - 0.5) * 800,
              (Math.random() - 0.5) * 800
            );
          }
        };
        
        nebulaAnimations.push(animateNebula);
      }

      // Add some magical particles
      const particleGeometry = new THREE.BufferGeometry();
      const particleCount = 5000;
      const particlePositions = new Float32Array(particleCount * 3);
      const particleColors = new Float32Array(particleCount * 3);
      const particleSpeeds = new Float32Array(particleCount);

      for (let i = 0; i < particleCount * 3; i += 3) {
        particlePositions[i] = (Math.random() - 0.5) * 1000;
        particlePositions[i + 1] = (Math.random() - 0.5) * 1000;
        particlePositions[i + 2] = (Math.random() - 0.5) * 1000;

        // Magical colors - purples, pinks, blues
        const colorChoice = Math.random();
        const color = new THREE.Color();
        
        if (colorChoice < 0.3) {
          // Purple
          color.setHSL(0.75, 0.9, 0.7);
        } else if (colorChoice < 0.6) {
          // Pink
          color.setHSL(0.85, 0.9, 0.8);
        } else if (colorChoice < 0.8) {
          // Blue
          color.setHSL(0.65, 0.9, 0.7);
        } else {
          // Gold
          color.setHSL(0.12, 0.9, 0.6);
        }
        
        particleColors[i] = color.r;
        particleColors[i + 1] = color.g;
        particleColors[i + 2] = color.b;
        
        particleSpeeds[i / 3] = 0.1 + Math.random() * 0.4;
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
        size: 4,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
      });

      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      // Create 3D anime character
      // Since we can't directly create a 3D model from an image,
      // we'll use a placeholder and position it nicely
      const animeCharacterGeometry = new THREE.BoxGeometry(1, 1, 1);
      animeCharacterGeometry.scale(5, 10, 2);
      const textureLoader = new THREE.TextureLoader();
      const animeTexture = textureLoader.load('/lovable-uploads/209d99d5-4f07-4de8-83a8-c13dc829a88b.png');
      
      const animeMaterial = new THREE.MeshStandardMaterial({
        map: animeTexture,
        transparent: true,
        roughness: 0.5,
        metalness: 0.8,
      });
      
      const animeCharacter = new THREE.Mesh(animeCharacterGeometry, animeMaterial);
      animeCharacter.position.set(0, 0, 0);
      animeCharacter.castShadow = true;
      animeCharacter.receiveShadow = true;
      
      // Create a group to hold our character for easier manipulation
      const animeGroup = new THREE.Group();
      animeGroup.add(animeCharacter);
      animeGroup.position.set(10, 0, -20);
      scene.add(animeGroup);
      animeModelRef.current = animeGroup;
      originalPositionRef.current = animeGroup.position.clone();

      // Setup drag controls for the anime character
      let selectedObject: THREE.Object3D | null = null;
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      // Create more anime characters
      for (let i = 0; i < 5; i++) {
        const charGeometry = new THREE.BoxGeometry(1, 1, 1);
        charGeometry.scale(3 + Math.random() * 3, 8 + Math.random() * 4, 1.5);
        
        // We'll use the same texture but with different colors
        const charMaterial = new THREE.MeshStandardMaterial({
          map: animeTexture,
          transparent: true,
          roughness: 0.5,
          metalness: 0.8,
          color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6), // Random color tint
        });
        
        const charMesh = new THREE.Mesh(charGeometry, charMaterial);
        charMesh.castShadow = true;
        charMesh.receiveShadow = true;
        
        const charGroup = new THREE.Group();
        charGroup.add(charMesh);
        
        // Position randomly around the scene
        charGroup.position.set(
          (Math.random() - 0.5) * 100,
          (Math.random() * 10) - 5,
          (Math.random() - 0.5) * 100
        );
        
        scene.add(charGroup);
        
        // Add animation for each character
        const animateChar = () => {
          const time = Date.now() * 0.001;
          const uniqueOffset = i * 0.5;
          
          // Float up and down
          charGroup.position.y += Math.sin(time + uniqueOffset) * 0.03;
          
          // Gentle rotation
          charGroup.rotation.y += 0.005;
        };
        
        nebulaAnimations.push(animateChar);
      }

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        // Rotate stars slowly
        stars.rotation.y += 0.0002;
        stars.rotation.x += 0.0001;
        
        // Animate shooting stars
        if (shootingStarsRef.current) {
          const positions = shootingStarsRef.current.geometry.attributes.position.array as Float32Array;
          
          for (let i = 0; i < shootingStarCount; i++) {
            const i3 = i * 3;
            
            // Update position based on velocity
            positions[i3] += shootingStarVelocities[i3] * 0.5;
            positions[i3 + 1] += shootingStarVelocities[i3 + 1] * 0.5;
            positions[i3 + 2] += shootingStarVelocities[i3 + 2] * 0.5;
            
            // Update lifetime
            shootingStarLifetimes[i] -= 1;
            
            // Reset shooting star if lifetime expired or out of bounds
            if (shootingStarLifetimes[i] <= 0 || 
                Math.abs(positions[i3]) > 1000 ||
                Math.abs(positions[i3 + 1]) > 1000 ||
                Math.abs(positions[i3 + 2]) > 1000) {
              positions[i3] = (Math.random() - 0.5) * 2000;
              positions[i3 + 1] = (Math.random() - 0.5) * 2000;
              positions[i3 + 2] = (Math.random() - 0.5) * 2000;
              
              shootingStarVelocities[i3] = (Math.random() - 0.5) * 10;
              shootingStarVelocities[i3 + 1] = (Math.random() - 0.5) * 10;
              shootingStarVelocities[i3 + 2] = (Math.random() - 0.5) * 10;
              
              shootingStarLifetimes[i] = Math.random() * 100;
            }
          }
          
          shootingStarsRef.current.geometry.attributes.position.needsUpdate = true;
        }
        
        // Animate particles
        const particlePositions = particles.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particlePositions.length; i += 3) {
          const idx = i / 3;
          const time = Date.now() * 0.001;
          particlePositions[i + 1] += particleSpeeds[idx] * Math.sin(time + idx) * 0.1;
          particlePositions[i] += particleSpeeds[idx] * Math.cos(time + idx) * 0.1;
          
          // Reset particles that go too far
          if (Math.abs(particlePositions[i]) > 500 || Math.abs(particlePositions[i + 1]) > 500 || Math.abs(particlePositions[i + 2]) > 500) {
            particlePositions[i] = (Math.random() - 0.5) * 1000;
            particlePositions[i + 1] = (Math.random() - 0.5) * 1000;
            particlePositions[i + 2] = (Math.random() - 0.5) * 1000;
          }
        }
        particles.geometry.attributes.position.needsUpdate = true;
        
        // Animate nebulas
        nebulaAnimations.forEach(animateNebula => animateNebula());
        
        // Gently float the anime character when not being dragged
        if (animeModelRef.current && !draggingRef.current) {
          const time = Date.now() * 0.001;
          animeModelRef.current.position.y = originalPositionRef.current!.y + Math.sin(time) * 2;
          animeModelRef.current.rotation.y += 0.005;
        }

        // Update orbit controls if enabled
        if (controls.enabled) {
          controls.update();
        }

        renderer.render(scene, camera);
      };

      animate();

      // Mouse event handling for dragging objects
      const onMouseDown = (event: MouseEvent) => {
        // Get normalized mouse coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);
        
        // Find intersections
        const intersects = raycaster.intersectObjects([animeGroup], true);
        
        if (intersects.length > 0) {
          selectedObject = animeGroup;
          draggingRef.current = true;
          controls.enabled = true;
        }
      };
      
      const onMouseMove = (event: MouseEvent) => {
        if (selectedObject) {
          // Update mouse coordinates
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
          
          // Cast a ray and find the intersection with a plane at Z=0
          raycaster.setFromCamera(mouse, camera);
          const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
          const point = new THREE.Vector3();
          raycaster.ray.intersectPlane(plane, point);
          
          // Update position of selected object
          selectedObject.position.copy(point);
        }
      };
      
      const onMouseUp = () => {
        if (selectedObject) {
          // Animate back to original position
          const originalPos = originalPositionRef.current!;
          const targetPosition = originalPos.clone();
          const startPosition = selectedObject.position.clone();
          const startTime = Date.now();
          const duration = 1000; // 1 second
          
          const animateReturn = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic: progress = 1 - (1 - progress)^3
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            selectedObject!.position.lerpVectors(startPosition, targetPosition, easeProgress);
            
            if (progress < 1) {
              requestAnimationFrame(animateReturn);
            } else {
              draggingRef.current = false;
            }
          };
          
          animateReturn();
          selectedObject = null;
          controls.enabled = false;
        }
      };
      
      window.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

      // Handle resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        mountRef.current?.removeChild(renderer.domElement);
      };
    };

    // No cleanup needed at this level since we handle it in initScene
    return () => {};
  }, []);

  return <div ref={mountRef} className="fixed top-0 left-0 -z-10" />;
};
