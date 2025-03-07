
import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ChatInterface } from "@/components/ChatInterface";
import { motion } from "framer-motion";
import { Laptop, Smartphone, Sparkles, Download, Headphones } from "lucide-react";
import { Link } from "react-router-dom";
import { WeatherEffects } from "@/components/WeatherEffects";

const Chat = () => {
  const [currentWeather, setCurrentWeather] = useState<"thunder" | "rain" | "fire" | "wind">("thunder");
  
  useEffect(() => {
    // Cycle through weather effects every 5 seconds
    const interval = setInterval(() => {
      setCurrentWeather(prev => {
        switch (prev) {
          case "thunder": return "rain";
          case "rain": return "fire";
          case "fire": return "wind";
          case "wind": return "thunder";
          default: return "thunder";
        }
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Link 
              to="/laptops"
              className="flex items-center justify-center text-center py-3 px-6 bg-purple-600/30 backdrop-blur-md border border-purple-600/50 rounded-lg text-white hover:bg-purple-600/50 transition-all duration-300 shadow-lg hover:shadow-purple-600/20 group"
            >
              <Laptop className="mr-2 group-hover:animate-bounce" size={20} />
              <span>Need a new laptop? Try our AI-powered laptop finder! 💻✨</span>
              <Sparkles className="ml-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
            </Link>
            
            <Link 
              to="/mobiles"
              className="flex items-center justify-center text-center py-3 px-6 bg-pink-600/30 backdrop-blur-md border border-pink-600/50 rounded-lg text-white hover:bg-pink-600/50 transition-all duration-300 shadow-lg hover:shadow-pink-600/20 group"
            >
              <Smartphone className="mr-2 group-hover:animate-bounce" size={20} />
              <span>Looking for a smartphone? Check out our mobile collection! 📱🔥</span>
              <Sparkles className="ml-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
            </Link>
            
            <Link 
              to="/updates"
              className="flex items-center justify-center text-center py-3 px-6 bg-blue-600/30 backdrop-blur-md border border-blue-600/50 rounded-lg text-white hover:bg-blue-600/50 transition-all duration-300 shadow-lg hover:shadow-blue-600/20 group"
            >
              <Download className="mr-2 group-hover:animate-bounce" size={20} />
              <span>Update SageX with new features! AI-powered platform evolution! 🚀⚡</span>
              <Sparkles className="ml-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
            </Link>
          </div>
          
          <ChatInterface />
        </motion.div>
      </main>
    </div>
  );
};

export default Chat;
