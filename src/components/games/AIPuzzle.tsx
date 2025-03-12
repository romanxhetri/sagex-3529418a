
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import confetti from "canvas-confetti";
import { Brain, Lightbulb, ArrowRight, Clock, Award, Zap } from "lucide-react";

// Define the puzzle type interface separately from import
interface PuzzleData {
  id: number;
  question: string;
  answer: string;
  hint: string;
  difficulty: "easy" | "medium" | "hard";
}

export const AIPuzzle = () => {
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // Puzzles database
  const puzzles: PuzzleData[] = [
    {
      id: 1,
      question: "What has keys but can't open locks?",
      answer: "piano",
      hint: "It makes music",
      difficulty: "easy"
    },
    {
      id: 2,
      question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
      answer: "echo",
      hint: "Your voice returns to you",
      difficulty: "medium"
    },
    {
      id: 3,
      question: "The more you take, the more you leave behind. What are they?",
      answer: "footsteps",
      hint: "Think about walking",
      difficulty: "medium"
    },
    {
      id: 4,
      question: "What is always in front of you but can't be seen?",
      answer: "future",
      hint: "It's related to time",
      difficulty: "easy"
    },
    {
      id: 5,
      question: "What gets wet while drying?",
      answer: "towel",
      hint: "You use it after a shower",
      difficulty: "easy"
    },
    {
      id: 6,
      question: "I'm tall when I'm young, and I'm short when I'm old. What am I?",
      answer: "candle",
      hint: "I melt over time",
      difficulty: "medium"
    },
    {
      id: 7,
      question: "What can you break, even if you never pick it up or touch it?",
      answer: "promise",
      hint: "It's something you give to someone",
      difficulty: "medium"
    },
    {
      id: 8,
      question: "What has a head and a tail but no body?",
      answer: "coin",
      hint: "It's in your pocket",
      difficulty: "easy"
    },
    {
      id: 9,
      question: "If you have me, you want to share me. If you share me, you haven't got me. What am I?",
      answer: "secret",
      hint: "It's something private",
      difficulty: "hard"
    },
    {
      id: 10,
      question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
      answer: "map",
      hint: "You use it for navigation",
      difficulty: "hard"
    },
  ];

  const startGame = () => {
    setIsPlaying(true);
    setTime(0);
    setIsCorrect(null);
    setShowHint(false);
    setUserAnswer("");
    getRandomPuzzle();
  };

  const getRandomPuzzle = () => {
    const filteredPuzzles = puzzles.filter(p => p.difficulty === difficulty);
    const randomPuzzle = filteredPuzzles[Math.floor(Math.random() * filteredPuzzles.length)];
    setPuzzle(randomPuzzle);
  };

  const checkAnswer = () => {
    if (!puzzle) return;
    
    const isAnswerCorrect = userAnswer.toLowerCase().trim() === puzzle.answer.toLowerCase();
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      // Celebrate with confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Update score based on difficulty and time
      let pointsEarned = difficulty === "easy" ? 10 : 
                         difficulty === "medium" ? 20 : 30;
                         
      // Faster answers get bonus points
      if (time < 30) pointsEarned += 10;
      if (time < 15) pointsEarned += 5;
      
      setScore(prev => prev + pointsEarned);
      setStreak(prev => prev + 1);
      
      // Get next puzzle after a delay
      setTimeout(() => {
        getRandomPuzzle();
        setUserAnswer("");
        setIsCorrect(null);
        setShowHint(false);
      }, 2000);
    } else {
      setStreak(0);
    }
  };

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isPlaying) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);

  return (
    <motion.div 
      className="p-6 bg-glass-dark backdrop-blur-lg rounded-lg border border-glass-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Brain className="w-6 h-6 mr-2 text-purple-400" />
          AI Brain Teasers
        </h2>
        
        <div className="flex items-center space-x-4">
          <div className="text-white bg-purple-800/50 px-3 py-1 rounded-md flex items-center">
            <Award className="w-4 h-4 mr-1" />
            <span>{score}</span>
          </div>
          <div className="text-white bg-blue-800/50 px-3 py-1 rounded-md flex items-center">
            <Zap className="w-4 h-4 mr-1" />
            <span>Streak: {streak}</span>
          </div>
          {isPlaying && (
            <div className="text-white bg-gray-800/50 px-3 py-1 rounded-md flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{time}s</span>
            </div>
          )}
        </div>
      </div>

      {!isPlaying ? (
        <div className="text-center py-8">
          <h3 className="text-xl font-medium text-white mb-4">Test your problem-solving skills!</h3>
          <p className="text-gray-300 mb-6">Solve riddles and brain teasers generated by AI</p>
          
          <div className="flex justify-center gap-3 mb-6">
            <Button 
              onClick={() => setDifficulty("easy")}
              variant={difficulty === "easy" ? "default" : "outline"}
              className={difficulty === "easy" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Easy
            </Button>
            <Button 
              onClick={() => setDifficulty("medium")}
              variant={difficulty === "medium" ? "default" : "outline"}
              className={difficulty === "medium" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
            >
              Medium
            </Button>
            <Button 
              onClick={() => setDifficulty("hard")}
              variant={difficulty === "hard" ? "default" : "outline"}
              className={difficulty === "hard" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              Hard
            </Button>
          </div>
          
          <Button onClick={startGame} size="lg" className="bg-purple-600 hover:bg-purple-700">
            Start Game
          </Button>
        </div>
      ) : puzzle ? (
        <div className="space-y-6">
          <motion.div 
            className="bg-glass-dark backdrop-blur-lg p-4 rounded-lg border border-glass-border text-center"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl text-white mb-2">Puzzle #{puzzle.id}</h3>
            <p className="text-xl font-medium text-white">{puzzle.question}</p>
          </motion.div>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Your answer..."
                className="flex-1 bg-gray-800/50 text-white border-gray-700"
                onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
              />
              <Button onClick={checkAnswer} disabled={!userAnswer.trim()}>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
            
            {isCorrect === false && (
              <motion.p 
                className="text-red-400 text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                That's not right. Try again!
              </motion.p>
            )}
            
            {isCorrect === true && (
              <motion.p 
                className="text-green-400 text-center font-bold"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                Correct! Well done!
              </motion.p>
            )}
            
            {!showHint && !isCorrect && (
              <Button 
                variant="outline" 
                onClick={() => setShowHint(true)}
                className="mx-auto block text-amber-400 border-amber-600/50 hover:bg-amber-900/20"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Need a hint?
              </Button>
            )}
            
            <AnimatePresence>
              {showHint && !isCorrect && (
                <motion.div 
                  className="bg-amber-950/30 border border-amber-800/50 rounded-lg p-3 text-amber-300"
                  initial={{ opacity: the0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <p className="flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2 text-amber-400" />
                    {puzzle.hint}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-white">Loading puzzle...</p>
        </div>
      )}
      
      {isPlaying && (
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            onClick={() => {
              setIsPlaying(false);
              setScore(0);
              setStreak(0);
            }}
            className="text-red-400 border-red-800/30 hover:bg-red-900/20"
          >
            End Game
          </Button>
        </div>
      )}
    </motion.div>
  );
};
