
export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  language?: string;
  suggestedQuestions?: string[];
  reasoning?: string;
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
