
import React, { useState } from "react";
import { Mobile } from "@/types/chat";
import { Star, ShoppingCart, Info, Camera, Battery, Award, Cpu, Smartphone, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MobileCardProps {
  mobile: Mobile;
}

export const MobileCard = ({ mobile }: MobileCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const { toast } = useToast();

  const handleBuyNow = () => {
    toast({
      title: "🎉 Added to Cart! 🛒",
      description: `${mobile.name} will be yours soon! Your friends will be soooo jealous! 😎`,
    });
  };

  const handleViewVideo = () => {
    setShowVideo(!showVideo);
    if (!showVideo) {
      toast({
        title: "🎬 Video Preview",
        description: "Experience the phone in action! (Demo video)",
      });
    }
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
      case "flagship":
        return "bg-indigo-500";
      case "midrange":
        return "bg-teal-500";
      case "budget":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRandomJoke = () => {
    const jokes = [
      "It's so good, Siri is jealous! 🤭",
      "Buy this phone or your current one will cry! 😢",
      "So fast, it arrives before you order! ⚡",
      "Camera so good, it captures your thoughts! 🧠📸",
      "Battery lasts longer than most relationships! 💘",
      "Makes other phones look like calculators! 🧮",
      "So smart, it finished this joke for me... 🤣"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  };

  return (
    <div className="relative bg-glass backdrop-blur-md rounded-lg overflow-hidden border border-glass-border transition-all duration-300 hover:shadow-[0_0_15px_rgba(149,128,255,0.5)] group">
      <div className="absolute top-2 right-2 z-10">
        <span className={`text-xs px-2 py-1 rounded-full text-white ${getCategoryColor(mobile.category)}`}>
          {mobile.category}
        </span>
      </div>
      
      <div className="h-48 overflow-hidden relative">
        <img
          src={mobile.imageUrl}
          alt={mobile.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Fun overlay sticker */}
        <div className="absolute bottom-2 left-2 bg-purple-600/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
          {getRandomJoke()}
        </div>
        
        {/* Video button */}
        <button 
          onClick={handleViewVideo}
          className="absolute top-2 left-2 bg-black/50 text-white p-1 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
        >
          <Video size={16} />
        </button>
      </div>
      
      {showVideo && (
        <div className="p-2 bg-black/30">
          <div className="aspect-video w-full bg-black/50 rounded flex items-center justify-center">
            <div className="text-center p-4">
              <Video className="mx-auto mb-2" size={32} />
              <p className="text-sm text-gray-300">
                Video preview would play here! 🎬
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-white">{mobile.name}</h3>
            <p className="text-sm text-gray-300">{mobile.brand}</p>
          </div>
          <p className="text-lg font-bold text-purple-400">${mobile.price.toLocaleString()}</p>
        </div>
        
        <div className="flex items-center mt-2 mb-3">
          {renderStars(mobile.rating)}
          <span className="ml-1 text-sm text-gray-300">({mobile.rating.toFixed(1)})</span>
        </div>
        
        {/* Quick Specs */}
        <div className="grid grid-cols-2 gap-2 my-2 text-xs">
          <div className="flex items-center text-gray-300">
            <Cpu size={12} className="mr-1 text-blue-400" />
            {mobile.processor}
          </div>
          <div className="flex items-center text-gray-300">
            <Battery size={12} className="mr-1 text-green-400" />
            {mobile.batteryLife}
          </div>
          <div className="flex items-center text-gray-300">
            <Camera size={12} className="mr-1 text-red-400" />
            {mobile.camera.split(" ")[0]} {/* Just show the main camera */}
          </div>
          <div className="flex items-center text-gray-300">
            <Smartphone size={12} className="mr-1 text-yellow-400" />
            {mobile.display.split(" ")[0]}"
          </div>
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
            <p><span className="font-medium text-white">Processor:</span> {mobile.processor}</p>
            <p><span className="font-medium text-white">RAM:</span> {mobile.ram}</p>
            <p><span className="font-medium text-white">Storage:</span> {mobile.storage}</p>
            <p><span className="font-medium text-white">Display:</span> {mobile.display}</p>
            <p><span className="font-medium text-white">Camera:</span> {mobile.camera}</p>
            <p><span className="font-medium text-white">Battery:</span> {mobile.batteryLife}</p>
            <p><span className="font-medium text-white">Weight:</span> {mobile.weight}</p>
            <p><span className="font-medium text-white">OS:</span> {mobile.os}</p>
            
            {mobile.features && mobile.features.length > 0 && (
              <div>
                <span className="font-medium text-white">Special Features:</span>
                <ul className="list-disc list-inside pl-2 pt-1">
                  {mobile.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Award size={12} className="mr-1 mt-1 text-purple-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        <button
          onClick={handleBuyNow}
          className="mt-4 w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center group"
        >
          <ShoppingCart size={18} className="mr-2 group-hover:animate-bounce" />
          Buy Now! 🔥
        </button>
      </div>
    </div>
  );
};
