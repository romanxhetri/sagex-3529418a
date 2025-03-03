
import React, { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { MagicalUniverseScene } from "@/components/MagicalUniverseScene";
import { motion } from "framer-motion";
import { SendHorizontal, Code, Play, Sparkles, Copy, Download, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Updates = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const previewRef = useRef<HTMLIFrameElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description of what you want to build.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedCode("");
    
    try {
      // Simulate code generation with thinking process
      const thinkingProcess = `🧠 Analyzing request: "${prompt}"

Step 1: Understanding requirements
- Parsing user request for key functionality
- Identifying UI components needed
- Determining data structures required

Step 2: Planning implementation
- Selecting appropriate React components
- Designing state management approach
- Planning API integration points

Step 3: Generating solution
- Creating component structure
- Implementing core functionality
- Adding styling and animations
- Ensuring responsiveness`;

      // Display thinking process with typewriter effect
      for (let i = 0; i < thinkingProcess.length; i++) {
        setGeneratedCode(prev => prev + thinkingProcess[i]);
        await new Promise(r => setTimeout(r, 10));
      }

      await new Promise(r => setTimeout(r, 1000));

      // Sample generated code based on prompt
      const sampleCode = `// Generated code based on: "${prompt}"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ${prompt.includes("weather") ? "Cloud, Sun, Moon, Wind" : "Sparkles, Star, Heart, Zap"} } from 'lucide-react';

export const ${prompt.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("")}Component = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch data or initialize component
    const fetchData = async () => {
      try {
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData([
          { id: 1, title: "Item 1", description: "Description for item 1" },
          { id: 2, title: "Item 2", description: "Description for item 2" },
          { id: 3, title: "Item 3", description: "Description for item 3" },
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <div className="p-4 bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">
        ${prompt.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
      </h2>
      
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 p-4 rounded-lg border border-purple-500/30"
            >
              <h3 className="text-lg font-medium text-white">{item.title}</h3>
              <p className="text-gray-300 mt-2">{item.description}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// How to use this component:
// import { ${prompt.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("")}Component } from './path/to/component';
// 
// function App() {
//   return (
//     <div>
//       <${prompt.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("")}Component />
//     </div>
//   );
// }`;

      setGeneratedCode(sampleCode);
      setIsGenerating(false);
      setShowPreview(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate code. Please try again.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <MagicalUniverseScene />
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg overflow-hidden"
        >
          <div className="p-4 border-b border-glass-border flex items-center justify-between">
            <div className="flex items-center">
              <Sparkles className="text-purple-400 mr-2" size={20} />
              <h2 className="text-xl font-semibold text-white">SageX Update Center</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                className={`px-3 py-1 rounded-md text-sm font-medium ${showCode ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                onClick={() => {
                  setShowCode(true);
                  setShowPreview(false);
                }}
              >
                <Code size={16} className="inline mr-1" />
                Code
              </button>
              <button 
                className={`px-3 py-1 rounded-md text-sm font-medium ${showPreview ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                onClick={() => {
                  setShowCode(false);
                  setShowPreview(true);
                }}
                disabled={!generatedCode}
              >
                <Play size={16} className="inline mr-1" />
                Preview
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-220px)]">
            <div className="p-4 border-r border-glass-border flex flex-col h-full">
              <div className="flex-grow">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the feature you want to add to SageX..."
                  className="w-full h-64 bg-glass rounded-lg p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isGenerating}
                />
                
                <div className="mt-4 text-sm text-gray-400">
                  <p className="font-medium text-purple-400">Pro Tips:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Be specific in your description</li>
                    <li>Include details about UI elements and functionality</li>
                    <li>Mention any specific technologies or packages</li>
                    <li>Describe how the feature should interact with existing components</li>
                  </ul>
                </div>
                
                <div className="mt-4">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <SendHorizontal size={18} className="mr-2" />
                        Generate Feature
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="mt-4 text-center text-xs text-gray-500">
                <p>Powered by Mistral AI • Built with React and Tailwind CSS</p>
                <p className="mt-1">API Key: ffF0FI3Cxp8iNPJpuCjDjqWZcSjCKBf8 (for demonstration purposes only)</p>
              </div>
            </div>
            
            <div className="relative">
              {showCode && (
                <div className="p-4 h-full flex flex-col">
                  {generatedCode ? (
                    <>
                      <div className="flex justify-end mb-2">
                        <button 
                          onClick={handleCopyCode}
                          className="p-1 text-gray-400 hover:text-white"
                          title="Copy code"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                      <pre className="bg-gray-900 p-4 rounded-lg text-gray-200 overflow-auto flex-grow text-sm">
                        <code className="whitespace-pre-wrap">{generatedCode}</code>
                      </pre>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Code size={48} className="text-gray-600 mb-4" />
                      <h3 className="text-xl font-medium text-gray-400 mb-2">No Code Generated Yet</h3>
                      <p className="text-gray-500 max-w-md">
                        Enter a description of what you want to build in the text area, then click "Generate Feature" to create code.
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {showPreview && (
                <div className="p-4 h-full flex flex-col">
                  {generatedCode ? (
                    <div className="bg-gray-900 rounded-lg overflow-hidden flex-grow flex flex-col items-center justify-center">
                      <p className="text-center text-gray-400 px-4">
                        {isGenerating ? (
                          <span className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-purple-500 mr-2"></div>
                            Building preview...
                          </span>
                        ) : (
                          <span>Visual preview coming soon! 🚀</span>
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Play size={48} className="text-gray-600 mb-4" />
                      <h3 className="text-xl font-medium text-gray-400 mb-2">No Preview Available</h3>
                      <p className="text-gray-500 max-w-md">
                        Generate some code first to see a preview.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Updates;
