
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Laptop, Smartphone, X, Image, Check } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { toast } from "sonner";

type ProductType = 'laptop' | 'mobile';

export const PostProductButton: React.FC = () => {
  const [productType, setProductType] = useState<ProductType>('laptop');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !price || !description || !specifications || !imagePreview) {
      toast.error("Please fill all required fields and add an image");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store in localStorage for demo purposes
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      const newProduct = {
        id: Date.now().toString(),
        type: productType,
        title,
        price: parseFloat(price),
        description,
        specifications,
        image: imagePreview,
        datePosted: new Date().toISOString()
      };
      
      products.push(newProduct);
      localStorage.setItem('products', JSON.stringify(products));
      
      // Reset form
      setTitle('');
      setPrice('');
      setDescription('');
      setSpecifications('');
      setImagePreview(null);
      
      toast.success("Product posted successfully!", {
        description: "Your product listing is now available to customers."
      });
      
      // Close dialog programmatically
      const closeButton = document.querySelector('[data-dialog-close="true"]');
      if (closeButton instanceof HTMLElement) {
        closeButton.click();
      }
    } catch (error) {
      console.error("Error posting product:", error);
      toast.error("Failed to post product", {
        description: "Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-colors">
          <PlusCircle className="mr-2 h-4 w-4" />
          Post a Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Post a Product for Sale</DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill in the details about the product you want to sell.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setProductType('laptop')}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center ${
                productType === 'laptop' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Laptop className="mr-2 h-5 w-5" />
              Laptop
            </button>
            <button
              type="button"
              onClick={() => setProductType('mobile')}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center ${
                productType === 'mobile' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Smartphone className="mr-2 h-5 w-5" />
              Mobile
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Product Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`${productType === 'laptop' ? 'e.g. MacBook Pro 16"' : 'e.g. iPhone 15 Pro'}`}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 999.99"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your product..."
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white min-h-[60px]"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Specifications
            </label>
            <textarea
              value={specifications}
              onChange={(e) => setSpecifications(e.target.value)}
              placeholder={`Enter detailed specifications (${
                productType === 'laptop' 
                  ? 'CPU, RAM, Storage, Display...' 
                  : 'Processor, RAM, Storage, Camera...'
              })`}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white min-h-[80px]"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Product Image
            </label>
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Product preview" 
                  className="w-full h-48 object-contain bg-gray-800 border border-gray-700 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white hover:bg-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-700 rounded-md p-6 text-center">
                <Image className="mx-auto h-12 w-12 text-gray-500" />
                <div className="mt-2">
                  <label htmlFor="file-upload" className="cursor-pointer text-blue-400 hover:text-blue-300">
                    <span>Upload an image</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <DialogClose asChild data-dialog-close="true">
              <Button type="button" variant="outline" className="text-white border-gray-600 hover:bg-gray-800">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Posting...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Post Product
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
