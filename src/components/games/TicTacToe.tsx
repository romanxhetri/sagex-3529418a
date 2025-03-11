
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCw, Trophy } from "lucide-react";
import confetti from 'canvas-confetti';

interface TicTacToeProps {
  onGameComplete: (won: boolean) => void;
}

export const TicTacToe = ({ onGameComplete }: TicTacToeProps) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [draws, setDraws] = useState(0);
  const [gameCount, setGameCount] = useState(0);
  
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  
  const calculateWinner = (squares: (string | null)[]) => {
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  };
  
  const isBoardFull = (squares: (string | null)[]) => {
    return squares.every(square => square !== null);
  };
  
  const handleClick = (i: number) => {
    if (winner || board[i] || aiThinking) return;
    
    const newBoard = [...board];
    newBoard[i] = 'X';
    setBoard(newBoard);
    setIsXNext(false);
    
    const result = calculateWinner(newBoard);
    if (result) {
      handleGameEnd(result.winner, result.line);
    } else if (isBoardFull(newBoard)) {
      handleDraw();
    } else {
      makeAiMove(newBoard);
    }
  };
  
  const makeAiMove = (currentBoard: (string | null)[]) => {
    setAiThinking(true);
    
    setTimeout(() => {
      // AI logic
      let bestScore = -Infinity;
      let move = -1;
      
      // Basic minimax for unbeatable AI
      for (let i = 0; i < currentBoard.length; i++) {
        if (currentBoard[i] === null) {
          currentBoard[i] = 'O';
          const score = minimax(currentBoard, 0, false);
          currentBoard[i] = null;
          
          if (score > bestScore) {
            bestScore = score;
            move = i;
          }
        }
      }
      
      if (move !== -1) {
        const newBoard = [...currentBoard];
        newBoard[move] = 'O';
        setBoard(newBoard);
        
        const result = calculateWinner(newBoard);
        if (result) {
          handleGameEnd(result.winner, result.line);
        } else if (isBoardFull(newBoard)) {
          handleDraw();
        }
      }
      
      setIsXNext(true);
      setAiThinking(false);
    }, 600);
  };
  
  const minimax = (board: (string | null)[], depth: number, isMaximizing: boolean): number => {
    const result = calculateWinner(board);
    
    if (result) {
      return result.winner === 'O' ? 10 - depth : depth - 10;
    }
    
    if (isBoardFull(board)) {
      return 0;
    }
    
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = 'O';
          const score = minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = 'X';
          const score = minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };
  
  const handleGameEnd = (winner: string | null, line: number[] | null) => {
    setWinner(winner);
    setWinningLine(line);
    setGameCount(prev => prev + 1);
    
    if (winner === 'X') {
      setPlayerScore(prev => prev + 1);
      onGameComplete(true);
      
      // Celebrate with confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else if (winner === 'O') {
      setAiScore(prev => prev + 1);
      onGameComplete(false);
    }
  };
  
  const handleDraw = () => {
    setWinner('draw');
    setDraws(prev => prev + 1);
    setGameCount(prev => prev + 1);
  };
  
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
  };
  
  return (
    <div className="bg-glass-dark backdrop-blur-lg border border-glass-border rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Tic Tac Toe</h2>
        
        <div className="flex items-center space-x-4">
          <div className="bg-purple-900/30 px-3 py-1 rounded-md text-sm">
            X: {playerScore}
          </div>
          <div className="bg-gray-800/50 px-3 py-1 rounded-md text-sm">
            Draws: {draws}
          </div>
          <div className="bg-blue-900/30 px-3 py-1 rounded-md text-sm">
            O: {aiScore}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-6">
        {board.map((square, i) => (
          <button
            key={i}
            className={`h-24 bg-glass border ${
              winningLine?.includes(i) ? 'border-green-500 shadow-lg shadow-green-500/20' : 'border-glass-border'
            } rounded-md flex items-center justify-center text-3xl font-bold transition-all duration-200 hover:bg-glass/70 ${
              !square && !winner && !aiThinking ? 'hover:border-purple-500 cursor-pointer' : ''
            }`}
            onClick={() => handleClick(i)}
            disabled={!!square || !!winner || aiThinking}
          >
            {square === 'X' && <span className="text-purple-400">X</span>}
            {square === 'O' && <span className="text-blue-400">O</span>}
          </button>
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          {winner === 'X' && (
            <div className="flex items-center text-green-400">
              <Trophy className="mr-2" size={20} />
              <span>You win! Congratulations!</span>
            </div>
          )}
          {winner === 'O' && <div className="text-red-400">AI wins. Try again!</div>}
          {winner === 'draw' && <div className="text-yellow-400">It's a draw!</div>}
          {aiThinking && <div className="text-blue-400">AI is thinking...</div>}
          {!winner && !aiThinking && isXNext && <div>Your turn (X)</div>}
        </div>
        
        <Button
          onClick={resetGame}
          variant="outline"
          size="sm"
          className="flex items-center"
        >
          <RotateCw className="mr-2" size={16} />
          New Game
        </Button>
      </div>
    </div>
  );
};
