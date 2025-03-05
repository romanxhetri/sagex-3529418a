
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
      const transformedCode = `
        ${code}
      `;
      
      // Create a function that returns the component
      // eslint-disable-next-line no-new-func
      const ComponentFunction = new Function('React', 'motion', 'require', 'module', 'exports', 'return ' + transformedCode);
      
      // Create a mock require function to handle imports
      const mockRequire = (moduleName: string) => {
        if (moduleName === 'react') return React;
        if (moduleName === 'framer-motion') return { motion };
        if (moduleName.startsWith('@/components/ui/')) {
          // Mock shadcn components
          return {
            Button: (props: any) => <button {...props}>{props.children}</button>,
            Card: (props: any) => <div {...props}>{props.children}</div>,
            CardContent: (props: any) => <div {...props}>{props.children}</div>,
            CardFooter: (props: any) => <div {...props}>{props.children}</div>,
            CardHeader: (props: any) => <div {...props}>{props.children}</div>,
            CardTitle: (props: any) => <h3 {...props}>{props.children}</h3>,
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
        if (moduleName.startsWith('./') || moduleName.startsWith('../')) {
          return {}; // Mock local imports
        }
        return {}; // Return empty object for other imports
      };
      
      // Create mock module and exports objects
      const mockModule: { exports: any } = { exports: {} };
      const mockExports = {};
      
      try {
        // First try with return statement (for component expressions)
        const result = ComponentFunction(React, motion, mockRequire, mockModule, mockExports);
        
        if (result && typeof result === 'function') {
          // If the function returned a React component directly
          const Component = result;
          return <Component />;
        }
      } catch (error) {
        // If that fails, try with the regular component definition approach
        // eslint-disable-next-line no-new-func
        const RegularComponentFunction = new Function('React', 'motion', 'require', 'module', 'exports', transformedCode);
        
        // Execute the function to get the component
        RegularComponentFunction(React, motion, mockRequire, mockModule, mockExports);
      }
      
      // Check if the component was exported
      const exportedComponent = mockModule.exports;
      let Component = null;
      
      // Try to find the component in different export formats
      if (exportedComponent && typeof exportedComponent === 'object') {
        if (exportedComponent.default) {
          Component = exportedComponent.default;
        } else if (exportedComponent.NewFeature) {
          Component = exportedComponent.NewFeature;
        } else if (exportedComponent.Component) {
          Component = exportedComponent.Component;
        } else if (exportedComponent.ProductCard) {
          Component = exportedComponent.ProductCard;
          // For ProductCard, provide sample props
          return <Component 
            title="Sample Product" 
            description="This is a sample product description" 
            imageUrl="/placeholder.svg" 
            price={99.99} 
          />;
        } else if (exportedComponent.EnhancedButton) {
          Component = exportedComponent.EnhancedButton;
          // For buttons, provide sample children
          return <Component>Sample Button</Component>;
        } else if (exportedComponent.ProfileCard) {
          Component = exportedComponent.ProfileCard;
          return <Component />;
        } else if (exportedComponent.MagicalFeature) {
          Component = exportedComponent.MagicalFeature;
          return <Component />;
        } else if (exportedComponent.AIAutoUpdateManager) {
          Component = exportedComponent.AIAutoUpdateManager;
          return <Component />;
        } else if (Object.keys(exportedComponent).length > 0) {
          // Try the first exported component if multiple are exported
          const firstKey = Object.keys(exportedComponent)[0];
          Component = exportedComponent[firstKey];
        }
      } else if (typeof exportedComponent === 'function') {
        Component = exportedComponent;
      }
      
      // Look for components in the code based on common patterns
      if (!Component) {
        const componentMatch = code.match(/export\s+(?:const|function)\s+(\w+)/);
        if (componentMatch && componentMatch[1]) {
          const componentName = componentMatch[1];
          // Try to extract it from the exports object
          if (exportedComponent && exportedComponent[componentName]) {
            Component = exportedComponent[componentName];
          }
        }
      }
      
      // Last resort: look for a return statement with JSX
      if (!Component && code.includes('return (')) {
        try {
          const returnMatch = code.match(/return\s+\(\s*<([^>]+)>/);
          if (returnMatch) {
            // Create a wrapper component with the return statement
            const WrapperComponent = () => {
              // eslint-disable-next-line no-new-func
              const renderFunc = new Function('React', 'motion', 'require', `
                ${code}
                return React.createElement(${returnMatch[1]});
              `);
              try {
                return renderFunc(React, motion, mockRequire);
              } catch (error) {
                console.error("Error rendering component:", error);
                return <div className="text-red-500">Error rendering component</div>;
              }
            };
            return <WrapperComponent />;
          }
        } catch (error) {
          console.error("Error extracting return statement:", error);
        }
      }
      
      // Render the component
      return Component ? <Component /> : (
        <div className="text-yellow-500">
          Could not render component. Make sure your code exports a React component either as default export or named export.
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
