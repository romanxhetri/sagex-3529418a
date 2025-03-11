
import React, { useState } from 'react';
import { Search, Send, Zap, Globe, Book, Brain } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PerplexitySearchProps {
  onSearch?: (query: string, results: any) => void;
}

export const PerplexitySearch: React.FC<PerplexitySearchProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [thinking, setThinking] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast("Please enter a search query");
      return;
    }
    
    if (!apiKey && !showApiKeyInput) {
      setShowApiKeyInput(true);
      return;
    }
    
    setLoading(true);
    setSearchResults(null);
    
    // Show thinking process
    setThinking(`Analyzing query: "${searchQuery}"
    
1. 🔍 Gathering Information
   - Searching relevant web sources
   - Checking most recent data
   - Identifying key information needs

2. 🧠 Processing Information
   - Evaluating source quality and relevance
   - Cross-referencing information for accuracy
   - Organizing data into coherent structure

3. 💡 Synthesizing Insights
   - Identifying patterns and connections
   - Developing comprehensive understanding
   - Formulating clarifying explanations

4. 📊 Preparing Results
   - Summarizing key findings
   - Citing relevant sources
   - Organizing information for readability`);
    
    try {
      // Simulate Perplexity API call
      setTimeout(async () => {
        // In production, use actual API call
        /* Example real implementation:
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
                content: 'You are a helpful research assistant. Provide comprehensive, accurate information with citations.'
              },
              {
                role: 'user',
                content: searchQuery
              }
            ],
            temperature: 0.2,
            max_tokens: 1000,
            return_related_questions: true,
            search_domain_filter: [],
            search_recency_filter: 'month',
          }),
        });
        
        const data = await response.json();
        const result = data.choices[0].message.content;
        */
        
        // Simulated response for now
        const result = `# Results for: ${searchQuery}

## Key Findings
${searchQuery.toLowerCase().includes('laptop') ? 
  `The latest laptops in 2023 include models from Apple, Dell, and HP with significant improvements in performance and battery life.

### Performance Highlights
- Apple M2 MacBooks offer exceptional performance with up to 20 hours of battery life
- Dell XPS series now features Intel's 13th generation processors
- HP Spectre models combine premium design with powerful hardware

### Price Ranges
- Budget options: $500-$800
- Mid-range: $800-$1500
- Premium: $1500-$3000+

Source: TechRadar, July 2023` : 
searchQuery.toLowerCase().includes('phone') || searchQuery.toLowerCase().includes('mobile') ?
  `Recent smartphone releases feature significant camera improvements and faster processors.

### Top Models
- iPhone 15 Pro with A17 Pro chip and 48MP camera
- Samsung Galaxy S23 Ultra with 200MP camera and Snapdragon 8 Gen 2
- Google Pixel 8 Pro with enhanced AI features

### Consumer Trends
- Increased focus on camera capabilities
- Longer software support (5+ years)
- Sustainability features becoming more prominent

Source: CNET, September 2023` :
  `Research on "${searchQuery}" reveals several important insights:

1. The topic has seen increased interest in recent months
2. Several authoritative sources provide comprehensive information
3. There are differing perspectives that should be considered

Recent developments suggest this will continue to be an area of focus in coming years.

Sources: Research journals, news articles, and academic publications from 2023`}`;

        setSearchResults(result);
        setThinking(null);
        setLoading(false);
        
        if (onSearch) {
          onSearch(searchQuery, result);
        }
      }, 3000);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to complete search');
      setLoading(false);
      setThinking(null);
    }
  };

  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    // Store the API key in local storage
    localStorage.setItem('perplexity_api_key', apiKey);
    setShowApiKeyInput(false);
    toast.success('API key saved');
    
    // Automatically trigger search
    handleSearch({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <div className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-glass-border">
        <div className="flex items-center mb-4">
          <Search className="text-purple-400 mr-2" size={20} />
          <h2 className="text-xl font-semibold text-white">Perplexity AI Search</h2>
        </div>
        
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anything with AI-powered research..."
            className="w-full p-3 pl-4 pr-12 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50"
            disabled={loading || !searchQuery.trim()}
          >
            {loading ? (
              <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full" />
            ) : (
              <Send size={16} className="text-white" />
            )}
          </button>
        </form>
        
        <div className="mt-2 flex flex-wrap gap-2">
          <button 
            onClick={() => setSearchQuery("Latest high-performance laptops")}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300"
          >
            High-performance laptops
          </button>
          <button 
            onClick={() => setSearchQuery("Best smartphone cameras 2023")}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300"
          >
            Best smartphone cameras
          </button>
          <button 
            onClick={() => setSearchQuery("AI technology trends")}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300"
          >
            AI technology trends
          </button>
        </div>
      </div>
      
      {showApiKeyInput && (
        <div className="p-4 border-b border-glass-border bg-gray-800/50">
          <h3 className="text-sm font-medium text-white mb-2">Enter your Perplexity API key to continue</h3>
          <div className="flex space-x-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="pk-xxxxxxxx"
              className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Button 
              onClick={handleApiKeySubmit}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Save
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Your API key is stored locally and never sent to our servers.
          </p>
        </div>
      )}
      
      <div className="p-4">
        {thinking && (
          <div className="bg-gray-800/50 rounded-lg p-4 animate-pulse">
            <div className="flex items-center mb-2">
              <Brain className="text-purple-400 mr-2" size={16} />
              <h3 className="text-sm font-medium text-white">Thinking Process</h3>
            </div>
            <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
              {thinking}
            </pre>
          </div>
        )}
        
        {searchResults && (
          <div className="bg-gray-800/50 rounded-lg p-4 markdown-content">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Globe className="text-blue-400 mr-2" size={16} />
                <h3 className="text-sm font-medium text-white">Search Results</h3>
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <Zap size={12} className="mr-1" />
                <span>Powered by Perplexity AI</span>
              </div>
            </div>
            <div className="prose prose-invert max-w-none prose-sm">
              <div className="markdown text-gray-300 text-sm">
                {searchResults.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={i} className="text-xl font-bold text-white mt-2 mb-4">{line.replace('# ', '')}</h1>;
                  } else if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-lg font-semibold text-white mt-4 mb-2">{line.replace('## ', '')}</h2>;
                  } else if (line.startsWith('### ')) {
                    return <h3 key={i} className="text-md font-semibold text-gray-200 mt-3 mb-1">{line.replace('### ', '')}</h3>;
                  } else if (line.startsWith('- ')) {
                    return <li key={i} className="ml-4 text-gray-300">{line.replace('- ', '')}</li>;
                  } else if (line.startsWith('Source:')) {
                    return <div key={i} className="mt-4 text-xs text-gray-400 italic">{line}</div>;
                  } else if (line.trim() === '') {
                    return <br key={i} />;
                  } else {
                    return <p key={i} className="my-2 text-gray-300">{line}</p>;
                  }
                })}
              </div>
            </div>
          </div>
        )}
        
        {!thinking && !searchResults && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Book className="text-gray-600 mb-3" size={48} />
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              Search with AI-powered research
            </h3>
            <p className="text-sm text-gray-500 max-w-md">
              Get comprehensive answers with citations from reliable sources across the web. 
              Start by typing your query above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
