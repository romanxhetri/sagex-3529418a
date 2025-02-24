
import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Scene } from "@/components/Scene";
import { ChatInterface } from "@/components/ChatInterface";
import { motion } from "framer-motion";

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
          <ChatInterface />
        </motion.div>
      </main>
    </div>
  );
};

export default Chat;
