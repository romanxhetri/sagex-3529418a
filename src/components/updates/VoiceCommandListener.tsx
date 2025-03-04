
import React, { useState, useEffect } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceCommandListenerProps {
  onCommand: (command: string) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
}

export const VoiceCommandListener: React.FC<VoiceCommandListenerProps> = ({
  onCommand,
  isListening,
  setIsListening
}) => {
  const [transcript, setTranscript] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  
  useEffect(() => {
    let recognition: any = null;
    
    if (isListening) {
      try {
        // @ts-ignore - SpeechRecognition is not in the TypeScript types
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
          setShowTranscript(true);
          setTranscript("Listening...");
        };
        
        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
              setConfidence(event.results[i][0].confidence);
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          
          if (finalTranscript) {
            setTranscript(finalTranscript);
            if (finalTranscript.trim()) {
              onCommand(finalTranscript);
              setIsListening(false);
              setShowTranscript(false);
            }
          } else {
            setTranscript(interimTranscript);
          }
        };
        
        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setTranscript(`Error: ${event.error}`);
          setIsListening(false);
          setTimeout(() => setShowTranscript(false), 2000);
        };
        
        recognition.onend = () => {
          setIsListening(false);
          setTimeout(() => setShowTranscript(false), 2000);
        };
        
        recognition.start();
      } catch (error) {
        console.error("Speech recognition not supported", error);
        setTranscript("Speech recognition not supported in this browser");
        setIsListening(false);
        setTimeout(() => setShowTranscript(false), 2000);
      }
    }
    
    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (error) {
          console.error("Error stopping recognition", error);
        }
      }
    };
  }, [isListening, onCommand, setIsListening]);
  
  return (
    <>
      <button
        onClick={() => setIsListening(!isListening)}
        className={`p-2 rounded-full transition-colors ${
          isListening 
            ? "bg-purple-600 text-white animate-pulse" 
            : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
        }`}
        title="Voice commands"
      >
        {isListening ? <Mic size={16} /> : <MicOff size={16} />}
      </button>
      
      <AnimatePresence>
        {showTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-16 right-0 bg-gray-900 border border-purple-500/30 p-3 rounded-lg shadow-lg z-50 max-w-xs"
          >
            <div className="flex items-center mb-2">
              <Volume2 size={16} className="text-purple-400 mr-2 animate-pulse" />
              <span className="text-sm font-medium text-white">Voice Command</span>
            </div>
            <p className="text-gray-300 text-sm">{transcript}</p>
            <div className="mt-2 bg-gray-800 rounded-full h-1.5">
              <div 
                className="bg-purple-500 h-1.5 rounded-full" 
                style={{ width: `${confidence * 100}%` }}
              ></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
