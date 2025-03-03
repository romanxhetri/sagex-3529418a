
import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Scene } from "@/components/Scene";
import { ChatInterface } from "@/components/ChatInterface";
import { motion } from "framer-motion";
import { Laptop } from "lucide-react";
import { Link } from "react-router-dom";

const Chat = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Scene />
      <Header />
      
      <main className="container mx-auto px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <Link 
            to="/laptops"
            className="mb-6 flex items-center justify-center text-center py-3 px-6 bg-purple-600/30 backdrop-blur-md border border-purple-600/50 rounded-lg text-white hover:bg-purple-600/50 transition-all duration-300 shadow-lg hover:shadow-purple-600/20"
          >
            <Laptop className="mr-2" size={20} />
            <span>Need a new laptop? Try our AI-powered laptop finder!</span>
          </Link>
          
          <ChatInterface />
        </motion.div>
      </main>
    </div>
  );
};

export default Chat;
