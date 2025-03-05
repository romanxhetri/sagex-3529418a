
import { toast } from "sonner";

// Interface for update tasks
export interface UpdateTask {
  id: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  completedAt?: Date;
  type: 'feature' | 'bugfix' | 'enhancement' | 'refactor';
  code?: string; // The generated code for this task
}

// Main AI Auto Updater service
class AIAutoUpdater {
  private isRunning: boolean = false;
  private updateTasks: UpdateTask[] = [];
  private updateInterval: number | null = null;
  private listeners: Array<(tasks: UpdateTask[]) => void> = [];
  private autoImplementEnabled: boolean = true; // Control auto-implementation

  constructor() {
    this.loadTasks();
    
    // Setup event listener for task storage
    window.addEventListener('storage', (e) => {
      if (e.key === 'pendingUpdateRequest' && e.newValue) {
        this.addTaskFromUserCommand(e.newValue);
        // Clear the storage after processing
        localStorage.removeItem('pendingUpdateRequest');
      }
    });
  }

  // Start the background update process
  public start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.updateInterval = window.setInterval(() => {
      this.processTasks();
    }, 15000); // Check for tasks every 15 seconds (faster than before)
    
    console.log('AI Auto Updater service started');
    toast('AI Auto Updater is now monitoring your app');
  }

  // Stop the background update process
  public stop(): void {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.updateInterval) {
      window.clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    console.log('AI Auto Updater service stopped');
  }

  // Toggle auto-implementation
  public toggleAutoImplement(enabled: boolean): void {
    this.autoImplementEnabled = enabled;
    toast(enabled ? 'Auto-implementation enabled' : 'Auto-implementation disabled');
  }

  // Add a new task from user command
  public addTaskFromUserCommand(command: string): void {
    const type = this.determineTaskType(command);
    
    const newTask: UpdateTask = {
      id: Date.now().toString(),
      description: command,
      status: 'pending',
      priority: this.determinePriority(command),
      createdAt: new Date(),
      type
    };
    
    this.updateTasks.push(newTask);
    this.saveTasks();
    this.notifyListeners();
    
    toast('New task added to AI update queue', {
      description: command
    });
    
    // Start processing immediately for better user experience
    setTimeout(() => this.processTasks(), 1000);
  }

  // Add a new task programmatically
  public addTask(description: string, type: UpdateTask['type'], priority: UpdateTask['priority'] = 'medium', code?: string): void {
    const newTask: UpdateTask = {
      id: Date.now().toString(),
      description,
      status: 'pending',
      priority,
      createdAt: new Date(),
      type,
      code
    };
    
    this.updateTasks.push(newTask);
    this.saveTasks();
    this.notifyListeners();
  }

  // Add generated code to a task
  public addCodeToTask(taskId: string, code: string): void {
    const task = this.updateTasks.find(t => t.id === taskId);
    if (task) {
      task.code = code;
      task.status = 'completed';
      task.completedAt = new Date();
      this.saveTasks();
      this.notifyListeners();
      
      // Auto-implement if enabled
      if (this.autoImplementEnabled) {
        this.implementChange(task);
      }
    }
  }

  // Get all current tasks
  public getTasks(): UpdateTask[] {
    return [...this.updateTasks];
  }

  // Subscribe to task updates
  public subscribe(callback: (tasks: UpdateTask[]) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  // Process pending tasks
  private processTasks(): void {
    const pendingTasks = this.updateTasks.filter(task => task.status === 'pending');
    
    if (pendingTasks.length === 0) return;
    
    // Sort by priority
    pendingTasks.sort((a, b) => {
      const priorityMap = { high: 3, medium: 2, low: 1 };
      return priorityMap[b.priority] - priorityMap[a.priority];
    });
    
    // Take the highest priority task
    const taskToProcess = pendingTasks[0];
    taskToProcess.status = 'in-progress';
    this.saveTasks();
    this.notifyListeners();
    
    toast.info('AI is working on an update', {
      description: taskToProcess.description
    });
    
    // Generate code based on task type and description
    const generatedCode = this.generateSampleCode(taskToProcess);
    taskToProcess.code = generatedCode;
    
    // Simulate AI processing the task
    setTimeout(() => {
      // 95% chance of success (increased from 90%)
      if (Math.random() < 0.95) {
        taskToProcess.status = 'completed';
        taskToProcess.completedAt = new Date();
        
        toast.success('AI Auto Update completed', {
          description: taskToProcess.description
        });
        
        // Implement the generated code if auto-implement is enabled
        if (this.autoImplementEnabled) {
          this.implementChange(taskToProcess);
        }
      } else {
        taskToProcess.status = 'failed';
        
        toast.error('AI Auto Update failed', {
          description: `Failed to implement: ${taskToProcess.description}`
        });
      }
      
      this.saveTasks();
      this.notifyListeners();
    }, 2000 + Math.random() * 3000); // Faster processing time (2-5 seconds)
  }

  // Implement the changes in a task
  private implementChange(task: UpdateTask): void {
    // In a real system, this would actually modify the codebase
    // For now, we'll just simulate it with a toast notification
    toast.success('Code changes implemented', {
      description: `Changes for "${task.description}" have been applied to the app`
    });
  }

  // Determine task type based on command content
  private determineTaskType(command: string): UpdateTask['type'] {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('fix') || 
        lowerCommand.includes('bug') || 
        lowerCommand.includes('issue') ||
        lowerCommand.includes('error')) {
      return 'bugfix';
    }
    
    if (lowerCommand.includes('improve') || 
        lowerCommand.includes('enhance') ||
        lowerCommand.includes('better')) {
      return 'enhancement';
    }
    
    if (lowerCommand.includes('refactor') || 
        lowerCommand.includes('clean') ||
        lowerCommand.includes('optimize')) {
      return 'refactor';
    }
    
    return 'feature'; // Default to feature
  }

  // Determine priority based on command content
  private determinePriority(command: string): UpdateTask['priority'] {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('urgent') || 
        lowerCommand.includes('critical') || 
        lowerCommand.includes('important') ||
        lowerCommand.includes('fix') ||
        lowerCommand.includes('now') ||
        lowerCommand.includes('asap')) {
      return 'high';
    }
    
    if (lowerCommand.includes('soon') || 
        lowerCommand.includes('next') ||
        lowerCommand.includes('enhance')) {
      return 'medium';
    }
    
    return 'low';
  }

  // Generate sample code based on task type and description
  private generateSampleCode(task: UpdateTask): string {
    const { type, description } = task;
    
    // Generate different code snippets based on task type
    switch (type) {
      case 'feature':
        return this.generateFeatureCode(description);
      case 'bugfix':
        return this.generateBugfixCode(description);
      case 'enhancement':
        return this.generateEnhancementCode(description);
      case 'refactor':
        return this.generateRefactorCode(description);
      default:
        return '// No code generated for this task type';
    }
  }
  
  // Generate feature code
  public generateFeatureCode(description: string): string {
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes('button')) {
      return `
import React from 'react';
import { Button } from "@/components/ui/button";

export const NewFeatureButton = () => {
  const handleClick = () => {
    console.log("New feature activated!");
    // Add feature-specific logic here
  };

  return (
    <Button 
      onClick={handleClick}
      className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
    >
      Activate New Feature
    </Button>
  );
};`;
    } else if (lowerDesc.includes('card') || lowerDesc.includes('product')) {
      return `
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const ProductCard = ({ title, description, price, image }) => {
  return (
    <Card className="w-full max-w-sm overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={image || "/placeholder.svg"} 
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500">{description}</p>
        <p className="mt-2 text-xl font-bold">${price}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  );
};`;
    } else {
      return `
import React from 'react';

export const NewFeature = () => {
  return (
    <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
      <h3 className="text-xl font-bold mb-2">New Feature</h3>
      <p className="text-gray-600 dark:text-gray-300">
        This is a new feature based on your request: "${description}"
      </p>
      <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
        <code>// Implementation details will be added here</code>
      </div>
    </div>
  );
};`;
    }
  }
  
  // Generate bugfix code
  private generateBugfixCode(description: string): string {
    return `
// Bugfix for: ${description}
function fixIssue() {
  console.log("Bug identified and fixed");
  
  // Example of a bugfix
  try {
    // Check for the error condition
    const errorCondition = false;
    
    if (errorCondition) {
      throw new Error("This would have caused the bug");
    }
    
    return true; // Bug fixed
  } catch (error) {
    console.error("Error caught:", error);
    // Fallback behavior
    return false;
  }
}`;
  }
  
  // Generate enhancement code
  private generateEnhancementCode(description: string): string {
    return `
// Enhancement for: ${description}
import { useEffect, useState } from 'react';

export function useEnhancedFeature(initialValue) {
  const [value, setValue] = useState(initialValue);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  // Enhanced functionality
  const enhanceValue = async (newValue) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Apply enhancements
      const enhancedValue = {
        ...newValue,
        enhanced: true,
        enhancedAt: new Date().toISOString(),
      };
      
      setValue(enhancedValue);
      return enhancedValue;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    value,
    isProcessing,
    error,
    enhanceValue,
  };
}`;
  }
  
  // Generate refactor code
  private generateRefactorCode(description: string): string {
    return `
// Refactored code for: ${description}

// Before refactoring:
/*
function doEverything(data) {
  // Validation
  if (!data) return null;
  if (!data.items || !Array.isArray(data.items)) return null;
  
  // Processing
  let total = 0;
  const processedItems = [];
  
  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    if (item.price > 0 && item.quantity > 0) {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      processedItems.push({
        ...item,
        total: itemTotal
      });
    }
  }
  
  // Formatting
  return {
    items: processedItems,
    total: total,
    formattedTotal: '$' + total.toFixed(2),
    processed: true
  };
}
*/

// After refactoring:
function validateData(data) {
  return data && data.items && Array.isArray(data.items);
}

function processItem(item) {
  if (item.price > 0 && item.quantity > 0) {
    const total = item.price * item.quantity;
    return {
      ...item,
      total
    };
  }
  return null;
}

function formatCurrency(amount) {
  return '$' + amount.toFixed(2);
}

function processData(data) {
  if (!validateData(data)) return null;
  
  let total = 0;
  const processedItems = data.items
    .map(processItem)
    .filter(item => item !== null);
  
  total = processedItems.reduce((sum, item) => sum + item.total, 0);
  
  return {
    items: processedItems,
    total,
    formattedTotal: formatCurrency(total),
    processed: true
  };
}`;
  }

  // Save tasks to localStorage
  private saveTasks(): void {
    localStorage.setItem('aiAutoUpdaterTasks', JSON.stringify(this.updateTasks));
  }

  // Load tasks from localStorage
  private loadTasks(): void {
    const savedTasks = localStorage.getItem('aiAutoUpdaterTasks');
    if (savedTasks) {
      try {
        this.updateTasks = JSON.parse(savedTasks);
        // Convert string dates back to Date objects
        this.updateTasks.forEach(task => {
          task.createdAt = new Date(task.createdAt);
          if (task.completedAt) {
            task.completedAt = new Date(task.completedAt);
          }
        });
      } catch (e) {
        console.error('Failed to parse saved tasks:', e);
        this.updateTasks = [];
      }
    }
  }

  // Notify all listeners of task changes
  private notifyListeners(): void {
    this.listeners.forEach(callback => {
      callback(this.getTasks());
    });
  }
}

// Create singleton instance
export const aiAutoUpdater = new AIAutoUpdater();

// Auto-start the service when imported
setTimeout(() => {
  aiAutoUpdater.start();
}, 1000); // Start faster

export default aiAutoUpdater;
