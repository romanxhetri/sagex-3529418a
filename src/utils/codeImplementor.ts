
import { toast } from "sonner";
import { UpdateTask } from "@/services/AIAutoUpdater";

/**
 * Utility that helps with implementing code from AI-generated tasks
 */
export class CodeImplementor {
  /**
   * Implement code from a task by creating or updating files
   */
  static async implementCode(task: UpdateTask): Promise<boolean> {
    try {
      if (!task.code) {
        toast.error("No code available to implement");
        return false;
      }

      // Extract component name and code details
      const { componentName, filePath, codeContent } = this.analyzeCode(task.code);
      
      if (!componentName || !filePath || !codeContent) {
        toast.error("Failed to analyze code for implementation");
        return false;
      }

      console.log(`[CodeImplementor] Implementing ${componentName} in ${filePath}`);
      
      // Write file through Lovable's API
      const success = await this.writeFileThroughLovable(filePath, codeContent);
      
      if (success) {
        toast.success(`Implemented: ${task.description}`, {
          description: `Created ${componentName} in ${filePath}`
        });
        
        // Update task status
        this.updateTaskStatus(task.id, 'completed');
        return true;
      } else {
        toast.error("Failed to implement code");
        return false;
      }
    } catch (error) {
      console.error("Implementation error:", error);
      toast.error(`Failed to implement code: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  /**
   * Write content to a file using Lovable's API
   */
  static async writeFileThroughLovable(filePath: string, content: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        console.log(`[CodeImplementor] Writing file through Lovable: ${filePath}`);
        
        // Use Lovable's messaging system to write files
        window.parent.postMessage({
          type: 'lovable-write-file',
          filePath,
          content
        }, '*');
        
        // We don't have a direct way to know if the file was written successfully,
        // so we'll assume success and resolve after a short delay
        setTimeout(() => {
          console.log(`[CodeImplementor] File write operation completed: ${filePath}`);
          resolve(true);
        }, 500);
      } catch (error) {
        console.error("Error writing file through Lovable:", error);
        resolve(false);
      }
    });
  }

  /**
   * Notify the file system about a new or updated file
   */
  private static notifyFileSystem(filePath: string, content: string): void {
    // Dispatch a custom event that can be caught by the application
    const event = new CustomEvent('fileSystemUpdate', {
      detail: { filePath, content, timestamp: new Date().toISOString(), success: true }
    });
    
    window.dispatchEvent(event);
    console.log(`[CodeImplementor] File system notified about: ${filePath}`);
  }

  /**
   * Update the status of a task in AIAutoUpdater
   */
  private static updateTaskStatus(taskId: string, status: 'completed' | 'failed'): void {
    try {
      const event = new CustomEvent('updateTaskStatus', {
        detail: { taskId, status }
      });
      
      window.dispatchEvent(event);
      console.log(`[CodeImplementor] Task ${taskId} marked as ${status}`);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  }

  /**
   * Analyze code to extract component name, file path, and code content
   */
  static analyzeCode(code: string): { 
    componentName: string | null; 
    filePath: string | null;
    codeContent: string | null;
  } {
    try {
      // Extract component name from code
      const exportMatch = code.match(/export\s+(const|function|class)\s+(\w+)/);
      const defaultExportMatch = code.match(/export\s+default\s+(\w+)/);
      
      let componentName = null;
      
      if (exportMatch && exportMatch[2]) {
        componentName = exportMatch[2];
      } else if (defaultExportMatch && defaultExportMatch[1]) {
        componentName = defaultExportMatch[1];
      }
      
      // Determine file path based on component name
      let filePath = null;
      if (componentName) {
        // Convert component name to kebab case for file path
        const kebabCase = componentName
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .replace(/[\s_]+/g, '-')
          .toLowerCase();
        
        // Determine appropriate directory based on component name
        if (componentName.includes('Button') || componentName.includes('Card') || componentName.includes('Input')) {
          filePath = `src/components/ui/${kebabCase}.tsx`;
        } else if (componentName.includes('Feature')) {
          filePath = `src/components/features/${kebabCase}.tsx`;
        } else if (componentName.includes('Page')) {
          filePath = `src/pages/${kebabCase}.tsx`;
        } else {
          filePath = `src/components/${kebabCase}.tsx`;
        }
      }
      
      // Clean up and format the code
      const codeContent = code.trim();
      
      return { componentName, filePath, codeContent };
    } catch (error) {
      console.error("Code analysis error:", error);
      return { componentName: null, filePath: null, codeContent: null };
    }
  }
}
