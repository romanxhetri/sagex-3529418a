import React, { useState } from "react";
import { Header } from "@/components/Header";
import { MagicalUniverseScene } from "@/components/MagicalUniverseScene";
import { motion } from "framer-motion";
import { Search as SearchIcon, Sparkles, BookOpen, Wand2 } from "lucide-react"; // Renamed import
import { PerplexitySearch } from "@/components/search/PerplexitySearch";

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    setSearchResults([]);

    // Simulate search delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const dummyResults: SearchResult[] = [
      {
        title: "React Documentation",
        link: "https://reactjs.org/",
        snippet: "The official website for React, a JavaScript library for building user interfaces.",
      },
      {
        title: "Framer Motion",
        link: "https://www.framer.com/motion/",
        snippet: "A production-ready motion library for React. Use spring animations and gestures to bring your interfaces to life.",
      },
      {
        title: "Lucide Icons",
        link: "https://lucide.dev/",
        snippet: "Beautifully simple, pixel-perfect icons. Open source and made with love.",
      },
    ];

    setSearchResults(dummyResults);
    setIsLoading(false);
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      <MagicalUniverseScene />
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
              <SearchIcon className="inline mr-2" size={36} /> {/* Fixed: changed to SearchIcon */}
              AI-Powered Research
            </h1>
            <p className="text-gray-300">
              Get AI-assisted answers with sources from across the web
            </p>
          </div>
          
          <PerplexitySearch />
        </motion.div>
      </main>
    </div>
  );
};

export default Search;
