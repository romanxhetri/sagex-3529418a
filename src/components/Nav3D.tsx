
import React, { useEffect, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import { motion, PanInfo } from 'framer-motion';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import { 
  Book, 
  Box, 
  Brain, 
  Calculator, 
  Facebook, 
  Gamepad, 
  Image, 
  Laptop, 
  MessageCircle, 
  Search, 
  Video 
} from 'lucide-react';

interface NavItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  position?: { x: number; y: number };
}

export const Nav3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<NavItem[]>(() => {
    const savedItems = localStorage.getItem('navItems');
    return savedItems ? JSON.parse(savedItems) : [
      { id: 'product', title: 'Product', icon: <Box className="w-6 h-6" />, path: '/product' },
      { id: 'resources', title: 'Resources', icon: <Book className="w-6 h-6" />, path: '/resources' },
      { id: 'pricing', title: 'Pricing', icon: <Calculator className="w-6 h-6" />, path: '/pricing' },
      { id: 'blog', title: 'Blog', icon: <Brain className="w-6 h-6" />, path: '/blog' },
      { id: 'facebook', title: 'Facebook', icon: <Facebook className="w-6 h-6" />, path: '/facebook' },
      { id: 'chatgpt', title: 'ChatGPT', icon: <MessageCircle className="w-6 h-6" />, path: '/chat' },
      { id: 'laptops', title: 'Laptops', icon: <Laptop className="w-6 h-6" />, path: '/laptops' },
      { id: 'ai-search', title: 'AI Search', icon: <Search className="w-6 h-6" />, path: '/search' },
      { id: 'games', title: 'Games', icon: <Gamepad className="w-6 h-6" />, path: '/games' },
      { id: 'media', title: 'Media Creation', icon: <Image className="w-6 h-6" />, path: '/media' },
      { id: 'video', title: 'Video Editor', icon: <Video className="w-6 h-6" />, path: '/video' }
    ];
  });

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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

    // Create floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: 0x8a2be2,
      transparent: true,
      opacity: 0.5,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Position camera
    camera.position.z = 5;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      particlesMesh.rotation.x += 0.0001;
      particlesMesh.rotation.y += 0.0001;
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  const DraggableNavItem = ({ item }: { item: NavItem }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'nav-item',
      item: { id: item.id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const newItems = items.map((i) => {
        if (i.id === item.id) {
          const rect = (event.target as HTMLElement).getBoundingClientRect();
          return {
            ...i,
            position: {
              x: rect.left + info.offset.x,
              y: rect.top + info.offset.y,
            },
          };
        }
        return i;
      });
      setItems(newItems);
      localStorage.setItem('navItems', JSON.stringify(newItems));
    };

    return (
      <motion.div
        ref={drag}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDrag={handleDrag}
        className={`absolute cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
        style={{
          left: item.position?.x || 'auto',
          top: item.position?.y || 'auto',
        }}
        whileHover={{ scale: 1.1 }}
      >
        <Link
          to={item.path}
          className="flex items-center space-x-2 px-4 py-2 bg-glass-dark backdrop-blur-lg rounded-lg border border-glass-border hover:border-purple-500 transition-all duration-300 animate-glow group"
        >
          <div className="text-purple-400 group-hover:text-purple-300 transition-colors">
            {item.icon}
          </div>
          <span className="text-white group-hover:text-purple-300 transition-colors">
            {item.title}
          </span>
        </Link>
      </motion.div>
    );
  };

  return (
    <>
      <div ref={mountRef} className="fixed top-0 left-0 w-full h-full -z-10" />
      <nav className="fixed top-20 left-4 space-y-4 z-50">
        {items.map((item) => (
          <DraggableNavItem key={item.id} item={item} />
        ))}
      </nav>
    </>
  );
};
