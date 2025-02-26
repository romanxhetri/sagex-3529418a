
import React from "react";
import { motion } from "framer-motion";
import { Message } from "@/types/chat";
import { Upload, Brain } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const renderContent = (content: string) => {
    // Convert emoji shortcodes to actual emojis
    return content.replace(/:([\w+-]+):/g, (match, shortcode) => {
      const emojiMap: { [key: string]: string } = {
        "smile": "😊",
        "think": "🤔",
        "brain": "🧠",
        "star": "⭐",
        "rocket": "🚀",
        // Add more emoji mappings as needed
      };
      return emojiMap[shortcode] || match;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
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
              {message.type === "file" ? (
                <div className="flex items-center space-x-2">
                  <Upload size={20} />
                  <span>{message.content}</span>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">
                  {renderContent(message.content)}
                </div>
              )}
            </div>
            
            {message.role === "assistant" && message.reasoning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-start space-x-2 text-sm text-purple-300 bg-glass/30 p-2 rounded"
              >
                <Brain size={16} className="mt-1" />
                <div className="flex-1">
                  <div className="font-semibold mb-1">Reasoning Process:</div>
                  <div className="opacity-90">{message.reasoning}</div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
      
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-2 text-gray-400"
        >
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
        </motion.div>
      )}
    </div>
  );
};
