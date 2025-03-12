import React, { useState } from "react";
import { Header } from "@/components/Header";
import { MagicalUniverseScene } from "@/components/MagicalUniverseScene";
import { LaptopChat } from "@/components/laptop/LaptopChat";
import { LaptopList } from "@/components/laptop/LaptopList";
import { Laptop } from "@/types/chat";
import { motion } from "framer-motion";
import { Sparkles, Laptop as LaptopIcon } from "lucide-react";

const Laptops = () => {
  const [filterQuery, setFilterQuery] = useState<string>("");

  const handleRecommendation = (query: string) => {
    setFilterQuery(query);
  };

  const defaultLaptops: Laptop[] = [
    {
      id: "1",
      name: "XPS 15",
      brand: "Dell",
      price: 1899,
      priceNPR: 247000,
      processor: "Intel Core i9-13900H",
      ram: "32GB DDR5",
      storage: "1TB SSD",
      display: '15.6" 4K OLED Touch',
      graphics: "NVIDIA RTX 4070 8GB",
      battery: "86Whr",
      batteryLife: "10 hours",
      weight: "1.8 kg",
      os: "Windows 11 Pro",
      color: "Platinum Silver",
      image: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/black/notebook-xps-15-9530-black-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=402&qlt=100,1&resMode=sharp2&size=402,402",
      imageUrl: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/black/notebook-xps-15-9530-black-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=402&qlt=100,1&resMode=sharp2&size=402,402",
      inStock: true,
      rating: 4.8,
      featured: true,
      category: "creative",
      ports: ["USB-C", "Thunderbolt 4", "SD Card", "3.5mm Audio"],
      features: ["Fingerprint Reader", "Backlit Keyboard", "Windows Hello"]
    },
    {
      id: "2",
      name: "MacBook Pro 16",
      brand: "Apple",
      price: 2499,
      priceNPR: 325000,
      processor: "Apple M2 Max",
      ram: "32GB Unified Memory",
      storage: "1TB SSD",
      display: '16.2" Liquid Retina XDR',
      graphics: "Integrated 38-Core GPU",
      battery: "100Wh",
      batteryLife: "12 hours",
      weight: "2.16 kg",
      os: "macOS Ventura",
      color: "Space Gray",
      image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spacegray-select-202301?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1673369844704",
      imageUrl: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spacegray-select-202301?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1673369844704",
      inStock: true,
      rating: 4.9,
      featured: true,
      category: "creative",
      ports: ["Thunderbolt 4", "HDMI", "SD Card", "3.5mm Audio", "MagSafe 3"],
      features: ["Touch ID", "Force Touch Trackpad", "Spatial Audio"]
    },
    {
      id: "3",
      name: "ROG Zephyrus G14",
      brand: "ASUS",
      price: 1549,
      priceNPR: 201000,
      processor: "AMD Ryzen 9 7940HS",
      ram: "16GB DDR5",
      storage: "1TB SSD",
      display: '14" QHD+ 165Hz',
      graphics: "NVIDIA RTX 4060 8GB",
      battery: "76Wh",
      batteryLife: "9 hours",
      weight: "1.65 kg",
      os: "Windows 11 Home",
      color: "Moonlight White",
      image: "https://dlcdnwebimgs.asus.com/gain/7383b9c9-1993-419c-b941-933e39e49c64/",
      imageUrl: "https://dlcdnwebimgs.asus.com/gain/7383b9c9-1993-419c-b941-933e39e49c64/",
      inStock: true,
      rating: 4.7,
      featured: true,
      category: "gaming",
      ports: ["USB-C", "USB-A", "HDMI", "3.5mm Audio"],
      features: ["AniMe Matrix", "ROG Intelligent Cooling", "Dolby Atmos"]
    },
    {
      id: "4",
      name: "ThinkPad X1 Carbon",
      brand: "Lenovo",
      price: 1679,
      priceNPR: 218000,
      processor: "Intel Core i7-1365U",
      ram: "16GB LPDDR5",
      storage: "512GB SSD",
      display: '14" WUXGA IPS',
      graphics: "Intel Iris Xe Graphics",
      battery: "57Wh",
      batteryLife: "11 hours",
      weight: "1.12 kg",
      os: "Windows 11 Pro",
      color: "Black",
      image: "https://www.lenovo.com/medias/lenovo-laptop-thinkpad-x1-carbon-gen-11-hero.png?context=bWFzdGVyfHJvb3R8MTQzOTI0fGltYWdlL3BuZ3xoYzgvaDkyLzMzMjk2MzQ4NzY0MTkwLnBua3wzNjQ4ZWY5MjM2ODQ4YjM3YjQ4M2I3Y2Q4ZjQ4YjU4NmE0M2QzN2E0NjQ4M2Q0Y2Q4YmQzYjQ4YjQzNzQ",
      imageUrl: "https://www.lenovo.com/medias/lenovo-laptop-thinkpad-x1-carbon-gen-11-hero.png?context=bWFzdGVyfHJvb3R8MTQzOTI0fGltYWdlL3BuZ3xoYzgvaDkyLzMzMjk2MzQ4NzY0MTkwLnBua3wzNjQ4ZWY5MjM2ODQ4YjM3YjQ4M2I3Y2Q4ZjQ4YjU4NmE0M2QzN2E0NjQ4M2Q0Y2Q4YmQzYjQ4YjQzNzQ",
      inStock: true,
      rating: 4.6,
      featured: false,
      category: "business",
      ports: ["Thunderbolt 4", "USB-A", "HDMI", "3.5mm Audio"],
      features: ["Fingerprint Reader", "Privacy Shutter", "MIL-STD 810H"]
    },
    {
      id: "5",
      name: "Surface Laptop 5",
      brand: "Microsoft",
      price: 1299,
      priceNPR: 169000,
      processor: "Intel Core i5-1235U",
      ram: "8GB LPDDR5",
      storage: "512GB SSD",
      display: '13.5" PixelSense Touch',
      graphics: "Intel Iris Xe Graphics",
      battery: "47Wh",
      batteryLife: "10 hours",
      weight: "1.27 kg",
      os: "Windows 11 Home",
      color: "Platinum",
      image: "https://img-prod-cms-rt-microsoft.crtd.o",
    }
  ];

  return (
    <motion.div>
      <Header />
      <MagicalUniverseScene />
      <LaptopChat />
      <LaptopList laptops={defaultLaptops} onRecommendation={handleRecommendation} />
    </motion.div>
  );
};

export default Laptops;
