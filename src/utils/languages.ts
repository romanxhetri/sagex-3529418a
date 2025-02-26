
import { LanguageOption } from "@/types/chat";
import { pipeline } from '@huggingface/transformers';

export const languages: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "zh", name: "Chinese", nativeName: "中文" }
];

export const translateToLanguage = async (text: string, targetLang: string) => {
  try {
    const translator = await pipeline('translation', 'facebook/mbart-large-50-many-to-many-mmt');
    const result = await translator(text, {
      max_length: 512,
      forced_bos_token_id: targetLang === "ne" ? "ne_NP" : `${targetLang}_XX`,
    });

    if (Array.isArray(result)) {
      return result[0]?.translation || text;
    }
    
    if (typeof result === 'object' && result !== null) {
      return 'translation' in result ? result.translation : text;
    }

    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};
