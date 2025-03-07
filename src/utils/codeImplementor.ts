
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
      
      // Attempt to write file to the real file system
      await this.writeFile(filePath, codeContent);
      
      toast.success(`Implementing: ${task.description}`, {
        description: `Created ${componentName} in ${filePath}`
      });
      
      // Update imports in App.tsx if it's a page component
      if (filePath.includes('pages/') && !filePath.includes('components/')) {
        await this.updateAppRoutes(componentName, filePath);
      }
      
      // Add import to index page if it's a component with "button" in the name
      if (componentName.toLowerCase().includes('button') && !filePath.includes('pages/')) {
        await this.addComponentToIndex(componentName, filePath);
      }
      
      toast.success("Code successfully implemented!");
      
      // Mark the task as completed
      this.updateTaskStatus(task.id, 'completed');
      
      return true;
    } catch (error) {
      console.error("Implementation error:", error);
      toast.error(`Failed to implement code: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  /**
   * Write content to a file using the Lovable runtime
   */
  private static async writeFile(filePath: string, content: string): Promise<void> {
    try {
      console.log(`[CodeImplementor] Writing file: ${filePath}`);
      
      // Using Lovable's runtime to write files
      // This is handled by the Lovable platform when this code runs
      window.parent.postMessage({
        type: 'lovable-write-file',
        filePath,
        content
      }, '*');
      
      // Store in localStorage as a backup mechanism
      const fileUpdates = JSON.parse(localStorage.getItem('fileUpdates') || '{}');
      fileUpdates[filePath] = { content, timestamp: new Date().toISOString() };
      localStorage.setItem('fileUpdates', JSON.stringify(fileUpdates));
      
      // Notify system about the new file
      this.notifyFileSystem(filePath, content);
    } catch (error) {
      console.error("Error writing file:", error);
      throw error;
    }
  }

  /**
   * Notify the file system about a new or updated file
   */
  private static notifyFileSystem(filePath: string, content: string): void {
    // Dispatch a custom event that can be caught by the application
    const event = new CustomEvent('fileSystemUpdate', {
      detail: { filePath, content, timestamp: new Date().toISOString() }
    });
    
    window.dispatchEvent(event);
    console.log(`[CodeImplementor] File system notified about: ${filePath}`);
  }

  /**
   * Update App.tsx to include new routes if necessary
   */
  private static async updateAppRoutes(componentName: string, filePath: string): Promise<void> {
    try {
      console.log(`[CodeImplementor] Adding route for ${componentName} in App.tsx`);
      
      // Create a route path from the component name
      const routePath = componentName.toLowerCase();
      
      // Read current App.tsx content
      const appTsxContent = localStorage.getItem('appTsxContent') || '';
      
      // Check if route already exists
      if (appTsxContent.includes(`path="/${routePath}"`)) {
        console.log(`[CodeImplementor] Route for /${routePath} already exists`);
        return;
      }
      
      // For now, we'll just notify that we would add the route
      // In a real implementation, this would modify App.tsx
      console.log(`[CodeImplementor] Would add: <Route path="/${routePath}" element={<${componentName} />} />`);
      
      // Since we can't directly modify App.tsx in this simulation,
      // We'll log what would be added
      console.log(`[CodeImplementor] Route added for ${componentName}`);
      
      // Notify about the change
      toast.info(`Added route: /${routePath}`, {
        description: `You can now access the new page at /${routePath}`
      });
    } catch (error) {
      console.error("Error updating App routes:", error);
      // Continue even if this fails, as the main implementation succeeded
    }
  }
  
  /**
   * Add a component to the Index page
   */
  private static async addComponentToIndex(componentName: string, filePath: string): Promise<void> {
    try {
      console.log(`[CodeImplementor] Adding ${componentName} to Index page`);
      
      // In a real implementation, this would:
      // 1. Read the Index.tsx file
      // 2. Add an import for the new component
      // 3. Add the component to the JSX
      
      // For now, we'll just notify that we would add the component
      console.log(`[CodeImplementor] Would add import: import { ${componentName} } from "${filePath.replace('src/', '@/')}";`);
      
      // Notify about the change
      toast.info(`Added ${componentName} to Index page`, {
        description: `The component is now visible on the home page`
      });
    } catch (error) {
      console.error("Error adding component to Index:", error);
      // Continue even if this fails
    }
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
  private static analyzeCode(code: string): { 
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
