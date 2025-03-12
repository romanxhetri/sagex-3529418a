
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, RefreshCw, CheckCircle, XCircle, Timer, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

// AI-generated puzzles
const puzzles = [
  {
    id: 1,
    question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    answer: "echo",
    hint: "I come back to you after you make a sound",
    difficulty: "medium"
  },
  {
    id: 2,
    question: "What has keys but no locks, space but no room, and you can enter but not go in?",
    answer: "keyboard",
    hint: "You use me to type messages",
    difficulty: "easy"
  },
  {
    id: 3,
    question: "The more you take, the more you leave behind. What am I?",
    answer: "footsteps",
    hint: "You make these when you walk",
    difficulty: "medium"
  },
  {
    id: 4,
    question: "What has a head, a tail, is brown, and has no legs?",
    answer: "penny",
    hint: "I'm a small coin",
    difficulty: "medium"
  },
  {
    id: 5,
    question: "I'm light as a feather, but even the strongest person can't hold me for more than a few minutes. What am I?",
    answer: "breath",
    hint: "You need me to live, but can't see me",
    difficulty: "hard"
  },
  {
    id: 6,
    question: "A man who was outside in the rain without an umbrella or hat didn't get a single hair on his head wet. Why?",
    answer: "bald",
    hint: "He had no hair to get wet",
    difficulty: "easy"
  },
  {
    id: 7,
    question: "What can travel around the world while staying in a corner?",
    answer: "stamp",
    hint: "I help letters reach their destination",
    difficulty: "medium"
  },
  {
    id: 8,
    question: "Forward I am heavy, but backward I am not. What am I?",
    answer: "ton",
    hint: "Read my name backwards",
    difficulty: "hard"
  },
  {
    id: 9,
    question: "What has many keys but can't open a single lock?",
    answer: "piano",
    hint: "I make music when you press my keys",
    difficulty: "easy"
  },
  {
    id: 10,
    question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
    answer: "map",
    hint: "I help you navigate to places",
    difficulty: "medium"
  },
  {
    id: 11,
    question: "What is full of holes but still holds water?",
    answer: "sponge",
    hint: "I'm used for cleaning and absorbing liquids",
    difficulty: "easy"
  },
  {
    id: 12,
    question: "If I drink, I die. If I eat, I'm fine. What am I?",
    answer: "fire",
    hint: "I can warm you, but I can also burn you",
    difficulty: "medium"
  },
  {
    id: 13,
    question: "What can run but never walks, has a mouth but never talks, has a head but never weeps, has a bed but never sleeps?",
    answer: "river",
    hint: "I flow from mountains to the sea",
    difficulty: "hard"
  },
  {
    id: 14,
    question: "The more it dries, the wetter it gets. What is it?",
    answer: "towel",
    hint: "You use me after a shower",
    difficulty: "medium"
  },
  {
    id: 15,
    question: "Mary has four daughters, and each of her daughters has a brother. How many children does Mary have?",
    answer: "5",
    hint: "All daughters share the same brother",
    difficulty: "hard"
  }
];

interface PuzzleType {
  id: number;
  question: string;
  answer: string;
  hint: string;
  difficulty: "easy" | "medium" | "hard";
}

export const AIPuzzle = ({ onGameComplete }: { onGameComplete: (score: number) => void }) => {
  const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleType | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [difficultyLevel, setDifficultyLevel] = useState<"easy" | "medium" | "hard">("medium");
  const [remainingTime, setRemainingTime] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [puzzlesSolved, setPuzzlesSolved] = useState(0);
  const [score, setScore] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Filter puzzles by difficulty
  const getPuzzlesByDifficulty = () => {
    return puzzles.filter(puzzle => puzzle.difficulty === difficultyLevel);
  };
  
  // Select a random puzzle
  const getRandomPuzzle = () => {
    const filteredPuzzles = getPuzzlesByDifficulty();
    if (filteredPuzzles.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * filteredPuzzles.length);
    return filteredPuzzles[randomIndex];
  };
  
  // Update puzzle
  const loadNewPuzzle = () => {
    setCurrentPuzzle(getRandomPuzzle());
    setUserAnswer("");
    setIsCorrect(null);
    setShowHint(false);
    setRemainingTime(difficultyLevel === "easy" ? 60 : difficultyLevel === "medium" ? 45 : 30);
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Start a new game
  const startGame = () => {
    setPuzzlesSolved(0);
    setScore(0);
    loadNewPuzzle();
    setIsTimerActive(true);
  };
  
  // Check user answer
  const checkAnswer = () => {
    if (!currentPuzzle) return;
    
    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrectAnswer = currentPuzzle.answer.trim().toLowerCase();
    
    const correct = normalizedUserAnswer === normalizedCorrectAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      // Calculate score based on difficulty and time
      const timeBonus = remainingTime * 2;
      const difficultyBonus = 
        difficultyLevel === "easy" ? 50 :
        difficultyLevel === "medium" ? 100 :
        200;
      const hintPenalty = showHint ? -25 : 0;
      
      const puzzleScore = 100 + timeBonus + difficultyBonus + hintPenalty;
      
      setScore(prevScore => prevScore + puzzleScore);
      setPuzzlesSolved(prev => prev + 1);
      
      // Celebrate with confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Load next puzzle after delay
      setTimeout(() => {
        loadNewPuzzle();
      }, 2000);
    }
  };
  
  // Handle timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime(prevTime => {
          if (prevTime <= 1) {
            setIsTimerActive(false);
            setIsCorrect(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (remainingTime === 0) {
      // Time's up!
      setIsCorrect(false);
      setIsTimerActive(false);
      
      // Game over logic - report final score
      if (puzzlesSolved > 0) {
        onGameComplete(score);
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, remainingTime, onGameComplete, puzzlesSolved, score]);
  
  // Initial load
  useEffect(() => {
    loadNewPuzzle();
  }, [difficultyLevel]);
  
  return (
    <div className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <Brain className="mr-2 text-purple-400" />
          AI Puzzle Challenge
        </h2>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-glass border border-glass-border rounded-lg px-3 py-1.5">
            <Timer className={`mr-2 ${remainingTime < 10 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`} size={16} />
            <span>{remainingTime}s</span>
          </div>
          
          <div className="flex items-center bg-glass border border-glass-border rounded-lg px-3 py-1.5">
            <Trophy className="mr-2 text-purple-400" size={16} />
            <span>Score: {score}</span>
          </div>
        </div>
      </div>
      
      {!isTimerActive && puzzlesSolved === 0 ? (
        <div className="mb-8 text-center">
          <p className="mb-4">Select difficulty and solve AI-generated puzzles!</p>
          <div className="flex justify-center space-x-4 mb-6">
            <Button 
              variant={difficultyLevel === "easy" ? "default" : "outline"}
              onClick={() => setDifficultyLevel("easy")}
              className={difficultyLevel === "easy" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Easy (60s)
            </Button>
            <Button 
              variant={difficultyLevel === "medium" ? "default" : "outline"}
              onClick={() => setDifficultyLevel("medium")}
              className={difficultyLevel === "medium" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
            >
              Medium (45s)
            </Button>
            <Button 
              variant={difficultyLevel === "hard" ? "default" : "outline"}
              onClick={() => setDifficultyLevel("hard")}
              className={difficultyLevel === "hard" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              Hard (30s)
            </Button>
          </div>
          <Button 
            onClick={startGame}
            className="bg-gradient-to-r from-purple-600 to-blue-600"
          >
            Start Game
          </Button>
        </div>
      ) : remainingTime === 0 ? (
        <motion.div 
          className="mb-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-6 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-2">Game Over! 🎮</h3>
          <p className="mb-2">You solved {puzzlesSolved} puzzles</p>
          <p className="text-xl mb-4">Final Score: {score}</p>
          <Button 
            onClick={startGame}
            className="bg-gradient-to-r from-purple-600 to-blue-600"
          >
            <RefreshCw className="mr-2" size={16} />
            Play Again
          </Button>
        </motion.div>
      ) : currentPuzzle ? (
        <div>
          <motion.div 
            className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 rounded-lg mb-6 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute -top-6 -right-6 opacity-20">
              <Sparkles size={100} className="text-purple-300" />
            </div>
            
            <h3 className="text-xl font-semibold mb-4">Puzzle #{puzzlesSolved + 1}</h3>
            <p className="text-lg mb-6">{currentPuzzle.question}</p>
            
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="bg-glass bg-indigo-900/20 p-3 rounded-lg mb-4"
              >
                <p className="text-sm flex items-center">
                  <Sparkles size={16} className="text-yellow-400 mr-2" />
                  Hint: {currentPuzzle.hint}
                </p>
              </motion.div>
            )}
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Your answer..."
                  className="w-full p-3 bg-black/30 border border-glass-border rounded-lg text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                />
              </div>
              
              <div className="flex gap-2">
                {!showHint && (
                  <Button 
                    variant="outline"
                    onClick={() => setShowHint(true)}
                    className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10"
                  >
                    Show Hint
                  </Button>
                )}
                
                <Button 
                  onClick={checkAnswer}
                  className="bg-gradient-to-r from-purple-600 to-blue-600"
                  disabled={!userAnswer.trim()}
                >
                  Submit Answer
                </Button>
              </div>
            </div>
            
            {isCorrect !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`mt-4 p-3 rounded-lg ${isCorrect ? 'bg-green-600/20' : 'bg-red-600/20'}`}
              >
                {isCorrect ? (
                  <p className="flex items-center text-green-400">
                    <CheckCircle size={16} className="mr-2" />
                    Correct! Loading next puzzle...
                  </p>
                ) : (
                  <p className="flex items-center text-red-400">
                    <XCircle size={16} className="mr-2" />
                    Incorrect. The answer was: "{currentPuzzle.answer}"
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>
          
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Solved: {puzzlesSolved} | Current Score: {score}</p>
            <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-full"
                style={{ width: `${(remainingTime / (difficultyLevel === "easy" ? 60 : difficultyLevel === "medium" ? 45 : 30)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-8">
          <p>No puzzles available for the selected difficulty</p>
          <Button 
            onClick={() => setDifficultyLevel("medium")}
            className="mt-4"
          >
            Try Medium Difficulty
          </Button>
        </div>
      )}
    </div>
  );
};
