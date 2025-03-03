
import React, { useState, useRef } from "react";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types/chat";

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
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    
    try {
      setCurrentThought(`My thinking process:
1. 🔍 Analyzing Request:
   - Parsing user query: "${input}"
   - Identifying key requirements and preferences
   - Determining budget constraints if mentioned

2. 🧠 Matching Requirements:
   - Mapping needs to laptop specifications
   - Considering use cases (gaming, professional, casual)
   - Prioritizing critical features vs. nice-to-have features

3. 💻 Finding Options:
   - Searching inventory for matching laptops
   - Comparing alternatives based on specifications
   - Ranking results by relevance to user needs

4. 📊 Preparing Recommendations:
   - Formatting specs for easy comparison
   - Highlighting key features that match requirements
   - Providing reasoning for each recommendation`);

      // Pass the query to the parent component to filter/find laptops
      onRecommendation(input);
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I've analyzed your preferences and found some laptop options that might be a good fit. Check out the recommendations below! Feel free to ask for more specific details about any model.",
        role: "assistant",
        timestamp: new Date(),
        reasoning: `1. 📝 Request Analysis:
   - Received query about: "${input}"
   - Identified key requirements: ${input.includes("gaming") ? "gaming performance" : input.includes("budget") ? "budget-friendly options" : "general purpose use"}
   - Noted preferences for: ${input.includes("light") ? "portability" : input.includes("power") ? "processing power" : "balanced performance"}

2. 🔍 Evaluation Process:
   - Matched requirements against available laptop database
   - Prioritized models with ${input.includes("RAM") ? "higher RAM" : input.includes("storage") ? "larger storage" : "balanced specifications"}
   - Filtered by ${input.includes("price") ? "price range" : "overall value"}

3. 🧮 Technical Assessment:
   - Evaluated processor capabilities for requested tasks
   - Considered graphics performance for ${input.includes("design") ? "design work" : input.includes("gaming") ? "gaming" : "everyday tasks"}
   - Assessed battery life for ${input.includes("travel") ? "travel needs" : "typical usage"}

4. 💡 Recommendation Logic:
   - Selected laptops that best match overall criteria
   - Included options at different price points
   - Provided diverse brand options for comparison`
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
      setCurrentThought("");
    }
  };

  return (
    <div className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg overflow-hidden h-[60vh] flex flex-col">
      <div className="p-4 border-b border-glass-border">
        <h3 className="text-lg font-medium text-white">Laptop Assistant</h3>
        {currentThought && (
          <div className="mt-2 p-3 bg-purple-900/20 rounded-lg text-sm text-purple-200">
            <div className="font-medium mb-1 flex items-center">
              <span className="mr-2">🧠</span>
              <span>AI Thinking Process:</span>
            </div>
            <div className="pl-6 whitespace-pre-wrap">{currentThought}</div>
          </div>
        )}
      </div>

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
              
              {message.role === "assistant" && message.reasoning && (
                <div className="flex items-start space-x-2 text-sm text-purple-300 bg-glass/30 p-2 rounded">
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Reasoning Process:</div>
                    <div className="opacity-90 whitespace-pre-wrap">{message.reasoning}</div>
                  </div>
                </div>
              )}
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
