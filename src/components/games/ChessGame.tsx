
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCw, Zap, AlertTriangle } from "lucide-react";

interface ChessGameProps {
  onGameComplete: (won: boolean) => void;
}

export const ChessGame = ({ onGameComplete }: ChessGameProps) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isGameStarted, setIsGameStarted] = useState(false);
  
  const startGame = () => {
    setIsGameStarted(true);
  };
  
  return (
    <div className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg p-6">
      {!isGameStarted ? (
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-6">Chess</h2>
          
          <div className="max-w-md mx-auto mb-8">
            <p className="text-gray-400 mb-6">
              Challenge the AI to a game of chess. Select your difficulty level to begin.
            </p>
            
            <div className="grid grid-cols-3 gap-3 mb-8">
              <Button 
                variant={difficulty === 'easy' ? 'default' : 'outline'}
                onClick={() => setDifficulty('easy')}
                className={difficulty === 'easy' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Easy
              </Button>
              <Button 
                variant={difficulty === 'medium' ? 'default' : 'outline'}
                onClick={() => setDifficulty('medium')}
                className={difficulty === 'medium' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
              >
                Medium
              </Button>
              <Button 
                variant={difficulty === 'hard' ? 'default' : 'outline'}
                onClick={() => setDifficulty('hard')}
                className={difficulty === 'hard' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                Hard
              </Button>
            </div>
            
            <Button 
              onClick={startGame}
              className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center"
            >
              <Zap className="mr-2" size={16} />
              Start Game
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="flex items-center justify-center mb-6 text-yellow-400">
            <AlertTriangle className="mr-2" size={20} />
            <span>Chess game is coming soon! We're working on it.</span>
          </div>
          
          <Button 
            onClick={() => setIsGameStarted(false)}
            variant="outline"
          >
            <RotateCw className="mr-2" size={16} />
            Back to Settings
          </Button>
        </div>
      )}
    </div>
  );
};
