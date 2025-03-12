
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shuffle, Trophy, Timer, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from 'canvas-confetti';

interface CardProps {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
  onClick: () => void;
}

const MemoryCard: React.FC<CardProps> = ({ value, flipped, matched, onClick }) => {
  return (
    <motion.div
      className={`aspect-square rounded-lg overflow-hidden cursor-pointer shadow-lg ${matched ? 'opacity-70' : ''}`}
      whileHover={!flipped && !matched ? { scale: 1.05, rotate: 1 } : {}}
      whileTap={!flipped && !matched ? { scale: 0.95 } : {}}
      onClick={!flipped && !matched ? onClick : undefined}
    >
      <div className={`w-full h-full transition-all duration-500 ${flipped || matched ? 'rotate-y-180' : ''}`}>
        <div className={`w-full h-full absolute transition-opacity duration-500 ${flipped || matched ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <Sparkles className="text-white opacity-70" size={36} />
          </div>
        </div>
        
        <div className={`w-full h-full absolute transition-opacity duration-500 ${flipped || matched ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-full h-full bg-gradient-to-br from-indigo-700 to-purple-900 flex items-center justify-center text-4xl font-bold text-white">
            {value}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const MemoryMatch = ({ onGameComplete }: { onGameComplete: (score: number) => void }) => {
  const symbols = ["🚀", "🎮", "💎", "🔥", "🌈", "⚡", "🍕", "🎵", "❄️", "🌟", "🦄", "🐉"];
  const [cards, setCards] = useState<{id: number, value: string, flipped: boolean, matched: boolean}[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  
  // Generate cards based on difficulty
  const generateCards = (diff: "easy" | "medium" | "hard") => {
    let cardSymbols: string[] = [];
    let pairsCount = 0;
    
    switch(diff) {
      case "easy":
        pairsCount = 6;
        break;
      case "medium":
        pairsCount = 8;
        break;
      case "hard":
        pairsCount = 12;
        break;
    }
    
    // Create pairs of symbols
    cardSymbols = symbols.slice(0, pairsCount);
    const pairs = [...cardSymbols, ...cardSymbols];
    
    // Shuffle the pairs
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    
    // Create card objects
    const newCards = shuffled.map((value, index) => ({
      id: index,
      value,
      flipped: false,
      matched: false
    }));
    
    setCards(newCards);
    setMatchedPairs(0);
    setMoves(0);
    setTimer(0);
    setFlippedCards([]);
    setGameCompleted(false);
  };
  
  // Start timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameStarted && !gameCompleted) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted, gameCompleted]);
  
  // Check for game completion
  useEffect(() => {
    const totalPairs = cards.length / 2;
    
    if (matchedPairs === totalPairs && totalPairs > 0) {
      setGameCompleted(true);
      setGameStarted(false);
      
      // Calculate score based on moves and time
      const baseScore = 1000;
      const movesPenalty = moves * 5;
      const timePenalty = timer * 2;
      const difficultyBonus = difficulty === "easy" ? 0 : difficulty === "medium" ? 300 : 700;
      
      const finalScore = Math.max(0, baseScore - movesPenalty - timePenalty + difficultyBonus);
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Call the onGameComplete callback
      onGameComplete(finalScore);
    }
  }, [matchedPairs, cards.length, moves, timer, difficulty, onGameComplete]);
  
  // Handle card click
  const handleCardClick = (id: number) => {
    // Start game on first card click
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    // Ignore if two cards are already flipped
    if (flippedCards.length === 2) return;
    
    // Flip the card
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === id ? { ...card, flipped: true } : card
      )
    );
    
    setFlippedCards(prev => [...prev, id]);
    
    // If two cards are flipped, check for a match
    if (flippedCards.length === 1) {
      setMoves(prev => prev + 1);
      
      const firstCardId = flippedCards[0];
      const secondCardId = id;
      
      const firstCard = cards.find(card => card.id === firstCardId);
      const secondCard = cards.find(card => card.id === secondCardId);
      
      if (firstCard?.value === secondCard?.value) {
        // Match found
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(card => 
              card.id === firstCardId || card.id === secondCardId
                ? { ...card, matched: true, flipped: false }
                : card
            )
          );
          
          setMatchedPairs(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match, flip cards back
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(card => 
              card.id === firstCardId || card.id === secondCardId
                ? { ...card, flipped: false }
                : card
            )
          );
          
          setFlippedCards([]);
        }, 1000);
      }
    }
  };
  
  // Start a new game
  const startNewGame = () => {
    generateCards(difficulty);
    setGameStarted(false);
  };
  
  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Initialize game
  useEffect(() => {
    generateCards(difficulty);
  }, [difficulty]);
  
  return (
    <div className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Memory Match</h2>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-glass border border-glass-border rounded-lg px-3 py-1.5">
            <Timer className="mr-2 text-yellow-400" size={16} />
            <span>{formatTime(timer)}</span>
          </div>
          
          <div className="flex items-center bg-glass border border-glass-border rounded-lg px-3 py-1.5">
            <Shuffle className="mr-2 text-blue-400" size={16} />
            <span>Moves: {moves}</span>
          </div>
          
          <div className="flex items-center bg-glass border border-glass-border rounded-lg px-3 py-1.5">
            <Trophy className="mr-2 text-purple-400" size={16} />
            <span>Pairs: {matchedPairs}/{cards.length / 2}</span>
          </div>
        </div>
      </div>
      
      {!gameStarted && !gameCompleted && cards.length > 0 && (
        <div className="mb-6">
          <p className="text-center mb-4">Select difficulty and start the game!</p>
          <div className="flex justify-center space-x-4">
            <Button 
              variant={difficulty === "easy" ? "default" : "outline"}
              onClick={() => setDifficulty("easy")}
              className={difficulty === "easy" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Easy
            </Button>
            <Button 
              variant={difficulty === "medium" ? "default" : "outline"}
              onClick={() => setDifficulty("medium")}
              className={difficulty === "medium" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
            >
              Medium
            </Button>
            <Button 
              variant={difficulty === "hard" ? "default" : "outline"}
              onClick={() => setDifficulty("hard")}
              className={difficulty === "hard" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              Hard
            </Button>
          </div>
        </div>
      )}
      
      {gameCompleted && (
        <motion.div 
          className="mb-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-6 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-2">Game Completed! 🎉</h3>
          <p className="mb-4">
            You matched all {cards.length / 2} pairs in {moves} moves and {formatTime(timer)}!
          </p>
          <Button onClick={startNewGame} className="bg-gradient-to-r from-purple-600 to-blue-600">
            <RefreshCw className="mr-2" size={16} />
            Play Again
          </Button>
        </motion.div>
      )}
      
      <div className={`grid gap-4 ${
        difficulty === "easy" ? "grid-cols-3 grid-rows-4" : 
        difficulty === "medium" ? "grid-cols-4 grid-rows-4" : 
        "grid-cols-4 grid-rows-6"
      }`}>
        {cards.map(card => (
          <MemoryCard
            key={card.id}
            id={card.id}
            value={card.value}
            flipped={card.flipped}
            matched={card.matched}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>
    </div>
  );
};
