
import React, { useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { languages } from '@/utils/languages';
import { SupportedLanguage } from '@/types/chat';
import { motion } from 'framer-motion';

interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
}

export const LanguageSelector = ({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedLanguageObj = languages.find(lang => lang.code === selectedLanguage);
  
  const handleLanguageChange = (value: string) => {
    // Type assertion as SupportedLanguage
    onLanguageChange(value as SupportedLanguage);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-gray-300 hover:text-white">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Globe size={16} className="text-purple-400" />
          </motion.div>
          <span className="ml-1">{selectedLanguageObj?.nativeName}</span>
          <ChevronDown size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white w-48">
        <div className="py-2 px-3 border-b border-gray-700">
          <p className="text-xs text-gray-400">Select Language</p>
        </div>
        <DropdownMenuRadioGroup value={selectedLanguage} onValueChange={handleLanguageChange}>
          {languages.map((language) => (
            <DropdownMenuRadioItem 
              key={language.code} 
              value={language.code}
              className="cursor-pointer flex items-center justify-between py-2 px-3 hover:bg-gray-700"
            >
              <span className="flex items-center">
                <span className="mr-2">{language.nativeName}</span>
                <span className="text-gray-400 text-xs">({language.name})</span>
              </span>
              {selectedLanguage === language.code && 
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Check size={16} className="text-purple-400" />
                </motion.div>
              }
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
