
import React from "react";
import { Mic, Camera, MonitorUp, Upload, Zap } from "lucide-react";

interface MediaControlsProps {
  isVoiceActive: boolean;
  isVideoActive: boolean;
  isScreenSharing: boolean;
  onVoiceToggle: () => void;
  onVideoToggle: () => void;
  onScreenShare: () => void;
  onFileUpload: () => void;
}

export const MediaControls = ({
  isVoiceActive,
  isVideoActive,
  isScreenSharing,
  onVoiceToggle,
  onVideoToggle,
  onScreenShare,
  onFileUpload,
}: MediaControlsProps) => {
  return (
    <div className="flex space-x-4 mb-4">
      <button
        type="button"
        onClick={onVoiceToggle}
        className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
          isVoiceActive ? "bg-red-500 text-white" : "text-gray-400 hover:text-white"
        }`}
        title="Toggle Voice Input"
      >
        <Mic size={20} />
      </button>
      <button
        type="button"
        onClick={onVideoToggle}
        className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
          isVideoActive ? "bg-red-500 text-white" : "text-gray-400 hover:text-white"
        }`}
        title="Toggle Video"
      >
        <Camera size={20} />
      </button>
      <button
        type="button"
        onClick={onScreenShare}
        className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
          isScreenSharing ? "bg-green-500 text-white" : "text-gray-400 hover:text-white"
        }`}
        title="Share Your Screen for AI Analysis"
      >
        {isScreenSharing ? (
          <>
            <MonitorUp size={20} />
            <Zap size={12} className="absolute top-0 right-0 text-yellow-300" />
          </>
        ) : (
          <MonitorUp size={20} />
        )}
      </button>
      <button
        type="button"
        onClick={onFileUpload}
        className="p-2 text-gray-400 hover:text-white transition-colors"
        title="Upload File"
      >
        <Upload size={20} />
      </button>
    </div>
  );
};
