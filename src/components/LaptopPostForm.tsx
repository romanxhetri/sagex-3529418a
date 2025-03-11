
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

export interface Laptop {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  processor: string;
  ram: string;
  storage: string;
  display: string;
  graphics: string;
  batteryLife: string;
  weight: string;
  os: string;
  category: 'gaming' | 'productivity' | 'ultrabook' | 'budget';
  rating: number;
  features: string[];
}

interface LaptopPostFormProps {
  onSubmit: (laptop: Omit<Laptop, 'id'>) => void;
  onCancel: () => void;
}

export const LaptopPostForm: React.FC<LaptopPostFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [processor, setProcessor] = useState('');
  const [ram, setRam] = useState('');
  const [storage, setStorage] = useState('');
  const [display, setDisplay] = useState('');
  const [graphics, setGraphics] = useState('');
  const [batteryLife, setBatteryLife] = useState('');
  const [weight, setWeight] = useState('');
  const [os, setOs] = useState('');
  const [category, setCategory] = useState('productivity');
  const [features, setFeatures] = useState('');
  const [rating, setRating] = useState('4.5');
  
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !brand || !price || !imageUrl) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields (name, brand, price, image)",
        variant: "destructive"
      });
      return;
    }
    
    const laptopData: Omit<Laptop, 'id'> = {
      name,
      brand,
      price: parseFloat(price),
      imageUrl,
      processor,
      ram,
      storage,
      display,
      graphics,
      batteryLife,
      weight,
      os,
      category: category as 'gaming' | 'productivity' | 'ultrabook' | 'budget',
      rating: parseFloat(rating),
      features: features.split(',').map(feat => feat.trim()).filter(Boolean)
    };
    
    onSubmit(laptopData);
    
    // Reset form
    setName('');
    setBrand('');
    setPrice('');
    setImageUrl('');
    setProcessor('');
    setRam('');
    setStorage('');
    setDisplay('');
    setGraphics('');
    setBatteryLife('');
    setWeight('');
    setOs('');
    setCategory('productivity');
    setFeatures('');
    setRating('4.5');
    
    toast({
      title: "Laptop Posted",
      description: "Your laptop has been successfully posted."
    });
  };
  
  return (
    <div className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg p-6 mb-6 relative">
      <button 
        onClick={onCancel}
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
      >
        <X size={20} />
      </button>
      
      <h2 className="text-xl font-semibold mb-4">Post a Laptop</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Laptop Name *</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="MacBook Pro 16"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="brand">Brand *</Label>
            <Input 
              id="brand" 
              value={brand} 
              onChange={(e) => setBrand(e.target.value)} 
              placeholder="Apple"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price (USD) *</Label>
            <Input 
              id="price" 
              type="number"
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              placeholder="2499"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL *</Label>
            <Input 
              id="imageUrl" 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)} 
              placeholder="https://example.com/image.jpg"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="processor">Processor</Label>
            <Input 
              id="processor" 
              value={processor} 
              onChange={(e) => setProcessor(e.target.value)} 
              placeholder="Apple M2 Pro"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ram">RAM</Label>
            <Input 
              id="ram" 
              value={ram} 
              onChange={(e) => setRam(e.target.value)} 
              placeholder="16GB"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="storage">Storage</Label>
            <Input 
              id="storage" 
              value={storage} 
              onChange={(e) => setStorage(e.target.value)} 
              placeholder="512GB SSD"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="display">Display</Label>
            <Input 
              id="display" 
              value={display} 
              onChange={(e) => setDisplay(e.target.value)} 
              placeholder="16-inch Liquid Retina XDR"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="graphics">Graphics</Label>
            <Input 
              id="graphics" 
              value={graphics} 
              onChange={(e) => setGraphics(e.target.value)} 
              placeholder="19-core GPU"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="batteryLife">Battery Life</Label>
            <Input 
              id="batteryLife" 
              value={batteryLife} 
              onChange={(e) => setBatteryLife(e.target.value)} 
              placeholder="Up to 22 hours"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight">Weight</Label>
            <Input 
              id="weight" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)} 
              placeholder="2.1 kg"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="os">Operating System</Label>
            <Input 
              id="os" 
              value={os} 
              onChange={(e) => setOs(e.target.value)} 
              placeholder="macOS Ventura"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select defaultValue={category} onValueChange={(value) => setCategory(value)}>
              <SelectTrigger id="category" className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="productivity">Productivity</SelectItem>
                <SelectItem value="ultrabook">Ultrabook</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rating">Rating (0-5)</Label>
            <Input 
              id="rating" 
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={rating} 
              onChange={(e) => setRating(e.target.value)} 
              placeholder="4.8"
              className="bg-gray-800 border-gray-700"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="features">Features (comma separated)</Label>
          <Textarea 
            id="features" 
            value={features} 
            onChange={(e) => setFeatures(e.target.value)} 
            placeholder="Touch Bar, Thunderbolt ports, Backlit keyboard"
            className="bg-gray-800 border-gray-700"
            rows={3}
          />
        </div>
        
        <div className="pt-4 flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Post Laptop
          </Button>
        </div>
      </form>
    </div>
  );
};
