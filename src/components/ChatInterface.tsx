
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Send, 
  Mic, 
  Camera, 
  MonitorUp, 
  Upload, 
  RefreshCw,
  Brain,
  Zap,
  Globe,
  Settings,
  Terminal,
  Bug,
  Users
} from "lucide-react";
import SimplePeer from "simple-peer";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  type?: "text" | "image" | "file";
  fileUrl?: string;
}

interface Capability {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
  description: string;
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
  const [showCapabilities, setShowCapabilities] = useState(false);
  const { toast } = useToast();
  
  const [capabilities, setCapabilities] = useState<Capability[]>([
    {
      id: "advanced-reasoning",
      name: "Advanced Reasoning",
      icon: <Brain size={20} />,
      enabled: true,
      description: "Enhanced logical analysis and complex problem solving 🧠"
    },
    {
      id: "deep-thinking",
      name: "Deep Thinking",
      icon: <Terminal size={20} />,
      enabled: true,
      description: "In-depth analysis and comprehensive understanding 🤔"
    },
    {
      id: "flash-thinking",
      name: "Flash Thinking",
      icon: <Zap size={20} />,
      enabled: true,
      description: "Quick, intuitive responses and rapid processing ⚡"
    },
    {
      id: "experimental",
      name: "Experimental Features",
      icon: <Globe size={20} />,
      enabled: true,
      description: "Access to cutting-edge AI capabilities 🔬"
    },
    {
      id: "auto-update",
      name: "Auto Updates",
      icon: <RefreshCw size={20} />,
      enabled: true,
      description: "AI-powered app improvements and bug fixes 🔄"
    },
    {
      id: "collaborative",
      name: "Collaborative Features",
      icon: <Users size={20} />,
      enabled: true,
      description: "Real-time collaboration tools 👥"
    }
  ]);
  
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

  const toggleCapability = (id: string) => {
    setCapabilities(caps => 
      caps.map(cap => 
        cap.id === id ? { ...cap, enabled: !cap.enabled } : cap
      )
    );
    toast({
      title: "Capability Updated",
      description: `${id} has been ${capabilities.find(c => c.id === id)?.enabled ? 'disabled' : 'enabled'} 🔄`,
    });
  };

  const callMistralAPI = async (prompt: string) => {
    try {
      const enabledCapabilities = capabilities
        .filter(cap => cap.enabled)
        .map(cap => cap.name)
        .join(", ");

      const systemMessage = `You are a friendly, comedic AI assistant that uses emojis and helps users with ${enabledCapabilities}. You excel at advanced reasoning, deep thinking, and experimental features. You can analyze content, provide explanations, and assist with various tasks in a fun way. Always respond with emojis and in a comedic tone. Format your responses with clear sections and emojis for better readability.`;

      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ffF0FI3Cxp8iNPJpuCjDjqWZcSjCKBf8`,
        },
        body: JSON.stringify({
          model: "mistral-medium",  // Changed from mistral-large-2.0 to mistral-medium
          messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2000,
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
      return "Oops! 😅 I had a small hiccup. Let me try again! 🔄\n\nError: " + (error as Error).message;
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
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">SageX AI Assistant</h2>
            <p className="text-sm text-gray-400">Powered by Mistral AI Large 2</p>
          </div>
          <button
            onClick={() => setShowCapabilities(!showCapabilities)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {showCapabilities && (
        <div className="p-4 border-b border-glass-border bg-purple-900/10">
          <h3 className="text-lg font-semibold mb-3">AI Capabilities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {capabilities.map((cap) => (
              <button
                key={cap.id}
                onClick={() => toggleCapability(cap.id)}
                className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                  cap.enabled ? 'bg-purple-600 text-white' : 'bg-glass text-gray-400'
                }`}
              >
                {cap.icon}
                <span>{cap.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
