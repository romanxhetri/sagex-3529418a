
export type SupportedLanguage = 
  | "en"
  | "fr"
  | "de"
  | "es"
  | "zh"
  | "ja"
  | "ko"
  | "ar"
  | "ru"
  | "pt"
  | "it"
  | "hi"
  | "tr"
  | "nl"
  | "sv"
  | "pl"
  | "vi"
  | "th"
  | "id"
  | "ne";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "text" | "image" | "file";
  timestamp?: number | Date;
  language?: SupportedLanguage;
  reasoning?: string;
  fileUrl?: string;
  suggestedQuestions?: string[];
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
  weight: string;
  os: string;
  batteryLife: string;
  ports: string[];
  category: "gaming" | "ultrabook" | "workstation" | "budget" | "convertible" | "business" | "student" | "creative";
  features: string[];
  rating?: number;
  priceNpr?: number;
}

export interface Mobile {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  processor: string;
  ram: string;
  storage: string;
  display: string;
  camera: string;
  batteryLife: string;
  weight: string;
  os: string;
  category: "gaming" | "budget" | "flagship" | "mid-range" | "camera";
  rating?: number;
  features: string[];
}

export interface PuzzleType {
  id: number;
  question: string;
  answer: string;
  hint: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface CardType {
  id: number;
  name: string;
  matched: boolean;
  frontImage: string;
  backImage: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
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

// Add a definition for React Three Fiber JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      points: any;
      bufferGeometry: any;
      pointsMaterial: any;
      position: any;
      shaderMaterial: any;
      ambientLight: any;
      directionalLight: any;
      bufferAttribute: any;
      pointLight: any;
    }
  }
}
