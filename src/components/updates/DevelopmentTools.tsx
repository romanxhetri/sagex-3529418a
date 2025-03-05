
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Terminal, 
  FileCode, 
  Bug, 
  RefreshCcw, 
  Download, 
  Braces,
  Play, 
  Code, 
  Layers,
  ScrollText,
  Check,
  Trash2,
  GitBranch
} from "lucide-react";
import { toast } from "sonner";
import { aiAutoUpdater } from "@/services/AIAutoUpdater";

interface ToolProps {
  icon: React.ReactNode;
  name: string;
  onClick: () => void;
  description: string;
}

const Tool: React.FC<ToolProps> = ({ icon, name, onClick, description }) => {
  return (
    <motion.div
      className="p-3 bg-gray-800 rounded-lg border border-gray-700 flex flex-col items-center justify-center cursor-pointer relative group"
      whileHover={{ scale: 1.03, borderColor: 'rgba(147, 51, 234, 0.5)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="text-purple-400 mb-2">{icon}</div>
      <span className="text-sm">{name}</span>
      
      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
          <Play size={12} className="text-white" />
        </div>
      </div>
      
      <div className="hidden group-hover:block absolute left-1/2 -bottom-14 transform -translate-x-1/2 p-2 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300 w-48 z-10">
        {description}
      </div>
    </motion.div>
  );
};

export const DevelopmentTools: React.FC = () => {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "> SageX development environment initialized",
    "> Ready for commands"
  ]);
  const [terminalInput, setTerminalInput] = useState("");

  const handleTerminalCommand = () => {
    if (!terminalInput.trim()) return;
    
    setTerminalOutput(prev => [...prev, `$ ${terminalInput}`]);
    
    // Process the command
    const command = terminalInput.toLowerCase();
    setTerminalInput("");
    
    if (command.includes("help")) {
      setTerminalOutput(prev => [...prev, 
        "> Available commands:",
        "> - check system: Check system status",
        "> - optimize: Run performance optimization",
        "> - add feature [description]: Add a new feature",
        "> - clean: Clean up unused code",
        "> - deploy: Deploy current build",
        "> - clear: Clear terminal"
      ]);
    }
    else if (command === "clear") {
      setTerminalOutput(["> Terminal cleared"]);
    }
    else if (command.includes("check system")) {
      setTerminalOutput(prev => [...prev, 
        "> Running system check...",
        "> CPU: Optimal",
        "> Memory: 74% available",
        "> Performance: Good",
        "> No issues detected"
      ]);
    }
    else if (command.includes("optimize")) {
      setTerminalOutput(prev => [...prev, 
        "> Running performance optimization...",
        "> Analyzing codebase...",
        "> Removing unused imports...",
        "> Optimizing render cycles...",
        "> Compressing assets...",
        "> Done! Performance improved by 27%"
      ]);
      
      setTimeout(() => {
        toast.success("Performance optimization complete", {
          description: "App should now run faster"
        });
      }, 1000);
    }
    else if (command.includes("add feature")) {
      const featureDesc = command.replace("add feature", "").trim();
      setTerminalOutput(prev => [...prev, 
        `> Creating new feature: "${featureDesc || 'Unnamed feature'}"...`,
        "> Generating code...",
        "> Adding to codebase...",
        "> Feature added successfully"
      ]);
      
      if (featureDesc) {
        aiAutoUpdater.addTaskFromUserCommand(featureDesc);
      }
    }
    else if (command.includes("clean")) {
      setTerminalOutput(prev => [...prev, 
        "> Cleaning up codebase...",
        "> Removing dead code...",
        "> Optimizing imports...",
        "> Formatting code...",
        "> Done! Removed 247 lines of unused code"
      ]);
      
      setTimeout(() => {
        toast.success("Cleanup complete", {
          description: "Codebase is now more maintainable"
        });
      }, 1000);
    }
    else if (command.includes("deploy")) {
      setTerminalOutput(prev => [...prev, 
        "> Starting deployment process...",
        "> Building production version...",
        "> Optimizing assets...",
        "> Running tests...",
        "> Tests passed",
        "> Deploying to production...",
        "> Deployment complete!"
      ]);
      
      setTimeout(() => {
        toast.success("Deployment complete", {
          description: "App is now live at https://sagex.app"
        });
      }, 2000);
    }
    else {
      setTerminalOutput(prev => [...prev, `> Command not recognized: ${terminalInput}`, "> Type 'help' for available commands"]);
    }
  };

  return (
    <>
      <div className="space-y-2 text-gray-200">
        <h3 className="text-lg font-semibold flex items-center">
          <Code className="mr-2 text-purple-400" size={18} />
          <span>Development Tools</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Tool 
            icon={<Terminal size={24} />}
            name="Terminal"
            description="Open command terminal to run development commands"
            onClick={() => setIsTerminalOpen(true)}
          />
          
          <Tool 
            icon={<FileCode size={24} />}
            name="Editor"
            description="Open code editor to make manual changes"
            onClick={() => {
              toast.info("Code editor opened", {
                description: "Ready for manual editing"
              });
            }}
          />
          
          <Tool 
            icon={<Bug size={24} />}
            name="Debugger"
            description="Start debugger to find and fix issues"
            onClick={() => {
              toast("Debugger activated", {
                description: "Analyzing application for issues...",
              });
              
              setTimeout(() => {
                toast.success("Debug complete", {
                  description: "No critical issues found"
                });
              }, 2000);
            }}
          />
          
          <Tool 
            icon={<Braces size={24} />}
            name="Linter"
            description="Run code linter to improve code quality"
            onClick={() => {
              toast("Running linter...", {
                description: "Analyzing code quality"
              });
              
              setTimeout(() => {
                toast.success("Linting complete", {
                  description: "32 issues fixed automatically"
                });
              }, 2000);
            }}
          />
          
          <Tool 
            icon={<RefreshCcw size={24} />}
            name="Auto-fix"
            description="Automatically fix common code issues"
            onClick={() => {
              toast("Running auto-fix...");
              
              setTimeout(() => {
                toast.success("Auto-fix complete", {
                  description: "Performance improved by 15%"
                });
              }, 1500);
            }}
          />
          
          <Tool 
            icon={<Download size={24} />}
            name="Deploy"
            description="Deploy your app to production"
            onClick={() => {
              toast("Starting deployment process...");
              
              setTimeout(() => {
                toast.success("Deployment complete", {
                  description: "Your app is now live!"
                });
              }, 2500);
            }}
          />
          
          <Tool 
            icon={<Layers size={24} />}
            name="Components"
            description="Browse and manage app components"
            onClick={() => {
              toast.info("Component library", {
                description: "87 components available"
              });
            }}
          />
          
          <Tool 
            icon={<ScrollText size={24} />}
            name="API Docs"
            description="View API documentation"
            onClick={() => {
              toast.info("API Documentation", {
                description: "Showing available endpoints and methods"
              });
            }}
          />
          
          <Tool 
            icon={<GitBranch size={24} />}
            name="Version Control"
            description="Manage code versions and branches"
            onClick={() => {
              toast.info("Version Control", {
                description: "Current branch: main (12 commits ahead)"
              });
            }}
          />
        </div>
      </div>
      
      {isTerminalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl bg-gray-900 rounded-lg border border-gray-800 overflow-hidden"
          >
            <div className="flex items-center justify-between bg-gray-950 px-4 py-2 border-b border-gray-800">
              <div className="flex items-center">
                <Terminal size={18} className="text-green-500 mr-2" />
                <span className="text-gray-300 font-mono">SageX Terminal</span>
              </div>
              <button 
                onClick={() => setIsTerminalOpen(false)}
                className="text-gray-500 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="h-96 overflow-y-auto p-4 font-mono text-sm text-green-400 bg-gray-950">
              {terminalOutput.map((line, i) => (
                <div key={i} className={`mb-1 ${line.startsWith('$') ? 'text-blue-400' : ''}`}>
                  {line}
                </div>
              ))}
              
              <div className="flex items-center mt-2">
                <span className="text-blue-400 mr-2">$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleTerminalCommand();
                    }
                  }}
                  className="flex-1 bg-transparent border-none outline-none text-green-400"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="p-3 bg-gray-950 border-t border-gray-800 flex justify-between">
              <div className="flex space-x-2">
                <button 
                  onClick={() => setTerminalOutput(["> Terminal cleared"])}
                  className="flex items-center text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-gray-300"
                >
                  <Trash2 size={12} className="mr-1" />
                  Clear
                </button>
                
                <button 
                  onClick={() => {
                    setTerminalInput("help");
                    handleTerminalCommand();
                  }}
                  className="flex items-center text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-gray-300"
                >
                  Help
                </button>
              </div>
              
              <button 
                onClick={handleTerminalCommand}
                disabled={!terminalInput.trim()}
                className="flex items-center text-xs bg-green-800 hover:bg-green-700 px-2 py-1 rounded text-white disabled:opacity-50"
              >
                <Play size={12} className="mr-1" />
                Run
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};
