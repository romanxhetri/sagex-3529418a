
import React from "react";
import { motion } from "framer-motion";
import { Message } from "@/types/chat";
import { Upload } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export const MessageList = ({ messages, isLoading }: MessageListProps) => {
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
          <div
            className={`max-w-[80%] p-3 rounded-lg ${
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
              message.content
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
