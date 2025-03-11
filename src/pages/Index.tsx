
import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Bot, Laptop, Smartphone, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { aiAutoUpdater } from "@/services/AIAutoUpdater";
import { useToast } from "@/hooks/use-toast";

// Try to dynamically import the TutorialButton if it exists
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
  const { toast } = useToast();
  
  const handleAiCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiCommand.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // Process the AI command
      if (aiCommand.toLowerCase().includes("update") || 
          aiCommand.toLowerCase().includes("add feature") ||
          aiCommand.toLowerCase().includes("create component")) {
        
        // Check if this is an admin command to update the app
        if (!showPasswordModal) {
          setShowPasswordModal(true);
          setIsProcessing(false);
          return;
        }
        
        // Password was entered, check if it's correct
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
        
        // If password is correct, add the task to the AI auto updater
        setShowPasswordModal(false);
        setPasswordInput("");
        
        // Add the task to the AI auto updater
        aiAutoUpdater.addTaskFromUserCommand(aiCommand);
        
        // Redirect to the Updates page
        localStorage.setItem("pendingUpdateRequest", aiCommand);
        window.location.href = "/updates";
      } else {
        // For non-admin commands, handle them directly
        toast({
          title: "Command Received",
          description: "Processing your request...",
        });
        
        // Simulate processing
        setTimeout(() => {
          toast({
            title: "Command Processed",
            description: "Your request has been completed!",
          });
          
          // Navigate based on the command
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
          
          {/* AI Command Chat Box */}
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
          
          {/* Password Modal */}
          {showPasswordModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-black/70"
            >
              <div className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">Admin Access Required</h3>
                <p className="text-gray-300 mb-4">
                  Enter your admin password to proceed with app updates:
                </p>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full p-3 bg-black/30 border border-glass-border rounded-md text-white placeholder-gray-500 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordInput("");
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={(e) => handleAiCommand(e as any)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Dynamic components section */}
          <motion.div 
            className="mt-10 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <DynamicComponentRenderer 
              componentName="TutorialButton" 
              fallback={null}
            />
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16"
        >
          <Link to="/laptops">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.98 }}
              className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg p-6 hover:border-purple-500/50 transition-all transform hover:rotate-1 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            >
              <Laptop className="text-purple-400 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Laptop Finder</h3>
              <p className="text-gray-400">Find the perfect laptop with AI-powered recommendations</p>
            </motion.div>
          </Link>
          
          <Link to="/mobiles">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: -1 }}
              whileTap={{ scale: 0.98 }}
              className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg p-6 hover:border-blue-500/50 transition-all transform hover:rotate-1 hover:shadow-[0_0_15px_rgba(96,165,250,0.3)]"
            >
              <Smartphone className="text-blue-400 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Mobile Expert</h3>
              <p className="text-gray-400">Discover the best smartphones with AI assistance</p>
            </motion.div>
          </Link>
          
          <Link to="/chat">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.98 }}
              className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg p-6 hover:border-green-500/50 transition-all transform hover:rotate-1 hover:shadow-[0_0_15px_rgba(74,222,128,0.3)]"
            >
              <Bot className="text-green-400 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
              <p className="text-gray-400">Get personalized help with your tech questions</p>
            </motion.div>
          </Link>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
