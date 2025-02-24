
import React from "react";
import { Mic, Camera, MonitorUp, Upload } from "lucide-react";

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
        className={`p-2 rounded-lg transition-colors ${
          isVoiceActive ? "bg-red-500 text-white" : "text-gray-400 hover:text-white"
        }`}
      >
        <Mic size={20} />
      </button>
      <button
        type="button"
        onClick={onVideoToggle}
        className={`p-2 rounded-lg transition-colors ${
          isVideoActive ? "bg-red-500 text-white" : "text-gray-400 hover:text-white"
        }`}
      >
        <Camera size={20} />
      </button>
      <button
        type="button"
        onClick={onScreenShare}
        className={`p-2 rounded-lg transition-colors ${
          isScreenSharing ? "bg-red-500 text-white" : "text-gray-400 hover:text-white"
        }`}
      >
        <MonitorUp size={20} />
      </button>
      <button
        type="button"
        onClick={onFileUpload}
        className="p-2 text-gray-400 hover:text-white transition-colors"
      >
        <Upload size={20} />
      </button>
    </div>
  );
};
