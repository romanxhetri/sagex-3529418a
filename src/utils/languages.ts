
import { SupportedLanguage } from '@/types/chat';

export const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "ar", name: "Arabic", nativeName: "العربية" }
];

export const translateToLanguage = async (text: string, targetLanguage: SupportedLanguage): Promise<string> => {
  // Placeholder for actual translation service
  console.log(`Translating to ${targetLanguage}: ${text}`);
  
  // For Nepali, add some simple translations to showcase functionality
  if (targetLanguage === 'ne' && text.includes('Hello')) {
    return text.replace('Hello', 'नमस्ते');
  }
  
  if (targetLanguage === 'ne' && text.includes('welcome')) {
    return text.replace('welcome', 'स्वागत छ');
  }
  
  if (targetLanguage === 'ne' && text.includes('thank you')) {
    return text.replace('thank you', 'धन्यवाद');
  }
  
  if (targetLanguage === 'ne' && text.includes('laptop')) {
    return text.replace('laptop', 'ल्यापटप');
  }
  
  if (targetLanguage === 'ne' && text.includes('mobile')) {
    return text.replace('mobile', 'मोबाइल');
  }
  
  return text;
};

// Add NPR currency conversion utility
export const convertToNPR = (usdPrice: number): number => {
  // Using an approximate exchange rate (adjust as needed)
  const exchangeRate = 130.5;
  return Math.round(usdPrice * exchangeRate);
};

// Function to get greeting based on time of day
export const getTimeBasedGreeting = (language: SupportedLanguage = 'en'): string => {
  const hour = new Date().getHours();
  
  if (language === 'en') {
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }
  
  if (language === 'ne') {
    if (hour < 12) return "शुभ प्रभात";
    if (hour < 18) return "शुभ दिउँसो";
    return "शुभ साँझ";
  }
  
  // Default to English for other languages
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};
