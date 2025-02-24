
import React from "react";
import { Brain, Terminal, Zap, Globe, RefreshCw, Users } from "lucide-react";
import { motion } from "framer-motion";

interface ReasoningDisplayProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
  currentThought?: string;
}

export const CapabilitiesDisplay: React.FC<ReasoningDisplayProps> = ({
  isMinimized,
  onToggleMinimize,
  currentThought
}) => {
  if (!currentThought) return null;

  return (
    <motion.div 
      initial={{ height: "auto" }}
      animate={{ height: isMinimized ? "2.5rem" : "auto" }}
      className="border-b border-glass-border bg-purple-900/10"
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            Thinking Process
          </h3>
          <button
            onClick={onToggleMinimize}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isMinimized ? "Show" : "Hide"} Details
          </button>
        </div>
        
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="prose prose-invert max-w-none"
          >
            <div className="text-sm text-gray-300 space-y-2">
              {currentThought.split('\n').map((line, i) => (
                <p key={i} className="leading-relaxed">{line}</p>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
