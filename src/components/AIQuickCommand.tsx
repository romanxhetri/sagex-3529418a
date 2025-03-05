
import React, { useState, useRef } from "react";
import { Send, Sparkles, Bot, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const AIQuickCommand = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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
        localStorage.setItem("pendingUpdateRequest", command);
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
        localStorage.setItem("pendingRequest", command);
      }

      toast({
        title: "Command received",
        description: "SageX AI is processing your request",
      });
      
      setCommand("");
    } catch (error) {
      console.error("Error processing command:", error);
      setAiResponse("Sorry, I encountered an error processing your command.");
      toast({
        title: "Error",
        description: "Failed to process command",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 p-4 bg-purple-600 rounded-full shadow-lg text-white z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-20 right-6 w-80 bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-glass-border">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Sparkles className="text-purple-400 mr-2" size={18} />
                SageX AI Command
              </h3>
              <p className="text-xs text-gray-400">
                Tell SageX what you need and it will help you
              </p>
            </div>

            {aiResponse && (
              <div className="p-4 bg-purple-900/20 border-b border-glass-border">
                <p className="text-sm text-white">{aiResponse}</p>
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
                <button
                  type="submit"
                  disabled={isProcessing || !command.trim()}
                  className="p-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCommand("Find best laptop")}
                  className="px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                >
                  Find best laptop
                </button>
                <button
                  type="button"
                  onClick={() => setCommand("Update app with new feature")}
                  className="px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                >
                  Update app
                </button>
                <button
                  type="button"
                  onClick={() => setCommand("Open chat")}
                  className="px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                >
                  Open chat
                </button>
                <button
                  type="button"
                  onClick={() => setCommand("Add new product")}
                  className="px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                >
                  Add new product
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
