
import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    // Check if the browser supports speech recognition
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Voice Commands Unavailable",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
      return;
    }

    // Setup recognition
    const SpeechRecognition = window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      
      setTranscript(currentTranscript);
      
      // Check for commands in the most recent result
      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal) {
        const command = lastResult[0].transcript.toLowerCase().trim();
        onCommand(command);
        
        // Show the recognized command
        toast({
          title: "Voice Command Recognized",
          description: command,
        });
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech Recognition Error", event.error);
      if (event.error === 'no-speech') {
        // This is a common error, don't show it to the user
        return;
      }
      
      toast({
        title: "Voice Recognition Error",
        description: `Error: ${event.error}`,
        variant: "destructive"
      });
      setIsListening(false);
    };

    recognition.onend = () => {
      // Only restart if we're still meant to be listening
      if (isListening) {
        recognition.start();
      } else {
        setIsListening(false);
      }
    };

    // Start or stop based on isListening prop
    if (isListening) {
      try {
        recognition.start();
      } catch (error) {
        console.error("Failed to start speech recognition", error);
      }
    } else if (recognition) {
      try {
        recognition.stop();
      } catch (error) {
        console.error("Failed to stop speech recognition", error);
      }
    }

    // Cleanup
    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (error) {
          // Ignore errors on cleanup
        }
      }
    };
  }, [isListening, toast, onCommand, setIsListening]);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      toast({
        title: "Voice Commands Disabled",
        description: "Voice command listening has been turned off",
      });
    } else {
      setIsListening(true);
      toast({
        title: "Voice Commands Enabled",
        description: "Listening for voice commands...",
      });
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={toggleListening}
        className={`flex items-center justify-center p-2 rounded-full ${
          isListening 
            ? "bg-red-500 text-white animate-pulse" 
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
        }`}
        title={isListening ? "Disable voice commands" : "Enable voice commands"}
      >
        {isListening ? <Mic size={18} /> : <MicOff size={18} />}
      </button>
      
      {isListening && (
        <div className="ml-2 text-sm text-gray-400 animate-pulse">
          Listening for commands...
        </div>
      )}
    </div>
  );
};
