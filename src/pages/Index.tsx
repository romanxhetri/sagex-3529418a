
import React, { useState, useEffect } from "react";
import { MagicalUniverseScene } from "@/components/MagicalUniverseScene";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Bot, Laptop, Smartphone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

// Try to dynamically import the TutorialButton if it exists
const DynamicComponentRenderer = ({ componentName, fallback = null }) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const importComponent = async () => {
      try {
        // This dynamic import pattern allows us to try loading components that may have been
        // added by the AI auto-update feature
        const module = await import(`../components/${componentName.toLowerCase()}`);
        if (module[componentName]) {
          setComponent(() => module[componentName]);
        } else {
          console.info(`Component ${componentName} not found in module`);
          setError(true);
        }
      } catch (err) {
        console.info(`Component at ../components/${componentName.toLowerCase()} not available yet`);
        setError(true);
      }
    };

    importComponent();
  }, [componentName]);

  if (error || !Component) return fallback;
  return <Component />;
};

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <MagicalUniverseScene />
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            SageX AI Assistant
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            The next generation AI-powered app that evolves with your needs
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link to="/chat">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center">
                <Bot className="mr-2" />
                Chat with AI
                <ArrowRight className="ml-2" size={16} />
              </Button>
            </Link>
            <Link to="/updates">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center">
                <Zap className="mr-2" />
                AI Updates
                <ArrowRight className="ml-2" size={16} />
              </Button>
            </Link>
          </motion.div>
          
          {/* Dynamic components section */}
          <motion.div 
            className="mt-10 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <DynamicComponentRenderer 
              componentName="TutorialButton" 
              fallback={
                <Link to="/updates">
                  <Button variant="outline" className="border-dashed border-2 text-gray-400 hover:text-white">
                    <Sparkles className="mr-2" size={16} />
                    Create components with AI
                  </Button>
                </Link>
              }
            />
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16"
        >
          <Link to="/laptops">
            <motion.div 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg p-6 hover:border-purple-500/50 transition-all"
            >
              <Laptop className="text-purple-400 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Laptop Finder</h3>
              <p className="text-gray-400">Find the perfect laptop with AI-powered recommendations</p>
            </motion.div>
          </Link>
          
          <Link to="/mobiles">
            <motion.div 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg p-6 hover:border-blue-500/50 transition-all"
            >
              <Smartphone className="text-blue-400 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Mobile Expert</h3>
              <p className="text-gray-400">Discover the best smartphones with AI assistance</p>
            </motion.div>
          </Link>
          
          <Link to="/chat">
            <motion.div 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg p-6 hover:border-green-500/50 transition-all"
            >
              <Bot className="text-green-400 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
              <p className="text-gray-400">Get personalized help with your tech questions</p>
            </motion.div>
          </Link>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
