
import React from "react";
import { motion } from "framer-motion";

interface LivePreviewProps {
  code: string;
  isLoading?: boolean;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ code, isLoading = false }) => {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Reset error state when code changes
    setErrorMessage(null);
  }, [code]);

  // A very basic safety check for potentially harmful code
  const isSafeCode = (codeString: string): boolean => {
    const dangerousPatterns = [
      'document.cookie',
      'localStorage',
      'sessionStorage',
      'window.open',
      'eval(',
      'new Function(',
      'fetch('
    ];
    
    return !dangerousPatterns.some(pattern => codeString.includes(pattern));
  };

  // Simple component renderer
  const renderComponent = () => {
    if (!code || isLoading) return null;
    
    if (!isSafeCode(code)) {
      return <div className="text-red-500">Error: Code contains potentially unsafe operations.</div>;
    }
    
    try {
      // Create a dynamic component from the code string
      // This is a simplified implementation and has limitations
      const transformedCode = `
        ${code}
      `;
      
      // Create a function that returns the component
      // eslint-disable-next-line no-new-func
      const ComponentFunction = new Function('React', 'motion', 'require', 'module', 'exports', transformedCode);
      
      // Create a mock require function to handle imports
      const mockRequire = (moduleName: string) => {
        if (moduleName === 'react') return React;
        if (moduleName === 'framer-motion') return { motion };
        if (moduleName.startsWith('./') || moduleName.startsWith('../')) {
          return {}; // Mock local imports
        }
        return {}; // Return empty object for other imports
      };
      
      // Create mock module and exports objects
      const mockModule: { exports: any } = { exports: {} };
      const mockExports = {};
      
      // Execute the function to get the component
      ComponentFunction(React, motion, mockRequire, mockModule, mockExports);
      
      // Check if the component was exported
      const exportedComponent = mockModule.exports;
      let Component = null;
      
      // Try to find the component in different export formats
      if (exportedComponent && typeof exportedComponent === 'object') {
        if (exportedComponent.default) {
          Component = exportedComponent.default;
        } else if (exportedComponent.Component) {
          Component = exportedComponent.Component;
        } else if (typeof exportedComponent === 'function') {
          Component = exportedComponent;
        }
      }
      
      // Render the component
      return Component ? <Component /> : <div className="text-yellow-500">No component exported</div>;
    } catch (error) {
      console.error('Error rendering component:', error);
      setErrorMessage((error as Error).message);
      return (
        <div className="p-4 bg-red-900/30 text-red-400 rounded-lg border border-red-500/30">
          <h3 className="font-medium mb-2">Error rendering component</h3>
          <pre className="text-sm overflow-auto">{(error as Error).message}</pre>
        </div>
      );
    }
  };

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg border border-gray-800 overflow-auto">
      <div className="p-2 border-b border-gray-800 bg-gray-950 text-gray-400 text-sm font-medium">
        Preview
      </div>
      
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : errorMessage ? (
          <div className="p-4 bg-red-900/30 text-red-400 rounded-lg border border-red-500/30">
            <h3 className="font-medium mb-2">Error rendering component</h3>
            <pre className="text-sm overflow-auto">{errorMessage}</pre>
          </div>
        ) : (
          <div className="bg-gray-950 rounded-lg border border-gray-800 p-4 min-h-64">
            {renderComponent()}
          </div>
        )}
      </div>
    </div>
  );
};
