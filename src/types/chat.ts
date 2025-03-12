
export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: number;  // Changed to only accept number
  language?: string;
  suggestedQuestions?: string[];
  reasoning?: string;
  fileUrl?: string;
  type?: "text" | "file" | "image";
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

export type SupportedLanguage = "en" | "ne" | "es" | "fr" | "de" | "ja" | "zh" | "ar";

export interface Laptop {
  id: string;
  name: string;
  brand: string;
  price: number;
  priceNPR: number;
  processor: string;
  ram: string;
  storage: string;
  display: string;
  graphics: string;
  os: string;
  battery: string;
  weight: string;
  color: string;
  image: string;
  imageUrl?: string;
  batteryLife?: string;
  inStock: boolean;
  rating: number;
  featured?: boolean;
  discount?: number;
  category: "gaming" | "business" | "student" | "professional" | "budget" | "creative" | "ultrabook" | "workstation" | "convertible";
  ports: string[];
  features: string[];
}

export interface Mobile {
  id: string;
  name: string;
  brand: string;
  price: number;
  priceNPR: number;
  camera: string;
  display: string;
  processor: string;
  ram: string;
  storage: string;
  battery: string;
  batteryLife?: string;
  color: string;
  os: string;
  image: string;
  imageUrl?: string;
  inStock: boolean;
  rating: number;
  featured?: boolean;
  discount?: number;
  weight?: string;
  features: string[];
  category: "flagship" | "mid-range" | "budget" | "camera" | "gaming";
}

