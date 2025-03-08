import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface LivePreviewProps {
  code: string;
  isLoading?: boolean;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ code, isLoading = false }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Process code to make it suitable for preview
  const processCode = (codeString: string): string => {
    // Remove import statements
    let processedCode = codeString.replace(/^import\s+.*?;?\s*$/gm, '');
    
    // Remove export statements but keep the component
    processedCode = processedCode.replace(/export\s+(default\s+)?/g, '');
    
    // Create a complete HTML document
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              margin: 0; 
              font-family: system-ui, sans-serif; 
              color: white;
              background-color: transparent;
            }
            #root {
              padding: 1rem;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
          </style>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <script src="https://cdn.tailwindcss.com"></script>
          <script>
            // Mock common dependencies
            const mockModules = {
              'lucide-react': {
                Button: (props) => {
                  const {children, ...rest} = props;
                  return React.createElement('button', 
                    {...rest, className: 'px-4 py-2 bg-purple-600 text-white rounded'}, 
                    children
                  );
                },
                Info: () => React.createElement('span', {}, 'ℹ️'),
                ArrowRight: () => React.createElement('span', {}, '→'),
                Download: () => React.createElement('span', {}, '↓'),
                Settings: () => React.createElement('span', {}, '⚙️'),
                User: () => React.createElement('span', {}, '👤'),
                Home: () => React.createElement('span', {}, '🏠'),
                Search: () => React.createElement('span', {}, '🔍'),
                Menu: () => React.createElement('span', {}, '☰'),
                X: () => React.createElement('span', {}, '✕'),
                Check: () => React.createElement('span', {}, '✓'),
                ChevronRight: () => React.createElement('span', {}, '❯'),
                ChevronLeft: () => React.createElement('span', {}, '❮'),
                ChevronDown: () => React.createElement('span', {}, '▼'),
                ChevronUp: () => React.createElement('span', {}, '▲'),
                Plus: () => React.createElement('span', {}, '+'),
                Minus: () => React.createElement('span', {}, '-'),
                Calendar: () => React.createElement('span', {}, '📅'),
                Clock: () => React.createElement('span', {}, '🕒'),
                Mail: () => React.createElement('span', {}, '✉️'),
                Phone: () => React.createElement('span', {}, '📞'),
                Star: () => React.createElement('span', {}, '★'),
                Heart: () => React.createElement('span', {}, '❤️'),
                Trash: () => React.createElement('span', {}, '🗑️'),
                Edit: () => React.createElement('span', {}, '✏️'),
                Copy: () => React.createElement('span', {}, '📋'),
                Save: () => React.createElement('span', {}, '💾'),
                Upload: () => React.createElement('span', {}, '📤'),
                DollarSign: () => React.createElement('span', {}, '$'),
                CreditCard: () => React.createElement('span', {}, '💳'),
                ShoppingCart: () => React.createElement('span', {}, '🛒'),
                Filter: () => React.createElement('span', {}, '🔍'),
                Sun: () => React.createElement('span', {}, '☀️'),
                Moon: () => React.createElement('span', {}, '🌙'),
                // Add more as needed
              },
              '@/components/ui/button': {
                Button: (props) => {
                  const {children, ...rest} = props;
                  return React.createElement('button', 
                    {...rest, className: 'px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700'}, 
                    children
                  );
                }
              },
              '@/components/ui/card': {
                Card: (props) => React.createElement('div', 
                  {...props, className: 'border rounded-lg p-4 shadow-lg ' + (props.className || '')}, 
                  props.children
                ),
                CardHeader: (props) => React.createElement('div', 
                  {...props, className: 'mb-2 pb-2 border-b ' + (props.className || '')}, 
                  props.children
                ),
                CardTitle: (props) => React.createElement('h3', 
                  {...props, className: 'text-lg font-bold ' + (props.className || '')}, 
                  props.children
                ),
                CardDescription: (props) => React.createElement('p', 
                  {...props, className: 'text-sm text-gray-500 ' + (props.className || '')}, 
                  props.children
                ),
                CardContent: (props) => React.createElement('div', 
                  {...props, className: 'py-2 ' + (props.className || '')}, 
                  props.children
                ),
                CardFooter: (props) => React.createElement('div', 
                  {...props, className: 'mt-2 pt-2 border-t ' + (props.className || '')}, 
                  props.children
                ),
              }
              // Add more module mocks as needed
            };

            // Setup require/import mock
            window.require = (module) => {
              if (mockModules[module]) {
                return mockModules[module];
              }
              console.warn('Module not mocked:', module);
              return {};
            };
            
            // Make React available globally for the code
            window.React = React;
          </script>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel" data-type="module">
            try {
              ${processedCode}
              
              // Find the last React component in the code
              const componentNames = Object.keys(window).filter(key => 
                typeof window[key] === 'function' && 
                /^[A-Z]/.test(key) && 
                key !== 'React'
              );
              
              // Use the last defined component or a default message
              const ComponentToRender = componentNames.length > 0 
                ? window[componentNames[componentNames.length - 1]] 
                : () => React.createElement('div', {}, 'No component found');
              
              ReactDOM.render(
                React.createElement(ComponentToRender, {}),
                document.getElementById('root')
              );
            } catch (error) {
              ReactDOM.render(
                React.createElement('div', {
                  style: {
                    color: 'red',
                    padding: '1rem',
                    border: '1px solid red',
                    borderRadius: '0.5rem',
                    backgroundColor: 'rgba(254, 202, 202, 0.1)'
                  }
                }, 'Error: ' + error.message),
                document.getElementById('root')
              );
              console.error('Preview error:', error);
            }
          </script>
        </body>
      </html>
    `;
  };

  useEffect(() => {
    if (!iframeRef.current || isLoading) return;
    
    try {
      const processedCode = processCode(code);
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(processedCode);
        iframeDoc.close();
        setError(null);
      }
    } catch (err) {
      console.error("Preview error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, [code, isLoading]);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gray-900 rounded-lg border border-gray-800">
        <Loader2 className="animate-spin h-8 w-8 text-purple-500 mb-4" />
        <p className="text-gray-400">Generating preview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gray-900 rounded-lg border border-gray-800">
        <div className="text-red-500 mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-red-400 mb-2">Preview Error</h3>
        <p className="text-gray-400 max-w-md mb-6">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-800 bg-glass">
      <iframe
        ref={iframeRef}
        title="Live Preview"
        className="w-full h-[500px] border-0"
        sandbox="allow-scripts"
      />
    </div>
  );
};
