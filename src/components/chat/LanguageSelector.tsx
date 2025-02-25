
import React from 'react';
import { languages } from '@/utils/languages';
import { SupportedLanguage } from '@/types/chat';
import { Check, Globe } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
}

export const LanguageSelector = ({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-glass hover:bg-glass-light transition-colors"
      >
        <Globe size={20} />
        <span>{languages.find(l => l.code === selectedLanguage)?.nativeName}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 rounded-lg bg-glass-dark border border-glass-border shadow-lg">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className="flex items-center justify-between w-full px-4 py-2 hover:bg-purple-500/10 transition-colors"
            >
              <span>{lang.nativeName}</span>
              {selectedLanguage === lang.code && <Check size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
