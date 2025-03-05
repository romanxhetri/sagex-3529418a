
import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, X, Zap, Laptop, Phone, InfoIcon, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { aiAutoUpdater } from "@/services/AIAutoUpdater";
import { toast } from "sonner";

export const AIQuickCommand = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast: uiToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Default suggestions based on capabilities
  const defaultSuggestions = [
    "Find best laptop",
    "Update app with new feature",
    "Open chat",
    "Add new product"
  ];

  useEffect(() => {
    // Reset suggestions when command changes
    if (command.trim()) {
      const lowerCommand = command.toLowerCase();
      // Provide contextual suggestions based on user input
      if (lowerCommand.includes('laptop')) {
        setSuggestions([
          "Show gaming laptops",
          "Find budget laptops",
          "Compare top laptops",
          "Show laptop details"
        ]);
      } else if (lowerCommand.includes('mobile') || lowerCommand.includes('phone')) {
        setSuggestions([
          "Show latest phones",
          "Find budget phones",
          "Compare top phones",
          "Show phone specs"
        ]);
      } else if (lowerCommand.includes('update') || lowerCommand.includes('feature')) {
        setSuggestions([
          "Add dark mode",
          "Improve performance",
          "Add search feature",
          "Create product filter"
        ]);
      } else {
        setSuggestions(defaultSuggestions);
      }
    } else {
      setSuggestions(defaultSuggestions);
    }
  }, [command]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setIsProcessing(true);
    setAiResponse("Processing your command...");

    try {
      // Process command logic
      const commandLower = command.toLowerCase();
      
      // Check for navigation commands
      if (commandLower.includes("open") || commandLower.includes("go to") || commandLower.includes("navigate")) {
        if (commandLower.includes("chat")) {
          setAiResponse("Opening Chat interface...");
          setTimeout(() => navigate("/chat"), 1000);
        } else if (commandLower.includes("laptop")) {
          setAiResponse("Opening Laptop section...");
          setTimeout(() => navigate("/laptops"), 1000);
        } else if (commandLower.includes("mobile") || commandLower.includes("phone")) {
          setAiResponse("Opening Mobile section...");
          setTimeout(() => navigate("/mobiles"), 1000);
        } else if (commandLower.includes("update")) {
          setAiResponse("Opening Updates section...");
          setTimeout(() => navigate("/updates"), 1000);
        } else {
          setAiResponse("I'm not sure which section you want to open. Available sections: Chat, Laptops, Mobiles, Updates");
        }
      } 
      // Check for feature requests or updates
      else if (commandLower.includes("update") || commandLower.includes("improve") || 
               commandLower.includes("new feature") || commandLower.includes("add")) {
        setAiResponse("I'll process your request to update the app. Navigating to Updates section...");
        
        // Add to AI Auto Updater tasks
        aiAutoUpdater.addTaskFromUserCommand(command);
        
        toast.success("Task added to AI Auto Updater", {
          description: command
        });
        
        setTimeout(() => navigate("/updates"), 1500);
      }
      // Check for find/search commands 
      else if (commandLower.includes("find") || commandLower.includes("search") || 
               commandLower.includes("best") || commandLower.includes("recommend")) {
        if (commandLower.includes("laptop")) {
          setAiResponse("I'll help you find the best laptops. Opening laptop section...");
          localStorage.setItem("searchQuery", command);
          setTimeout(() => navigate("/laptops"), 1000);
        } else if (commandLower.includes("mobile") || commandLower.includes("phone")) {
          setAiResponse("I'll help you find mobile devices. Opening mobile section...");
          localStorage.setItem("searchQuery", command);
          setTimeout(() => navigate("/mobiles"), 1000);
        } else {
          setAiResponse("I'm not sure what you're looking for. Try specifying 'laptop' or 'mobile'.");
        }
      }
      // Default response
      else {
        setAiResponse(`I'll process your request: "${command}". Would you like me to create a new feature based on this?`);
        
        // Create a task for the AI Auto Updater
        aiAutoUpdater.addTaskFromUserCommand(command);
        
        toast.success("Task added to AI Auto Updater", {
          description: command
        });
      }

      uiToast({
        title: "Command received",
        description: "SageX AI is processing your request",
      });
      
      setCommand("");
    } catch (error) {
      console.error("Error processing command:", error);
      setAiResponse("Sorry, I encountered an error processing your command.");
      uiToast({
        title: "Error",
        description: "Failed to process command",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Create dynamic suggestion buttons based on current context
  const renderSuggestions = () => {
    return suggestions.map((suggestion, index) => (
      <button
        key={index}
        type="button"
        onClick={() => setCommand(suggestion)}
        className="px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors flex items-center gap-1"
      >
        {suggestion.toLowerCase().includes('laptop') && <Laptop size={12} />}
        {suggestion.toLowerCase().includes('mobile') && <Phone size={12} />}
        {suggestion.toLowerCase().includes('update') && <Zap size={12} />}
        {suggestion.toLowerCase().includes('feature') && <Sparkles size={12} />}
        {suggestion}
      </button>
    ));
  };

  return (
    <>
      <motion.button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg text-white z-50 flex items-center justify-center"
        whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(124, 58, 237, 0.5)" }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-20 right-6 w-80 md:w-96 bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-glass-border">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Sparkles className="text-purple-400 mr-2" size={18} />
                SageX AI Command
              </h3>
              <p className="text-xs text-gray-400">
                Tell SageX what you need and it will help you automatically
              </p>
            </div>

            {aiResponse && (
              <div className="p-4 bg-purple-900/20 border-b border-glass-border">
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-white"
                >
                  {aiResponse}
                </motion.p>
              </div>
            )}

            <form onSubmit={handleCommand} className="p-4">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="Ask SageX AI to do something..."
                  className="flex-1 bg-glass rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isProcessing}
                />
                <motion.button
                  type="submit"
                  disabled={isProcessing || !command.trim()}
                  className="p-2 text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={16} />
                </motion.button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {renderSuggestions()}
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <InfoIcon size={12} className="mr-1" />
                  <span>Auto-updates enabled</span>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/updates');
                  }}
                  className="flex items-center hover:text-gray-300"
                >
                  <Settings size={12} className="mr-1" />
                  <span>AI Settings</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
