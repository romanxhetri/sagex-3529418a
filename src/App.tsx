
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import Index from "./pages/Index";
import { AIAutoUpdaterIntegration } from "./services/AIAutoUpdaterIntegration";
import { UniverseBackground } from "./components/UniverseBackground";

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
      refetchOnWindowFocus: false,
      gcTime: 10 * 60 * 1000
    }
  }
});

// Route component to manage scene rendering
const AppRoutes = () => {
  const location = useLocation();
  const [currentWeather, setCurrentWeather] = useState<"thunder" | "rain" | "fire" | "wind">("thunder");
  const [adminPassword, setAdminPassword] = useState<string | null>(null);

  // Set up admin password
  useEffect(() => {
    // Set a default admin password or load from storage
    const savedPassword = localStorage.getItem("adminPassword");
    if (!savedPassword) {
      const defaultPassword = "admin123"; // You can change this
      localStorage.setItem("adminPassword", defaultPassword);
      setAdminPassword(defaultPassword);
    } else {
      setAdminPassword(savedPassword);
    }
  }, []);
  
  // Cycle through weather effects every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWeather(prev => {
        switch (prev) {
          case "thunder": return "rain";
          case "rain": return "fire";
          case "fire": return "wind";
          case "wind": return "thunder";
          default: return "thunder";
        }
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <>
      {/* Global 3D background with weather effects */}
      <UniverseBackground weatherType={currentWeather} />
      
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Index adminPassword={adminPassword} />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/laptops" element={<Laptops />} />
          <Route path="/mobiles" element={<Mobiles />} />
          <Route path="/updates" element={<Updates adminPassword={adminPassword} />} />
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
    }, 5000);

    // Initialize the AIAutoUpdater integration
    AIAutoUpdaterIntegration.initialize();

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
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
