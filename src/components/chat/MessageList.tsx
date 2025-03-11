
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
        "laugh": "😂",
        "lol": "🤣",
        "cool": "😎",
        "fire": "🔥",
        "heart": "❤️",
        "party": "🎉",
        "wow": "😮",
        "happy": "😄",
        "dance": "💃",
        "magic": "✨",
      };
      return emojiMap[shortcode] || match;
    });
  };

  // Function to convert markdown images to HTML and add stickers
  const renderMarkdownContent = (content: string) => {
    // Replace markdown image syntax with HTML
    let contentWithImages = content.replace(
      /!\[(.*?)\]\((.*?)\)/g, 
      '<img src="$2" alt="$1" class="rounded-lg max-w-full my-3 max-h-96" />'
    );
    
    // Add random stickers and enhance with emoji
    const addRandomSticker = () => {
      const stickers = [
        '😂', '🤣', '😎', '🔥', '💯', '✨', '🚀', '🎉', '🥳', '😍', 
        '💪', '👍', '🙌', '🤩', '🤪', '🧠', '🦄', '🎯', '🧸', '💫'
      ];
      return stickers[Math.floor(Math.random() * stickers.length)];
    };
    
    // Add stickers to beginning and end of paragraphs for comic effect
    contentWithImages = contentWithImages.replace(/<p>/g, `<p>${addRandomSticker()} `);
    contentWithImages = contentWithImages.replace(/<\/p>/g, ` ${addRandomSticker()}</p>`);
    
    return { __html: contentWithImages };
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-5">
      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div className="flex flex-col max-w-[85%] lg:max-w-[75%] space-y-2">
            <div
              className={`p-5 rounded-lg text-lg shadow-lg ${
                message.role === "user"
                  ? "bg-purple-600 text-white"
                  : "bg-glass text-white border border-purple-400/20"
              }`}
            >
              {message.type === "file" ? (
                <div className="flex items-center space-x-2">
                  <Upload size={24} />
                  <span className="text-lg">{message.content}</span>
                </div>
              ) : (
                <div 
                  className="whitespace-pre-wrap text-base md:text-lg leading-relaxed"
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
          className="flex items-center space-x-3 text-gray-400 p-4 bg-glass/30 rounded-lg w-fit"
        >
          <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce" />
          <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
          <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
        </motion.div>
      )}
    </div>
  );
};
