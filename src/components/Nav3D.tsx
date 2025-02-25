
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Book, 
  Box, 
  Brain, 
  Calculator, 
  Facebook, 
  Gamepad, 
  Image, 
  Laptop, 
  MessageCircle, 
  Search, 
  Video 
} from 'lucide-react';

interface NavItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
}

export const Nav2D = () => {
  const items: NavItem[] = [
    { id: 'product', title: 'Product', icon: <Box className="w-6 h-6" />, path: '/product' },
    { id: 'resources', title: 'Resources', icon: <Book className="w-6 h-6" />, path: '/resources' },
    { id: 'pricing', title: 'Pricing', icon: <Calculator className="w-6 h-6" />, path: '/pricing' },
    { id: 'blog', title: 'Blog', icon: <Brain className="w-6 h-6" />, path: '/blog' },
    { id: 'facebook', title: 'Facebook', icon: <Facebook className="w-6 h-6" />, path: '/facebook' },
    { id: 'chatgpt', title: 'ChatGPT', icon: <MessageCircle className="w-6 h-6" />, path: '/chat' },
    { id: 'laptops', title: 'Laptops', icon: <Laptop className="w-6 h-6" />, path: '/laptops' },
    { id: 'ai-search', title: 'AI Search', icon: <Search className="w-6 h-6" />, path: '/search' },
    { id: 'games', title: 'Games', icon: <Gamepad className="w-6 h-6" />, path: '/games' },
    { id: 'media', title: 'Media Creation', icon: <Image className="w-6 h-6" />, path: '/media' },
    { id: 'video', title: 'Video Editor', icon: <Video className="w-6 h-6" />, path: '/video' }
  ];

  return (
    <div className="space-y-1">
      {items.map((item) => (
        <Link
          key={item.id}
          to={item.path}
          className="flex items-center space-x-2 px-4 py-2 hover:bg-purple-500/10 rounded-lg transition-colors group"
        >
          <div className="text-purple-400 group-hover:text-purple-300 transition-colors">
            {item.icon}
          </div>
          <span className="text-white group-hover:text-purple-300 transition-colors">
            {item.title}
          </span>
        </Link>
      ))}
    </div>
  );
};
