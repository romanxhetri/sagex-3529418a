import React, { useState } from "react";
import { Header } from "@/components/Header";
import { LaptopChat } from "@/components/laptop/LaptopChat";
import { LaptopList } from "@/components/laptop/LaptopList";
import { Laptop } from "@/types/chat";
import { motion } from "framer-motion";
import { Sparkles, Laptop as LaptopIcon, Plus, X, Upload, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const initialLaptopData: Laptop[] = [
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
  const [laptops, setLaptops] = useState<Laptop[]>(initialLaptopData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLaptop, setNewLaptop] = useState<Partial<Laptop>>({
    id: "",
    name: "",
    brand: "",
    price: 0,
    imageUrl: "",
    processor: "",
    ram: "",
    storage: "",
    display: "",
    graphics: "",
    batteryLife: "",
    weight: "",
    os: "",
    category: "creative",
    rating: 4.0
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRecommendation = (query: string) => {
    setFilterQuery(query);
  };

  const handleAddLaptop = (e: React.FormEvent) => {
    e.preventDefault();
    
    const id = Date.now().toString();
    const newLaptopData: Laptop = {
      ...newLaptop as Laptop,
      id
    };
    
    setLaptops([newLaptopData, ...laptops]);
    
    setNewLaptop({
      id: "",
      name: "",
      brand: "",
      price: 0,
      imageUrl: "",
      processor: "",
      ram: "",
      storage: "",
      display: "",
      graphics: "",
      batteryLife: "",
      weight: "",
      os: "",
      category: "creative",
      rating: 4.0
    });
    setImagePreview(null);
    setShowAddForm(false);
    
    toast({
      title: "Laptop Posted",
      description: "Your laptop has been successfully posted for sale!",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setNewLaptop(prev => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);
    
    setNewLaptop(prev => ({
      ...prev,
      imageUrl
    }));
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2 flex items-center">
                <Sparkles className="mr-2 text-purple-400" />
                Premium Laptops 💻✨
                <Sparkles className="ml-2 text-pink-400" />
              </h1>
              <p className="text-gray-300">
                Find the perfect laptop for your needs with our AI assistant! Tell us what you're looking for, and we'll recommend the best options. Your perfect tech companion awaits! 🚀
              </p>
            </div>
            
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2"
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={16} />
              Post a Laptop
            </Button>
          </div>
          
          {showAddForm && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center p-4 border-b border-glass-border">
                  <h2 className="text-xl font-semibold">Post a Laptop for Sale</h2>
                  <button 
                    onClick={() => setShowAddForm(false)}
                    className="p-1 hover:bg-gray-800 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleAddLaptop} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Laptop Name</label>
                        <input
                          type="text"
                          name="name"
                          value={newLaptop.name}
                          onChange={handleInputChange}
                          required
                          className="w-full p-2 mt-1 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="MacBook Pro 16"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Brand</label>
                        <input
                          type="text"
                          name="brand"
                          value={newLaptop.brand}
                          onChange={handleInputChange}
                          required
                          className="w-full p-2 mt-1 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Apple"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Price ($)</label>
                        <input
                          type="number"
                          name="price"
                          value={newLaptop.price || ""}
                          onChange={handleInputChange}
                          required
                          min={0}
                          className="w-full p-2 mt-1 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="1999"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Category</label>
                        <select
                          name="category"
                          value={newLaptop.category}
                          onChange={handleInputChange}
                          required
                          className="w-full p-2 mt-1 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="creative">Creative</option>
                          <option value="gaming">Gaming</option>
                          <option value="business">Business</option>
                          <option value="student">Student</option>
                          <option value="budget">Budget</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Image</label>
                        <div className="mt-1 flex items-center">
                          <label className="flex items-center justify-center p-2 bg-gray-800/50 border border-gray-700 rounded-md text-white hover:bg-gray-700/50 transition-colors cursor-pointer flex-1">
                            <Upload size={16} className="mr-2" />
                            {imagePreview ? 'Change Image' : 'Upload Image'}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                        
                        {imagePreview && (
                          <div className="mt-2 relative rounded-md overflow-hidden h-32">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreview(null);
                                setNewLaptop(prev => ({ ...prev, imageUrl: "" }));
                              }}
                              className="absolute top-2 right-2 p-1 bg-red-500 rounded-full"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Processor</label>
                        <input
                          type="text"
                          name="processor"
                          value={newLaptop.processor}
                          onChange={handleInputChange}
                          required
                          className="w-full p-2 mt-1 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Intel Core i9-12900H"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300">RAM</label>
                        <input
                          type="text"
                          name="ram"
                          value={newLaptop.ram}
                          onChange={handleInputChange}
                          required
                          className="w-full p-2 mt-1 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="32GB DDR5"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Storage</label>
                        <input
                          type="text"
                          name="storage"
                          value={newLaptop.storage}
                          onChange={handleInputChange}
                          required
                          className="w-full p-2 mt-1 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="1TB SSD"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Display</label>
                        <input
                          type="text"
                          name="display"
                          value={newLaptop.display}
                          onChange={handleInputChange}
                          required
                          className="w-full p-2 mt-1 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="16-inch Liquid Retina XDR"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Graphics</label>
                        <input
                          type="text"
                          name="graphics"
                          value={newLaptop.graphics}
                          onChange={handleInputChange}
                          required
                          className="w-full p-2 mt-1 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="NVIDIA RTX 3080"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300">Battery Life</label>
                          <input
                            type="text"
                            name="batteryLife"
                            value={newLaptop.batteryLife}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 mt-1 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Up to 10 hours"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300">Weight</label>
                          <input
                            type="text"
                            name="weight"
                            value={newLaptop.weight}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 mt-1 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="1.8 kg"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Operating System</label>
                        <input
                          type="text"
                          name="os"
                          value={newLaptop.os}
                          onChange={handleInputChange}
                          required
                          className="w-full p-2 mt-1 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Windows 11 Pro"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Check size={16} className="mr-2" />
                      Post Laptop
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <LaptopList laptops={laptops} filter={filterQuery} />
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
