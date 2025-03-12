import React, { useState } from 'react';
import { Search, Send, Zap, Globe, Book, Brain } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const AISearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast("Please enter a search query");
      return;
    }

    setLoading(true);
    setSearchResults(null);

    try {
      // Simulate AI search processing
      setThinking(`Analyzing query: "${searchQuery}"\n\nSearching and analyzing multiple sources...`);
      
      setTimeout(() => {
        const simulatedResponse = `# Results for: ${searchQuery}

## Key Findings
${generateSimulatedResponse(searchQuery)}

Sources: Latest research papers, tech blogs, and expert analysis from 2024`;

        setSearchResults(simulatedResponse);
        setThinking(null);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to complete search');
      setLoading(false);
      setThinking(null);
    }
  };

  const generateSimulatedResponse = (query: string): string => {
    const topics = {
      technology: [
        "Latest advancements in AI and machine learning",
        "Emerging trends in software development",
        "Breakthroughs in quantum computing",
        "Updates in cybersecurity"
      ],
      science: [
        "Recent discoveries in astronomy",
        "Developments in renewable energy",
        "Advances in medical research",
        "Climate science findings"
      ],
      general: [
        "Current global trends",
        "Educational resources",
        "Expert opinions",
        "Latest developments"
      ]
    };

    const lowerQuery = query.toLowerCase();
    let category = topics.general;

    if (lowerQuery.includes('tech') || lowerQuery.includes('computer') || lowerQuery.includes('ai')) {
      category = topics.technology;
    } else if (lowerQuery.includes('science') || lowerQuery.includes('research') || lowerQuery.includes('study')) {
      category = topics.science;
    }

    return category.map(topic => `- ${topic}`).join('\n');
  };

  return (
    <div className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-glass-border">
        <div className="flex items-center mb-4">
          <Search className="text-purple-400 mr-2" size={20} />
          <h2 className="text-xl font-semibold text-white">AI-Powered Search</h2>
        </div>
        
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anything with AI..."
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
            onClick={() => setSearchQuery("Latest technology trends")}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300"
          >
            Technology Trends
          </button>
          <button 
            onClick={() => setSearchQuery("Breakthroughs in medical research")}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300"
          >
            Medical Research
          </button>
          <button 
            onClick={() => setSearchQuery("Developments in renewable energy")}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300"
          >
            Renewable Energy
          </button>
        </div>
      </div>
      
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
                <span>AI-Powered</span>
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
              Search with AI
            </h3>
            <p className="text-sm text-gray-500 max-w-md">
              Get comprehensive answers with AI-powered analysis. 
              Start by typing your query above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
