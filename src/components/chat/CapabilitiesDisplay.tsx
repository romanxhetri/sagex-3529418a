
import React from "react";
import { Brain, Terminal, Zap, Globe, RefreshCw, Users } from "lucide-react";
import { motion } from "framer-motion";

interface Capability {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
  description: string;
}

interface CapabilitiesDisplayProps {
  capabilities: Capability[];
  onToggle: (id: string) => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

export const CapabilitiesDisplay = ({
  capabilities,
  onToggle,
  isMinimized,
  onToggleMinimize,
}: CapabilitiesDisplayProps) => {
  return (
    <motion.div 
      initial={{ height: "auto" }}
      animate={{ height: isMinimized ? "2.5rem" : "auto" }}
      className="border-b border-glass-border bg-purple-900/10"
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Reasoning Details</h3>
          <button
            onClick={onToggleMinimize}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isMinimized ? "Show" : "Hide"} Details
          </button>
        </div>
        
        {!isMinimized && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {capabilities.map((cap) => (
              <button
                key={cap.id}
                onClick={() => onToggle(cap.id)}
                className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                  cap.enabled ? 'bg-purple-600 text-white' : 'bg-glass text-gray-400'
                }`}
              >
                {cap.icon}
                <div className="text-left">
                  <span className="block">{cap.name}</span>
                  <span className="text-xs opacity-75">{cap.description}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
