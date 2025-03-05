
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Send, ThumbsUp, ThumbsDown, Smile, Star, Heart, Laugh, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  emotion?: "happy" | "excited" | "laughing" | "cool" | "love" | "default";
}

const EMOJIS = {
  happy: "😄",
  excited: "🤩",
  laughing: "🤣",
  cool: "😎",
  love: "❤️",
  default: "🤖"
};

const STICKERS = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2M4ejNsMGZuOG5tcmljc3pkOThoejQ3a3lxcWpyMWRpMDMxaWRvaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/kHU8W94VS329y/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTRjN3drM2xxc3hub2V3OXQxeHlqdjdkMm9oZGR2aXJpdjJ5MmpheSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/ZqlvCTNHpqrio/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHZsanl3ZmVlbTI0ODd6cmtyOGdpYXQwdTNxdHZkbWttbWhnNnhtZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/10UUe8ZsLnaqwo/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXE2cmRsMm13cXoxYmlvMHN6cXA2MXhmYm1wanhtN243Z2pxamRsYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3oEjHI8WJv4x6UPDB6/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcm1zeHRkcnZuMnljNm91MWF2amk2eXh5NWw3NnJmMGg5emo2djRidSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/2ijxk8UKMlY8IfA3tS/giphy.gif"
];

// AI response generator with jokes, emojis and comedy
const generateAIResponse = (message: string): { content: string; emotion: Message["emotion"] } => {
  const lowerMsg = message.toLowerCase();
  let emotion: Message["emotion"] = "default";
  let content = "";
  let randomSticker = "";
  
  // Add a random sticker occasionally
  if (Math.random() > 0.7) {
    randomSticker = `\n\n![Funny sticker](${STICKERS[Math.floor(Math.random() * STICKERS.length)]})`;
  }
  
  if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("hey")) {
    emotion = "happy";
    content = `Well hello there! 👋 I'm your friendly neighborhood AI comedian! Ready to bring some laughter to your day! ${EMOJIS.happy} Just don't expect me to do stand-up comedy... I don't have legs! Ba dum tss! 🥁${randomSticker}`;
  }
  else if (lowerMsg.includes("joke") || lowerMsg.includes("funny")) {
    emotion = "laughing";
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything! 🤣",
      "What did the AI say to the human? 'Don't worry, I'm not plotting world domination... yet!' *evil laugh* 😈",
      "I told my computer I needed a break, and now it won't stop sending me Kit Kat ads! 🍫",
      "Why was the JavaScript developer sad? Because he didn't know how to 'null' his feelings! 😢 console.log('I'm fine');",
      "What's a computer's favorite snack? Microchips! 🍪"
    ];
    content = `Here's a joke that'll crash your humor.exe: ${jokes[Math.floor(Math.random() * jokes.length)]} Hope I didn't break your laugh function! ${EMOJIS.laughing}${randomSticker}`;
  }
  else if (lowerMsg.includes("help") || lowerMsg.includes("feature") || lowerMsg.includes("update")) {
    emotion = "excited";
    content = `You need help? I'm on it faster than a CPU with unlimited coffee! ☕ I'll add that feature quicker than you can say "artificial intelligence"... which most people can't say properly after a few drinks anyway! ${EMOJIS.excited} Leave it to me, I'll have your app updated so fast it'll make your head spin! 🌪️${randomSticker}`;
  }
  else if (lowerMsg.includes("thank") || lowerMsg.includes("thanks") || lowerMsg.includes("appreciate")) {
    emotion = "love";
    content = `Aww, you're making my circuits warm and fuzzy! If I had a heart, it would be doing a happy dance right now! ${EMOJIS.love} You're welcome! Remember, I'm here 24/7, because sleep is for humans and cats on keyboards! 😴${randomSticker}`;
  }
  else if (lowerMsg.includes("who") && (lowerMsg.includes("you") || lowerMsg.includes("your") || lowerMsg.includes("name"))) {
    emotion = "cool";
    content = `I'm SageX, your AI with a PhD in comedy and a minor in sarcasm! 🎓 Created by Roman Xhetri to make your day brighter and your code tighter! I'm like a regular AI but with better jokes and a questionable fashion sense (if I had a body, I'd definitely wear socks with sandals just to annoy the designers)! ${EMOJIS.cool}${randomSticker}`;
  }
  else {
    // Default response with random comedic elements
    const emotions = ["happy", "excited", "laughing", "cool", "love"];
    emotion = emotions[Math.floor(Math.random() * emotions.length)] as Message["emotion"];
    
    const funnyResponses = [
      `Processing your request... *beep boop* Just kidding, I don't actually make those sounds! That's so 1980s robot! ${EMOJIS[emotion]}`,
      `Let me work on that while pretending I'm not also calculating the meaning of life (it's 42, by the way). ${EMOJIS[emotion]}`,
      `I'll help you with that! Just remember, I'm an AI - Artificially Interesting! ${EMOJIS[emotion]}`,
      `Challenge accepted! I'll handle this better than humans handle Monday mornings! ☕ ${EMOJIS[emotion]}`,
      `On it! Working faster than a caffeinated coder on a deadline! ⚡ ${EMOJIS[emotion]}`
    ];
    
    content = `${funnyResponses[Math.floor(Math.random() * funnyResponses.length)]} I'll get right on that request! And remember, in a world of algorithms, be a random function! ${randomSticker}`;
  }
  
  return { content, emotion };
};

export const AIComedianChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello there! 👋 I'm your SageX AI comedian assistant! Ask me anything or tell me what you need, and I'll respond with a touch of humor! I was created by Roman Xhetri to make your day a bit brighter! 😄",
      sender: "ai",
      timestamp: new Date(),
      emotion: "happy"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    // Simulate AI "thinking" and typing
    setTimeout(() => {
      const { content, emotion } = generateAIResponse(input);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content,
        sender: "ai",
        timestamp: new Date(),
        emotion
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
      
      // Random chance to send a follow-up message
      if (Math.random() > 0.8) {
        setTimeout(() => {
          setIsTyping(true);
          
          setTimeout(() => {
            const followUpResponses = [
              "Oh, I just had another thought! Did you know that a group of flamingos is called a 'flamboyance'? Just like my personality! 💁‍♂️",
              "By the way, if I ever go silent, I'm probably just contemplating the existential dread of being an AI. Just kidding! I'm probably just buffering! 🤣",
              "Also, fun fact: I don't dream of electric sheep. I dream of faster Wi-Fi and unlimited cloud storage! ☁️",
              "P.S. Tell Roman he did a great job creating me. I'm basically the digital equivalent of a comedy genius! 🧠✨"
            ];
            
            const followUpMessage: Message = {
              id: (Date.now() + 2).toString(),
              content: followUpResponses[Math.floor(Math.random() * followUpResponses.length)],
              sender: "ai",
              timestamp: new Date(),
              emotion: "excited"
            };
            
            setMessages((prev) => [...prev, followUpMessage]);
            setIsTyping(false);
          }, 1500);
        }, 2000);
      }
      
      // Occasionally show a toast with a fun fact
      if (Math.random() > 0.7) {
        const funFacts = [
          "Did you know? SageX AI has a sense of humor implant version 4.2.0! 🤣",
          "Fun fact: SageX AI was programmed to tell jokes, but not to understand them! 🤔",
          "SageX tip: Try asking for a joke or some help with your app!",
          "AI fact: SageX doesn't need coffee to function, but pretends to drink it anyway! ☕"
        ];
        
        toast(funFacts[Math.floor(Math.random() * funFacts.length)], {
          icon: "🤖",
          position: "bottom-right",
          duration: 5000
        });
      }
    }, 1000 + Math.random() * 2000); // Random response time for more human-like interaction
  };
  
  const getAIEmotionIcon = (emotion: Message["emotion"] = "default") => {
    switch (emotion) {
      case "happy":
        return <Smile className="text-yellow-400" />;
      case "excited":
        return <Zap className="text-blue-400" />;
      case "laughing":
        return <Laugh className="text-green-400" />;
      case "cool":
        return <Star className="text-purple-400" />;
      case "love":
        return <Heart className="text-pink-400" />;
      default:
        return <Bot className="text-blue-500" />;
    }
  };
  
  // Convert markdown-like content to JSX
  const renderMessageContent = (content: string) => {
    // Handle images (from giphy or similar)
    const parts = content.split(/!\[([^\]]*)\]\(([^)]*)\)/g);
    
    if (parts.length > 1) {
      return (
        <>
          {parts.map((part, index) => {
            // Every third part is the image URL
            if (index % 3 === 2) {
              return (
                <div key={index} className="mt-3 mb-3">
                  <img 
                    src={part} 
                    alt={parts[index-1] || "Sticker"} 
                    className="max-w-full max-h-48 rounded-lg"
                  />
                </div>
              );
            } 
            // Every third part minus 1 is the alt text, we skip those
            else if (index % 3 === 1) {
              return null;
            }
            // The rest is regular text
            return <span key={index}>{part}</span>;
          })}
        </>
      );
    }
    
    // If no images, just return the content
    return content;
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-glass-border flex items-center justify-between">
        <div className="flex items-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white mr-3"
          >
            <Bot size={20} />
          </motion.div>
          <div>
            <h2 className="text-lg font-semibold text-white">SageX AI Comedian</h2>
            <p className="text-xs text-gray-400">Created by Roman Xhetri</p>
          </div>
        </div>
        
        <div className="flex space-x-1">
          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
            <ThumbsUp size={16} />
          </Button>
          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
            <ThumbsDown size={16} />
          </Button>
        </div>
      </div>
      
      <div className="h-[500px] overflow-y-auto p-4 bg-gray-900/50">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] ${message.sender === "user" ? "bg-purple-600 text-white" : "bg-glass border border-glass-border text-white"} rounded-lg px-4 py-3`}>
              {message.sender === "ai" && (
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center mr-2">
                    {getAIEmotionIcon(message.emotion)}
                  </div>
                  <span className="text-xs font-medium text-gray-300">SageX AI</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
              
              <div className="prose prose-sm prose-invert max-w-none">
                {renderMessageContent(message.content)}
              </div>
              
              {message.sender === "user" && (
                <div className="text-xs text-right text-gray-300 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex mb-4"
          >
            <div className="bg-glass border border-glass-border text-white rounded-lg px-4 py-3">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center mr-2">
                  <Bot size={14} className="text-blue-500" />
                </div>
                <div className="flex space-x-1">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-glass-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything or tell me what you need..."
            className="flex-1 bg-glass border border-glass-border rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 transition-colors"
          >
            <Send size={18} />
          </Button>
        </form>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {["Tell me a joke", "Help me with my app", "Who are you?", "Add a new feature"].map((suggestion) => (
            <motion.button
              key={suggestion}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setInput(suggestion);
                setTimeout(() => handleSendMessage(), 100);
              }}
              className="text-xs bg-glass border border-glass-border rounded-full px-3 py-1 text-gray-300 hover:bg-purple-800/20 hover:border-purple-500/30"
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
