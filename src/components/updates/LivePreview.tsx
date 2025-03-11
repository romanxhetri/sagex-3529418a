
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

  // Find component name in code
  const extractComponentName = (codeString: string): string | null => {
    // Try to find export statements
    const exportMatch = codeString.match(/export\s+(const|function|class)\s+(\w+)/);
    if (exportMatch && exportMatch[2]) {
      return exportMatch[2];
    }
    
    // Try to find default export statements
    const defaultExportMatch = codeString.match(/export\s+default\s+(\w+)/);
    if (defaultExportMatch && defaultExportMatch[1]) {
      return defaultExportMatch[1];
    }
    
    // Try to find component declaration
    const constMatch = codeString.match(/const\s+(\w+)\s*=\s*\(\)/);
    if (constMatch && constMatch[1]) {
      return constMatch[1];
    }
    
    return null;
  };

  // Remove import statements from code to prevent errors
  const processCodeForEvaluation = (codeString: string): string => {
    // Remove all import statements
    const codeWithoutImports = codeString.replace(/import.*?from\s+['"].*?['"];?/g, '');
    
    // Replace export statements with simple variable declarations
    const codeWithoutExports = codeWithoutImports.replace(/export\s+(default\s+)?/g, '');
    
    return codeWithoutExports;
  };

  // Simple component renderer
  const renderComponent = () => {
    if (!code || isLoading) return null;
    
    if (!isSafeCode(code)) {
      return <div className="text-red-500">Error: Code contains potentially unsafe operations.</div>;
    }
    
    try {
      // Extract component name
      const componentName = extractComponentName(code);
      
      // Process code to remove imports and exports
      const processedCode = processCodeForEvaluation(code);
      
      // Create a dynamic component from the code string
      const transformedCode = `
        try {
          ${processedCode}
          return typeof ${componentName} !== 'undefined' ? ${componentName} : null;
        } catch (error) {
          console.error('Component evaluation error:', error);
          return null;
        }
      `;
      
      // Create a function that returns the component
      let ComponentFunction;
      try {
        // eslint-disable-next-line no-new-func
        ComponentFunction = new Function('React', 'motion', 'require', 'module', 'exports', transformedCode);
      } catch (error) {
        console.error("Error creating function:", error);
        throw error;
      }
      
      // Create a mock require function to handle imports
      const mockRequire = (moduleName: string) => {
        if (moduleName === 'react') return React;
        if (moduleName === 'framer-motion') return { motion };
        if (moduleName.startsWith('@/components/ui/')) {
          // Mock shadcn components
          return {
            Button: (props: any) => <button className="px-4 py-2 bg-purple-600 text-white rounded" {...props}>{props.children}</button>,
            Card: (props: any) => <div className="border rounded p-4 bg-gray-800" {...props}>{props.children}</div>,
            CardContent: (props: any) => <div className="py-2" {...props}>{props.children}</div>,
            CardFooter: (props: any) => <div className="pt-2 border-t border-gray-700" {...props}>{props.children}</div>,
            CardHeader: (props: any) => <div className="pb-2 border-b border-gray-700" {...props}>{props.children}</div>,
            CardTitle: (props: any) => <h3 className="text-lg font-bold" {...props}>{props.children}</h3>,
            Input: (props: any) => <input className="px-2 py-1 bg-gray-700 border border-gray-600 rounded" {...props} />,
            Label: (props: any) => <label className="block text-sm font-medium" {...props}>{props.children}</label>,
            Select: (props: any) => <select className="px-2 py-1 bg-gray-700 border border-gray-600 rounded" {...props}>{props.children}</select>,
            Textarea: (props: any) => <textarea className="px-2 py-1 bg-gray-700 border border-gray-600 rounded" {...props}>{props.children}</textarea>,
          };
        }
        if (moduleName.startsWith('lucide-react')) {
          // Mock Lucide icons
          const IconComponent = (props: any) => (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            </svg>
          );
          return {
            Sparkles: IconComponent,
            Bot: IconComponent,
            Code: IconComponent,
            Play: IconComponent,
            Zap: IconComponent,
            Star: IconComponent,
            Heart: IconComponent,
            RefreshCw: IconComponent,
            Check: IconComponent,
            AlertCircle: IconComponent,
            MessageCircle: IconComponent,
            Share2: IconComponent,
            User: IconComponent,
          };
        }
        return {}; // Return empty object for other imports
      };
      
      // Create mock module and exports objects
      const mockModule: { exports: any } = { exports: {} };
      const mockExports = {};
      
      try {
        // Execute the component function
        const Component = ComponentFunction(React, motion, mockRequire, mockModule, mockExports);
        
        if (Component && typeof Component === 'function') {
          return (
            <ErrorBoundary>
              <Component />
            </ErrorBoundary>
          );
        } else if (React.isValidElement(Component)) {
          return Component;
        } else {
          // If the componentName is found but not returned correctly, try to create it manually
          if (componentName) {
            const fallbackCode = `
              ${processedCode}
              try {
                const FallbackComponent = ${componentName};
                return FallbackComponent ? React.createElement(FallbackComponent) : null;
              } catch (e) {
                console.error('Fallback error:', e);
                return null;
              }
            `;
            
            try {
              // eslint-disable-next-line no-new-func
              const FallbackFunction = new Function('React', 'motion', fallbackCode);
              return FallbackFunction(React, motion);
            } catch (error) {
              console.error("Fallback creation error:", error);
            }
          }
        }
      } catch (error) {
        console.error("Component execution error:", error);
        throw error;
      }
      
      return (
        <div className="text-yellow-500">
          Could not render component. The component might have dependencies that cannot be mocked in the preview.
        </div>
      );
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

  // Error boundary component to catch runtime errors
  class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
    constructor(props: {children: React.ReactNode}) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }

    render() {
      if (this.state.hasError) {
        return (
          <div className="p-4 bg-red-900/30 text-red-400 rounded-lg border border-red-500/30">
            <h3 className="font-medium mb-2">Component Error</h3>
            <pre className="text-sm overflow-auto">{this.state.error?.message}</pre>
          </div>
        );
      }

      return this.props.children;
    }
  }

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
