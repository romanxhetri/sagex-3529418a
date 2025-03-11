import React, { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { 
  SendHorizontal, 
  Code, 
  Play, 
  Sparkles, 
  Bot,
  Rocket,
  Shield,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CodeEditor } from "@/components/updates/CodeEditor";
import { ReasoningProcess } from "@/components/updates/ReasoningProcess";
import { LivePreview } from "@/components/updates/LivePreview";
import { VoiceCommandListener } from "@/components/updates/VoiceCommandListener";
import { AIUpdateFeatureList } from "@/components/updates/AIUpdateFeatureList";
import { aiAutoUpdater } from "@/services/AIAutoUpdater";
import { DevelopmentToolsPanel } from "@/components/updates/DevelopmentToolsPanel";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface UpdatesProps {
  adminPassword?: string | null;
}

const Updates: React.FC<UpdatesProps> = ({ adminPassword = "6947" }) => {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isReasoningMinimized, setIsReasoningMinimized] = useState(false);
  const [currentThought, setCurrentThought] = useState("");
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [generatedReasoning, setGeneratedReasoning] = useState("");
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);
  const [isOptimized, setIsOptimized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const { toast } = useToast();
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOptimized) {
      document.documentElement.style.setProperty('--animate-duration', '0.2s');
      
      const animationReducer = () => {
        const animatedElements = document.querySelectorAll('.animate-pulse');
        if (animatedElements.length > 5) {
          for (let i = 5; i < animatedElements.length; i++) {
            animatedElements[i].classList.remove('animate-pulse');
          }
        }
      };
      
      setInterval(animationReducer, 3000);
      
      setIsOptimized(true);
    }
    
    const pendingRequest = localStorage.getItem("pendingUpdateRequest");
    if (pendingRequest) {
      setPrompt(pendingRequest);
      localStorage.removeItem("pendingUpdateRequest");
    }
  }, []);

  useEffect(() => {
    if (!adminPassword) {
      toast({
        title: "Error",
        description: "Admin access not configured. Please contact the administrator.",
        variant: "destructive"
      });
      navigate("/");
      return;
    }
  }, [adminPassword, navigate]);

  const handleVoiceCommand = (command: string) => {
    if (!isAuthenticated) return;
    
    console.log("Voice command received:", command);
    
    if (command.includes("generate") || command.includes("create")) {
      const featureMatch = command.match(/generate (.*?)( for| to| with|$)/i);
      if (featureMatch) {
        const feature = featureMatch[1];
        setPrompt(`Create a ${feature} component or feature for the SageX app`);
        setTimeout(() => handleGenerate(), 300);
      }
    } else {
      setPrompt(command);
    }
  };

  const toggleAutoUpdate = () => {
    if (!isAuthenticated) return;
    
    if (autoUpdateEnabled) {
      aiAutoUpdater.stop();
      setAutoUpdateEnabled(false);
      toast({
        title: "Auto Updates Disabled",
        description: "SageX AI will no longer automatically apply updates",
      });
    } else {
      aiAutoUpdater.start();
      setAutoUpdateEnabled(true);
      toast({
        title: "Auto Updates Enabled",
        description: "SageX AI will now automatically apply updates",
      });
    }
  };

  const handleGenerate = async () => {
    if (!isAuthenticated) return;
    
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
    setGeneratedReasoning("");
    setIsReasoningMinimized(false);
    
    try {
      const reasoning = `## SageX AI Reasoning Process

### 1. 🧠 Understanding the Request
**Input Analysis:** "${prompt}"

### 2. 🔍 Technical Analysis
- **Key Technologies Needed:** React, Tailwind CSS, Modern web components

### 3. 💡 Solution Design
- **UI/UX Considerations:** Following SageX design system

### 4. ⚙️ Implementation Planning
- **Coding Approach:** Component-first methodology

### 5. 🧪 Testing & Quality Assurance
- **Performance:** Optimized for speed and responsiveness`;

      setGeneratedReasoning(reasoning);
      setCurrentThought(reasoning);
      
      let sampleCode = aiAutoUpdater.generateFeatureCode(prompt);
      setGeneratedCode(sampleCode);
      setIsGenerating(false);
      setShowPreview(true);
      
      toast({
        title: "Generation complete",
        description: "Your code has been generated successfully!",
      });

      aiAutoUpdater.addTask(prompt, "feature", "high", sampleCode);
      
      setTimeout(() => {
        const tasks = aiAutoUpdater.getTasks();
        const pendingTask = tasks.find(t => t.description === prompt && t.status === 'pending');
        if (pendingTask) {
          aiAutoUpdater.addCodeToTask(pendingTask.id, sampleCode);
        }
      }, 300);
      
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to generate code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = () => {
    if (!isAuthenticated) return;
    
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordInput === adminPassword) {
      setIsAuthenticated(true);
      toast({
        title: "Access Granted",
        description: "Welcome to the admin interface!",
      });
      
      if (prompt && promptInputRef.current) {
        setTimeout(() => {
          handleGenerate();
        }, 500);
      }
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password.",
        variant: "destructive"
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden">
        <Header />
        
        <main className="container mx-auto px-4 pt-24 pb-16 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg overflow-hidden p-6"
          >
            <div className="text-center mb-6">
              <Shield className="w-16 h-16 mx-auto text-purple-500 mb-4" />
              <h2 className="text-2xl font-bold text-white">Admin Access Required</h2>
              <p className="text-gray-400 mt-2">
                Please enter your admin password to access the AI update system.
              </p>
            </div>
            
            <form onSubmit={handleAuthenticate}>
              <div className="mb-4">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full p-3 bg-black/30 border border-glass-border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Authenticate
              </Button>
              
              <div className="flex items-center justify-center mt-4">
                <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                <p className="text-sm text-gray-400">
                  Authorized personnel only
                </p>
              </div>
            </form>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg overflow-hidden"
        >
          <div className="p-4 border-b border-glass-border flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="text-purple-400 mr-2" size={20} />
              <h2 className="text-xl font-semibold text-white">SageX AI Self-Update System</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleAutoUpdate}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  autoUpdateEnabled ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'
                }`}
                title={autoUpdateEnabled ? "Disable auto updates" : "Enable auto updates"}
              >
                <Rocket size={16} className="inline mr-1" />
                {autoUpdateEnabled ? "Auto On" : "Auto Off"}
              </button>
              
              <VoiceCommandListener 
                onCommand={handleVoiceCommand}
                isListening={isVoiceListening}
                setIsListening={setIsVoiceListening}
              />
              
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
          
          {generatedReasoning && (
            <ReasoningProcess 
              reasoning={generatedReasoning}
              isMinimized={isReasoningMinimized}
              onToggle={() => setIsReasoningMinimized(!isReasoningMinimized)}
            />
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
            <div className="flex flex-col">
              <textarea
                ref={promptInputRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the feature you want to add to SageX..."
                className="w-full h-32 bg-glass rounded-lg p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isGenerating}
              />
              
              <div className="mt-4 flex space-x-2">
                <motion.button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} className="mr-2" />
                      Generate Code
                    </>
                  )}
                </motion.button>
                
                <motion.button
                  onClick={() => setPrompt("")}
                  disabled={isGenerating || !prompt.trim()}
                  className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Clear prompt"
                >
                  <SendHorizontal size={18} />
                </motion.button>
              </div>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Create tutorial button', 'Add card component', 'Chart visualization', 'Performance boost'].map((suggestion) => (
                  <motion.button
                    key={suggestion}
                    onClick={() => setPrompt(suggestion)}
                    className="py-1 px-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm text-gray-300 hover:text-white transition-colors text-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
              
              <div className="mt-6">
                <AIUpdateFeatureList />
              </div>
              
              <div className="mt-6">
                <DevelopmentToolsPanel />
              </div>
            </div>
            
            <div>
              {showCode && (
                <CodeEditor code={generatedCode} language="jsx" onCopy={handleCopyCode} />
              )}
              
              {showPreview && generatedCode && (
                <LivePreview code={generatedCode} isLoading={isGenerating} />
              )}
              
              {!generatedCode && (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gray-900 rounded-lg border border-gray-800">
                  <Sparkles size={48} className="text-purple-500 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Development</h3>
                  <p className="text-gray-400 max-w-md mb-6">
                    Describe what you want to build, and the SageX AI Engine will generate the code for you.
                  </p>
                  <p className="text-purple-400 text-sm">
                    Try voice commands or type a prompt to get started.
                  </p>
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
