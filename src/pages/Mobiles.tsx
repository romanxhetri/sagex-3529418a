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
    category: "midrange",
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
    category: "midrange",
    rating: 4.3,
    features: ["IP67 water resistance", "Stereo speakers", "25W fast charging"]
  }
];

const Mobiles = () => {
  const [filterQuery, setFilterQuery] = useState<string>("");

  const handleRecommendation = (query: string) => {
    setFilterQuery(query);
  };

  const defaultMobiles: Mobile[] = [
    {
      id: "m1",
      name: "Galaxy S24 Ultra",
      brand: "Samsung",
      price: 1299,
      priceNPR: 170000,
      camera: "200MP + 50MP + 12MP",
      display: "6.8-inch Dynamic AMOLED 2X, 120Hz",
      processor: "Snapdragon 8 Gen 3",
      ram: "16GB",
      storage: "512GB",
      battery: "5000mAh",
      color: "Titanium Black",
      os: "Android 14",
      image: "/mobiles/galaxy-s24-ultra.jpg",
      imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/uk/2401/gallery/uk-galaxy-s24-ultra-s928-sm-s928bzkcxeu-thumb-538643182",
      inStock: true,
      rating: 4.9,
      featured: true,
      weight: "233g",
      features: ["AI Features", "S-Pen", "8K Video", "IP68"],
      category: "flagship"
    },
    {
      id: "m2",
      name: "iPhone 16 Pro Max",
      brand: "Apple",
      price: 1399,
      priceNPR: 182000,
      camera: "48MP + 12MP + 12MP",
      display: "6.9-inch Super Retina XDR, 120Hz",
      processor: "A18 Bionic",
      ram: "12GB",
      storage: "1TB",
      battery: "4800mAh",
      color: "Space Black",
      os: "iOS 18",
      image: "/mobiles/iphone-16-pro-max.jpg",
      imageUrl: "https://www.trustedreviews.com/wp-content/uploads/sites/54/2023/09/iPhone-15-Pro-Max-review-24.jpg",
      inStock: true,
      rating: 5.0,
      featured: true,
      weight: "221g",
      features: ["Dynamic Island", "ProMotion", "Action Button", "Ceramic Shield"],
      category: "flagship"
    },
    {
      id: "m3",
      name: "Pixel 9 Pro",
      brand: "Google",
      price: 1099,
      priceNPR: 143000,
      camera: "50MP + 48MP + 12MP",
      display: "6.7-inch LTPO OLED, 120Hz",
      processor: "Google Tensor G5",
      ram: "12GB",
      storage: "512GB",
      battery: "5100mAh",
      color: "Obsidian Black",
      os: "Android 15",
      image: "/mobiles/pixel-9-pro.jpg",
      imageUrl: "https://www.androidauthority.com/wp-content/uploads/2022/10/Google-Pixel-7-Pro-back-13.jpg",
      inStock: true,
      rating: 4.8,
      weight: "212g",
      features: ["Magic Eraser", "Face Unlock", "Titan M2 Security"],
      category: "flagship"
    },
    {
      id: "m4",
      name: "Xiaomi 15 Pro",
      brand: "Xiaomi",
      price: 899,
      priceNPR: 117000,
      camera: "50MP + 50MP + 12MP",
      display: "6.7-inch AMOLED, 144Hz",
      processor: "Snapdragon 8 Gen 4",
      ram: "12GB",
      storage: "256GB",
      battery: "4800mAh",
      color: "Ceramic White",
      os: "MIUI 16",
      image: "/mobiles/xiaomi-15-pro.jpg",
      imageUrl: "https://www.gizmochina.com/wp-content/uploads/2023/10/xiaomi_14_pro_specs_price_featured.jpg",
      inStock: true,
      rating: 4.7,
      weight: "198g",
      features: ["120W HyperCharge", "Leica Optics", "IP68"],
      category: "flagship"
    },
    {
      id: "m5",
      name: "OnePlus Nord CE 3",
      brand: "OnePlus",
      price: 329,
      priceNPR: 43000,
      camera: "50MP + 8MP + 2MP",
      display: "6.7-inch Fluid AMOLED, 120Hz",
      processor: "Snapdragon 782G",
      ram: "8GB",
      storage: "256GB",
      battery: "5000mAh",
      color: "Aqua Surge",
      os: "OxygenOS 13.1",
      image: "/mobiles/oneplus-nord-ce-3.jpg",
      imageUrl: "https://www.91-img.com/gallery_images_uploads/d/7/d7cf5e2b1a3a3dfcf25814c75ecd7b2c1642cca7.jpg",
      inStock: true,
      rating: 4.1,
      weight: "184g",
      features: ["67W SUPERVOOC", "Dual Speakers", "Gaming Mode"],
      category: "mid-range"
    },
    {
      id: "m6",
      name: "Samsung Galaxy A55",
      brand: "Samsung",
      price: 449,
      priceNPR: 58000,
      camera: "50MP + 12MP + 5MP",
      display: "6.6-inch Super AMOLED, 120Hz",
      processor: "Exynos 1480",
      ram: "8GB",
      storage: "128GB",
      battery: "5000mAh",
      color: "Awesome Ice Blue",
      os: "Android 14",
      image: "/mobiles/samsung-galaxy-a55.jpg",
      imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/in/sm-a546elgdinu/gallery/in-galaxy-a54-5g-a546-sm-a546elgdinu-536693081?$720_N_JPG$",
      inStock: true,
      rating: 4.3,
      weight: "202g",
      features: ["IP67", "Stereo Speakers", "Samsung Knox"],
      category: "mid-range"
    },
    {
      id: "m7",
      name: "Realme GT 6",
      brand: "Realme",
      price: 549,
      priceNPR: 71000,
      camera: "50MP + 8MP + 2MP",
      display: "6.78-inch AMOLED, 144Hz",
      processor: "Snapdragon 8s Gen 3",
      ram: "12GB",
      storage: "256GB",
      battery: "5500mAh",
      color: "Fluid Silver",
      os: "Realme UI 5.0",
      image: "/mobiles/realme-gt-6.jpg",
      imageUrl: "https://static.digit.in/default/944795384c79c2cdef870c9f9d1a4f154c46c985.jpeg",
      inStock: true,
      rating: 4.6,
      weight: "191g",
      features: ["120W SuperDart", "GT Mode", "Vapor Cooling"],
      category: "mid-range"
    },
    {
      id: "m8",
      name: "Poco X6 Pro",
      brand: "Poco",
      price: 369,
      priceNPR: 48000,
      camera: "64MP + 8MP + 2MP",
      display: "6.67-inch AMOLED, 120Hz",
      processor: "MediaTek Dimensity 8300-Ultra",
      ram: "8GB",
      storage: "256GB",
      battery: "5000mAh",
      color: "Racing Grey",
      os: "HyperOS",
      image: "/mobiles/poco-x6-pro.jpg",
      imageUrl: "https://www.notebookcheck.net/uploads/tx_nbc2article/v6/Poco_X6_Pro_5G_Teaser.png",
      inStock: true,
      rating: 4.4,
      weight: "186g",
      features: ["67W Turbo Charging", "LiquidCool", "Gaming Turbo"],
      category: "mid-range"
    },
    {
      id: "m9",
      name: "Redmi Note 13 Pro",
      brand: "Xiaomi",
      price: 299,
      priceNPR: 39000,
      camera: "108MP + 8MP + 2MP",
      display: "6.67-inch AMOLED, 120Hz",
      processor: "MediaTek Dimensity 7050",
      ram: "8GB",
      storage: "256GB",
      battery: "5100mAh",
      color: "Midnight Black",
      os: "MIUI 14",
      image: "/mobiles/redmi-note-13-pro.jpg",
      imageUrl: "https://i02.appmifile.com/964_operator_sg/10/01/2024/6695244d44099612e89a939fc8b536a5.png",
      inStock: true,
      rating: 4.5,
      weight: "187g",
      features: ["67W Fast Charging", "Corning Gorilla Glass Victus", "IP54"],
      category: "mid-range"
    },
    {
      id: "m10",
      name: "Motorola Moto G84",
      brand: "Motorola",
      price: 249,
      priceNPR: 32000,
      camera: "50MP + 8MP",
      display: "6.55-inch pOLED, 120Hz",
      processor: "Snapdragon 695",
      ram: "8GB",
      storage: "128GB",
      battery: "5000mAh",
      color: "Midnight Blue",
      os: "Android 13",
      image: "/mobiles/motorola-moto-g84.jpg",
      imageUrl: "https://www.phoneworld.com.pk/wp-content/uploads/2023/09/moto-g84-5G-1-1.jpg",
      inStock: true,
      rating: 4.2,
      weight: "168g",
      features: ["33W TurboPower", "Stereo Speakers", "Water Repellent"],
      category: "budget"
    }
  ];

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
