
import React, { useState } from "react";
import { Laptop } from "@/types/chat";
import { Star, ShoppingCart, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LaptopCardProps {
  laptop: Laptop;
}

export const LaptopCard = ({ laptop }: LaptopCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  const handleBuyNow = () => {
    toast({
      title: "Added to Cart",
      description: `${laptop.name} has been added to your cart!`,
    });
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
          }`}
        />
      ));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "gaming":
        return "bg-red-500";
      case "business":
        return "bg-blue-500";
      case "student":
        return "bg-green-500";
      case "creative":
        return "bg-purple-500";
      case "budget":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="relative bg-glass backdrop-blur-md rounded-lg overflow-hidden border border-glass-border transition-all duration-300 hover:shadow-[0_0_15px_rgba(149,128,255,0.5)] group">
      <div className="absolute top-2 right-2 z-10">
        <span className={`text-xs px-2 py-1 rounded-full text-white ${getCategoryColor(laptop.category)}`}>
          {laptop.category}
        </span>
      </div>
      
      <div className="h-48 overflow-hidden">
        <img
          src={laptop.imageUrl}
          alt={laptop.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-white">{laptop.name}</h3>
            <p className="text-sm text-gray-300">{laptop.brand}</p>
          </div>
          <p className="text-lg font-bold text-purple-400">${laptop.price.toLocaleString()}</p>
        </div>
        
        <div className="flex items-center mt-2 mb-3">
          {renderStars(laptop.rating)}
          <span className="ml-1 text-sm text-gray-300">({laptop.rating.toFixed(1)})</span>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center text-sm text-purple-300 hover:text-purple-200"
          >
            <Info size={16} className="mr-1" />
            {showDetails ? "Hide Details" : "Show Details"}
          </button>
        </div>
        
        {showDetails && (
          <div className="mt-2 space-y-2 text-sm text-gray-300 bg-black/20 p-3 rounded-lg">
            <p><span className="font-medium text-white">Processor:</span> {laptop.processor}</p>
            <p><span className="font-medium text-white">RAM:</span> {laptop.ram}</p>
            <p><span className="font-medium text-white">Storage:</span> {laptop.storage}</p>
            <p><span className="font-medium text-white">Display:</span> {laptop.display}</p>
            <p><span className="font-medium text-white">Graphics:</span> {laptop.graphics}</p>
            <p><span className="font-medium text-white">Battery:</span> {laptop.batteryLife}</p>
            <p><span className="font-medium text-white">Weight:</span> {laptop.weight}</p>
            <p><span className="font-medium text-white">OS:</span> {laptop.os}</p>
          </div>
        )}
        
        <button
          onClick={handleBuyNow}
          className="mt-4 w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center"
        >
          <ShoppingCart size={18} className="mr-2" />
          Buy Now
        </button>
      </div>
    </div>
  );
};
