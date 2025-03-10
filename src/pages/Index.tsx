
import React from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { ProductsDisplay } from "@/components/ProductsDisplay";

const Index = () => {
  return (
    <div className="min-h-screen text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
            SageX Universe
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Explore the future of technology with AI-powered recommendations and real-time assistance.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-4">Products Marketplace</h2>
            <p className="text-gray-300 mb-4">
              Browse laptops and mobiles posted by our community, or post your own products for sale.
            </p>
            <ProductsDisplay />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg p-6"
          >
            <h2 className="text-2xl font-bold mb-4">AI-Powered Features</h2>
            <p className="text-gray-300 mb-6">
              SageX uses advanced AI to provide personalized recommendations and assistance.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mt-1 bg-purple-500 rounded-full p-2 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Chat Assistant</h3>
                  <p className="text-sm text-gray-400">Get personalized product recommendations and technical support.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 bg-blue-500 rounded-full p-2 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Smart Product Finder</h3>
                  <p className="text-sm text-gray-400">Find the perfect laptop or mobile based on your needs and budget.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 bg-green-500 rounded-full p-2 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Self-Updating Interface</h3>
                  <p className="text-sm text-gray-400">Our AI constantly improves the app with new features and enhancements.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;
