
import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameChatProps {
  gameId: string | null;
}

export const GameChat = ({ gameId }: GameChatProps) => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hi there! Need any tips or strategies for this game? I'm here to help! 😎", isUser: false }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    // Generate AI response based on game type
    setTimeout(() => {
      let response = "";
      
      if (gameId === "tictactoe") {
        const responses = [
          "For Tic Tac Toe, try to take the center square if you can - it's part of more winning combinations than any other square! 🎯",
          "Corner squares are more valuable than edge squares in Tic Tac Toe. Try to grab them early! 🎮",
          "If the AI takes the center, go for a corner. If it takes a corner, take the center! 🧠",
          "Watch for 'fork' opportunities where you can create two winning lines at once! That's an automatic win! 🏆",
          "The first player in Tic Tac Toe has a big advantage. Use it wisely! 💪"
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
      } else if (gameId === "chess") {
        const responses = [
          "In chess, try to control the center of the board early in the game. This gives your pieces more mobility! ♟️",
          "Remember to develop your knights and bishops before making major moves with your queen. Development is key! 🧩",
          "Castle early to protect your king and connect your rooks. Safety first! 🏰",
          "When playing against the AI, look for tactical opportunities - computers sometimes miss long-term strategic advantages! 🔍",
          "Pawns may seem weak, but their structure is critical. Don't create too many pawn weaknesses! 👑"
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
      } else {
        const responses = [
          "What aspect of the game are you finding challenging? I can offer specific strategies! 🤔",
          "Remember that practice makes perfect! Even losing games teach valuable lessons. 📚",
          "Try different approaches each time you play - experimentation is the key to mastery! 🔬",
          "Our AI adjusts to your skill level over time, providing just the right challenge! 🎯",
          "Don't forget to have fun! Games are about enjoyment as much as winning! 🎉"
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
      }
      
      setMessages(prev => [...prev, { text: response, isUser: false }]);
      setIsTyping(false);
    }, 1000);
  };
  
  return (
    <div className="flex flex-col h-[300px]">
      <div className="flex-1 overflow-y-auto scrollbar-none mb-4 space-y-4 pr-1">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-[85%] rounded-lg px-3 py-2 ${
                message.isUser 
                  ? "bg-purple-600 text-white" 
                  : "bg-gray-800 text-white"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-white rounded-lg px-3 py-2 max-w-[85%]">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSend} className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for game tips..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={isTyping}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};
