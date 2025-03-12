import React, { useState } from "react";
import { Header } from "@/components/Header";
import { LaptopChat } from "@/components/laptop/LaptopChat";
import { LaptopList } from "@/components/laptop/LaptopList";
import { Laptop } from "@/types/chat";
import { motion } from "framer-motion";
import { LaptopPostForm } from "@/components/LaptopPostForm";
import { Sparkles } from "lucide-react";

// Sample laptops data
const laptopsData: Laptop[] = [
  {
    id: "1",
    name: "MacBook Pro 16",
    brand: "Apple",
    price: 2499,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1626&auto=format&fit=crop",
    processor: "Apple M2 Pro",
    ram: "16GB",
    storage: "512GB SSD",
    display: "16-inch Liquid Retina XDR",
    graphics: "16-core GPU",
    weight: "2.1kg",
    os: "macOS",
    batteryLife: "Up to 22 hours",
    category: "workstation", // Changed from "creative"
    rating: 4.9,
    ports: ["Thunderbolt 4", "HDMI", "SDXC", "MagSafe 3"],
    features: ["ProMotion", "Spatial Audio", "1080p FaceTime HD camera"]
  },
  {
    id: "2",
    name: "Dell XPS 15",
    brand: "Dell",
    price: 1799,
    imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1632&auto=format&fit=crop",
    processor: "Intel Core i9-12900HK",
    ram: "32GB",
    storage: "1TB SSD",
    display: "15.6-inch 4K OLED Touch",
    graphics: "NVIDIA RTX 3050 Ti",
    weight: "1.8kg",
    os: "Windows 11",
    batteryLife: "Up to 12 hours",
    category: "workstation", // Changed from "creative"
    rating: 4.8,
    ports: ["Thunderbolt 4", "USB-C", "SD card", "3.5mm jack"],
    features: ["Carbon fiber design", "Dolby Atmos", "Studio quality webcam"]
  },
  {
    id: "3",
    name: "ASUS ROG Zephyrus G14",
    brand: "ASUS",
    price: 1549,
    imageUrl: "https://images.unsplash.com/photo-1611262584943-9c4a2954033b?q=80&w=1470&auto=format&fit=crop",
    processor: "AMD Ryzen 9 6900HS",
    ram: "16GB",
    storage: "1TB SSD",
    display: "14-inch QHD 120Hz",
    graphics: "AMD Radeon RX 6800S",
    weight: "1.65kg",
    os: "Windows 11",
    batteryLife: "Up to 10 hours",
    category: "gaming",
    rating: 4.7,
    ports: ["USB-C", "USB-A", "HDMI", "3.5mm jack"],
    features: ["AniMe Matrix", "ROG Intelligent Cooling", "Dolby Atmos"]
  },
  {
    id: "4",
    name: "ThinkPad X1 Carbon",
    brand: "Lenovo",
    price: 1499,
    imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1470&auto=format&fit=crop",
    processor: "Intel Core i7-1260P",
    ram: "16GB",
    storage: "512GB SSD",
    display: "14-inch WUXGA IPS",
    graphics: "Intel Iris Xe",
    weight: "1.12kg",
    os: "Windows 11",
    batteryLife: "Up to 14 hours",
    category: "ultrabook", // Changed from "business"
    rating: 4.7,
    ports: ["Thunderbolt 4", "USB-A", "HDMI", "3.5mm jack"],
    features: ["Mil-spec tested", "Fingerprint reader", "TrackPoint"]
  },
  {
    id: "5",
    name: "HP Spectre x360",
    brand: "HP",
    price: 1299,
    imageUrl: "https://images.unsplash.com/photo-1616363939578-9d64a71ca8a7?q=80&w=1470&auto=format&fit=crop",
    processor: "Intel Core i7-1255U",
    ram: "16GB",
    storage: "512GB SSD",
    display: "13.5-inch 3K2K OLED Touch",
    graphics: "Intel Iris Xe",
    weight: "1.36kg",
    os: "Windows 11",
    batteryLife: "Up to 16 hours",
    category: "convertible",
    rating: 4.6,
    ports: ["Thunderbolt 4", "USB-A", "3.5mm jack"],
    features: ["360° hinge", "HP Tilt Pen", "Privacy Camera Shutter"]
  },
  {
    id: "6",
    name: "Acer Aspire 5",
    brand: "Acer",
    price: 649,
    imageUrl: "https://images.unsplash.com/photo-1543539308-9122441474e4?q=80&w=1470&auto=format&fit=crop",
    processor: "AMD Ryzen 5 5625U",
    ram: "8GB",
    storage: "256GB SSD",
    display: "15.6-inch FHD IPS",
    graphics: "AMD Radeon Graphics",
    weight: "1.77kg",
    os: "Windows 11",
    batteryLife: "Up to 8 hours",
    category: "budget",
    rating: 4.3,
    ports: ["USB-C", "USB-A", "HDMI", "Ethernet"],
    features: ["Aluminum top cover", "Wi-Fi 6", "Ergonomic hinge"]
  },
  {
    id: "7",
    name: "Microsoft Surface Laptop 5",
    brand: "Microsoft",
    price: 1299,
    imageUrl: "https://images.unsplash.com/photo-1664997545644-25c98246369c?q=80&w=1470&auto=format&fit=crop",
    processor: "Intel Core i5-1235U",
    ram: "8GB",
    storage: "512GB SSD",
    display: "13.5-inch PixelSense Touch",
    graphics: "Intel Iris Xe",
    weight: "1.27kg",
    os: "Windows 11",
    batteryLife: "Up to 18 hours",
    category: "ultrabook",
    rating: 4.5,
    ports: ["USB-C", "USB-A", "Surface Connect", "3.5mm jack"],
    features: ["Alcantara keyboard", "Omnisonic speakers", "Instant On"]
  },
  {
    id: "8",
    name: "LG Gram 17",
    brand: "LG",
    price: 1699,
    imageUrl: "https://images.unsplash.com/photo-1618424188875-645096dec01a?q=80&w=1548&auto=format&fit=crop",
    processor: "Intel Core i7-1260P",
    ram: "16GB",
    storage: "1TB SSD",
    display: "17-inch WQXGA IPS",
    graphics: "Intel Iris Xe",
    weight: "1.35kg",
    os: "Windows 11",
    batteryLife: "Up to 19.5 hours",
    category: "ultrabook",
    rating: 4.4,
    ports: ["Thunderbolt 4", "USB-A", "HDMI", "3.5mm jack"],
    features: ["Lightweight design", "DTS:X Ultra", "Military standard durability"]
  },
  {
    id: "9",
    name: "Razer Blade 15",
    brand: "Razer",
    price: 2299,
    imageUrl: "https://images.unsplash.com/photo-1606138414441-0a11196f9aed?q=80&w=1470&auto=format&fit=crop",
    processor: "Intel Core i7-12800H",
    ram: "16GB",
    storage: "512GB SSD",
    display: "15.6-inch QHD 240Hz",
    graphics: "NVIDIA RTX 3070 Ti",
    weight: "2.01kg",
    os: "Windows 11",
    batteryLife: "Up to 6 hours",
    category: "gaming",
    rating: 4.6,
    ports: ["Thunderbolt 4", "USB-A", "HDMI", "Ethernet"],
    features: ["Per-key RGB", "Vapor chamber cooling", "THX Spatial Audio"]
  },
  {
    id: "10",
    name: "Alienware m15 R7",
    brand: "Alienware",
    price: 1999,
    imageUrl: "https://i.dell.com/is/image/DellContent//content/dam/dfh/global/products/alienware/laptop-pcs/alienware-m15-r7/media-gallery/ng-alienware-m15-r7-gallery-5.psd?fmt=jpg&wid=4000&hei=3000",
    processor: "AMD Ryzen 9 6900HX",
    ram: "32GB",
    storage: "1TB SSD",
    display: "15.6-inch QHD 240Hz",
    graphics: "NVIDIA RTX 3070 Ti",
    weight: "2.35kg",
    os: "Windows 11",
    batteryLife: "Up to 6 hours",
    category: "gaming",
    rating: 4.5,
    ports: ["USB-C", "USB-A", "HDMI", "Ethernet"],
    features: ["Alienware Cryo-tech", "Dolby Atmos", "Cherry MX keyboard"]
  }
];

const Laptops = () => {
  const [filterQuery, setFilterQuery] = useState<string>("");

  const handleRecommendation = (query: string) => {
    setFilterQuery(query);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
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
              Stellar Laptops 💻✨
              <Sparkles className="ml-2 text-pink-400" />
            </h1>
            <p className="text-gray-300">
              Find your perfect laptop companion with our AI assistant! Tell us what you need, and we'll find the perfect laptop just for you! 🚀
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <LaptopList laptops={laptopsData} filter={filterQuery} />
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
