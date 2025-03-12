
import React, { useState } from "react";
import { Header } from "@/components/Header";
import { MagicalUniverseScene } from "@/components/MagicalUniverseScene";
import { MobileChat } from "@/components/mobile/MobileChat";
import { MobileList } from "@/components/mobile/MobileList";
import { Mobile } from "@/types/chat";
import { motion } from "framer-motion";
import { Sparkles, Smartphone } from "lucide-react";

const mobileData: Mobile[] = [
  {
    id: "1",
    name: "Galaxy S23 Ultra",
    brand: "Samsung",
    price: 1199,
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1471&auto=format&fit=crop",
    processor: "Snapdragon 8 Gen 2",
    ram: "12GB",
    storage: "512GB",
    display: "6.8-inch Dynamic AMOLED 2X (3088 x 1440)",
    camera: "200MP wide + 12MP ultrawide + 10MP telephoto + 10MP telephoto",
    batteryLife: "5000mAh",
    weight: "234g",
    os: "Android 13",
    category: "flagship",
    rating: 4.8,
    features: ["S Pen", "IP68 water resistance", "45W fast charging"]
  },
  {
    id: "2",
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    price: 1199,
    imageUrl: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?q=80&w=1480&auto=format&fit=crop",
    processor: "A17 Pro",
    ram: "8GB",
    storage: "1TB",
    display: "6.7-inch Super Retina XDR (2796 x 1290)",
    camera: "48MP wide + 12MP ultrawide + 12MP telephoto",
    batteryLife: "4422mAh",
    weight: "221g",
    os: "iOS 17",
    category: "flagship",
    rating: 4.9,
    features: ["Dynamic Island", "ProMotion", "Action button"]
  },
  {
    id: "3",
    name: "Pixel 7 Pro",
    brand: "Google",
    price: 899,
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1527&auto=format&fit=crop",
    processor: "Google Tensor G2",
    ram: "12GB",
    storage: "256GB",
    display: "6.7-inch LTPO OLED (3120 x 1440)",
    camera: "50MP wide + 12MP ultrawide + 48MP telephoto",
    batteryLife: "5000mAh",
    weight: "212g",
    os: "Android 13",
    category: "flagship",
    rating: 4.7,
    features: ["Magic Eraser", "Face Unlock", "30W fast charging"]
  },
  {
    id: "4",
    name: "Nothing Phone (2)",
    brand: "Nothing",
    price: 699,
    imageUrl: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1481&auto=format&fit=crop",
    processor: "Snapdragon 8+ Gen 1",
    ram: "12GB",
    storage: "256GB",
    display: "6.7-inch LTPO OLED (2412 x 1080)",
    camera: "50MP wide + 50MP ultrawide",
    batteryLife: "4700mAh",
    weight: "201g",
    os: "Nothing OS 2.0",
    category: "mid-range", // Fixed: changed from "midrange" to "mid-range"
    rating: 4.5,
    features: ["Glyph Interface", "45W fast charging", "Wireless charging"]
  },
  {
    id: "5",
    name: "OnePlus 11",
    brand: "OnePlus",
    price: 699,
    imageUrl: "https://images.unsplash.com/photo-1681479036290-2b54aae106ef?q=80&w=1372&auto=format&fit=crop",
    processor: "Snapdragon 8 Gen 2",
    ram: "16GB",
    storage: "256GB",
    display: "6.7-inch AMOLED (3216 x 1440)",
    camera: "50MP wide + 48MP ultrawide + 32MP portrait",
    batteryLife: "5000mAh",
    weight: "205g",
    os: "OxygenOS 13",
    category: "flagship",
    rating: 4.6,
    features: ["100W SUPERVOOC charging", "Hasselblad camera", "Alert slider"]
  },
  {
    id: "6",
    name: "Moto G Power",
    brand: "Motorola",
    price: 249,
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1527&auto=format&fit=crop",
    processor: "Snapdragon 662",
    ram: "4GB",
    storage: "64GB",
    display: "6.6-inch IPS LCD (1600 x 720)",
    camera: "48MP wide + 2MP macro + 2MP depth",
    batteryLife: "5000mAh",
    weight: "206g",
    os: "Android 11",
    category: "budget",
    rating: 4.2,
    features: ["3-day battery life", "10W charging", "Water-repellent design"]
  },
  {
    id: "7",
    name: "Xiaomi 13",
    brand: "Xiaomi",
    price: 799,
    imageUrl: "https://images.unsplash.com/photo-1557180295-76eee20ae8aa?q=80&w=1480&auto=format&fit=crop",
    processor: "Snapdragon 8 Gen 2",
    ram: "12GB",
    storage: "256GB",
    display: "6.36-inch AMOLED (2400 x 1080)",
    camera: "50MP wide + 12MP ultrawide + 10MP telephoto",
    batteryLife: "4500mAh",
    weight: "189g",
    os: "MIUI 14",
    category: "flagship",
    rating: 4.5,
    features: ["67W turbo charging", "Leica optics", "IP68 rating"]
  },
  {
    id: "8",
    name: "Galaxy A54",
    brand: "Samsung",
    price: 449,
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1471&auto=format&fit=crop",
    processor: "Exynos 1380",
    ram: "8GB",
    storage: "128GB",
    display: "6.4-inch Super AMOLED (2340 x 1080)",
    camera: "50MP wide + 12MP ultrawide + 5MP macro",
    batteryLife: "5000mAh",
    weight: "202g",
    os: "Android 13",
    category: "mid-range", // Fixed from "midrange" to "mid-range"
    rating: 4.3,
    features: ["IP67 water resistance", "Stereo speakers", "25W fast charging"]
  }
];

const Mobiles = () => {
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
              Stellar Smartphones 📱✨
              <Sparkles className="ml-2 text-pink-400" />
            </h1>
            <p className="text-gray-300">
              Find your perfect pocket companion with our AI assistant! Tell us what you need, and we'll find the perfect mobile just for you! 🚀 LOL, your current phone is probably crying right now... 😂
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <MobileList mobiles={mobileData} filter={filterQuery} />
            </div>
            
            <div className="lg:col-span-1">
              <MobileChat onRecommendation={handleRecommendation} />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Mobiles;
