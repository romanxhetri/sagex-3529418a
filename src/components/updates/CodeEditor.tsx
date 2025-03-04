
import React from "react";
import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeEditorProps {
  code: string;
  language?: string;
  onCopy?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  code, 
  language = "jsx",
  onCopy 
}) => {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
    if (onCopy) onCopy();
  };

  return (
    <motion.div 
      className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800">
        <div className="flex items-center">
          <div className="mr-2 flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-sm text-gray-400">{language}</span>
        </div>
        <button 
          onClick={handleCopy}
          className="text-gray-400 hover:text-white transition-colors"
          title="Copy code"
        >
          <Copy size={16} />
        </button>
      </div>
      <pre className="p-4 overflow-auto max-h-[600px] text-sm">
        <code className="text-gray-300">{code}</code>
      </pre>
    </motion.div>
  );
};
