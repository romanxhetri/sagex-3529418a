
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import Index from "./pages/Index";
import { AIQuickCommand } from "./components/AIQuickCommand";
import { AIAutoUpdaterIntegration } from "./services/AIAutoUpdaterIntegration";
import { DynamicUniverseBackground } from "./components/DynamicUniverseBackground";

// Lazy loading components to improve initial load time
const Chat = lazy(() => import("./pages/Chat"));
const Laptops = lazy(() => import("./pages/Laptops"));
const Mobiles = lazy(() => import("./pages/Mobiles"));
const Updates = lazy(() => import("./pages/Updates"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AppIntro = lazy(() => import("./components/AppIntro").then(module => ({ default: module.AppIntro })));

// Loading fallback
const LoadingFallback = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
  </div>
);

// Create a performant query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false, // Disable refetching on window focus for better performance
      gcTime: 10 * 60 * 1000 // 10 minutes cache time (renamed from cacheTime)
    }
  }
});

// Route component to manage scene rendering
const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <>
      <AIQuickCommand />
      
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/laptops" element={<Laptops />} />
          <Route path="/mobiles" element={<Mobiles />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      
      <div className="fixed bottom-1 left-1 text-[10px] text-gray-500 opacity-60">
        Created by Roman Xhetri
      </div>
    </>
  );
};

const App = () => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Hide intro after a shorter time for better performance
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 5000); // Further reduced to 5 seconds for faster app experience

    // Initialize the AIAutoUpdater integration
    AIAutoUpdaterIntegration.initialize();

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Add DynamicUniverseBackground once, at the app root level */}
        <DynamicUniverseBackground />
        
        <Toaster />
        <Sonner />
        
        {showIntro && (
          <Suspense fallback={<div className="fixed inset-0 bg-gray-900" />}>
            <AppIntro />
          </Suspense>
        )}
        
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
