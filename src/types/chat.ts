
export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  type?: "text" | "image" | "file";
  fileUrl?: string;
  suggestedQuestions?: string[];
  language?: string;
  reasoning?: string;  // Added this property
}

export interface Capability {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
  description: string;
}

export interface AIFeatures {
  contextualMemory: boolean;
  multimodalProcessing: boolean;
  logicalReasoning: boolean;
  realTimeSearch: boolean;
  safeMode: boolean;
}

export type SupportedLanguage = "en" | "ne" | "hi" | "es" | "fr" | "de" | "ja" | "ko" | "zh";

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

export interface Laptop {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  processor: string;
  ram: string;
  storage: string;
  display: string;
  graphics: string;
  batteryLife: string;
  weight: string;
  os: string;
  category: "gaming" | "business" | "student" | "creative" | "budget";
  rating: number;
}
