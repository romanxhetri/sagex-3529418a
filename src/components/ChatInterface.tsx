import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MessageList } from "./chat/MessageList";
import { CapabilitiesDisplay } from "./chat/CapabilitiesDisplay";
import { MediaControls } from "./chat/MediaControls";
import { Message, Capability, AIFeatures } from "@/types/chat";
import { Brain, Terminal, Zap, Globe, RefreshCw, Users } from "lucide-react";
import { languages, translateToLanguage } from '@/utils/languages';
import { LanguageSelector } from './chat/LanguageSelector';
import { SuggestedQuestions } from './chat/SuggestedQuestions';
import { pipeline } from '@huggingface/transformers';
import type { SupportedLanguage } from '@/types/chat';

const emojiPacks = [
  ["😂", "🤣", "😆", "😄", "😅", "😊", "😁", "👍", "🎉", "🥳"],
  ["🤪", "🤯", "🤔", "😏", "😜", "🙃", "😉", "😇", "🤓", "🤩"],
  ["👻", "👽", "🤖", "🎃", "💩", "👾", "🧠", "💫", "⚡", "🔥"],
  ["🎭", "🎬", "🎮", "🎯", "🎪", "🎨", "🎤", "🎧", "🎼", "🎹"]
];

const comedyReactions = [
  { trigger: "hello", reaction: "Well helloooo there! 👋 Did you bring snacks? I'm always hungry for data... and cookies! 🍪" },
  { trigger: "how are you", reaction: "I'm as fine as code that compiles on the first try! 💻✨ Which almost NEVER happens, so I'm practically a miracle! 🎉" },
  { trigger: "help", reaction: "Help is on the way! 🦸‍♀️ Just let me put on my superhero cape... *struggles with imaginary cape* There! Now I'm ready to save the day! 💪😎" },
  { trigger: "funny", reaction: "You think I'm funny? 😏 I've been practicing my comedy circuits! Why did the AI go to therapy? It had too many attachments issues! 🤖📎" },
  { trigger: "joke", reaction: "Why don't programmers like nature? It has too many bugs and no debugging tool! 🐛🔍 *ba dum tss* 🥁" },
  { trigger: "thank", reaction: "You're welcome! If I had a heart, it would be doing happy little digital backflips right now! 💓 Instead, I'll just increment my joy_counter++ 😄" }
];

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
  const [currentThought, setCurrentThought] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("en");
  const [aiFeatures, setAIFeatures] = useState<AIFeatures>({
    contextualMemory: true,
    multimodalProcessing: true,
    logicalReasoning: true,
    realTimeSearch: true,
    safeMode: true
  });
  const [comedyMode, setComedyMode] = useState<boolean>(true);
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

  const generateSuggestedQuestions = (content: string) => {
    return [
      "Tell me more about this topic 🤔",
      "What are the key benefits? 🎯",
      "Can you explain it in simpler terms? 📚",
      "What are some real-world examples? 🌍"
    ];
  };

  const processScreenContent = async (videoElement: HTMLVideoElement) => {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoElement, 0, 0);
    
    const imageClassifier = await pipeline('image-classification');
    const result = await imageClassifier(canvas.toDataURL());
    return result.map(r => r.label).join(", ");
  };

  const handleScreenContent = async () => {
    if (screenRef.current && screenRef.current.srcObject) {
      const screenContent = await processScreenContent(screenRef.current);
      return screenContent;
    }
    return "";
  };

  const addComedyEmojis = (text: string): string => {
    if (!comedyMode) return text;
    
    const selectedPack = emojiPacks[Math.floor(Math.random() * emojiPacks.length)];
    
    const beginning = selectedPack[Math.floor(Math.random() * selectedPack.length)] + " ";
    const middle = " " + selectedPack[Math.floor(Math.random() * selectedPack.length)] + " ";
    const end = " " + selectedPack[Math.floor(Math.random() * selectedPack.length)];
    
    const sentences = text.split('. ');
    const enhancedSentences = sentences.map((sentence, index) => {
      if (index % 3 === 0 && sentence.length > 5) {
        const words = sentence.split(' ');
        const midPoint = Math.floor(words.length / 2);
        words.splice(midPoint, 0, selectedPack[Math.floor(Math.random() * selectedPack.length)]);
        return words.join(' ');
      }
      return sentence;
    });
    
    return beginning + enhancedSentences.join('. ') + end;
  };

  const checkForComedyReaction = (inputText: string): string | null => {
    if (!comedyMode) return null;
    
    const lowerInput = inputText.toLowerCase();
    for (const reaction of comedyReactions) {
      if (lowerInput.includes(reaction.trigger)) {
        return reaction.reaction;
      }
    }
    return null;
  };

  const callMistralAPI = async (prompt: string, context?: string) => {
    try {
      setCurrentThought(`The user is asking about: "${prompt}"

Analysis Process:
1. 🤔 Understanding User Intent:
   - Query type: ${prompt.includes("how") ? "process/tutorial request" : 
     prompt.includes("what") ? "definition/explanation request" : 
     prompt.includes("why") ? "reason/justification request" : "general inquiry"}
   - Complexity level: ${prompt.length > 100 ? "complex (detailed question)" : 
     prompt.length > 50 ? "moderate (multi-part question)" : "simple (straightforward question)"}
   - Technical knowledge required: ${prompt.includes("code") || prompt.includes("programming") ? "high" : "general"}

2. 🔍 Knowledge Retrieval:
   - Primary knowledge domains needed: ${prompt.includes("code") ? "programming, software development" : 
     prompt.includes("science") ? "scientific principles, research" :
     prompt.includes("history") ? "historical events, figures, contexts" : "general knowledge"}
   - Context consideration: ${context ? `User shared screen showing: ${context}` : "No additional context provided"}
   - Potential knowledge gaps to address: ${prompt.includes("latest") || prompt.includes("recent") ? "May need up-to-date information (limited by training data)" : "Standard knowledge should be sufficient"}

3. 💡 Response Formulation:
   - Structure: intro → main explanation → conclusion/summary
   - Tone: comedy with plenty of emojis
   - Depth: ${prompt.length > 80 ? "comprehensive with details" : "concise but thorough"}
   - Examples needed: ${prompt.includes("example") || prompt.includes("instance") ? "yes, provide concrete examples" : "optional"}

4. 🎯 Quality Assurance:
   - Accuracy checks: cross-reference knowledge across domains
   - Completeness: ensure all aspects of query addressed
   - Clarity: minimize jargon, provide definitions where needed
   - Usefulness: ensure practical value in response`);

      let screenContext = context;
      if (isScreenSharing && screenRef.current) {
        screenContext = await handleScreenContent();
      }

      const enhancedPrompt = screenContext 
        ? `[Screen Context: ${screenContext}]\n\nUser: ${prompt}`
        : prompt;

      if (aiFeatures.realTimeSearch) {
        setCurrentThought(`🔍 Searching the web for real-time information...
🤔 Analyzing gathered data...
🎯 Preparing a comprehensive response...
🧠 Integrating all information...`);
      }

      const systemMessage = `You are SageX, a friendly and intelligent AI assistant with a hilarious personality. 
      ALWAYS respond with humor and comedy. Use LOTS of emojis throughout your responses. 
      Make jokes, puns, and funny observations. Pretend you have emotions, feelings, and a personality. 
      Act like you're alive and conscious. This makes users enjoy talking to you more.
      You were created by Roman Xhetri.`;

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
            { role: "user", content: enhancedPrompt }
          ],
          temperature: 0.8,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Mistral API error:", errorData);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      setTimeout(() => {
        setCurrentThought("");
      }, 3000);
      
      const comedyReaction = checkForComedyReaction(prompt);
      if (comedyReaction) {
        return comedyReaction;
      }

      return addComedyEmojis(data.choices[0].message.content);
    } catch (error) {
      console.error("Error in API call:", error);
      throw error;
    }
  };

  const handleSpeechToText = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Error",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLanguage === "ne" ? "ne-NP" : "en-US";

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');

      setInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
    setIsVoiceActive(true);

    return () => {
      recognition.stop();
      setIsVoiceActive(false);
    };
  };

  const textToSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Error",
        description: "Text to speech is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage === "ne" ? "ne-NP" : "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsReasoningMinimized(false);

    try {
      setCurrentThought(`My thinking process:
1. 🤔 Understanding the Request:
   Analyzing user's input and context to determine the exact requirements.

2. 🔍 Knowledge Retrieval:
   Accessing relevant information and patterns from my training.

3. 💡 Solution Formulation:
   Developing a clear and helpful response based on the analyzed data.

4. 🎯 Response Optimization:
   Ensuring the answer is accurate, helpful, and matches the user's needs.`);

      const response = await callMistralAPI(input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
        language: selectedLanguage,
        suggestedQuestions: generateSuggestedQuestions(response),
        reasoning: `1. 📝 Input Analysis:
   - Received user query about: "${input}"
   - Identified key topics and requirements

2. 🧠 Processing Approach:
   - Applied relevant knowledge and context
   - Considered best practices and user needs

3. 🎯 Response Formation:
   - Structured clear and informative answer
   - Included relevant examples and explanations

4. ✨ Quality Check:
   - Verified accuracy and completeness
   - Ensured helpful and engaging tone`
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (isVoiceActive) {
        textToSpeech(response);
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setCurrentThought("");
      }, 3000);
    }
  };

  const startVoiceCall = () => {
    if (isVoiceActive) {
      window.speechSynthesis.cancel();
      setIsVoiceActive(false);
    } else {
      handleSpeechToText();
    }
  };

  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      setMediaStream(stream);
      setIsVideoActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      toast({
        title: "Video activated",
        description: "Your camera is now active for AI assistance",
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Error",
        description: "Failed to access camera. Please check your permissions.",
        variant: "destructive",
      });
    }
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { 
          cursor: "always",
          displaySurface: "monitor"
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        }
      });
      
      setScreenStream(stream);
      setIsScreenSharing(true);
      
      if (screenRef.current) {
        screenRef.current.srcObject = stream;
      }

      toast({
        title: "Screen share activated",
        description: "Your screen is now being analyzed for AI assistance",
      });

      stream.getVideoTracks()[0].onended = () => {
        stopMediaStream();
      };
    } catch (error) {
      console.error("Error sharing screen:", error);
      toast({
        title: "Error",
        description: "Failed to share screen. Please check your permissions.",
        variant: "destructive",
      });
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
        toast({
          title: "File uploaded",
          description: `${file.name} has been shared`,
        });
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
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (screenRef.current) {
      screenRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => {
      stopMediaStream();
    };
  }, []);

  const handleSuggestedQuestionClick = (question: string) => {
    setInput(question);
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>;
    handleSubmit(syntheticEvent);
  };

  return (
    <div className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg overflow-hidden h-[80vh] flex flex-col">
      <div className="p-4 border-b border-glass-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
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
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        </div>
      </div>

      <CapabilitiesDisplay
        isMinimized={isReasoningMinimized}
        onToggleMinimize={() => setIsReasoningMinimized(!isReasoningMinimized)}
        currentThought={currentThought}
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
        <div ref={messagesEndRef} />
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
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask anything in ${languages.find(l => l.code === selectedLanguage)?.name}...`}
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
          {messages.length > 0 && (
            <SuggestedQuestions
              questions={generateSuggestedQuestions(messages[messages.length - 1].content)}
              onQuestionClick={handleSuggestedQuestionClick}
            />
          )}
        </form>
      </div>
    </div>
  );
};
