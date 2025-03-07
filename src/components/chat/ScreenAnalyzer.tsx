
import React, { useEffect, useState, useRef } from "react";
import { Zap, Eye, Robot } from "lucide-react";

interface ScreenAnalyzerProps {
  screenRef: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
  onAnalysisComplete: (result: string) => void;
}

export const ScreenAnalyzer: React.FC<ScreenAnalyzerProps> = ({ 
  screenRef, 
  isActive,
  onAnalysisComplete
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState("");
  const analysisIntervalRef = useRef<number | null>(null);
  
  // Process screen content using canvas and OCR
  const processScreenContent = async () => {
    if (!screenRef.current || !screenRef.current.srcObject) return null;
    
    try {
      setIsAnalyzing(true);
      
      // Create canvas to capture video frame
      const canvas = document.createElement('canvas');
      const video = screenRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      
      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL for processing
      const imageData = canvas.toDataURL('image/png');
      
      // Mock AI processing (in a real implementation, you'd send this to your AI service)
      const result = await mockAnalyzeScreen(imageData);
      
      setLastAnalysis(result);
      onAnalysisComplete(result);
      return result;
    } catch (error) {
      console.error("Error analyzing screen:", error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Mock function to simulate AI processing
  const mockAnalyzeScreen = async (imageData: string): Promise<string> => {
    // In a real implementation, you would:
    // 1. Send the image to your backend
    // 2. Process with OpenCV/YOLO/Tesseract
    // 3. Return the analysis results
    
    // For now, we'll simulate processing time and return mock results
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockResults = [
      "Screen shows a chat interface with conversation history",
      "User appears to be navigating an application dashboard",
      "Screen displays several data visualization charts",
      "User is viewing a document with text content",
      "Screen shows a media player with video content",
      "User is browsing a website with multiple sections"
    ];
    
    return mockResults[Math.floor(Math.random() * mockResults.length)];
  };
  
  useEffect(() => {
    if (isActive) {
      // Start periodic analysis when screen sharing is active
      processScreenContent();
      
      analysisIntervalRef.current = window.setInterval(() => {
        processScreenContent();
      }, 5000); // Analyze every 5 seconds
    } else {
      // Clear interval when screen sharing stops
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;
      }
    }
    
    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, [isActive]);
  
  if (!isActive) return null;
  
  return (
    <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm p-2 rounded-lg text-xs text-white max-w-[200px]">
      <div className="flex items-center gap-1 mb-1">
        <Robot size={12} className="text-purple-400" />
        <span className="font-medium">AI Screen Analysis</span>
        {isAnalyzing && <Zap size={12} className="animate-pulse text-yellow-400" />}
      </div>
      {lastAnalysis && (
        <div className="text-gray-300 text-[10px]">
          <Eye size={10} className="inline mr-1 text-blue-400" />
          {lastAnalysis}
        </div>
      )}
    </div>
  );
};
