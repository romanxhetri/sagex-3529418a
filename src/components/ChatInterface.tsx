import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MessageList } from "./chat/MessageList";
import { CapabilitiesDisplay } from "./chat/CapabilitiesDisplay";
import { MediaControls } from "./chat/MediaControls";
import { Message, Capability } from "@/types/chat";
import { Brain, Terminal, Zap, Globe, RefreshCw, Users } from "lucide-react";

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isReasoningMinimized, setIsReasoningMinimized] = useState(false);
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

  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          model: "mistral-medium",
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

      if (isVoiceActive) {
        const utterance = new SpeechSynthesisUtterance(response);
        window.speechSynthesis.speak(utterance);
      }
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
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = async (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        if (event.results[0].isFinal) {
          const userMessage: Message = {
            id: Date.now().toString(),
            content: transcript,
            role: "user",
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, userMessage]);
          const response = await callMistralAPI(transcript);
          
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: response,
            role: "assistant",
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, assistantMessage]);
          
          const utterance = new SpeechSynthesisUtterance(response);
          window.speechSynthesis.speak(utterance);
        }
      };
      
      recognition.start();
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
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { 
          cursor: "always",
          displaySurface: "monitor"
        },
        audio: false
      });
      
      setScreenStream(stream);
      setIsScreenSharing(true);
      
      if (screenRef.current) {
        screenRef.current.srcObject = stream;
        
        const videoTrack = stream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(videoTrack);
        
        const interval = setInterval(async () => {
          if (isScreenSharing) {
            try {
              const bitmap = await imageCapture.grabFrame();
              console.log("Captured screen frame for AI analysis");
            } catch (error) {
              console.error("Error capturing screen frame:", error);
            }
          }
        }, 5000);
        
        videoTrack.onended = () => {
          clearInterval(interval);
          stopMediaStream();
        };
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {capabilities.map((cap) => (
                <button
                  key={cap.id}
                  onClick={() => toggleCapability(cap.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    cap.enabled ? 'text-purple-400' : 'text-gray-500'
                  } hover:text-purple-300`}
                  title={cap.name}
                >
                  {cap.icon}
                </button>
              ))}
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold">SageX</h2>
            <p className="text-sm text-gray-400">Created by Roman Xhetri</p>
          </div>
          <div className="w-[120px]"></div>
        </div>
      </div>

      <CapabilitiesDisplay
        capabilities={capabilities}
        onToggle={toggleCapability}
        isMinimized={isReasoningMinimized}
        onToggleMinimize={() => setIsReasoningMinimized(!isReasoningMinimized)}
      />

      <div className="flex-1 overflow-y-auto">
        {(isVideoActive || isScreenSharing) && (
          <div className="grid grid-cols-2 gap-4 p-4">
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

        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      <div className="p-4 border-t border-glass-border">
        <MediaControls
          isVoiceActive={isVoiceActive}
          isVideoActive={isVideoActive}
          isScreenSharing={isScreenSharing}
          onVoiceToggle={() => isVoiceActive ? stopMediaStream() : startVoiceCall()}
          onVideoToggle={() => isVideoActive ? stopMediaStream() : startVideoCall()}
          onScreenShare={() => isScreenSharing ? stopMediaStream() : startScreenShare()}
          onFileUpload={() => fileInputRef.current?.click()}
        />
        
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
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
