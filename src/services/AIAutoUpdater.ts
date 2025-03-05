
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
}

// Main AI Auto Updater service
class AIAutoUpdater {
  private isRunning: boolean = false;
  private updateTasks: UpdateTask[] = [];
  private updateInterval: number | null = null;
  private listeners: Array<(tasks: UpdateTask[]) => void> = [];

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
    }, 60000); // Check for tasks every minute
    
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

  // Add a new task from user command
  public addTaskFromUserCommand(command: string): void {
    const taskTypes = ['feature', 'bugfix', 'enhancement', 'refactor'] as const;
    const type = taskTypes[Math.floor(Math.random() * taskTypes.length)];
    
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
  }

  // Add a new task programmatically
  public addTask(description: string, type: UpdateTask['type'], priority: UpdateTask['priority'] = 'medium'): void {
    const newTask: UpdateTask = {
      id: Date.now().toString(),
      description,
      status: 'pending',
      priority,
      createdAt: new Date(),
      type
    };
    
    this.updateTasks.push(newTask);
    this.saveTasks();
    this.notifyListeners();
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
    
    // Simulate AI processing the task
    setTimeout(() => {
      // 80% chance of success
      if (Math.random() < 0.8) {
        taskToProcess.status = 'completed';
        taskToProcess.completedAt = new Date();
        
        toast.success('AI Auto Update completed', {
          description: taskToProcess.description
        });
      } else {
        taskToProcess.status = 'failed';
        
        toast.error('AI Auto Update failed', {
          description: `Failed to implement: ${taskToProcess.description}`
        });
      }
      
      this.saveTasks();
      this.notifyListeners();
    }, 5000 + Math.random() * 10000); // Random time between 5-15 seconds
  }

  // Determine priority based on command content
  private determinePriority(command: string): UpdateTask['priority'] {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('urgent') || 
        lowerCommand.includes('critical') || 
        lowerCommand.includes('important') ||
        lowerCommand.includes('fix')) {
      return 'high';
    }
    
    if (lowerCommand.includes('soon') || 
        lowerCommand.includes('next') ||
        lowerCommand.includes('enhance')) {
      return 'medium';
    }
    
    return 'low';
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
}, 3000);

export default aiAutoUpdater;
