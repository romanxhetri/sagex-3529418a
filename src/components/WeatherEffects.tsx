
import React, { useEffect, useRef } from 'react';

interface WeatherEffectsProps {
  weatherType: "thunder" | "rain" | "fire" | "wind" | "magic";
}

export const WeatherEffects: React.FC<WeatherEffectsProps> = ({ weatherType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particles array
    let particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      life: number;
      maxLife: number;
    }[] = [];

    const fireColors = ['#FF8C00', '#FF4500', '#FF6347', '#FF0000', '#FFD700'];
    const rainColors = ['#ADD8E6', '#87CEEB', '#00BFFF', '#1E90FF', '#4169E1'];
    const thunderColors = ['#FFD700', '#FFFF00', '#F8F8FF', '#FFFFFF', '#FFFAFA'];
    const windColors = ['#F5F5F5', '#F8F8FF', '#E6E6FA', '#D8BFD8', '#FFFFFF'];
    const magicColors = ['#FF00FF', '#8A2BE2', '#9400D3', '#9932CC', '#BA55D3'];
    
    // Function to create new particles
    const createParticles = () => {
      const count = weatherType === 'fire' ? 15 : 
                   weatherType === 'rain' ? 20 : 
                   weatherType === 'thunder' ? 5 :
                   weatherType === 'magic' ? 15 : 10;
      
      for (let i = 0; i < count; i++) {
        let x, y, speedX, speedY, size, color, life, maxLife, opacity;
        
        if (weatherType === 'fire') {
          x = Math.random() * canvas.width;
          y = canvas.height + Math.random() * 20;
          speedX = (Math.random() - 0.5) * 3;
          speedY = -3 - Math.random() * 3;
          size = 5 + Math.random() * 15;
          color = fireColors[Math.floor(Math.random() * fireColors.length)];
          opacity = 0.7 + Math.random() * 0.3;
          life = maxLife = 50 + Math.random() * 30;
        } 
        else if (weatherType === 'rain') {
          x = Math.random() * canvas.width;
          y = -20;
          speedX = (Math.random() - 0.5) * 2;
          speedY = 10 + Math.random() * 15;
          size = 1 + Math.random() * 3;
          color = rainColors[Math.floor(Math.random() * rainColors.length)];
          opacity = 0.5 + Math.random() * 0.5;
          life = maxLife = 100 + Math.random() * 50;
        } 
        else if (weatherType === 'thunder') {
          x = Math.random() * canvas.width;
          y = Math.random() * (canvas.height / 3);
          speedX = (Math.random() - 0.5) * 5;
          speedY = Math.random() * 5;
          size = 2 + Math.random() * 8;
          color = thunderColors[Math.floor(Math.random() * thunderColors.length)];
          opacity = 0.8 + Math.random() * 0.2;
          life = maxLife = 10 + Math.random() * 20;
        } 
        else if (weatherType === 'magic') {
          x = Math.random() * canvas.width;
          y = Math.random() * canvas.height;
          speedX = (Math.random() - 0.5) * 4;
          speedY = (Math.random() - 0.5) * 4;
          size = 3 + Math.random() * 7;
          color = magicColors[Math.floor(Math.random() * magicColors.length)];
          opacity = 0.6 + Math.random() * 0.4;
          life = maxLife = 60 + Math.random() * 40;
        }
        else { // wind
          x = -20;
          y = Math.random() * canvas.height;
          speedX = 8 + Math.random() * 12;
          speedY = (Math.random() - 0.5) * 5;
          size = 1 + Math.random() * 3;
          color = windColors[Math.floor(Math.random() * windColors.length)];
          opacity = 0.3 + Math.random() * 0.4;
          life = maxLife = 80 + Math.random() * 40;
        }
        
        particles.push({
          x, y, size, speedX, speedY, color, opacity, life, maxLife
        });
      }
    };
    
    // Function to update particles
    const updateParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        
        p.x += p.speedX;
        p.y += p.speedY;
        p.life--;
        
        // Modify behavior based on weather type
        if (weatherType === 'fire') {
          p.speedX += (Math.random() - 0.5) * 0.3;
          p.speedY += (Math.random() - 0.5) * 0.2 - 0.1;
          p.size -= 0.1;
          p.opacity = (p.life / p.maxLife) * (0.7 + Math.random() * 0.3);
        } 
        else if (weatherType === 'rain') {
          p.speedX += (Math.random() - 0.5) * 0.1;
          p.opacity = (p.life / p.maxLife) * 0.8;
        } 
        else if (weatherType === 'thunder') {
          // Make thunder particles flicker
          p.opacity = Math.random() * 0.5 + 0.5;
          p.size += (Math.random() - 0.5) * 2;
        } 
        else if (weatherType === 'magic') {
          // Make magic particles swirl
          p.speedX += Math.sin(p.life * 0.1) * 0.2;
          p.speedY += Math.cos(p.life * 0.1) * 0.2;
          p.size += Math.sin(p.life * 0.2) * 0.3;
          p.opacity = 0.4 + Math.sin(p.life * 0.1) * 0.4;
        }
        else { // wind
          p.speedY += (Math.random() - 0.5) * 0.2;
          p.opacity = (p.life / p.maxLife) * 0.4;
        }
        
        // Remove particles that are off-screen or out of life
        if (p.life <= 0 || 
            p.x < -50 || 
            p.x > canvas.width + 50 || 
            p.y < -50 || 
            p.y > canvas.height + 50 ||
            p.size <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }
    };
    
    // Function to draw particles
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Weather type specific effects
      if (weatherType === 'thunder' && Math.random() < 0.03) {
        // Lightning flash
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Lightning bolt
        if (Math.random() < 0.5) {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2 + Math.random() * 4;
          ctx.beginPath();
          let x = Math.random() * canvas.width;
          let y = 0;
          ctx.moveTo(x, y);
          
          const segments = 5 + Math.floor(Math.random() * 5);
          for (let i = 0; i < segments; i++) {
            x += (Math.random() - 0.5) * 100;
            y += canvas.height / segments;
            ctx.lineTo(x, y);
          }
          
          ctx.stroke();
        }
      }
      
      // Draw all particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        ctx.beginPath();
        
        if (weatherType === 'rain') {
          // Draw raindrops as lines
          ctx.strokeStyle = `rgba(${hexToRgb(p.color)}, ${p.opacity})`;
          ctx.lineWidth = p.size / 2;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 0.5, p.y + p.speedY * 0.5);
          ctx.stroke();
        } 
        else if (weatherType === 'thunder') {
          // Draw thunder particles as glowing dots
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
          gradient.addColorStop(0, `rgba(${hexToRgb(p.color)}, ${p.opacity})`);
          gradient.addColorStop(1, `rgba(${hexToRgb(p.color)}, 0)`);
          
          ctx.fillStyle = gradient;
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
        }
        else if (weatherType === 'magic') {
          // Draw magic particles as stars or sparkles
          ctx.fillStyle = `rgba(${hexToRgb(p.color)}, ${p.opacity})`;
          
          if (Math.random() < 0.5) {
            // Draw star
            const spikes = 5;
            const outerRadius = p.size;
            const innerRadius = p.size / 2;
            
            ctx.beginPath();
            for (let i = 0; i < spikes * 2; i++) {
              const radius = i % 2 === 0 ? outerRadius : innerRadius;
              const angle = (Math.PI * 2) * (i / (spikes * 2));
              const x = p.x + radius * Math.cos(angle);
              const y = p.y + radius * Math.sin(angle);
              
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
          } else {
            // Draw circle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Add glow
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
            gradient.addColorStop(0, `rgba(${hexToRgb(p.color)}, ${p.opacity * 0.5})`);
            gradient.addColorStop(1, `rgba(${hexToRgb(p.color)}, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        else {
          // Draw regular particles (fire and wind)
          ctx.fillStyle = `rgba(${hexToRgb(p.color)}, ${p.opacity})`;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Add glow effect for fire
          if (weatherType === 'fire') {
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
            gradient.addColorStop(0, `rgba(${hexToRgb(p.color)}, ${p.opacity * 0.5})`);
            gradient.addColorStop(1, `rgba(${hexToRgb(p.color)}, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };
    
    // Helper function to convert hex to rgb
    const hexToRgb = (hex: string) => {
      // Remove # if present
      hex = hex.replace('#', '');
      
      // Convert 3-digit hex to 6-digits
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      
      // Parse the values
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      return `${r}, ${g}, ${b}`;
    };
    
    // Animation loop
    const animate = () => {
      createParticles();
      updateParticles();
      drawParticles();
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [weatherType]);
  
  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 opacity-80">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
};
