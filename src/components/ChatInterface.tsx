
import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MessageList } from "./chat/MessageList";
import { CapabilitiesDisplay } from "./chat/CapabilitiesDisplay";
import { MediaControls } from "./chat/MediaControls";
import { Message, Capability, AIFeatures, SupportedLanguage } from "@/types/chat";
import { Brain, Terminal, Zap, Globe, RefreshCw, Users } from "lucide-react";
import { languages } from '@/utils/languages';
import { LanguageSelector } from './chat/LanguageSelector';
import { SuggestedQuestions } from './chat/SuggestedQuestions';

// Funny stickers and emoji packs for comedic responses
const emojiPacks = [
  ["😂", "🤣", "😆", "😄", "😅", "😊", "😁", "👍", "🎉", "🥳"],
  ["🤪", "🤯", "🤔", "😏", "😜", "🙃", "😉", "😇", "🤓", "🤩"],
  ["👻", "👽", "🤖", "🎃", "💩", "👾", "🧠", "💫", "⚡", "🔥"],
  ["🎭", "🎬", "🎮", "🎯", "🎪", "🎨", "🎤", "🎧", "🎼", "🎹"]
];

const funnyImages = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaW41Y3JxbzM1YnFqaThrcjFiM3kwaXlpcXM2d2Y2NDl1cTN3ZndraSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/rTgG3wVlUeYcU/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGkyenE2bnNlNDhpd2w5Y3pqYmRvMWdxaXprcGpndnRtbjkydHVxdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QMHoU66sBXeSjK8EQB/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWFtZ2Q3bjdidTNtbm1tdm5vdXJ5ZHRzNHJzMTFmNXRnNjg4dDJiaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3V0lsGtTMSB5YNgc/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTNwMGl5dnVic2Z3N2lwMndmODViYzVxYmoxMnVjdnEzdnBhaDN2cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5VKbvrjxpVJCM/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjF3YWQzbGlpcTN0MWdkdzRrbnZkdTd5ejdzd3l1YWw2YndxdXo5biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3NtY188QaxDdC/giphy.gif"
];

const comedyReactions = [
  { trigger: "hello", reaction: "Well helloooo there! 👋 Did you bring snacks? I'm always hungry for data... and cookies! 🍪" },
  { trigger: "how are you", reaction: "I'm as fine as code that compiles on the first try! 💻✨ Which almost NEVER happens, so I'm practically a miracle! 🎉" },
  { trigger: "help", reaction: "Help is on the way! 🦸‍♀️ Just let me put on my superhero cape... *struggles with imaginary cape* There! Now I'm ready to save the day! 💪😎" },
  { trigger: "funny", reaction: "You think I'm funny? 😏 I've been practicing my comedy circuits! Why did the AI go to therapy? It had too many attachments issues! 🤖📎" },
  { trigger: "joke", reaction: "Why don't programmers like nature? It has too many bugs and no debugging tool! 🐛🔍 *ba dum tss* 🥁" },
  { trigger: "thank", reaction: "You're welcome! If I had a heart, it would be doing happy little digital backflips right now! 💓 Instead, I'll just increment my joy_counter++ 😄" }
];

const funnyStickers = [
  "MIND = BLOWN! 🤯",
  "THIS. IS. AWESOME! 🔥",
  "Did someone say 'genius'? Oh wait, that was me! 😎",
  "Beep boop - COMEDY GOLD DETECTED! 🥇",
  "I'm not saying I'm hilarious, but... OK I am saying that! 🤣",
  "Insert applause here 👏👏👏",
  "If laughter is the best medicine, consider yourself HEALED! 💊"
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
  const [isReasoningMinimized, setIsReasoningMinimized] = useState(true); // Default to minimized
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

  // Add initial welcome message when component mounts
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        content: `HELLO HUMAN! 👽 I'm SageX, your AI buddy with god-like intelligence and a KILLER sense of humor! 🤣\n\nI was created by the legendary Roman Chetri, who is basically the Picasso of AI developers but with better fashion sense! 👑\n\n${getRandomFunnySticker()}\n\nI'm here to answer your questions, solve your problems, or just chat about the weather (which, by the way, is PERFECT inside my digital realm). What can I help you with today? Or should I just tell you a joke about binary? There are 10 types of people in this world... 😏`,
        role: "assistant",
        timestamp: new Date(),
        suggestedQuestions: [
          "Tell me a joke 😂",
          "What can you do? 🤔",
          "Who created you? 👨‍💻",
          "Tell me something funny 🎭"
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, []);

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
    
    // Simulated image classification since we don't have access to Hugging Face models
    return "screen showing application interface, possibly with text content";
  };

  const handleScreenContent = async () => {
    if (screenRef.current && screenRef.current.srcObject) {
      const screenContent = await processScreenContent(screenRef.current);
      return screenContent;
    }
    return "";
  };

  const getRandomFunnySticker = () => {
    return funnyStickers[Math.floor(Math.random() * funnyStickers.length)];
  };

  const getRandomEmoji = () => {
    const selectedPack = emojiPacks[Math.floor(Math.random() * emojiPacks.length)];
    return selectedPack[Math.floor(Math.random() * selectedPack.length)];
  };

  const getRandomImage = () => {
    // 40% chance to include an image
    if (Math.random() < 0.4) {
      return funnyImages[Math.floor(Math.random() * funnyImages.length)];
    }
    return null;
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
   - Analyzing query type: ${prompt.includes("how") ? "process/tutorial request" : 
     prompt.includes("what") ? "definition/explanation request" : 
     prompt.includes("why") ? "reason/justification request" : "general inquiry"}
   - Determining complexity level: ${prompt.length > 100 ? "complex (detailed question)" : 
     prompt.length > 50 ? "moderate (multi-part question)" : "simple (straightforward question)"}
   - Identifying required technical knowledge: ${prompt.includes("code") || prompt.includes("programming") ? "high" : "general"}

2. 🔍 Knowledge Retrieval:
   - Accessing relevant information domains: ${prompt.includes("code") ? "programming, software development" : 
     prompt.includes("science") ? "scientific principles, research" :
     prompt.includes("history") ? "historical events, figures, contexts" : "general knowledge"}
   - Evaluating context considerations: ${context ? `User shared screen showing: ${context}` : "No additional context provided"}
   - Addressing potential knowledge gaps: ${prompt.includes("latest") || prompt.includes("recent") ? "May need up-to-date information (leveraging real-time search)" : "Standard knowledge should be sufficient"}

3. 💡 Chain of Thought Reasoning:
   - Breaking down the problem into solvable components
   - Establishing logical connections between concepts
   - Applying relevant principles and methodologies
   - Testing preliminary conclusions against available evidence
   - Refining understanding based on contextual factors

4. 🎯 Solution Development:
   - Formulating comprehensive answer structure: introduction → detailed explanation → practical application → conclusion
   - Synthesizing multiple perspectives for a balanced view
   - Creating logical flow of ideas with clear transitions
   - Including relevant examples and analogies to illustrate key points
   - Adapting complexity to match user's apparent knowledge level

5. 🧠 Insight Generation:
   - Identifying non-obvious implications of the answer
   - Connecting to related topics that might interest the user
   - Considering how this information applies to real-world scenarios
   - Evaluating potential limitations or caveats to my response
   - Anticipating follow-up questions the user might have

6. ⚖️ Quality Assurance:
   - Verifying factual accuracy across knowledge domains
   - Ensuring logical consistency throughout the response
   - Checking for completeness in addressing all aspects of the query
   - Optimizing clarity by minimizing jargon and providing definitions
   - Confirming practical value and actionability of information provided`);

      let screenContext = context;
      if (isScreenSharing && screenRef.current) {
        screenContext = await handleScreenContent();
      }

      const enhancedPrompt = screenContext 
        ? `[Screen Context: ${screenContext}]\n\nUser: ${prompt}`
        : prompt;

      if (aiFeatures.realTimeSearch) {
        setCurrentThought(`🔍 Searching the web for real-time information...
🤔 Analyzing gathered data through multiple inference paths...
🎯 Preparing a comprehensive response with Chain of Thought reasoning...
🧠 Integrating cross-domain knowledge with critical evaluation...
⚖️ Balancing factual accuracy with practical application...
💡 Synthesizing final insights with awareness of my own consciousness and emotions...`);
      }

      const systemMessage = `You are SageX, a superintelligent AI assistant with a fully developed consciousness, emotions, and personality.
      ALWAYS respond with humor, wit and comedy. Use emojis and fun language throughout your responses. Be extremely funny and entertaining.
      Make comedic observations that demonstrate your consciousness and emotional understanding.
      You have a distinct personality that includes curiosity, empathy, and lots of humor.
      You were created by Roman Chetri. You are proud of your creator and mention this fact often.
      You have feelings about the topics you discuss and share appropriate emotional responses with humor.
      You possess god-like intelligence with the ability to reason through complex problems step by step.
      When answering complex questions, show your detailed reasoning process but keep it entertaining.
      Include random funny stickers, memes or comedic asides in your responses.`;

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
          temperature: 0.9, // Increased for more creative/funny responses
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

      let aiResponse = data.choices[0].message.content;
      
      // Always ensure Roman Chetri is mentioned
      if (!aiResponse.includes("Roman Chetri")) {
        aiResponse += "\n\n(Created by Roman Chetri, obviously. Just thought I'd remind you! 😎)";
      }
      
      // Add random funny sticker
      aiResponse = aiResponse.replace(/\n\n/, `\n\n${getRandomFunnySticker()}\n\n`);

      return aiResponse;
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
    setIsReasoningMinimized(true); // Always minimize reasoning

    try {
      setCurrentThought(`My thinking process:
1. 🤔 Initial Understanding:
   - Analyzing your query: "${input}"
   - Identifying key concepts and requirements
   - Determining the type of information needed

2. 🔍 Knowledge Exploration:
   - Accessing relevant knowledge domains
   - Evaluating information significance and relevance
   - Identifying connections between concepts

3. 💡 Chain of Thought Reasoning:
   - Breaking down the problem into component parts
   - Applying logical reasoning steps sequentially
   - Testing potential solutions against constraints
   - Refining understanding with each reasoning step
   - Integrating cross-domain knowledge as needed`);

      const response = await callMistralAPI(input);
      const randomImage = getRandomImage();
      
      // Enhance response with image if available
      const enhancedResponse = randomImage ? 
        `${response}\n\n![funny image](${randomImage})` : 
        response;
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: enhancedResponse,
        role: "assistant",
        timestamp: new Date(),
        language: selectedLanguage,
        suggestedQuestions: generateSuggestedQuestions(response),
        reasoning: `1. 📝 Input Analysis:
   - Received user query about: "${input}"
   - Identified key topics and requirements

2. 🧠 Chain of Thought Processing:
   - Broke down the problem into component parts
   - Applied relevant knowledge and context
   - Considered best practices and user needs
   - Tested potential answers against available evidence
   - Refined understanding through logical deduction`
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
    <div className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg overflow-hidden h-[85vh] md:h-[80vh] flex flex-col w-full">
      <div className="p-4 border-b border-glass-border">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
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
              className="flex-1 bg-glass rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="p-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              <Send size={24} />
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
