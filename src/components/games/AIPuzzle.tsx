import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, HelpCircle } from "lucide-react";

type PuzzleDifficulty = "easy" | "medium" | "hard";

interface PuzzleType {
  id: number;
  question: string;
  answer: string;
  hint: string;
  difficulty: PuzzleDifficulty;
}

export const AIPuzzle: React.FC = () => {
  const [puzzle, setPuzzle] = useState<PuzzleType>({
    id: 1,
    question: "What is the capital of France?",
    answer: "Paris",
    hint: "It's a famous city known for the Eiffel Tower",
    difficulty: "easy"
  });
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);

  const checkAnswer = () => {
    if (userAnswer.trim().toLowerCase() === puzzle.answer.toLowerCase()) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleNewPuzzle = () => {
    const puzzle = {
      id: Date.now(),
      question: "What comes after artificial in AI?",
      answer: "Intelligence",
      hint: "Think about what AI stands for",
      difficulty: "medium" as PuzzleDifficulty
    };
    setPuzzle(puzzle);
  };

  return (
    <Card className="w-full max-w-md bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">AI Puzzle</CardTitle>
        <CardDescription className="text-gray-400">Test your AI knowledge!</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          <p className="text-lg text-white mb-2">{puzzle.question}</p>
          {showHint && (
            <div className="p-3 bg-gray-800 rounded-md text-gray-300">
              <Lightbulb className="inline-block mr-2" size={16} />
              Hint: {puzzle.hint}
            </div>
          )}
        </div>
        <div className="mb-4">
          <Input
            type="text"
            placeholder="Your answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        {isCorrect !== null && (
          <div className={`mb-4 p-3 rounded-md ${isCorrect ? "bg-green-800 text-green-300" : "bg-red-800 text-red-300"}`}>
            {isCorrect ? "Correct!" : "Incorrect. Try again."}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4">
        <Button onClick={checkAnswer} className="bg-purple-600 hover:bg-purple-700 text-white">Check Answer</Button>
        <div>
          <Button
            variant="outline"
            onClick={() => setShowHint(!showHint)}
            className="mr-2 text-gray-300 hover:text-white border-gray-600 hover:border-gray-400"
          >
            <HelpCircle className="inline-block mr-2" size={16} />
            {showHint ? "Hide Hint" : "Show Hint"}
          </Button>
          <Button onClick={handleNewPuzzle} variant="secondary" className="bg-gray-700 hover:bg-gray-600 text-white">New Puzzle</Button>
        </div>
      </CardFooter>
    </Card>
  );
};
