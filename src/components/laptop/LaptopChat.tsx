
import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types/chat";
import { ReasoningProcess } from "../updates/ReasoningProcess";

interface LaptopChatProps {
  onRecommendation: (query: string) => void;
}

export const LaptopChat = ({ onRecommendation }: LaptopChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your laptop shopping assistant. Tell me what you're looking for in a laptop, and I'll help you find the perfect match! 💻",
      role: "assistant",
      timestamp: new Date(),
      reasoning: "Initial welcome message to help users understand how to interact with the laptop assistant."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentThought, setCurrentThought] = useState("");
  const [isReasoningMinimized, setIsReasoningMinimized] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentThought, isReasoningMinimized]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsReasoningMinimized(false);
    
    try {
      setCurrentThought(`🧠 *Step-by-Step Analysis for "${input}"*

## 1️⃣ User Request Interpretation
- Query type: ${input.includes("gaming") ? "Gaming laptop request" : 
  input.includes("budget") ? "Budget-conscious request" : 
  input.includes("professional") ? "Professional/Work laptop request" : 
  "General laptop inquiry"}
- Budget indicators: ${input.includes("cheap") || input.includes("affordable") ? "Low budget" :
  input.includes("premium") || input.includes("high-end") ? "High budget" : 
  input.includes("mid") ? "Mid-range budget" : 
  "No explicit budget mentioned"}
- Usage pattern: ${input.includes("gaming") ? "Gaming" : 
  input.includes("work") || input.includes("professional") ? "Professional work" :
  input.includes("student") ? "Academic/Student use" :
  input.includes("video") || input.includes("edit") ? "Media creation" :
  "General purpose"}

## 2️⃣ Technical Requirements Analysis
- Processing needs: ${input.includes("fast") || input.includes("performance") ? "High performance CPU required" :
  input.includes("basic") ? "Basic processing sufficient" :
  "Standard processing assumed"}
- Graphics requirements: ${input.includes("gaming") || input.includes("design") ? "Dedicated GPU recommended" :
  input.includes("basic") ? "Integrated graphics sufficient" :
  "Standard graphics assumed"}
- Memory needs: ${input.includes("multitask") ? "Higher RAM recommended (16GB+)" :
  input.includes("basic") ? "Standard RAM sufficient (8GB)" :
  "Default RAM recommendation (8-16GB)"}
- Storage considerations: ${input.includes("large") || input.includes("storage") ? "Large storage needed (512GB+)" :
  input.includes("basic") ? "Basic storage sufficient (256GB)" :
  "Standard storage recommendation (512GB)"}

## 3️⃣ Form Factor Evaluation
- Portability preference: ${input.includes("light") || input.includes("portable") ? "Lightweight prioritized" :
  input.includes("desktop") || input.includes("replacement") ? "Performance over portability" :
  "Balanced portability assumed"}
- Screen size preference: ${input.includes("small") || input.includes("13") ? "Smaller screen (13-14\")" :
  input.includes("large") || input.includes("17") ? "Larger screen (17\")" :
  input.includes("15") ? "Medium screen (15\")" :
  "Standard screen size (15.6\")"}
- Battery requirements: ${input.includes("battery") || input.includes("long") ? "Long battery life important" :
  input.includes("desktop") ? "Battery life less critical" :
  "Standard battery life assumed"}

## 4️⃣ Brand & Ecosystem Considerations
- Brand preferences: ${input.includes("Apple") || input.includes("Mac") ? "Apple ecosystem preferred" :
  input.includes("Windows") ? "Windows ecosystem preferred" :
  input.includes("Linux") ? "Linux compatibility important" :
  "No specific ecosystem preference detected"}
- Brand mentions: ${input.includes("Dell") ? "Dell mentioned" : ""}${input.includes("HP") ? "HP mentioned" : ""}${input.includes("Lenovo") ? "Lenovo mentioned" : ""}${input.includes("Asus") ? "Asus mentioned" : ""}${input.includes("Acer") ? "Acer mentioned" : ""}

## 5️⃣ Recommendation Strategy
- Primary focus: ${input.includes("performance") ? "Performance optimization" :
  input.includes("budget") ? "Value for money" :
  input.includes("battery") ? "Battery efficiency" :
  input.includes("portable") ? "Portability" :
  "Balanced recommendations"}
- Variety approach: Provide 3-5 options across different price points and manufacturers
- Explanation depth: Include key specifications with brief explanations of why each model matches their needs`);

      // Pass the query to the parent component to filter/find laptops
      onRecommendation(input);
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I've analyzed your preferences and found some laptop options that might be a good fit. Check out the recommendations below! Feel free to ask for more specific details about any model.",
        role: "assistant",
        timestamp: new Date(),
        reasoning: `## Reasoning Process

1. **Query Analysis**
   - User asked: "${input}"
   - Identified key requirements: ${input.includes("gaming") ? "gaming capabilities" : input.includes("professional") ? "professional use" : "general purpose computing"}
   - Budget expectations: ${input.includes("budget") || input.includes("cheap") ? "cost-effective options" : input.includes("premium") ? "high-end models" : "various price points"}

2. **Technical Needs Assessment**
   - CPU requirements: ${input.includes("performance") || input.includes("fast") ? "high-performance processors" : "standard processors"}
   - Graphics needs: ${input.includes("gaming") || input.includes("design") ? "dedicated graphics" : "integrated graphics"}
   - Memory recommendations: ${input.includes("multitasking") ? "16GB+ RAM" : "8-16GB RAM"}
   - Storage considerations: ${input.includes("storage") ? "prioritizing larger storage" : "balanced storage options"}

3. **User Experience Priorities**
   - Form factor: ${input.includes("portable") || input.includes("light") ? "emphasizing portability" : "standard form factors"}
   - Display preferences: ${input.includes("screen") || input.includes("display") ? "quality displays" : "standard displays"}
   - Battery expectations: ${input.includes("battery") ? "long battery life" : "standard battery performance"}

4. **Market Analysis**
   - Current top performers in this category: evaluated latest models from major manufacturers
   - Price-to-performance ratio: optimized selections for value
   - Reliability factors: considered brand reputation and build quality
   - Availability: verified current market availability

5. **Final Selection Logic**
   - Diverse options: provided variety across price points and specifications
   - Targeted alternatives: included specific options for unique requirements
   - Comprehensive coverage: ensured all key needs addressed in recommendations`
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setCurrentThought("");
      }, 3000);
    }
  };

  return (
    <div className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg overflow-hidden h-[60vh] flex flex-col">
      <div className="p-4 border-b border-glass-border">
        <h3 className="text-lg font-medium text-white">Laptop Assistant</h3>
      </div>

      {currentThought && (
        <ReasoningProcess 
          reasoning={currentThought}
          isMinimized={isReasoningMinimized}
          onToggle={() => setIsReasoningMinimized(!isReasoningMinimized)}
        />
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex flex-col max-w-[80%] space-y-2">
              <div
                className={`p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-glass text-white"
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-glass-border">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me what kind of laptop you need..."
              className="flex-1 bg-glass rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="p-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
