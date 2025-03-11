
import React from "react";
import { motion } from "framer-motion";
import { Message } from "@/types/chat";
import { Upload } from "lucide-react";

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

  // Function to convert markdown images to HTML
  const renderMarkdownContent = (content: string) => {
    // Replace markdown image syntax with HTML
    const contentWithImages = content.replace(
      /!\[(.*?)\]\((.*?)\)/g, 
      '<img src="$2" alt="$1" class="rounded-lg max-w-full my-2 max-h-64" />'
    );
    
    return { __html: contentWithImages };
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
          <div className="flex flex-col max-w-[80%] lg:max-w-[70%] space-y-2">
            <div
              className={`p-4 rounded-lg ${
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
                <div 
                  className="whitespace-pre-wrap text-base"
                  dangerouslySetInnerHTML={renderMarkdownContent(message.content)}
                />
              )}
            </div>
          </div>
        </motion.div>
      ))}
      
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-2 text-gray-400"
        >
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
        </motion.div>
      )}
    </div>
  );
};
