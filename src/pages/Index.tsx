
import React from "react";
import { Header } from "@/components/Header";
import { MagicalUniverseScene } from "@/components/MagicalUniverseScene";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MessageCircle, Laptop, Smartphone, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <MagicalUniverseScene />
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
            Welcome to the Future ✨
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
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full text-white font-medium transition-all duration-300 animate-glow transform hover:scale-105 flex items-center justify-center"
            >
              <MessageCircle className="mr-2" size={20} />
              Chat with SageX 🤖
              <Sparkles className="ml-2" size={16} />
            </Link>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Link 
              to="/laptops"
              className="flex flex-col items-center justify-center text-center p-6 bg-purple-600/20 backdrop-blur-md border border-purple-600/30 rounded-lg text-white hover:bg-purple-600/30 transition-all duration-300 shadow-lg hover:shadow-purple-600/20 group"
            >
              <Laptop className="mb-2 group-hover:animate-bounce" size={30} />
              <span className="text-lg font-medium">Shop Laptops</span>
              <span className="text-sm text-gray-300 mt-1">Find your perfect digital companion 💻</span>
            </Link>
            
            <Link 
              to="/mobiles"
              className="flex flex-col items-center justify-center text-center p-6 bg-pink-600/20 backdrop-blur-md border border-pink-600/30 rounded-lg text-white hover:bg-pink-600/30 transition-all duration-300 shadow-lg hover:shadow-pink-600/20 group"
            >
              <Smartphone className="mb-2 group-hover:animate-bounce" size={30} />
              <span className="text-lg font-medium">Shop Smartphones</span>
              <span className="text-sm text-gray-300 mt-1">Premium mobile devices at your fingertips 📱</span>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
