
import { aiAutoUpdater, UpdateTask } from "@/services/AIAutoUpdater";
import { CodeImplementor } from "@/utils/codeImplementor";

/**
 * Integration layer between the AIAutoUpdater and the CodeImplementor
 */
export class AIAutoUpdaterIntegration {
  private static isInitialized = false;

  /**
   * Initialize the integration
   */
  public static initialize(): void {
    if (this.isInitialized) return;
    
    // Listen for task completion events
    window.addEventListener('updateTaskStatus', (event: any) => {
      const { taskId, status } = event.detail;
      
      if (taskId && status) {
        const tasks = aiAutoUpdater.getTasks();
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
          console.log(`[AIAutoUpdaterIntegration] Updating task ${taskId} to ${status}`);
          
          // Use the internal method to update the task
          // This is a workaround since we don't have direct access to the internal methods
          const updatedTasks = aiAutoUpdater.getTasks().map(t => 
            t.id === taskId ? { ...t, status: status as UpdateTask['status'] } : t
          );
          
          // Force a refresh by triggering a status update
          this.refreshTasks(updatedTasks);
        }
      }
    });
    
    // Listen for file system update events
    window.addEventListener('fileSystemUpdate', (event: any) => {
      const { filePath, content } = event.detail;
      
      if (filePath && content) {
        console.log(`[AIAutoUpdaterIntegration] File system updated: ${filePath}`);
        // In a real implementation, this would trigger a file system update
      }
    });
    
    // Enhance the aiAutoUpdater to automatically implement changes
    this.enhanceAutoUpdater();
    
    this.isInitialized = true;
    console.log('[AIAutoUpdaterIntegration] Initialized');
  }

  /**
   * Enhance the AIAutoUpdater with real implementation capabilities
   */
  private static enhanceAutoUpdater(): void {
    // Listen to completed tasks and implement them
    aiAutoUpdater.subscribe((tasks) => {
      const completedTasks = tasks.filter(t => 
        t.status === 'completed' && 
        t.code && 
        !localStorage.getItem(`implemented_${t.id}`)
      );
      
      if (completedTasks.length > 0) {
        console.log(`[AIAutoUpdaterIntegration] Found ${completedTasks.length} completed tasks to implement`);
        
        // Implement each task
        completedTasks.forEach(async (task) => {
          console.log(`[AIAutoUpdaterIntegration] Implementing task: ${task.id}`);
          
          // Mark as implemented in localStorage to avoid duplicate implementations
          localStorage.setItem(`implemented_${task.id}`, 'true');
          
          // Implement the code
          const success = await CodeImplementor.implementCode(task);
          
          if (success) {
            console.log(`[AIAutoUpdaterIntegration] Successfully implemented task: ${task.id}`);
          } else {
            console.error(`[AIAutoUpdaterIntegration] Failed to implement task: ${task.id}`);
            // Mark as not implemented to try again later
            localStorage.removeItem(`implemented_${task.id}`);
          }
        });
      }
    });
  }

  /**
   * Refresh tasks manually
   */
  private static refreshTasks(tasks: UpdateTask[]): void {
    // This is a workaround to force a refresh of the tasks
    // In a real implementation, we would have a more direct way to update the tasks
    if (tasks.length > 0) {
      localStorage.setItem('aiAutoUpdaterTasks', JSON.stringify(tasks));
      
      // Force a refresh
      const event = new Event('storage');
      window.dispatchEvent(event);
    }
  }
  
  /**
   * Manually implement a specific task
   */
  public static async implementTask(taskId: string): Promise<boolean> {
    const tasks = aiAutoUpdater.getTasks();
    const task = tasks.find(t => t.id === taskId);
    
    if (task && task.code) {
      return await CodeImplementor.implementCode(task);
    }
    
    return false;
  }
}
