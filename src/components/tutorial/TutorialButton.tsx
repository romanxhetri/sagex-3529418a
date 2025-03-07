
import React from 'react';
import { Button } from "@/components/ui/button";
import { Info, ArrowRight } from "lucide-react";

export const TutorialButton = () => {
  const startTutorial = () => {
    console.log("Tutorial started");
    alert("Welcome to the tutorial! This will guide you through using the app.");
  };

  return (
    <Button 
      onClick={startTutorial}
      className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 px-4 py-2 rounded-lg text-white font-medium shadow-lg transition-all duration-300 flex items-center"
    >
      <Info className="mr-2 h-4 w-4" />
      Start Tutorial
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
};
