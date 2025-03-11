
import React, { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { Search, ExternalLink, Book, Clock, Globe, FileText, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter a search query",
        variant: "destructive"
      });
      return;
    }

    if (!apiKey && !showApiKeyInput) {
      setShowApiKeyInput(true);
      toast({
        title: "API Key Required",
        description: "Please enter your Perplexity API key to continue",
      });
      return;
    }

    if (!apiKey && showApiKeyInput) {
      toast({
        title: "Missing API Key",
        description: "Please enter a valid Perplexity API key",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a research assistant that provides comprehensive, factual, and up-to-date information. Always cite your sources and provide evidence for your claims. Structure your responses clearly with sections and bullet points where appropriate.'
            },
            {
              role: 'user',
              content: query
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 1000,
          return_webpages: true,
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error(`Search request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("Search response:", data);
      
      // Parse the response
      const message = data.choices[0].message;
      
      // Create a structured result
      setSearchResults([
        {
          type: 'answer',
          content: message.content,
          sources: message.webpages || []
        }
      ]);
      
      toast({
        title: "Search Complete",
        description: "Research results are ready",
      });
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveKey = () => {
    if (!apiKey) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid API key",
        variant: "destructive"
      });
      return;
    }
    
    localStorage.setItem("perplexity_api_key", apiKey);
    setShowApiKeyInput(false);
    
    toast({
      title: "API Key Saved",
      description: "Your Perplexity API key has been saved",
    });
    
    // Focus back on search input
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Load API key from localStorage on initial render
  React.useEffect(() => {
    const savedKey = localStorage.getItem("perplexity_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      setShowApiKeyInput(true);
    }
  }, []);

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
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              SageX AI Research
            </h1>
            <p className="text-gray-400 mb-8">
              Powered by advanced AI research capabilities, get factual and comprehensive answers
            </p>
          </div>
          
          {showApiKeyInput ? (
            <div className="mb-8 bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">API Key Required</h2>
              <p className="text-gray-400 mb-4">
                To use the search functionality, you need a Perplexity API key. You can get one from the Perplexity website.
              </p>
              <div className="flex gap-2">
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Perplexity API key"
                  className="bg-gray-800 text-white border-gray-700"
                />
                <Button onClick={handleSaveKey}>
                  Save Key
                </Button>
              </div>
            </div>
          ) : null}
          
          <form onSubmit={handleSearch} className="relative mb-8">
            <Input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything or search the web..."
              className="w-full p-4 pr-12 bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Button 
              type="submit" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              size="sm"
              disabled={isSearching}
            >
              {isSearching ? (
                <RotateCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </form>
          
          {isSearching && (
            <div className="text-center py-12">
              <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-purple-500 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Researching your query...</p>
            </div>
          )}
          
          {searchResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {searchResults.map((result, index) => (
                <Card key={index} className="bg-glass-dark backdrop-blur-lg border border-glass-border p-6 rounded-lg">
                  <div className="prose prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ 
                      __html: result.content
                        .replace(/\n/g, '<br>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    }} />
                  </div>
                  
                  {result.sources && result.sources.length > 0 && (
                    <div className="mt-6 border-t border-gray-700 pt-4">
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <Book className="h-4 w-4 mr-2" />
                        Sources
                      </h3>
                      <div className="space-y-2">
                        {result.sources.map((source: any, idx: number) => (
                          <a
                            key={idx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start p-2 hover:bg-gray-800/50 rounded-md transition-colors"
                          >
                            <div className="flex-shrink-0 mr-3 mt-1">
                              <Globe className="h-4 w-4 text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-blue-400 hover:underline text-sm font-medium">
                                {source.title || source.url}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {source.url}
                              </p>
                            </div>
                            <ExternalLink className="h-3 w-3 text-gray-500 flex-shrink-0 mt-1" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </motion.div>
          )}
          
          {!isSearching && !searchResults && (
            <div className="text-center py-12">
              <Globe className="h-16 w-16 text-gray-700 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-400 mb-2">
                Search the web with AI
              </h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Ask any question and get comprehensive answers with sources and citations from across the web.
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default SearchPage;
