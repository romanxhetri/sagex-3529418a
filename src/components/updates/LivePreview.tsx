
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, RefreshCcw } from "lucide-react";

interface LivePreviewProps {
  code: string;
  isLoading?: boolean;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ code, isLoading = false }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    if (iframeRef.current && code) {
      try {
        const htmlTemplate = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { background-color: #111; color: white; font-family: sans-serif; }
            </style>
          </head>
          <body>
            <div id="app"></div>
            <script type="module">
              import React from 'https://esm.sh/react@18.2.0';
              import ReactDOM from 'https://esm.sh/react-dom@18.2.0/client';
              import { motion } from 'https://esm.sh/framer-motion@10.12.4';
              import * as lucide from 'https://esm.sh/lucide-react@0.259.0';
              
              const Component = () => {
                ${code}
                return null;
              };
              
              const root = ReactDOM.createRoot(document.getElementById('app'));
              root.render(React.createElement(Component));
            </script>
          </body>
          </html>
        `;
        
        const iframe = iframeRef.current;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        
        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(htmlTemplate);
          iframeDoc.close();
        }
      } catch (error) {
        console.error("Error rendering preview:", error);
      }
    }
  }, [code]);
  
  return (
    <motion.div 
      className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800">
        <div className="flex items-center">
          <Play size={16} className="mr-2 text-green-400" />
          <span className="text-sm text-gray-400">Live Preview</span>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          <RefreshCcw size={16} />
        </button>
      </div>
      
      <div className="flex-grow bg-black p-1 relative min-h-[400px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <iframe 
            ref={iframeRef}
            className="w-full h-full bg-black rounded-md"
            title="Live Preview"
            sandbox="allow-scripts"
          />
        )}
      </div>
    </motion.div>
  );
};
