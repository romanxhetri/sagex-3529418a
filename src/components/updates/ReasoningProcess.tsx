
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Brain } from "lucide-react";

interface ReasoningProcessProps {
  reasoning: string;
  isMinimized: boolean;
  onToggle: () => void;
}

export const ReasoningProcess: React.FC<ReasoningProcessProps> = ({
  reasoning,
  isMinimized,
  onToggle
}) => {
  return (
    <motion.div
      className="bg-black/50 backdrop-blur-sm rounded-lg border border-purple-500/30 overflow-hidden mb-4"
      initial={{ opacity: 0, height: 0 }}
      animate={{ 
        opacity: 1, 
        height: isMinimized ? "48px" : "auto"
      }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-purple-900/20"
        onClick={onToggle}
      >
        <div className="flex items-center text-purple-400">
          <Brain className="mr-2" size={18} />
          <h3 className="font-medium">AI Reasoning Process</h3>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          {isMinimized ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
      </div>
      
      {!isMinimized && (
        <motion.div 
          className="px-4 py-3 border-t border-purple-500/30 text-gray-300 whitespace-pre-wrap text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {reasoning}
        </motion.div>
      )}
    </motion.div>
  );
};
