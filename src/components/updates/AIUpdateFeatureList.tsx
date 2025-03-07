
import React, { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { aiAutoUpdater, UpdateTask } from "@/services/AIAutoUpdater";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AIAutoUpdaterIntegration } from "@/services/AIAutoUpdaterIntegration";
import { TaskCard } from "./TaskCard";
import { TaskCodePreview } from "./TaskCodePreview";
import { TaskListFilters } from "./TaskListFilters";

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

  const toggleAutoImplement = () => {
    const newState = !autoImplementEnabled;
    setAutoImplementEnabled(newState);
    aiAutoUpdater.toggleAutoImplement(newState);
  };

  const handleViewCode = (task: UpdateTask, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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

  const handleProcessTask = (task: UpdateTask, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedTasks = tasks.map(t => 
      t.id === task.id ? { ...t, status: 'in-progress' as const } : t
    );
    localStorage.setItem('aiAutoUpdaterTasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
    
    setTimeout(() => {
      const generatedCode = aiAutoUpdater.generateFeatureCode(task.description);
      aiAutoUpdater.addCodeToTask(task.id, generatedCode);
    }, 500);
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
          t.id === task.id ? { ...t, status: 'completed' as const } : t
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

  const handleAddTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
  };

  const handleCreateTutorialButton = () => {
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
  };

  return (
    <div className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-glass-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Zap className="text-purple-400 mr-2" size={20} />
            AI Auto Updates
          </h3>
          
          <TaskListFilters
            filter={filter}
            onFilterChange={(value) => setFilter(value as UpdateTask['status'] | 'all')}
            autoImplementEnabled={autoImplementEnabled}
            onToggleAutoImplement={toggleAutoImplement}
            onRefresh={refreshTasks}
          />
        </div>
        
        <div className="text-sm text-gray-400">
          <p>AI is continuously monitoring and improving your app. Add tasks using the input below or through the AI Quick Command.</p>
        </div>
        
        <div className="mt-3">
          <input
            type="text"
            placeholder="Tell AI what to build or fix..."
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            onKeyDown={handleAddTask}
          />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-4 border-r border-glass-border overflow-hidden">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <p>No AI update tasks found</p>
              <Button 
                onClick={handleCreateTutorialButton}
                className="mt-2"
              >
                Create Tutorial Button
              </Button>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isSelected={selectedTask?.id === task.id}
                  onSelect={handleViewCode}
                  onDelete={handleDeleteTask}
                  onProcess={handleProcessTask}
                  onViewCode={handleViewCode}
                  onImplement={(task, e) => {
                    if (e) e.stopPropagation();
                    handleImplementCode(task);
                  }}
                  isImplementing={isImplementing}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="w-full md:w-1/2 p-4">
          <TaskCodePreview
            task={selectedTask}
            isImplementing={isImplementing}
            onImplement={handleImplementCode}
          />
        </div>
      </div>
    </div>
  );
};
