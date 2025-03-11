
import React from "react";
import { motion } from "framer-motion";
import { Gamepad2, Zap } from "lucide-react";

interface Game {
  id: string;
  name: string;
  description: string;
  image: string;
  difficulty: string;
  aiPowered: boolean;
}

interface GameCardProps {
  game: Game;
  onClick: () => void;
}

export const GameCard = ({ game, onClick }: GameCardProps) => {
  const difficultyColor = 
    game.difficulty === "Easy" ? "text-green-400" : 
    game.difficulty === "Medium" ? "text-yellow-400" : 
    game.difficulty === "Hard" ? "text-red-400" : 
    "text-purple-400";

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
      onClick={onClick}
    >
      <div className="aspect-video w-full overflow-hidden">
        {game.image ? (
          <img 
            src={game.image} 
            alt={game.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-900/30 to-blue-900/30">
            <Gamepad2 size={48} className="text-purple-400 opacity-70" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg text-white">{game.name}</h3>
          {game.aiPowered && (
            <div className="flex items-center bg-purple-700/50 rounded-full px-2 py-0.5 text-xs">
              <Zap size={10} className="text-yellow-400 mr-1" />
              <span>AI</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {game.description}
        </p>
        
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">Difficulty:</span>
          <span className={`text-xs font-medium ${difficultyColor}`}>
            {game.difficulty}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
