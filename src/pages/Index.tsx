
import React from "react";
import { Header } from "@/components/Header";
import { Scene } from "@/components/Scene";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Scene />
      <Header />
      
      <main className="container mx-auto px-4 pt-32">
        <motion.div
          className="max-w-4xl mx-auto text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="px-4 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome to the Future
          </motion.span>

          <motion.h1
            className="text-5xl md:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Experience Magic with{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
              SageX
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-gradient-multi max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Unleash the power of AI with our revolutionary platform. Experience
            seamless interactions, stunning visuals, and limitless possibilities.
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row gap-4 justify-center pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link 
              to="/chat"
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full text-white font-medium transition-all duration-300 animate-glow transform hover:scale-105"
            >
              Chat with SageX 🤖
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
