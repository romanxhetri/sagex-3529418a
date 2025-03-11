
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

export const translateToLanguage = async (text: string, targetLanguage: string): Promise<string> => {
  // Placeholder for actual translation service
  console.log(`Translating to ${targetLanguage}: ${text}`);
  return text;
};
