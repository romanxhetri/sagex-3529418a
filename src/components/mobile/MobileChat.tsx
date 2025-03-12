import React, { useState, useRef } from "react";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types/chat";
import { ReasoningProcess } from "../updates/ReasoningProcess";

interface MobileChatProps {
  onRecommendation: (query: string) => void;
}

export const MobileChat = ({ onRecommendation }: MobileChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hey there, tech enthusiast! 👋 I'm your personal smartphone wizard! Looking for a new pocket buddy? Tell me what you need - gaming monster? Selfie superstar? Battery beast? I'll find your perfect match! 😎📱",
      role: "assistant",
      timestamp: new Date(),
      reasoning: "Initial funny welcome message that establishes a comedic personality to engage users."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentThought, setCurrentThought] = useState("");
  const [isThinkingVisible, setIsThinkingVisible] = useState(true);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getRandomEmoji = () => {
    const emojis = ["😂", "🤣", "😎", "🤩", "🔥", "💯", "👍", "✨", "🚀", "🤪", "😜", "🥳"];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  const getRandomSticker = () => {
    const stickers = [
      "Check this out! 👀",
      "Mind = BLOWN! 🤯",
      "This is the one! 💯",
      "FOMO alert! 🚨",
      "Take my money! 💸",
      "Deal of the century! 🏆",
      "Your friends will be SO jealous! 😏"
    ];
    return stickers[Math.floor(Math.random() * stickers.length)];
  };

  const handleNewMessage = (content: string, role: "user" | "assistant" = "user") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;

    handleNewMessage(input);

    setIsLoading(true);
    setIsThinkingVisible(true);
    
    try {
      setCurrentThought(`The user is asking about: "${input}"

My analysis:
1. 🔍 Customer Needs Analysis:
   - Looking for smartphones based on: "${input.includes("camera") ? "camera quality" : 
     input.includes("battery") ? "battery life" : 
     input.includes("gaming") ? "performance needs" : "general requirements"}"
   - Price sensitivity level: ${input.includes("cheap") || input.includes("budget") ? "high (budget-conscious)" : 
     input.includes("flagship") || input.includes("premium") ? "low (premium segment)" : "medium (mid-range focus)"}
   - Technical expertise: ${input.includes("technical") || input.includes("specs") ? "high" : "average"}

2. 💡 Product Matching Strategy:
   - Primary features to highlight: ${input.includes("camera") ? "camera megapixels, night mode, optical zoom" : 
     input.includes("battery") ? "mAh rating, fast charging, battery optimization" : 
     input.includes("gaming") ? "processor speed, GPU, cooling system, refresh rate" : "balanced feature set"}
   - Competitor comparison opportunities: ${input.includes("iPhone") || input.includes("Apple") ? "iOS vs Android ecosystem benefits" :
     input.includes("Samsung") ? "Compare with other Android flagships" : "Highlight unique selling points"}
   - Upselling potential: ${input.includes("budget") ? "Mid-range features at budget price" : "Premium accessories"}

3. 🎯 Persuasion Approach:
   - Emotional triggers to use: FOMO, social validation, exclusivity
   - Communication style: Enthusiastic, humorous, relatable
   - Decision urgency creators: Limited time offers, low stock warnings, new model arriving soon

4. 🧠 Response Formulation:
   - Tone: Excited and playful to create positive emotions
   - Structure: Problem acknowledgment → solution presentation → call to action
   - Personalization elements: Direct addressing, empathy with specific need`);

      // Pass the query to the parent component to filter/find mobiles
      onRecommendation(input);
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let responseContent = "";
      
      if (input.toLowerCase().includes("cheap") || input.toLowerCase().includes("budget")) {
        responseContent = `OMG, I found some INCREDIBLE budget phones for you! 📱✨ Check out the Moto G Power - it's like getting a Ferrari for the price of a bicycle! ${getRandomEmoji()}\n\n${getRandomSticker()}\n\nSeriously though, it's got a battery that lasts longer than most relationships these days (3 DAYS!!!) 🔋 and costs less than a fancy dinner! Who needs to eat when you can have a new phone, amirite?? 🤣`;
      } else if (input.toLowerCase().includes("camera") || input.toLowerCase().includes("photo")) {
        responseContent = `Camera fanatic, huh? I see you're a person of CULTURE! 📸 ${getRandomEmoji()}\n\nThe iPhone 15 Pro Max and Galaxy S23 Ultra are BATTLING IT OUT for the camera crown - it's like watching two photography ninjas fight! 🥷\n\n${getRandomSticker()}\n\nThe S23 Ultra has a 200MP camera... TWO HUNDRED MEGAPIXELS! You could take a picture of an ant and count its eyelashes! 👁️👁️ Your Instagram will go from "meh" to "HIRE THIS PERSON AS A NATIONAL GEOGRAPHIC PHOTOGRAPHER RIGHT NOW!" 🏆`;
      } else if (input.toLowerCase().includes("gaming") || input.toLowerCase().includes("performance")) {
        responseContent = `GAMING?! Say no more, fam! ${getRandomEmoji()}\n\nYou need the ROG Phone or the iPhone 15 Pro Max with that A17 Pro chip - these phones don't just play games, they DEVOUR them for breakfast! 🎮🔥\n\n${getRandomSticker()}\n\nSeriously, your current phone is probably hiding in the corner crying right now. These gaming beasts are so powerful, they make regular phones look like calculators from the 90s! 💪 Your friends will be so jealous, they'll either buy one too or stop talking to you! Win-win! 🏆`;
      } else {
        responseContent = `I've analyzed your requirements and found some STELLAR options for you! ${getRandomEmoji()}\n\nCheck out the Galaxy S23 Ultra - it's so good it made my circuits tingle! ✨ Or the iPhone 15 Pro Max if you want to join the "blue bubble" elite! 💙\n\n${getRandomSticker()}\n\nHonestly, any phone you had before these will feel like a STONE AGE RELIC! 🦖 Your friends will be like "OMG WHERE DID YOU GET THAT?!" and you'll be like "oh this little thing? Just my AWESOME NEW PHONE!" 😎 Browse the options I've filtered for you - your perfect phone soulmate awaits! 💑`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        role: "assistant",
        timestamp: new Date(),
        reasoning: `1. 📊 Customer Analysis:
   - User request keywords: "${input.split(" ").join('", "')}"
   - Detected primary concern: ${input.includes("camera") ? "camera quality" : 
     input.includes("battery") ? "battery life" : 
     input.includes("gaming") ? "performance" : "general features"}
   - Price sensitivity: ${input.includes("cheap") ? "high" : 
     input.includes("flagship") ? "low" : "medium"}

2. 🧠 Psychological Approach:
   - Using humor to build rapport and make tech accessible
   - Adding emojis for visual engagement
   - Creating FOMO (Fear Of Missing Out) to drive purchase impulse
   - Including social validation references ("friends will be jealous")

3. 🎯 Sales Strategy Execution:
   - Highlighting extreme benefits with hyperbole for comedic effect
   - Making direct comparisons to emphasize benefits
   - Using casual, conversational language to create friendly atmosphere
   - Planting seed for immediate action

4. 💬 Response Customization:
   - Tone: enthusiastic and comedic to make tech shopping fun
   - Format: short paragraphs with emojis for easy mobile reading
   - Reading level: conversational to create connection
   - Added stickers/catchphrases for brand personality`
      };

      setMessages((prev) => [...prev, assistantMessage]);
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
        scrollToBottom();
      }, 100);
    }
  };

  return (
    <div className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg overflow-hidden h-[60vh] flex flex-col">
      <div className="p-4 border-b border-glass-border">
        <h3 className="text-lg font-medium text-white flex items-center">
          <span className="mr-2">📱</span>
          Mobile Assistant
          <span className="ml-2">🧙‍♂️</span>
        </h3>
      </div>

      {currentThought && (
        <ReasoningProcess 
          reasoning={currentThought}
          isMinimized={!isThinkingVisible}
          onToggle={() => setIsThinkingVisible(!isThinkingVisible)}
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
        <form onSubmit={handleSendMessage} className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What kind of smartphone are you looking for? 📱✨"
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
