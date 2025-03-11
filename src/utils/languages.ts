export const languages = [
  { code: "en", name: "English" },
  { code: "ne", name: "Nepali" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" }
];

export const translateToLanguage = async (text: string, targetLanguage: string): Promise<string> => {
  // Placeholder for actual translation service
  console.log(`Translating to ${targetLanguage}: ${text}`);
  return text;
};
