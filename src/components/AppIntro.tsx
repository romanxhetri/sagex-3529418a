
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const AppIntro = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Make the intro disappear after 10 seconds
    const timer = setTimeout(() => {
      setVisible(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: visible ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* VFX Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-purple-500/30"
              style={{
                width: Math.random() * 200 + 50,
                height: Math.random() * 200 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ scale: 0, opacity: 0.7 }}
              animate={{ 
                scale: [0, 1.5, 0],
                opacity: [0.7, 0.3, 0],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Magic circle effects */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="w-96 h-96 rounded-full border-4 border-purple-500/50"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1.5, rotate: 180 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute w-80 h-80 rounded-full border-4 border-blue-500/50"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1.2, rotate: -180 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute w-64 h-64 rounded-full border-4 border-pink-500/50"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 0.9, rotate: 90 }}
            transition={{ duration: 3, ease: "easeOut" }}
          />
        </div>

        {/* 3D Character */}
        <motion.div 
          className="relative z-10"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <img 
            src="/lovable-uploads/209d99d5-4f07-4de8-83a8-c13dc829a88b.png" 
            alt="AI Assistant" 
            className="h-80 object-contain drop-shadow-[0_0_15px_rgba(255,0,255,0.7)]"
          />
          
          {/* Magical aura */}
          <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-purple-600/40 via-pink-500/40 to-blue-500/40 blur-xl animate-pulse" />
        </motion.div>

        {/* Welcome Text */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 1 }}
        >
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-[0_0_8px_rgba(255,0,255,0.7)]">
            🔥 WELCOME TO THE FUTURE! 🔥
          </h1>
          <p className="mt-4 text-xl text-white">Your personal AI shop assistant is ready to blow your mind! 🚀</p>
        </motion.div>

        {/* Skip button */}
        <motion.button
          className="absolute bottom-8 text-white opacity-50 hover:opacity-100 transition-opacity"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2 }}
          onClick={() => setVisible(false)}
        >
          Skip Intro ⏭️
        </motion.button>
      </div>
    </motion.div>
  );
};
