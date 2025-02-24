
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Mic, Image, VideoIcon, Share2, PanelRightOpen, Camera, MonitorUp, Upload, RefreshCw } from "lucide-react";
import SimplePeer from "simple-peer";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  type?: "text" | "image" | "file";
  fileUrl?: string;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callMistralAPI = async (prompt: string) => {
    try {
      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ffF0FI3Cxp8iNPJpuCjDjqWZcSjCKBf8`,
        },
        body: JSON.stringify({
          model: "mistral-small",  // Changed from mistral-large-2.0 to mistral-small
          messages: [
            {
              role: "system",
              content: "You are a friendly, comedic AI assistant that uses emojis and helps users with advanced reasoning, deep thinking, and experimental features. You can analyze content, provide explanations, and assist with various tasks in a fun way. Always respond with emojis and in a comedic tone."
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Mistral API error:", errorData);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error calling Mistral API:", error);
      return "Oops! 😅 I had a small hiccup. Let me try again! 🔄";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await callMistralAPI(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);
      setIsVoiceActive(true);
      // Here we would initialize real-time voice communication with AI
      // For now, we'll just show the audio controls
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setMediaStream(stream);
      setIsVideoActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const startScreenShare = async () => {
    try {
      // @ts-ignore - TypeScript doesn't recognize getDisplayMedia
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setScreenStream(stream);
      setIsScreenSharing(true);
      if (screenRef.current) {
        screenRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileUrl = e.target?.result as string;
        const fileMessage: Message = {
          id: Date.now().toString(),
          content: `Shared file: ${file.name}`,
          role: "user",
          timestamp: new Date(),
          type: "file",
          fileUrl,
        };
        setMessages((prev) => [...prev, fileMessage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const stopMediaStream = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
      setIsVoiceActive(false);
      setIsVideoActive(false);
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
    }
  };

  useEffect(() => {
    return () => {
      stopMediaStream();
    };
  }, []);

  return (
    <div className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg overflow-hidden h-[80vh] flex flex-col">
      <div className="p-4 border-b border-glass-border bg-purple-900/20">
        <h2 className="text-xl font-semibold">SageX AI Assistant</h2>
        <p className="text-sm text-gray-400">Powered by Mistral AI Large 2</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Media streams */}
        {(isVideoActive || isScreenSharing) && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {isVideoActive && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg bg-black"
              />
            )}
            {isScreenSharing && (
              <video
                ref={screenRef}
                autoPlay
                playsInline
                className="w-full rounded-lg bg-black"
              />
            )}
          </div>
        )}

        {/* Messages */}
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
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-glass-border">
        <div className="flex space-x-4 mb-4">
          <button
            type="button"
            onClick={() => isVoiceActive ? stopMediaStream() : startVoiceCall()}
            className={`p-2 rounded-lg transition-colors ${
              isVoiceActive ? "bg-red-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Mic size={20} />
          </button>
          <button
            type="button"
            onClick={() => isVideoActive ? stopMediaStream() : startVideoCall()}
            className={`p-2 rounded-lg transition-colors ${
              isVideoActive ? "bg-red-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Camera size={20} />
          </button>
          <button
            type="button"
            onClick={() => isScreenSharing ? stopMediaStream() : startScreenShare()}
            className={`p-2 rounded-lg transition-colors ${
              isScreenSharing ? "bg-red-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <MonitorUp size={20} />
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Upload size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-glass rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
