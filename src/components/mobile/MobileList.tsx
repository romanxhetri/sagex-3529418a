
import React from "react";
import { MobileCard } from "./MobileCard";
import { Mobile } from "@/types/chat";

interface MobileListProps {
  mobiles: Mobile[];
  filter?: string;
}

export const MobileList = ({ mobiles, filter }: MobileListProps) => {
  const filterMobiles = (mobiles: Mobile[], filterText: string = ""): Mobile[] => {
    if (!filterText) return mobiles;
    
    const lowercaseFilter = filterText.toLowerCase();
    
    return mobiles.filter(mobile => {
      // Check various mobile properties for matches
      return (
        mobile.name.toLowerCase().includes(lowercaseFilter) ||
        mobile.brand.toLowerCase().includes(lowercaseFilter) ||
        mobile.processor.toLowerCase().includes(lowercaseFilter) ||
        mobile.ram.toLowerCase().includes(lowercaseFilter) ||
        mobile.category.toLowerCase().includes(lowercaseFilter) ||
        mobile.os.toLowerCase().includes(lowercaseFilter) ||
        mobile.camera.toLowerCase().includes(lowercaseFilter) ||
        // Check for specific requirements
        (lowercaseFilter.includes("camera") && mobile.camera.includes("MP")) ||
        (lowercaseFilter.includes("gaming") && (mobile.processor.includes("Gen 2") || mobile.ram.includes("12GB") || mobile.ram.includes("16GB"))) ||
        (lowercaseFilter.includes("battery") && parseInt(mobile.batteryLife) >= 4500) ||
        (lowercaseFilter.includes("flagship") && mobile.category === "flagship") ||
        (lowercaseFilter.includes("budget") && mobile.price < 300) ||
        (lowercaseFilter.includes("cheap") && mobile.price < 500) ||
        (lowercaseFilter.includes("expensive") && mobile.price > 1000) ||
        (lowercaseFilter.includes("apple") && mobile.brand === "Apple") ||
        (lowercaseFilter.includes("android") && mobile.brand !== "Apple") ||
        // Check for features
        mobile.features?.some(feature => feature.toLowerCase().includes(lowercaseFilter))
      );
    });
  };

  const filteredMobiles = filterMobiles(mobiles, filter);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {filteredMobiles.length > 0 ? (
        filteredMobiles.map((mobile) => (
          <MobileCard key={mobile.id} mobile={mobile} />
        ))
      ) : (
        <div className="col-span-full text-center py-10">
          <p className="text-white text-lg">No smartphones match your criteria. Try adjusting your search! 📱🔍</p>
        </div>
      )}
    </div>
  );
};
