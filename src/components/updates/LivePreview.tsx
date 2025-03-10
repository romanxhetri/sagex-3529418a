
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Eye, RefreshCw, Zap } from "lucide-react";

interface LivePreviewProps {
  code: string;
  isLoading: boolean;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ code, isLoading }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!code || isLoading) return;
    
    try {
      renderPreview();
    } catch (error) {
      console.error("Error rendering preview:", error);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
      setHasError(true);
      toast.error("Preview error", {
        description: "Failed to render the preview. Check console for details."
      });
    }
  }, [code, isLoading]);

  const renderPreview = () => {
    if (!iframeRef.current) return;
    
    setIsRendering(true);
    setHasError(false);
    setErrorMessage("");
    
    // Process the code to make it renderable
    const processedCode = processCodeForPreview(code);
    
    // Create the HTML content for the iframe
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <script>
            // Mock React and ReactDOM
            const React = {
              createElement: (...args) => ({ type: args[0], props: args[1] || {} }),
              useState: (initial) => [initial, () => {}],
              useEffect: () => {},
              useRef: () => ({ current: null }),
              forwardRef: (component) => component,
              Fragment: 'fragment',
              createContext: () => ({ Provider: 'provider' }),
            };
            
            // Mock imports
            const mockImports = {
              '@/components/ui/button': { Button: (props) => props.children },
              'lucide-react': {
                Sparkles: () => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L13.2 7.8L18 9L13.2 10.2L12 15L10.8 10.2L6 9L10.8 7.8L12 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                Check: () => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                X: () => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                ArrowRight: () => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                Info: () => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                PlusCircle: () => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 8V16M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                Image: () => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                Laptop: () => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 16H4V7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 21H22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 16V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 16V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                Smartphone: () => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 18H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
              },
              'react': React,
              'react-dom': { createRoot: () => ({ render: () => {} }) },
              '@/components/ui/dialog': {
                Dialog: ({ children }) => children,
                DialogTrigger: ({ children }) => children,
                DialogContent: ({ children }) => children,
                DialogHeader: ({ children }) => children,
                DialogFooter: ({ children }) => children,
                DialogTitle: ({ children }) => children,
                DialogDescription: ({ children }) => children,
                DialogClose: ({ children }) => children,
              },
              '@/hooks/use-toast': { useToast: () => ({ toast: () => {} }) },
              'sonner': { toast: { success: () => {}, error: () => {} } },
            };
            
            // Mock import statements
            window.handleImport = (path) => {
              console.log('Handling import:', path);
              if (mockImports[path]) {
                return mockImports[path];
              }
              
              // Default mock for unknown imports
              return {};
            };
            
            // Render the component
            window.renderComponent = (component) => {
              try {
                const container = document.getElementById('preview-container');
                container.innerHTML = '';
                
                // Basic mock rendering by creating a DOM element
                const renderElement = (element) => {
                  if (!element) return document.createTextNode('');
                  
                  if (typeof element === 'string' || typeof element === 'number') {
                    return document.createTextNode(element.toString());
                  }
                  
                  if (typeof element.type === 'function') {
                    try {
                      const result = element.type(element.props);
                      return renderElement(result);
                    } catch (e) {
                      console.error("Error rendering function component:", e);
                      const errorElement = document.createElement('div');
                      errorElement.className = 'text-red-500';
                      errorElement.textContent = 'Component Error: ' + e.message;
                      return errorElement;
                    }
                  }
                  
                  if (typeof element.type === 'string') {
                    const el = document.createElement(element.type);
                    
                    // Add classes from className prop
                    if (element.props.className) {
                      el.className = element.props.className;
                    }
                    
                    // Add other attributes
                    for (const [key, value] of Object.entries(element.props)) {
                      if (key === 'children' || key === 'className') continue;
                      
                      if (key.startsWith('on') && typeof value === 'function') {
                        const eventName = key.slice(2).toLowerCase();
                        el.addEventListener(eventName, (e) => {
                          e.preventDefault();
                          console.log('Event:', eventName);
                        });
                      } else {
                        try {
                          el.setAttribute(key, value);
                        } catch (e) {
                          console.warn('Could not set attribute:', key, value);
                        }
                      }
                    }
                    
                    // Add children
                    if (element.props.children) {
                      const children = Array.isArray(element.props.children) 
                        ? element.props.children 
                        : [element.props.children];
                      
                      children.forEach(child => {
                        if (child) {
                          const childElement = renderElement(child);
                          if (childElement) el.appendChild(childElement);
                        }
                      });
                    }
                    
                    return el;
                  }
                  
                  // For Lucide icons and other special components
                  if (typeof element.type === 'object' && element.type !== null) {
                    const div = document.createElement('span');
                    div.innerHTML = '📋';
                    div.className = 'inline-block';
                    return div;
                  }
                  
                  return document.createTextNode('');
                };
                
                const componentInstance = component.default ? component.default() : component();
                const renderedElement = renderElement(componentInstance);
                
                if (renderedElement) {
                  container.appendChild(renderedElement);
                  window.parent.postMessage({ type: 'previewReady', error: null }, '*');
                } else {
                  throw new Error('Component returned null or undefined');
                }
              } catch (error) {
                console.error('Error rendering component:', error);
                const errorElement = document.createElement('div');
                errorElement.className = 'bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4';
                errorElement.innerHTML = '<p class="font-bold">Preview Error</p><p>' + error.message + '</p>';
                document.getElementById('preview-container').appendChild(errorElement);
                
                window.parent.postMessage({ type: 'previewError', error: error.message }, '*');
              }
            };
            
            // Handle unhandled errors
            window.addEventListener('error', (event) => {
              console.error('Unhandled error:', event.error);
              window.parent.postMessage({ type: 'previewError', error: event.error?.message || 'Unknown error' }, '*');
            });
          </script>
          <style>
            body { 
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              margin: 0;
              padding: 1rem;
              background: #1f2937;
              color: #fff;
            }
            
            #preview-container {
              display: flex;
              min-height: 200px;
              align-items: center;
              justify-content: center;
            }
            
            .error-message {
              background-color: #fee2e2;
              color: #ef4444;
              padding: 1rem;
              border-radius: 0.375rem;
              margin-top: 1rem;
            }
          </style>
        </head>
        <body>
          <div id="preview-container" class="p-4">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          
          <script type="module">
            try {
              // Transform the imported code into a module
              ${processedCode}
              
              // Wait for a moment to ensure everything is processed
              setTimeout(() => window.renderComponent(componentModule), 100);
            } catch (error) {
              console.error('Error in module script:', error);
              document.getElementById('preview-container').innerHTML = '<div class="error-message"><p class="font-bold">Preview Error</p><p>' + error.message + '</p></div>';
              window.parent.postMessage({ type: 'previewError', error: error.message }, '*');
            }
          </script>
        </body>
      </html>
    `;
    
    // Set the content to the iframe
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();
      
      // Listen for messages from the iframe
      window.addEventListener('message', handleIframeMessage);
    }
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('message', handleIframeMessage);
    };
  };

  const handleIframeMessage = (event: MessageEvent) => {
    if (event.data.type === 'previewReady') {
      setIsRendering(false);
    } else if (event.data.type === 'previewError') {
      setIsRendering(false);
      setHasError(true);
      setErrorMessage(event.data.error || 'Unknown error');
      
      console.error('Preview error:', event.data.error);
      toast.error("Preview error", {
        description: event.data.error || 'Failed to render component'
      });
    }
  };

  const processCodeForPreview = (sourceCode: string): string => {
    // Replace imports with dynamic imports
    const importRegex = /import\s+(?:(?:{[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g;
    
    let processedCode = sourceCode.replace(importRegex, (match, importPath) => {
      return `// ${match}\nconst ${importPath.replace(/[@/.-]/g, '_')} = window.handleImport('${importPath}');`;
    });
    
    // Handle named imports
    const namedImportRegex = /import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/g;
    let namedImports = [];
    
    processedCode = processedCode.replace(namedImportRegex, (match, importsStr, importPath) => {
      const imports = importsStr.split(',').map(i => i.trim());
      
      imports.forEach(importName => {
        // Handle "as" syntax
        const [name, alias] = importName.split(' as ').map(s => s.trim());
        namedImports.push(`const ${alias || name} = ${importPath.replace(/[@/.-]/g, '_')}.${name};`);
      });
      
      return ''; // Remove the original import
    });
    
    // Add named imports after all other imports have been processed
    processedCode = processedCode + '\n' + namedImports.join('\n');
    
    // Wrap the component in a module for easier access
    processedCode = `
      // Module wrapper for the component
      const componentModule = {};
      
      ${processedCode}
      
      // Detect the exported component
      if (typeof NewFeature !== 'undefined') {
        componentModule.default = NewFeature;
      } else if (typeof FeatureButton !== 'undefined') {
        componentModule.default = FeatureButton;
      } else if (typeof TutorialButton !== 'undefined') {
        componentModule.default = TutorialButton;
      } else if (typeof ProductCard !== 'undefined') {
        componentModule.default = ProductCard;
      } else {
        // Look for any named export
        const possibleComponents = Object.keys(window)
          .filter(key => /[A-Z]/.test(key[0]) && typeof window[key] === 'function');
        
        if (possibleComponents.length > 0) {
          const componentName = possibleComponents[0];
          componentModule.default = window[componentName];
        } else {
          throw new Error('No React component found in the code');
        }
      }
    `;
    
    return processedCode;
  };

  const handleRefresh = () => {
    setHasError(false);
    setErrorMessage("");
    renderPreview();
    toast.success("Refreshing preview");
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      <div className="p-3 border-b border-gray-800 flex items-center justify-between bg-gray-900">
        <div className="flex items-center">
          <Eye size={16} className="text-gray-400 mr-2" />
          <h3 className="text-sm font-medium text-white">Live Preview</h3>
        </div>
        <button 
          onClick={handleRefresh}
          className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white"
          title="Refresh preview"
        >
          <RefreshCw size={14} />
        </button>
      </div>
      
      <div className="relative flex-grow overflow-hidden">
        {isRendering && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
              <p className="mt-2 text-sm text-gray-300">Rendering preview...</p>
            </div>
          </div>
        )}
        
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-gray-900">
            <div className="bg-red-900/20 border border-red-900 text-red-300 rounded-lg p-4 max-w-md">
              <h4 className="font-bold flex items-center">
                <Zap size={16} className="mr-2" />
                Preview Error
              </h4>
              <p className="mt-1 text-sm">{errorMessage}</p>
              <button 
                onClick={handleRefresh}
                className="mt-4 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md text-sm flex items-center"
              >
                <RefreshCw size={12} className="mr-2" />
                Try Again
              </button>
            </div>
          </div>
        )}
        
        <iframe 
          ref={iframeRef}
          title="Live Preview"
          className="w-full h-full bg-gray-900"
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
};
