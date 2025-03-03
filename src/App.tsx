
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Laptops from "./pages/Laptops";
import Mobiles from "./pages/Mobiles";
import NotFound from "./pages/NotFound";
import { AppIntro } from "./components/AppIntro";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2
    }
  }
});

const App = () => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Hide intro after 10 seconds
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showIntro && <AppIntro />}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/laptops" element={<Laptops />} />
            <Route path="/mobiles" element={<Mobiles />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
