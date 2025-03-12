import React from "react";
import { Header } from "@/components/Header";
import { MagicalUniverseScene } from "@/components/MagicalUniverseScene";
import { MobileChat } from "@/components/mobile/MobileChat";
import { MobileList } from "@/components/mobile/MobileList";
import { Mobile } from "@/types/chat";
import { motion } from "framer-motion";
import { Sparkles, Smartphone } from "lucide-react";

const Mobiles = () => {
  const defaultMobiles: Mobile[] = [
    {
      id: "1",
      name: "iPhone 15 Pro Max",
      brand: "Apple",
      price: 1299,
      priceNPR: 169000,
      processor: "A17 Pro",
      ram: "8GB",
      storage: "256GB",
      display: "6.7-inch Super Retina XDR",
      camera: "48MP Main + 12MP Ultra Wide + 12MP Telephoto",
      battery: "4422mAh",
      batteryLife: "29 hours",
      color: "Natural Titanium",
      os: "iOS 17",
      image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch_GEO_US?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009279082",
      imageUrl: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch_GEO_US?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009279082",
      inStock: true,
      rating: 4.9,
      featured: true,
      category: "flagship",
      features: [
        "A17 Pro chip",
        "ProMotion display",
        "Titanium design",
        "Action button",
        "USB-C"
      ]
    },
    {
      id: "2",
      name: "Samsung Galaxy S23 Ultra",
      brand: "Samsung",
      price: 1199,
      priceNPR: 156000,
      camera: "200MP Wide + 12MP Ultra Wide + 10MP Telephoto (3x) + 10MP Telephoto (10x)",
      display: "6.8-inch Dynamic AMOLED 2X",
      processor: "Snapdragon 8 Gen 2 for Galaxy",
      ram: "8GB",
      storage: "256GB",
      battery: "5000mAh",
      batteryLife: "26 hours",
      color: "Phantom Black",
      os: "Android 13",
      image: "https://image-us.samsung.com/SamsungUS/home/mobile/phones/galaxy-s/galaxy-s23-ultra/configurator/02012023/S23_Ultra_ProductKV_Black_600x600.jpg",
      imageUrl: "https://image-us.samsung.com/SamsungUS/home/mobile/phones/galaxy-s/galaxy-s23-ultra/configurator/02012023/S23_Ultra_ProductKV_Black_600x600.jpg",
      inStock: true,
      rating: 4.8,
      featured: true,
      discount: 5,
      weight: "234g",
      features: [
        "200MP camera",
        "S Pen support",
        "100x Space Zoom",
        "IP68 water resistance"
      ],
      category: "flagship"
    },
    {
      id: "3",
      name: "Google Pixel 8 Pro",
      brand: "Google",
      price: 999,
      priceNPR: 130000,
      camera: "50MP Wide + 48MP Ultra Wide + 48MP Telephoto",
      display: "6.7-inch Super Actua display",
      processor: "Google Tensor G3",
      ram: "12GB",
      storage: "128GB",
      battery: "5050mAh",
      batteryLife: "24 hours",
      color: "Obsidian",
      os: "Android 14",
      image: "https://m.media-amazon.com/images/I/51VGwakkqiL._AC_UF1000,1000_QL80_.jpg",
      imageUrl: "https://m.media-amazon.com/images/I/51VGwakkqiL._AC_UF1000,1000_QL80_.jpg",
      inStock: true,
      rating: 4.7,
      featured: true,
      weight: "213g",
      features: [
        "Google Tensor G3 chip",
        "AI-powered features",
        "Titanium design",
        "Action button",
        "USB-C"
      ],
      category: "flagship"
    },
    {
      id: "4",
      name: "OnePlus 11",
      brand: "OnePlus",
      price: 699,
      priceNPR: 91000,
      camera: "50MP Main + 48MP Ultra-Wide + 32MP Telephoto",
      display: "6.7-inch 120 Hz Fluid AMOLED",
      processor: "Snapdragon 8 Gen 2",
      ram: "8GB",
      storage: "128GB",
      battery: "5000mAh",
      batteryLife: "20 hours",
      color: "Eternal Green",
      os: "OxygenOS 13",
      image: "https://www.oneplus.com/content/dam/oneplus/global/oneplus-11/images/specs/oneplus-11-green.png",
      imageUrl: "https://www.oneplus.com/content/dam/oneplus/global/oneplus-11/images/specs/oneplus-11-green.png",
      inStock: true,
      rating: 4.6,
      featured: false,
      weight: "205g",
      features: [
        "Hasselblad Camera",
        "100W SuperVOOC Charging",
        "Fluid AMOLED Display",
        "Snapdragon 8 Gen 2"
      ],
      category: "flagship"
    },
    {
      id: "5",
      name: "Xiaomi 13 Pro",
      brand: "Xiaomi",
      price: 799,
      priceNPR: 104000,
      camera: "50MP Wide + 50MP Ultra-Wide + 50MP Telephoto",
      display: "6.73-inch 120Hz AMOLED",
      processor: "Snapdragon 8 Gen 2",
      ram: "12GB",
      storage: "256GB",
      battery: "4820mAh",
      batteryLife: "18 hours",
      color: "Ceramic Black",
      os: "MIUI 14",
      image: "https://i01.appmifile.com/v1/MI_18455B3E4DA68F887429435E5A3F0621",
      imageUrl: "https://i01.appmifile.com/v1/MI_18455B3E4DA68F887429435E5A3F0621",
      inStock: true,
      rating: 4.5,
      featured: false,
      weight: "229g",
      features: [
        "Leica Camera System",
        "120W HyperCharge",
        "WQHD+ Display",
        "Snapdragon 8 Gen 2"
      ],
      category: "flagship"
    },
    {
      id: "6",
      name: "Nothing Phone (2)",
      brand: "Nothing",
      price: 599,
      priceNPR: 78000,
      camera: "50MP Wide + 50MP Ultra-Wide",
      display: "6.7-inch 120Hz OLED",
      processor: "Snapdragon 8+ Gen 1",
      ram: "8GB",
      storage: "128GB",
      battery: "4700mAh",
      batteryLife: "16 hours",
      color: "White",
      os: "Nothing OS 2.0",
      image: "https://www.notebookcheck.net/uploads/tx_nbc2article/v6/2_1280_1.jpg",
      imageUrl: "https://www.notebookcheck.net/uploads/tx_nbc2article/v6/2_1280_1.jpg",
      inStock: true,
      rating: 4.4,
      featured: false,
      weight: "201g",
      features: [
        "Glyph Interface",
        "Unique Design",
        "Snapdragon 8+ Gen 1",
        "Clean OS"
      ],
      category: "mid-range"
    },
    {
      id: "7",
      name: "Samsung Galaxy A54",
      brand: "Samsung",
      price: 449,
      priceNPR: 58000,
      camera: "50MP Main + 12MP Ultra-Wide + 5MP Macro",
      display: "6.4-inch 120Hz Super AMOLED",
      processor: "Exynos 1380",
      ram: "6GB",
      storage: "128GB",
      battery: "5000mAh",
      batteryLife: "22 hours",
      color: "Awesome Graphite",
      os: "Android 13",
      image: "https://images.samsung.com/is/image/samsung/p6/global/feature/galaxy-a/a54/Highlight_Color_KV_AwesomeGraphite_PC.jpg",
      imageUrl: "https://images.samsung.com/is/image/samsung/p6/global/feature/galaxy-a/a54/Highlight_Color_KV_AwesomeGraphite_PC.jpg",
      inStock: true,
      rating: 4.3,
      featured: false,
      weight: "202g",
      features: [
        "120Hz Super AMOLED",
        "IP67 Water Resistance",
        "Exynos 1380",
        "Versatile Camera"
      ],
      category: "mid-range"
    },
    {
      id: "8",
      name: "Google Pixel 7a",
      brand: "Google",
      price: 499,
      priceNPR: 65000,
      camera: "64MP Wide + 13MP Ultra-Wide",
      display: "6.1-inch 90Hz OLED",
      processor: "Google Tensor G2",
      ram: "8GB",
      storage: "128GB",
      battery: "4385mAh",
      batteryLife: "20 hours",
      color: "Charcoal",
      os: "Android 13",
      image: "https://www.bhphotovideo.com/images/images2500x2500/google_ga04750_us_pixel_7a_5g_128gb_1763211.jpg",
      imageUrl: "https://www.bhphotovideo.com/images/images2500x2500/google_ga04750_us_pixel_7a_5g_128gb_1763211.jpg",
      inStock: true,
      rating: 4.2,
      featured: false,
      weight: "193.5g",
      features: [
        "Google Tensor G2",
        "High-Quality Camera",
        "90Hz OLED Display",
        "Clean Android Experience"
      ],
      category: "mid-range"
    },
    {
      id: "9",
      name: "Motorola Moto G Power 5G",
      brand: "Motorola",
      price: 299,
      priceNPR: 39000,
      camera: "50MP Main + 2MP Macro + 2MP Depth",
      display: "6.5-inch 120Hz LCD",
      processor: "MediaTek Dimensity 930",
      ram: "6GB",
      storage: "128GB",
      battery: "5000mAh",
      batteryLife: "36 hours",
      color: "Mineral Black",
      os: "Android 13",
      image: "https://www.motorola.com/sites/default/files/catalog/moto_g_power_5g_2023_black_front.png",
      imageUrl: "https://www.motorola.com/sites/default/files/catalog/moto_g_power_5g_2023_black_front.png",
      inStock: true,
      rating: 4.1,
      featured: false,
      weight: "185g",
      features: [
        "Long Battery Life",
        "120Hz Display",
        "5G Connectivity",
        "Affordable Price"
      ],
      category: "budget"
    },
    {
      id: "10",
      name: "Xiaomi Redmi Note 12",
      brand: "Xiaomi",
      price: 199,
      priceNPR: 26000,
      camera: "50MP Main + 8MP Ultra-Wide + 2MP Macro",
      display: "6.67-inch 120Hz AMOLED",
      processor: "Snapdragon 4 Gen 1",
      ram: "4GB",
      storage: "64GB",
      battery: "5000mAh",
      batteryLife: "30 hours",
      color: "Onyx Gray",
      os: "MIUI 13",
      image: "https://mobilefunda.com/wp-content/uploads/2023/04/Redmi-Note-12-5G-Review-scaled.jpg",
      imageUrl: "https://mobilefunda.com/wp-content/uploads/2023/04/Redmi-Note-12-5G-Review-scaled.jpg",
      inStock: true,
      rating: 4.0,
      featured: false,
      weight: "183.5g",
      features: [
        "120Hz AMOLED Display",
        "50MP Camera",
        "5000mAh Battery",
        "Affordable Price"
      ],
      category: "budget"
    }
  ];

  return (
    <motion.div>
      <Header />
      <MagicalUniverseScene />
      <MobileChat />
      <MobileList mobiles={defaultMobiles} />
    </motion.div>
  );
};

export default Mobiles;
