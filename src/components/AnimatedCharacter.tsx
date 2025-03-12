import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const the0 = 0; // Fix for undefined variable the0

export const AnimatedCharacter = () => {
  const characterRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!characterRef.current) return;
    
    // Add interaction with mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      if (!characterRef.current) return;
      
      const rect = characterRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const percentX = (e.clientX - centerX) / (window.innerWidth / 2);
      const percentY = (e.clientY - centerY) / (window.innerHeight / 2);
      
      // Apply subtle rotation based on mouse position
      characterRef.current.style.transform = `
        perspective(1000px) 
        rotateY(${percentX * 10}deg) 
        rotateX(${-percentY * 10}deg)
      `;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div className="relative h-full w-full flex items-center justify-center" ref={characterRef}>
      <motion.div 
        className="h-60 w-40 relative"
        animate={{ 
          y: [0, -10, 0],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 4,
          ease: "easeInOut"
        }}
      >
        {/* Character base */}
        <div className="absolute bottom-0 w-full h-[130px] bg-gradient-to-t from-purple-600 to-blue-500 rounded-t-[70px]">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-36 h-20 bg-gradient-to-t from-indigo-700 to-indigo-600 rounded-t-[50px]"></div>
        </div>
        
        {/* Character head */}
        <motion.div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-b from-purple-400 to-blue-500 rounded-full overflow-hidden border-4 border-indigo-600"
          animate={{ 
            rotateZ: [-2, 2, -2],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 5,
            ease: "easeInOut"
          }}
        >
          {/* Eyes */}
          <motion.div 
            className="absolute top-12 left-6 w-6 h-8 bg-white rounded-full"
            animate={{ 
              scaleY: [1, 0.3, 1],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3,
              repeatDelay: 1.5
            }}
          >
            <motion.div 
              className="absolute top-2 left-1.5 w-3 h-3 bg-black rounded-full"
              animate={{ 
                y: [0, 1, 0, 1, 0],
                x: [0, 1, 0, -1, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                times: [0, 0.2, 0.5, 0.8, 1]
              }}
            ></motion.div>
          </motion.div>
          <motion.div 
            className="absolute top-12 right-6 w-6 h-8 bg-white rounded-full"
            animate={{ 
              scaleY: [1, 0.3, 1],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3,
              repeatDelay: 1.5
            }}
          >
            <motion.div 
              className="absolute top-2 left-1.5 w-3 h-3 bg-black rounded-full"
              animate={{ 
                y: [0, 1, 0, 1, 0],
                x: [0, 1, 0, -1, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                times: [0, 0.2, 0.5, 0.8, 1]
              }}
            ></motion.div>
          </motion.div>
          
          {/* Mouth */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-5 bg-white rounded-full overflow-hidden"
            animate={{ 
              height: [5, 8, 5],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3,
              delay: 0.5
            }}
          >
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-pink-300 rounded-t-full"></div>
          </motion.div>
        </motion.div>
        
        {/* Arms */}
        <motion.div 
          className="absolute top-[100px] left-[-5px] w-8 h-24 bg-gradient-to-b from-purple-500 to-blue-600 rounded-full origin-top"
          animate={{ 
            rotateZ: [10, 30, 10],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut"
          }}
        ></motion.div>
        <motion.div 
          className="absolute top-[100px] right-[-5px] w-8 h-24 bg-gradient-to-b from-purple-500 to-blue-600 rounded-full origin-top"
          animate={{ 
            rotateZ: [-10, -30, -10],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2.5,
            ease: "easeInOut"
          }}
        ></motion.div>
        
        {/* Magical effect */}
        <motion.div 
          className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-md"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3
          }}
        ></motion.div>
      </motion.div>
      
      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-purple-400 to-blue-500"
          style={{
            width: Math.random() * 8 + 2 + 'px',
            height: Math.random() * 8 + 2 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            repeat: Infinity,
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};
