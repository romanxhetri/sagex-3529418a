
import React from 'react';
import { Header } from "@/components/Header";
import { AISearch } from "@/components/search/AISearch";  // Renamed from PerplexitySearch
import { UniverseBackground } from "@/components/UniverseBackground";

const SearchPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <UniverseBackground weatherType="magic" />
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto">
          <AISearch />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
