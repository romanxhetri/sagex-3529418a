
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, CheckCircle, XCircle, Clock, ArrowUpCircle, Code, Play, Trash } from "lucide-react";
import { aiAutoUpdater, UpdateTask } from "@/services/AIAutoUpdater";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LivePreview } from "./LivePreview";
import { AIAutoUpdaterIntegration } from "@/services/AIAutoUpdaterIntegration";

export const AIUpdateFeatureList: React.FC = () => {
  const [tasks, setTasks] = useState<UpdateTask[]>([]);
  const [filter, setFilter] = useState<UpdateTask['status'] | 'all'>('all');
  const [selectedTask, setSelectedTask] = useState<UpdateTask | null>(null);
  const [autoImplementEnabled, setAutoImplementEnabled] = useState(true);
  const [isImplementing, setIsImplementing] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    // Initial load
    setTasks(aiAutoUpdater.getTasks());
    
    // Subscribe to updates
    const unsubscribe = aiAutoUpdater.subscribe((updatedTasks) => {
      setTasks(updatedTasks);
    });
    
    // Listen for storage events to refresh tasks
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'aiAutoUpdaterTasks') {
        try {
          const updatedTasks = JSON.parse(e.newValue || '[]');
          setTasks(updatedTasks);
        } catch (error) {
          console.error("Error parsing tasks from storage:", error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshCounter]);

  const refreshTasks = () => {
    setRefreshCounter(prev => prev + 1);
    setTasks(aiAutoUpdater.getTasks());
    toast.success("Tasks refreshed");
  };

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  const getStatusIcon = (status: UpdateTask['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'failed':
        return <XCircle size={16} className="text-red-400" />;
      case 'in-progress':
        return <Clock size={16} className="text-yellow-400 animate-pulse" />;
      case 'pending':
        return <ArrowUpCircle size={16} className="text-blue-400" />;
    }
  };

  const getTypeColor = (type: UpdateTask['type']) => {
    switch (type) {
      case 'feature':
        return 'bg-purple-500/20 text-purple-300';
      case 'bugfix':
        return 'bg-red-500/20 text-red-300';
      case 'enhancement':
        return 'bg-blue-500/20 text-blue-300';
      case 'refactor':
        return 'bg-yellow-500/20 text-yellow-300';
    }
  };

  const toggleAutoImplement = () => {
    const newState = !autoImplementEnabled;
    setAutoImplementEnabled(newState);
    aiAutoUpdater.toggleAutoImplement(newState);
  };

  const handleViewCode = (task: UpdateTask) => {
    setSelectedTask(task);
  };

  const handleDeleteTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    localStorage.setItem('aiAutoUpdaterTasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
    toast.success("Task removed");
  };

  const handleImplementCode = async (task: UpdateTask) => {
    if (!task.code) {
      toast.error("No code available to implement");
      return;
    }

    setIsImplementing(true);
    
    try {
      // Use the integration to implement the task
      const success = await AIAutoUpdaterIntegration.implementTask(task.id);
      
      if (success) {
        toast.success("Code implementation successful!", {
          description: "The feature has been added to your app."
        });
        
        // Update the task list with the new status
        const updatedTasks = tasks.map(t => 
          t.id === task.id 
            ? { ...t, status: 'completed' as const } 
            : t
        );
        
        // Update local storage and state
        localStorage.setItem('aiAutoUpdaterTasks', JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
        
        // Refresh tasks to ensure everything is in sync
        setTimeout(refreshTasks, 1000);
      } else {
        toast.error("Failed to implement code", {
          description: "Check the console for more details."
        });
      }
    } catch (error) {
      console.error("Implementation error:", error);
      toast.error("An error occurred during implementation");
    } finally {
      setIsImplementing(false);
    }
  };

  return (
    <div className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-glass-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Zap className="text-purple-400 mr-2" size={20} />
            AI Auto Updates
          </h3>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshTasks}
              className="text-xs"
            >
              <RefreshCcw size={14} className="mr-1" />
              Refresh
            </Button>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as UpdateTask['status'] | 'all')}
              className="bg-gray-800 text-gray-300 text-sm rounded-md px-2 py-1 border border-gray-700"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            
            <Button 
              size="sm" 
              variant={autoImplementEnabled ? "default" : "outline"}
              onClick={toggleAutoImplement}
              className="text-xs"
            >
              {autoImplementEnabled ? "Auto-Implement ON" : "Auto-Implement OFF"}
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-gray-400">
          <p>AI is continuously monitoring and improving your app. Add tasks using the input below or through the AI Quick Command.</p>
        </div>
        
        <div className="mt-3">
          <input
            type="text"
            placeholder="Tell AI what to build or fix..."
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                aiAutoUpdater.addTaskFromUserCommand(e.currentTarget.value);
                e.currentTarget.value = '';
                
                // Auto-process the task immediately
                setTimeout(() => {
                  const tasks = aiAutoUpdater.getTasks();
                  const latestTask = tasks[tasks.length - 1];
                  if (latestTask && latestTask.status === 'pending') {
                    const updatedTasks = tasks.map(t => 
                      t.id === latestTask.id 
                        ? { ...t, status: 'in-progress' as const } 
                        : t
                    );
                    localStorage.setItem('aiAutoUpdaterTasks', JSON.stringify(updatedTasks));
                    
                    // Generate code and implement
                    setTimeout(() => {
                      const generatedCode = aiAutoUpdater.generateFeatureCode(latestTask.description);
                      aiAutoUpdater.addCodeToTask(latestTask.id, generatedCode);
                    }, 500);
                  }
                }, 100);
              }
            }}
          />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-4 border-r border-glass-border overflow-hidden">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <p>No AI update tasks found</p>
              <Button 
                onClick={() => {
                  aiAutoUpdater.addTask('Add a tutorial button', 'feature', 'medium');
                  
                  // Auto-process the task immediately
                  setTimeout(() => {
                    const tasks = aiAutoUpdater.getTasks();
                    const latestTask = tasks[tasks.length - 1];
                    if (latestTask && latestTask.status === 'pending') {
                      const updatedTasks = tasks.map(t => 
                        t.id === latestTask.id 
                          ? { ...t, status: 'in-progress' as const } 
                          : t
                      );
                      localStorage.setItem('aiAutoUpdaterTasks', JSON.stringify(updatedTasks));
                      
                      // Generate code and implement
                      setTimeout(() => {
                        const generatedCode = aiAutoUpdater.generateFeatureCode(latestTask.description);
                        aiAutoUpdater.addCodeToTask(latestTask.id, generatedCode);
                      }, 500);
                    }
                  }, 100);
                }}
                className="mt-2"
              >
                Create Tutorial Button
              </Button>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-gray-800 border border-gray-700 rounded-lg p-3 hover:border-purple-500/50 transition-all ${selectedTask?.id === task.id ? 'border-purple-500' : ''}`}
                  onClick={() => handleViewCode(task)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center">
                        {getStatusIcon(task.status)}
                        <span className="ml-2 text-sm font-medium text-white">{task.description}</span>
                      </div>
                      
                      <div className="flex items-center mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(task.type)}`}>
                          {task.type}
                        </span>
                        <span className="ml-2 text-xs text-gray-400">
                          Priority: {task.priority}
                        </span>
                        <span className="ml-2 text-xs text-gray-400">
                          {new Date(task.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      {task.code && (
                        <button 
                          className="text-xs bg-blue-600 hover:bg-blue-700 p-1 rounded text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCode(task);
                          }}
                        >
                          <Code size={14} />
                        </button>
                      )}
                      
                      {task.code && task.status !== 'completed' && (
                        <button 
                          className="text-xs bg-purple-600 hover:bg-purple-700 p-1 rounded text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImplementCode(task);
                          }}
                          disabled={isImplementing}
                        >
                          {isImplementing ? (
                            <div className="animate-spin h-3 w-3 border-2 border-t-transparent border-white rounded-full" />
                          ) : (
                            <Play size={14} />
                          )}
                        </button>
                      )}
                      
                      {task.status === 'pending' && (
                        <button 
                          className="text-xs bg-purple-600 hover:bg-purple-700 px-2 py-0.5 rounded text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            const updatedTasks = tasks.map(t => 
                              t.id === task.id 
                                ? { ...t, status: 'in-progress' as const } 
                                : t
                            );
                            localStorage.setItem('aiAutoUpdaterTasks', JSON.stringify(updatedTasks));
                            setTasks(updatedTasks);
                            
                            setTimeout(() => {
                              const generatedCode = aiAutoUpdater.generateFeatureCode(task.description);
                              aiAutoUpdater.addCodeToTask(task.id, generatedCode);
                            }, 500);
                          }}
                        >
                          Process
                        </button>
                      )}
                      
                      <button 
                        className="text-xs bg-red-600 hover:bg-red-700 p-1 rounded text-white"
                        onClick={(e) => handleDeleteTask(task.id, e)}
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
        <div className="w-full md:w-1/2 p-4">
          {selectedTask && selectedTask.code ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Generated Code</h3>
                {selectedTask.code && selectedTask.status !== 'completed' && (
                  <Button 
                    size="sm"
                    onClick={() => handleImplementCode(selectedTask)}
                    className="flex items-center gap-1"
                    disabled={isImplementing}
                  >
                    {isImplementing ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full mr-1" />
                        Implementing...
                      </>
                    ) : (
                      <>
                        <Play size={14} className="mr-1" />
                        Implement Now
                      </>
                    )}
                  </Button>
                )}
              </div>
              
              <div className="bg-gray-900 rounded-lg p-3 overflow-auto max-h-60 custom-scrollbar">
                <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                  <code>{selectedTask.code}</code>
                </pre>
              </div>
              
              <div>
                <h4 className="text-md font-semibold text-white mb-2">Preview</h4>
                <div className="h-[200px] bg-gray-900 rounded-lg overflow-hidden">
                  <LivePreview code={selectedTask.code} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>{selectedTask ? "No code available for this task" : "Select a task to view generated code"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
