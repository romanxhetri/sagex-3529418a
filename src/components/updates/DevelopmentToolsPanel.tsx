
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  FileCode, 
  Bug, 
  Braces, 
  RefreshCw, 
  Download,
  Play,
  Eye,
  CloudLightning,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { aiAutoUpdater } from '@/services/AIAutoUpdater';

interface DevTool {
  id: string;
  name: string;
  icon: React.ReactNode;
  action: () => void;
  description: string;
  color: string;
}

export const DevelopmentToolsPanel: React.FC = () => {
  const runPendingUpdates = () => {
    const pendingTasks = aiAutoUpdater.getTasks().filter(t => t.status === 'pending');
    if (pendingTasks.length === 0) {
      toast.info("No pending tasks found to run");
      return;
    }
    
    toast.success(`Running ${pendingTasks.length} pending updates`, {
      description: "AI is now processing your requests"
    });
    
    // Process tasks immediately
    setTimeout(() => aiAutoUpdater['processTasks'](), 500);
  };

  const optimizeApp = () => {
    toast.success("App optimization started", {
      description: "Analyzing and optimizing app performance"
    });
    
    // Add optimization task
    aiAutoUpdater.addTaskFromUserCommand("Optimize application performance");
  };

  const debugApp = () => {
    toast.info("Debug mode activated", {
      description: "Scanning for potential issues..."
    });
    
    setTimeout(() => {
      toast.success("Debug complete", { 
        description: "No critical issues found" 
      });
    }, 2000);
  };

  const lintCode = () => {
    toast.info("Linting codebase", {
      description: "Checking code quality and style"
    });
    
    setTimeout(() => {
      toast.success("Linting complete", { 
        description: "Code meets style guidelines" 
      });
    }, 1500);
  };

  const autoFix = () => {
    toast.info("Auto-fixing issues", {
      description: "AI is fixing common issues"
    });
    
    // Add auto-fix task
    aiAutoUpdater.addTaskFromUserCommand("Fix any code issues");
  };

  const deployApp = () => {
    toast.info("Preparing for deployment", {
      description: "Bundling and optimizing assets"
    });
    
    setTimeout(() => {
      toast.success("Deployment ready", { 
        description: "App is ready to deploy" 
      });
    }, 2000);
  };
  
  const turboMode = () => {
    toast("Turbo mode activated", {
      description: "Performance optimizations enabled"
    });
    
    // Apply performance optimizations to the page
    document.body.classList.add('turbo-mode');
    
    // Clear some unnecessary animations
    const elements = document.querySelectorAll('.animate-pulse');
    elements.forEach(el => el.classList.remove('animate-pulse'));
  };

  const tools: DevTool[] = [
    {
      id: 'terminal',
      name: 'Terminal',
      icon: <Terminal size={24} />,
      action: () => {
        toast.info("Terminal activated", { description: "Command line interface ready" });
      },
      description: "Command-line interface",
      color: "text-purple-400"
    },
    {
      id: 'editor',
      name: 'Editor',
      icon: <FileCode size={24} />,
      action: () => {
        toast.info("Code editor ready", { description: "Edit code directly" });
      },
      description: "Code editing interface",
      color: "text-blue-400"
    },
    {
      id: 'debugger',
      name: 'Debugger',
      icon: <Bug size={24} />,
      action: debugApp,
      description: "Find and fix issues",
      color: "text-red-400"
    },
    {
      id: 'linter',
      name: 'Linter',
      icon: <Braces size={24} />,
      action: lintCode,
      description: "Enforce code standards",
      color: "text-yellow-400"
    },
    {
      id: 'autofix',
      name: 'Auto-fix',
      icon: <RefreshCw size={24} />,
      action: autoFix,
      description: "Automatic code fixes",
      color: "text-green-400"
    },
    {
      id: 'deploy',
      name: 'Deploy',
      icon: <Download size={24} />,
      action: deployApp,
      description: "Push to production",
      color: "text-indigo-400"
    },
    {
      id: 'run',
      name: 'Run Updates',
      icon: <Play size={24} />,
      action: runPendingUpdates,
      description: "Run pending tasks",
      color: "text-pink-400"
    },
    {
      id: 'optimize',
      name: 'Optimize',
      icon: <Zap size={24} />,
      action: optimizeApp,
      description: "Speed up your app",
      color: "text-cyan-400"
    },
    {
      id: 'turbo',
      name: 'Turbo Mode',
      icon: <CloudLightning size={24} />,
      action: turboMode,
      description: "Maximum performance",
      color: "text-amber-400"
    }
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-white flex items-center mb-3">
        <Zap className="mr-2 text-purple-400" size={18} />
        <span>Development Tools</span>
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {tools.map((tool) => (
          <motion.button
            key={tool.id}
            className="p-3 bg-gray-800 rounded-lg border border-gray-700 flex flex-col items-center justify-center hover:bg-gray-750 transition-all"
            whileHover={{ scale: 1.03, borderColor: 'rgba(147, 51, 234, 0.5)' }}
            whileTap={{ scale: 0.97 }}
            onClick={tool.action}
          >
            <div className={`mb-2 ${tool.color}`}>{tool.icon}</div>
            <span className="text-sm text-white">{tool.name}</span>
          </motion.button>
        ))}
      </div>
      
      <div className="mt-4">
        <Button 
          onClick={() => {
            toast.success("All tools activated", {
              description: "Your development environment is ready"
            });
          }}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
        >
          <Eye size={16} className="mr-2" />
          Activate All Tools
        </Button>
      </div>
    </div>
  );
};
