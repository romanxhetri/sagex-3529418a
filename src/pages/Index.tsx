
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Zap, MessageSquare, Laptop, Smartphone, Sparkles, Bot, InfoIcon } from "lucide-react";

// Function to dynamically import components as they are created by AI
const dynamicImport = async (path: string) => {
  try {
    return await import(path);
  } catch (error) {
    console.log(`Component at ${path} not available yet`);
    return null;
  }
};

const Index = () => {
  const navigate = useNavigate();
  const [TutorialButton, setTutorialButton] = useState<React.ComponentType | null>(null);
  
  // Check for dynamically created components
  useEffect(() => {
    const checkForComponents = async () => {
      try {
        // Try to import the TutorialButton component if it exists
        const tutorialModule = await dynamicImport('../components/tutorial-button');
        if (tutorialModule && tutorialModule.TutorialButton) {
          setTutorialButton(() => tutorialModule.TutorialButton);
        }
      } catch (error) {
        // Component doesn't exist yet
      }
      
      // Check localStorage for file updates (our simulation mechanism)
      const fileUpdates = JSON.parse(localStorage.getItem('fileUpdates') || '{}');
      const tutorialPath = 'src/components/tutorial-button.tsx';
      
      if (fileUpdates[tutorialPath]) {
        // We have a tutorial button implementation in our storage
        console.log("Tutorial button implementation found in storage!");
        
        // In a real implementation, we would have a way to dynamically load this
        // For now, we'll create a simple wrapper component
        const TutorialButtonWrapper = () => (
          <Button 
            onClick={() => alert("Welcome to the tutorial! This will guide you through using the app.")}
            className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700"
          >
            <InfoIcon className="mr-2 h-4 w-4" />
            Start Tutorial
          </Button>
        );
        
        setTutorialButton(() => TutorialButtonWrapper);
      }
    };
    
    checkForComponents();
    
    // Listen for file system updates
    const handleFileUpdate = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (detail && detail.filePath && detail.filePath.includes('tutorial-button')) {
        console.log("Tutorial button was updated!");
        checkForComponents();
      }
    };
    
    window.addEventListener('fileSystemUpdate', handleFileUpdate);
    
    return () => {
      window.removeEventListener('fileSystemUpdate', handleFileUpdate);
    };
  }, []);

  // Showcase features with animations
  const features = [
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Chat with SageX",
      description: "Talk to our intelligent AI assistant",
      action: () => navigate("/chat"),
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <Laptop className="h-5 w-5" />,
      title: "Laptops",
      description: "Browse our collection of high-end laptops",
      action: () => navigate("/laptops"),
      color: "from-purple-500 to-blue-600"
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      title: "Mobile Phones",
      description: "Discover the latest smartphones",
      action: () => navigate("/mobiles"),
      color: "from-pink-500 to-purple-600"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "AI Updates",
      description: "See how SageX improves itself",
      action: () => navigate("/updates"),
      color: "from-amber-500 to-red-600"
    }
  ];

  return (
    <div className="min-h-screen text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to SageX
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-300 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Experience the future of intelligent assistance
          </motion.p>
          
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button 
              onClick={() => navigate("/chat")} 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Bot className="mr-2 h-5 w-5" />
              Start Chatting
            </Button>
            
            {TutorialButton && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <TutorialButton />
              </motion.div>
            )}
          </motion.div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-glass-dark backdrop-blur-md border border-glass-border rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div 
                className={`p-6 cursor-pointer`}
                onClick={feature.action}
              >
                <div className={`inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-r ${feature.color} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-6 inline-flex items-center">
            <Sparkles className="text-purple-400 mr-2" />
            AI-Powered Auto Updates
          </h2>
          
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            SageX continuously improves itself using AI. Visit the Updates page to see this in action.
          </p>
          
          <Button 
            onClick={() => navigate("/updates")} 
            variant="outline"
            className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
          >
            <Zap className="mr-2 h-4 w-4" />
            See Auto Updates
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
