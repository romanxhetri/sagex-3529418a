
import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { MobileList } from "@/components/mobile/MobileList";
import { MobileChat } from "@/components/mobile/MobileChat";
import { useMediaQuery } from "@/hooks/use-mobile";
import { PostProductButton } from "@/components/PostProductButton";

const Mobiles = () => {
  const [showChat, setShowChat] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowChat(false);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen text-white overflow-hidden">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Mobile Finder</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowChat(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              AI Assistant
            </button>
            <PostProductButton />
          </div>
        </div>
        
        <MobileList />
        
        {(showChat || isMobile) && (
          <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity ${
            showChat ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}>
            <div className="relative w-full max-w-lg max-h-[80vh] bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => setShowChat(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <MobileChat onClose={() => setShowChat(false)} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Mobiles;
