
import { aiAutoUpdater, UpdateTask } from "@/services/AIAutoUpdater";
import { CodeImplementor } from "@/utils/codeImplementor";
import { toast } from "sonner";

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
    
    console.log('[AIAutoUpdaterIntegration] Initializing...');
    
    // Listen for task completion events
    window.addEventListener('updateTaskStatus', (event: any) => {
      const { taskId, status } = event.detail;
      
      if (taskId && status) {
        const tasks = aiAutoUpdater.getTasks();
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
          console.log(`[AIAutoUpdaterIntegration] Updating task ${taskId} to ${status}`);
          
          // Force a refresh by triggering a status update
          this.refreshTasks(tasks.map(t => 
            t.id === taskId ? { ...t, status: status as UpdateTask['status'] } : t
          ));
        }
      }
    });
    
    // Enhanced implementation for file system updates
    window.addEventListener('fileSystemUpdate', (event: any) => {
      const { filePath, content, success } = event.detail;
      
      if (filePath && content) {
        console.log(`[AIAutoUpdaterIntegration] File system updated: ${filePath}`);
        
        if (success) {
          toast.success(`Updated file: ${filePath}`, {
            description: "Changes have been applied"
          });
        }
      }
    });
    
    // Make sure autoImplement is enabled by default
    aiAutoUpdater.toggleAutoImplement(true);
    
    // Monitor for completed tasks and implement them
    this.enhanceAutoUpdater();
    
    this.isInitialized = true;
    console.log('[AIAutoUpdaterIntegration] Initialized');
    
    // Start the AIAutoUpdater
    setTimeout(() => {
      try {
        aiAutoUpdater.start();
        console.log('[AIAutoUpdaterIntegration] AIAutoUpdater started');
      } catch (error) {
        console.error('[AIAutoUpdaterIntegration] Error starting AIAutoUpdater:', error);
      }
    }, 500);
  }

  /**
   * Enhance the AIAutoUpdater with real implementation capabilities
   */
  private static enhanceAutoUpdater(): void {
    // Listen to completed tasks and implement them
    aiAutoUpdater.subscribe(async (tasks) => {
      const pendingTasks = tasks.filter(t => 
        t.status === 'completed' && 
        t.code && 
        !localStorage.getItem(`implemented_${t.id}`)
      );
      
      if (pendingTasks.length > 0) {
        console.log(`[AIAutoUpdaterIntegration] Found ${pendingTasks.length} completed tasks to implement`);
        
        // Implement each task
        for (const task of pendingTasks) {
          console.log(`[AIAutoUpdaterIntegration] Implementing task: ${task.id}`);
          
          // Mark as implemented in localStorage to avoid duplicate implementations
          localStorage.setItem(`implemented_${task.id}`, 'true');
          
          // Implement the code directly through Lovable's API
          try {
            const success = await this.implementTaskViaLovable(task);
            
            if (success) {
              console.log(`[AIAutoUpdaterIntegration] Successfully implemented task: ${task.id}`);
              toast.success(`Feature implemented: ${task.description}`, {
                description: "Your app has been updated"
              });
            } else {
              console.error(`[AIAutoUpdaterIntegration] Failed to implement task: ${task.id}`);
              localStorage.removeItem(`implemented_${task.id}`);
              toast.error(`Failed to implement: ${task.description}`);
            }
          } catch (error) {
            console.error("Implementation error:", error);
            localStorage.removeItem(`implemented_${task.id}`);
          }
        }
      }
    });
  }

  /**
   * Use Lovable's API to implement the task
   */
  private static async implementTaskViaLovable(task: UpdateTask): Promise<boolean> {
    try {
      // Extract component info
      const { componentName, filePath, codeContent } = CodeImplementor.analyzeCode(task.code || "");
      
      if (!componentName || !filePath || !codeContent) {
        console.error("Failed to analyze code");
        return false;
      }
      
      // Use Lovable's messaging system to implement the code
      const success = await CodeImplementor.writeFileThroughLovable(filePath, codeContent);
      
      if (success) {
        // If it's a button component, automatically add it to the Index page
        if (componentName.toLowerCase().includes('button') || 
            task.description.toLowerCase().includes('button')) {
          await this.addComponentToIndex(componentName, filePath);
        }
      }
      
      return success;
    } catch (error) {
      console.error("Error implementing via Lovable:", error);
      return false;
    }
  }

  /**
   * Add a new component to the Index page
   */
  private static async addComponentToIndex(componentName: string, filePath: string): Promise<boolean> {
    try {
      // Use Lovable to update the Index page
      const relativePath = filePath.replace('src/', '@/');
      const importStatement = `import { ${componentName} } from "${relativePath.replace('.tsx', '')}";`;
      
      console.log(`[AIAutoUpdaterIntegration] Adding component ${componentName} to Index page`);
      
      // Signal that component needs to be added to index
      window.parent.postMessage({
        type: 'add-component-to-index',
        componentName,
        importPath: relativePath.replace('.tsx', '')
      }, '*');
      
      return true;
    } catch (error) {
      console.error("Error adding component to Index:", error);
      return false;
    }
  }

  /**
   * Refresh tasks manually
   */
  private static refreshTasks(tasks: UpdateTask[]): void {
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
      return await this.implementTaskViaLovable(task);
    }
    
    return false;
  }
}
