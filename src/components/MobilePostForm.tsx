import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Mobile } from "@/types/chat";

interface MobilePostFormProps {
  onAddMobile: (mobile: Mobile) => void;
}

const MobilePostForm = () => {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [processor, setProcessor] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [display, setDisplay] = useState("");
  const [camera, setCamera] = useState("");
  const [batteryLife, setBatteryLife] = useState("");
  const [weight, setWeight] = useState("");
  const [os, setOs] = useState("");
  const [category, setCategory] = useState("");
  const [features, setFeatures] = useState("");
  const [rating, setRating] = useState("");

  const handleAddMobile = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMobile: Partial<Mobile> = {
      id: Date.now().toString(),
      name,
      brand,
      price: Number(price),
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1527&auto=format&fit=crop",
      processor,
      ram,
      storage,
      display,
      camera,
      batteryLife,
      weight,
      os,
      category: category as "gaming" | "budget" | "flagship" | "mid-range" | "camera", // Fixed: ensure type safety
      features: features.split(",").map(feature => feature.trim()),
      rating: Number(rating)
    };
    
    // Here you would typically dispatch an action to add the new mobile to your data store
    // For this example, we'll just log the new mobile to the console
    console.log("New Mobile:", newMobile);
    
    // Clear the form
    setName("");
    setBrand("");
    setPrice("");
    setImageUrl("");
    setProcessor("");
    setRam("");
    setStorage("");
    setDisplay("");
    setCamera("");
    setBatteryLife("");
    setWeight("");
    setOs("");
    setCategory("");
    setFeatures("");
    setRating("");
  };
  
  return (
    <form onSubmit={handleAddMobile} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full py-2 px-3 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      
      <div>
        <Label htmlFor="brand">Brand</Label>
        <Input
          type="text"
          id="brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="mt-1 block w-full py-2 px-3 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 block w-full py-2 px-3 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      
      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          type="text"
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="mt-1 block w-full py-2 px-3 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      
      <div>
        <Label htmlFor="processor">Processor</Label>
        <Input
          type="text"
          id="processor"
          value={processor}
          onChange={(e) => setProcessor(e.target.value)}
          className="mt-1 block w-full py-2 px-3 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      
      <div>
        <Label htmlFor="ram">RAM</Label>
        <Input
          type="text"
          id="ram"
          value={ram}
          onChange={(e) => setRam(e.target.value)}
          className="mt-1 block w-full py-2 px-3 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      
      <div>
        <Label htmlFor="storage">Storage</Label>
        <Input
          type="text"
          id="storage"
          value={storage}
          onChange={(e) => setStorage(e.target.value)}
          className="mt-1 block w-full py-2 px-3 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      
      <div>
        <Label htmlFor="display">Display</Label>
        <Input
          type="text"
          id="display"
          value={display}
          onChange={(e) => setDisplay(e.target.value)}
          className="mt-1 block w-full py-2 px-3 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      
      <div>
        <Label htmlFor="camera">Camera</Label>
        <Input
          type="text"
          id="camera"
          value={camera}
          onChange={(e) => setCamera(e.target.value)}
          className="mt-1 block w-full py-2 px-3 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      
      <div>
        <Label htmlFor="batteryLife">Battery Life</Label>
        <Input
          type="text"
          id="batteryLife"
          value={batteryLife}
          onChange={(e) => setBatteryLife(e.target.value)}
          className="mt-1 block w-full py-2 px-3 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      
      <div>
        <Label htmlFor="weight">Weight</Label>
        <Input
          type="text"
          id="weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="mt-1 block w-full py-2 px-3 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      
      <div>
        <Label htmlFor="os">OS</Label>
        <Input
          type="text"
          id="os"
          value={os}
          onChange={(e) => setOs(e.target.value)}
          className="mt-1 block w-full py-2 px-3 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      
      <div>
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full py-2 px-3 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">Select Category</option>
          <option value="budget">Budget</option>
          <option value="mid-range">Mid-Range</option>
          <option value="flagship">Flagship</option>
          <option value="gaming">Gaming</option>
          <option value="camera">Camera</option>
        </select>
      </div>
      
      <div>
        <Label htmlFor="features">Features (comma-separated)</Label>
        <Textarea
          id="features"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          className="mt-1 block w-full py-2 px-3 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      
      <div>
        <Label htmlFor="rating">Rating</Label>
        <Input
          type="number"
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="mt-1 block w-full py-2 px-3 bg-gray-800 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        />
      </div>
      
      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
        Add Mobile
      </Button>
    </form>
  );
};

export default MobilePostForm;
