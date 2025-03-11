import React, { useState } from "react";
import { Header } from "@/components/Header";
import { MagicalUniverseScene } from "@/components/MagicalUniverseScene";
import { LaptopChat } from "@/components/laptop/LaptopChat";
import { LaptopList } from "@/components/laptop/LaptopList";
import { Laptop } from "@/types/chat";
import { motion } from "framer-motion";
import { Sparkles, Laptop as LaptopIcon } from "lucide-react";

const laptopData: Laptop[] = [
  {
    id: "1",
    name: "XPS 15",
    brand: "Dell",
    price: 1899,
    imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1470&auto=format&fit=crop",
    processor: "Intel Core i7-11800H",
    ram: "16GB DDR4",
    storage: "512GB SSD",
    display: "15.6-inch 4K UHD (3840 x 2160)",
    graphics: "NVIDIA GeForce RTX 3050 Ti",
    batteryLife: "Up to 9 hours",
    weight: "1.8 kg",
    os: "Windows 11 Home",
    category: "creative",
    rating: 4.7
  },
  {
    id: "2",
    name: "MacBook Pro 16",
    brand: "Apple",
    price: 2399,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1452&auto=format&fit=crop",
    processor: "Apple M1 Pro",
    ram: "32GB Unified Memory",
    storage: "1TB SSD",
    display: "16-inch Liquid Retina XDR (3456 x 2234)",
    graphics: "16-core GPU",
    batteryLife: "Up to 14 hours",
    weight: "2.1 kg",
    os: "macOS Monterey",
    category: "creative",
    rating: 4.9
  },
  {
    id: "3",
    name: "ROG Zephyrus G15",
    brand: "ASUS",
    price: 1799,
    imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1468&auto=format&fit=crop",
    processor: "AMD Ryzen 9 5900HS",
    ram: "32GB DDR4",
    storage: "1TB NVMe SSD",
    display: "15.6-inch QHD (2560 x 1440) 165Hz",
    graphics: "NVIDIA GeForce RTX 3070",
    batteryLife: "Up to 8 hours",
    weight: "1.9 kg",
    os: "Windows 11 Home",
    category: "gaming",
    rating: 4.8
  },
  {
    id: "4",
    name: "ThinkPad X1 Carbon",
    brand: "Lenovo",
    price: 1599,
    imageUrl: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=1632&auto=format&fit=crop",
    processor: "Intel Core i7-1165G7",
    ram: "16GB LPDDR4X",
    storage: "512GB SSD",
    display: "14-inch FHD+ (1920 x 1200)",
    graphics: "Intel Iris Xe Graphics",
    batteryLife: "Up to 16 hours",
    weight: "1.13 kg",
    os: "Windows 11 Pro",
    category: "business",
    rating: 4.6
  },
  {
    id: "5",
    name: "Spectre x360",
    brand: "HP",
    price: 1299,
    imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1470&auto=format&fit=crop",
    processor: "Intel Core i7-1165G7",
    ram: "16GB DDR4",
    storage: "1TB SSD",
    display: "13.3-inch 4K OLED",
    graphics: "Intel Iris Xe Graphics",
    batteryLife: "Up to 12 hours",
    weight: "1.27 kg",
    os: "Windows 11 Home",
    category: "creative",
    rating: 4.5
  },
  {
    id: "6",
    name: "Inspiron 15",
    brand: "Dell",
    price: 699,
    imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1470&auto=format&fit=crop",
    processor: "Intel Core i5-1135G7",
    ram: "8GB DDR4",
    storage: "256GB SSD",
    display: "15.6-inch FHD (1920 x 1080)",
    graphics: "Intel Iris Xe Graphics",
    batteryLife: "Up to 7 hours",
    weight: "1.9 kg",
    os: "Windows 11 Home",
    category: "budget",
    rating: 4.2
  },
  {
    id: "7",
    name: "Swift 3",
    brand: "Acer",
    price: 649,
    imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1468&auto=format&fit=crop",
    processor: "AMD Ryzen 5 5500U",
    ram: "8GB LPDDR4X",
    storage: "512GB SSD",
    display: "14-inch FHD (1920 x 1080)",
    graphics: "AMD Radeon Graphics",
    batteryLife: "Up to 10 hours",
    weight: "1.2 kg",
    os: "Windows 11 Home",
    category: "student",
    rating: 4.3
  },
  {
    id: "8",
    name: "Legion 5 Pro",
    brand: "Lenovo",
    price: 1599,
    imageUrl: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=1632&auto=format&fit=crop",
    processor: "AMD Ryzen 7 5800H",
    ram: "16GB DDR4",
    storage: "1TB SSD",
    display: "16-inch QHD (2560 x 1600) 165Hz",
    graphics: "NVIDIA GeForce RTX 3070",
    batteryLife: "Up to 6 hours",
    weight: "2.45 kg",
    os: "Windows 11 Home",
    category: "gaming",
    rating: 4.7
  },
  {
    id: "9",
    name: "Surface Laptop 4",
    brand: "Microsoft",
    price: 1299,
    imageUrl: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=1632&auto=format&fit=crop",
    processor: "AMD Ryzen 7 4980U",
    ram: "16GB LPDDR4X",
    storage: "512GB SSD",
    display: "13.5-inch PixelSense (2256 x 1504)",
    graphics: "AMD Radeon Graphics",
    batteryLife: "Up to 19 hours",
    weight: "1.3 kg",
    os: "Windows 11 Home",
    category: "student",
    rating: 4.5
  }
];

const Laptops = () => {
  const [filterQuery, setFilterQuery] = useState<string>("");

  const handleRecommendation = (query: string) => {
    setFilterQuery(query);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <MagicalUniverseScene />
      <Header />
      
      <main className="container mx-auto px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2 flex items-center">
              <Sparkles className="mr-2 text-purple-400" />
              Premium Laptops 💻✨
              <Sparkles className="ml-2 text-pink-400" />
            </h1>
            <p className="text-gray-300">
              Find the perfect laptop for your needs with our AI assistant! Tell us what you're looking for, and we'll recommend the best options. Your perfect tech companion awaits! 🚀
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <LaptopList laptops={laptopData} filter={filterQuery} />
            </div>
            
            <div className="lg:col-span-1">
              <LaptopChat onRecommendation={handleRecommendation} />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Laptops;
