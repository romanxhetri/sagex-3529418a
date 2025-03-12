import React, { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Bot, Laptop, Smartphone, Sparkles, Send, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { aiAutoUpdater } from "@/services/AIAutoUpdater";
import { useToast } from "@/hooks/use-toast";
import { ChatInterface } from "@/components/ChatInterface";
import { AnimatedCharacter } from "@/components/AnimatedCharacter";

const DynamicComponentRenderer = ({ componentName, fallback = null }) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const importComponent = async () => {
      try {
        const module = await import(`../components/${componentName.toLowerCase()}`);
        if (module[componentName]) {
          setComponent(() => module[componentName]);
        } else {
          console.info(`Component ${componentName} not found in module`);
          setError(true);
        }
      } catch (err) {
        console.info(`Component at ../components/${componentName.toLowerCase()} not available yet`);
        setError(true);
      }
    };

    importComponent();
  }, [componentName]);

  if (error || !Component) return fallback;
  return <Component />;
};

interface IndexProps {
  adminPassword?: string | null;
}

const Index: React.FC<IndexProps> = ({ adminPassword }) => {
  const [aiCommand, setAiCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCommandChat, setShowCommandChat] = useState(false);
  const miniChatRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const handleAiCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiCommand.trim()) return;
    
    setIsProcessing(true);
    
    try {
      if (aiCommand.toLowerCase().includes("update") || 
          aiCommand.toLowerCase().includes("add feature") ||
          aiCommand.toLowerCase().includes("create component")) {
        
        if (!showPasswordModal) {
          setShowPasswordModal(true);
          setIsProcessing(false);
          return;
        }
        
        if (passwordInput !== adminPassword) {
          toast({
            title: "Access Denied",
            description: "Incorrect password. Admin access required for app updates.",
            variant: "destructive"
          });
          setPasswordInput("");
          setShowPasswordModal(false);
          setIsProcessing(false);
          return;
        }
        
        setShowPasswordModal(false);
        setPasswordInput("");
        
        aiAutoUpdater.addTaskFromUserCommand(aiCommand);
        
        localStorage.setItem("pendingUpdateRequest", aiCommand);
        window.location.href = "/updates";
      } else {
        toast({
          title: "Command Received",
          description: "Processing your request...",
        });
        
        setTimeout(() => {
          toast({
            title: "Command Processed",
            description: "Your request has been completed!",
          });
          
          if (aiCommand.toLowerCase().includes("laptop")) {
            window.location.href = "/laptops";
          } else if (aiCommand.toLowerCase().includes("mobile") || aiCommand.toLowerCase().includes("phone")) {
            window.location.href = "/mobiles";
          } else if (aiCommand.toLowerCase().includes("chat")) {
            window.location.href = "/chat";
          }
          
          setAiCommand("");
          setIsProcessing(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Error processing command:", error);
      toast({
        title: "Error",
        description: "Failed to process your command. Please try again.",
        variant: "destructive"
      });
    } finally {
      if (!showPasswordModal) {
        setIsProcessing(false);
      }
    }
  };

  const toggleCommandChat = () => {
    setShowCommandChat(!showCommandChat);
  };

  const quickCommands = [
    { icon: <Laptop className="w-5 h-5" />, label: "Find laptop", command: "I need help finding a laptop" },
    { icon: <Smartphone className="w-5 h-5" />, label: "Find mobile", command: "Help me choose a smartphone" },
    { icon: <Gamepad className="w-5 h-5" />, label: "Play games", command: "I want to play AI games" },
    { icon: <Bot className="w-5 h-5" />, label: "Chat with AI", command: "Let's have a conversation" },
    { icon: <Search className="w-5 h-5" />, label: "Search internet", command: "Search the web for me" }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            SageX AI Assistant
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            The next generation AI-powered app that evolves with your needs
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8 relative h-64 md:h-72 lg:h-80"
          >
            <AnimatedCharacter />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-8 max-w-2xl mx-auto"
          >
            <form onSubmit={handleAiCommand} className="relative">
              <input
                type="text"
                value={aiCommand}
                onChange={(e) => setAiCommand(e.target.value)}
                placeholder="Type an AI command (e.g., 'Find me a gaming laptop')"
                className="w-full p-4 pl-5 pr-12 bg-glass-dark backdrop-blur-lg border border-glass-border rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg"
                disabled={isProcessing || showPasswordModal}
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50"
                disabled={isProcessing || !aiCommand.trim() || showPasswordModal}
              >
                {isProcessing ? (
                  <div className="animate-spin h-5 w-5 border-2 border-t-transparent border-white rounded-full" />
                ) : (
                  <Send size={20} className="text-white" />
                )}
              </button>
            </form>
            <p className="text-sm text-gray-400 mt-2">
              Try: "Find a laptop for video editing" or "Show me flagship phones"
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mb-12 max-w-4xl mx-auto"
          >
            <div ref={miniChatRef} className="relative">
              <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Chat with SageX AI
              </h2>
              <div className="h-[500px] overflow-hidden rounded-lg">
                <ChatInterface />
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
          >
            <Link to="/laptops">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 1, z: 10 }}
                whileTap={{ scale: 0.98 }}
                className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg p-6 hover:border-purple-500/50 transition-all transform hover:rotate-1 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Laptop className="text-purple-400 mb-4" size={32} />
                <h3 className="text-xl font-semibold mb-2">Laptop Finder</h3>
                <p className="text-gray-400">Find the perfect laptop with AI-powered recommendations</p>
              </motion.div>
            </Link>
            
            <Link to="/mobiles">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: -1, z: 10 }}
                whileTap={{ scale: 0.98 }}
                className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg p-6 hover:border-blue-500/50 transition-all transform hover:rotate-1 hover:shadow-[0_0_15px_rgba(96,165,250,0.3)] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Smartphone className="text-blue-400 mb-4" size={32} />
                <h3 className="text-xl font-semibold mb-2">Mobile Expert</h3>
                <p className="text-gray-400">Discover the best smartphones with AI assistance</p>
              </motion.div>
            </Link>
            
            <Link to="/search">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 1, z: 10 }}
                whileTap={{ scale: 0.98 }}
                className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg p-6 hover:border-green-500/50 transition-all transform hover:rotate-1 hover:shadow-[0_0_15px_rgba(74,222,128,0.3)] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <SearchIcon className="text-green-400 mb-4" size={32} />
                <h3 className="text-xl font-semibold mb-2">AI Search</h3>
                <p className="text-gray-400">Search the web with Perplexity-powered AI research</p>
              </motion.div>
            </Link>
          </motion.div>
          
          <div className="flex gap-2 flex-wrap justify-center mb-4">
           

