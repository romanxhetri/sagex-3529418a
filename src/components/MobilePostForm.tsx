
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mobile } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface MobilePostFormProps {
  onSubmit: (mobile: Omit<Mobile, 'id'>) => void;
  onCancel: () => void;
}

export const MobilePostForm: React.FC<MobilePostFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [processor, setProcessor] = useState('');
  const [ram, setRam] = useState('');
  const [storage, setStorage] = useState('');
  const [display, setDisplay] = useState('');
  const [camera, setCamera] = useState('');
  const [batteryLife, setBatteryLife] = useState('');
  const [weight, setWeight] = useState('');
  const [os, setOs] = useState('');
  const [category, setCategory] = useState('midrange');
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
    
    const mobileData: Omit<Mobile, 'id'> = {
      name,
      brand,
      price: parseFloat(price),
      imageUrl,
      processor,
      ram,
      storage,
      display,
      camera,
      batteryLife,
      weight,
      os,
      category: category as 'flagship' | 'midrange' | 'budget',
      rating: parseFloat(rating),
      features: features.split(',').map(feat => feat.trim()).filter(Boolean)
    };
    
    onSubmit(mobileData);
    
    // Reset form
    setName('');
    setBrand('');
    setPrice('');
    setImageUrl('');
    setProcessor('');
    setRam('');
    setStorage('');
    setDisplay('');
    setCamera('');
    setBatteryLife('');
    setWeight('');
    setOs('');
    setCategory('midrange');
    setFeatures('');
    setRating('4.5');
    
    toast({
      title: "Mobile Posted",
      description: "Your mobile has been successfully posted."
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
      
      <h2 className="text-xl font-semibold mb-4">Post a Mobile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Mobile Name *</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Galaxy S23 Ultra"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="brand">Brand *</Label>
            <Input 
              id="brand" 
              value={brand} 
              onChange={(e) => setBrand(e.target.value)} 
              placeholder="Samsung"
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
              placeholder="1199"
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
              placeholder="Snapdragon 8 Gen 2"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ram">RAM</Label>
            <Input 
              id="ram" 
              value={ram} 
              onChange={(e) => setRam(e.target.value)} 
              placeholder="12GB"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="storage">Storage</Label>
            <Input 
              id="storage" 
              value={storage} 
              onChange={(e) => setStorage(e.target.value)} 
              placeholder="512GB"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="display">Display</Label>
            <Input 
              id="display" 
              value={display} 
              onChange={(e) => setDisplay(e.target.value)} 
              placeholder="6.8-inch Dynamic AMOLED 2X"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="camera">Camera</Label>
            <Input 
              id="camera" 
              value={camera} 
              onChange={(e) => setCamera(e.target.value)} 
              placeholder="200MP wide + 12MP ultrawide + 10MP telephoto"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="batteryLife">Battery</Label>
            <Input 
              id="batteryLife" 
              value={batteryLife} 
              onChange={(e) => setBatteryLife(e.target.value)} 
              placeholder="5000mAh"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight">Weight</Label>
            <Input 
              id="weight" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)} 
              placeholder="234g"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="os">Operating System</Label>
            <Input 
              id="os" 
              value={os} 
              onChange={(e) => setOs(e.target.value)} 
              placeholder="Android 13"
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
                <SelectItem value="flagship">Flagship</SelectItem>
                <SelectItem value="midrange">Mid-range</SelectItem>
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
            placeholder="S Pen, IP68 water resistance, 45W fast charging"
            className="bg-gray-800 border-gray-700"
            rows={3}
          />
        </div>
        
        <div className="pt-4 flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Post Mobile
          </Button>
        </div>
      </form>
    </div>
  );
};
