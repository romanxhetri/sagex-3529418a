
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Laptop, Smartphone, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

type Product = {
  id: string;
  type: 'laptop' | 'mobile';
  title: string;
  price: number;
  description: string;
  specifications: string;
  image: string;
  datePosted: string;
};

export const ProductsDisplay: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<'all' | 'laptop' | 'mobile'>('all');

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(storedProducts);
  }, []);

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(product => product.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          All Products
        </button>
        <button
          onClick={() => setFilter('laptop')}
          className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
            filter === 'laptop' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Laptop size={16} className="mr-1" />
          Laptops
        </button>
        <button
          onClick={() => setFilter('mobile')}
          className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
            filter === 'mobile' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Smartphone size={16} className="mr-1" />
          Mobiles
        </button>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-10 bg-gray-900 rounded-lg border border-gray-800">
          <div className="text-gray-400">
            {filter === 'all' ? (
              <>No products have been posted yet.</>
            ) : (
              <>No {filter}s have been posted yet.</>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="h-full w-full object-contain bg-gray-800"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-white">{product.title}</h3>
                  <Badge className={product.type === 'laptop' ? 'bg-blue-600' : 'bg-purple-600'}>
                    {product.type === 'laptop' ? (
                      <><Laptop size={12} className="mr-1" /> Laptop</>
                    ) : (
                      <><Smartphone size={12} className="mr-1" /> Mobile</>
                    )}
                  </Badge>
                </div>
                
                <div className="mt-2 flex items-center text-green-500 font-bold">
                  <DollarSign size={16} className="mr-1" />
                  {product.price.toFixed(2)}
                </div>
                
                <p className="mt-2 text-gray-400 text-sm line-clamp-2">{product.description}</p>
                
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-300">Specifications:</h4>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-3">{product.specifications}</p>
                </div>
                
                <div className="mt-3 text-xs text-gray-500 flex items-center">
                  <Calendar size={12} className="mr-1" />
                  {format(new Date(product.datePosted), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
