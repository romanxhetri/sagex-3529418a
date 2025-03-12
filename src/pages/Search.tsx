
import React, { useState } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { PerplexitySearch } from "@/components/search/PerplexitySearch";
import { Search, Globe, Zap, Database } from "lucide-react";

const Search = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const handleSearch = (query: string) => {
    if (!recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev].slice(0, 5));
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              SageX AI Search
            </h1>
            <p className="text-gray-400 mt-2">
              Get comprehensive answers powered by Perplexity AI research technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <PerplexitySearch onSearch={(query) => handleSearch(query)} />
            </div>
            
            <div className="space-y-6">
              <div className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg overflow-hidden">
                <div className="p-3 border-b border-glass-border">
                  <div className="flex items-center">
                    <Search className="text-purple-400 mr-2" size={16} />
                    <h3 className="text-sm font-medium text-white">Recent Searches</h3>
                  </div>
                </div>
                <div className="p-3">
                  {recentSearches.length > 0 ? (
                    <ul className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <li key={index} className="text-sm text-gray-300 hover:text-white cursor-pointer">
                          {search}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No recent searches</p>
                  )}
                </div>
              </div>
              
              <div className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg overflow-hidden">
                <div className="p-3 border-b border-glass-border">
                  <div className="flex items-center">
                    <Globe className="text-purple-400 mr-2" size={16} />
                    <h3 className="text-sm font-medium text-white">AI Search Features</h3>
                  </div>
                </div>
                <div className="p-3">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Zap className="text-yellow-500 mt-0.5 mr-2" size={14} />
                      <span className="text-sm text-gray-300">Web-wide research with citations</span>
                    </li>
                    <li className="flex items-start">
                      <Zap className="text-yellow-500 mt-0.5 mr-2" size={14} />
                      <span className="text-sm text-gray-300">Real-time information access</span>
                    </li>
                    <li className="flex items-start">
                      <Zap className="text-yellow-500 mt-0.5 mr-2" size={14} />
                      <span className="text-sm text-gray-300">Comprehensive deep analysis</span>
                    </li>
                    <li className="flex items-start">
                      <Zap className="text-yellow-500 mt-0.5 mr-2" size={14} />
                      <span className="text-sm text-gray-300">Multi-source information synthesis</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg overflow-hidden">
                <div className="p-3 border-b border-glass-border">
                  <div className="flex items-center">
                    <Database className="text-purple-400 mr-2" size={16} />
                    <h3 className="text-sm font-medium text-white">Search Tips</h3>
                  </div>
                </div>
                <div className="p-3">
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Use specific keywords for better results</li>
                    <li>• Ask complete questions for detailed answers</li>
                    <li>• Include context for more relevant information</li>
                    <li>• Try different phrasings if needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Search;
