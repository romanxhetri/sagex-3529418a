import React from "react";
import { LaptopCard } from "./LaptopCard";
import { Laptop } from "@/types/chat";

interface LaptopListProps {
  laptops: Laptop[];
  filter?: string;
}

export const LaptopList = ({ laptops, filter }: LaptopListProps) => {
  const filterLaptops = (laptops: Laptop[], filterText: string = ""): Laptop[] => {
    if (!filterText) return laptops;
    
    const lowercaseFilter = filterText.toLowerCase();
    
    return laptops.filter(laptop => {
      return (
        laptop.name.toLowerCase().includes(lowercaseFilter) ||
        laptop.brand.toLowerCase().includes(lowercaseFilter) ||
        laptop.processor.toLowerCase().includes(lowercaseFilter) ||
        laptop.ram.toLowerCase().includes(lowercaseFilter) ||
        laptop.category.toLowerCase().includes(lowercaseFilter) ||
        laptop.os.toLowerCase().includes(lowercaseFilter) ||
        // Price range checks
        (lowercaseFilter.includes("cheap") && laptop.price < 800) ||
        (lowercaseFilter.includes("expensive") && laptop.price > 1500) ||
        (lowercaseFilter.includes("mid-range") && laptop.price >= 800 && laptop.price <= 1500)
      );
    });
  };

  const filteredLaptops = filterLaptops(laptops, filter);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredLaptops.length > 0 ? (
        filteredLaptops.map((laptop) => (
          <LaptopCard key={laptop.id} laptop={laptop} />
        ))
      ) : (
        <div className="col-span-full text-center py-10">
          <p className="text-white text-lg">No laptops match your criteria. Try adjusting your search.</p>
        </div>
      )}
    </div>
  );
};
