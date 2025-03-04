
import React from "react";
import { ReasoningProcess } from "../updates/ReasoningProcess";

interface CapabilitiesDisplayProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
  currentThought: string;
}

export const CapabilitiesDisplay = ({
  isMinimized,
  onToggleMinimize,
  currentThought,
}: CapabilitiesDisplayProps) => {
  if (!currentThought) return null;

  return (
    <ReasoningProcess
      reasoning={currentThought}
      isMinimized={isMinimized}
      onToggle={onToggleMinimize}
    />
  );
};
