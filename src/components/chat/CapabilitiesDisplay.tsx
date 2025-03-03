
import React from "react";
import { ChevronUp, ChevronDown, Sparkle } from "lucide-react";

interface CapabilitiesDisplayProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
  currentThought: string;
}

export const CapabilitiesDisplay = ({
  isMinimized,
  onToggleMinimize,
  currentThought,
}: CapabilitiesDisplayProps) => {
  if (!currentThought) return null;

  return (
    <div className="border-b border-purple-800/30">
      <div 
        className="flex items-center px-4 py-2 cursor-pointer hover:bg-purple-900/20"
        onClick={onToggleMinimize}
      >
        <Sparkle className="text-blue-400 mr-2" size={18} />
        <span className="text-blue-300 font-medium">Show thinking</span>
        {!isMinimized ? 
          <ChevronUp className="ml-2 text-blue-400" size={16} /> : 
          <ChevronDown className="ml-2 text-blue-400" size={16} />
        }
      </div>
      
      {!isMinimized && (
        <div className="p-4 bg-blue-950/20 text-sm text-white/90 whitespace-pre-wrap">
          {currentThought}
        </div>
      )}
    </div>
  );
};
