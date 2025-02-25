
import React from 'react';
import { MessageSquare } from 'lucide-react';

interface SuggestedQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
}

export const SuggestedQuestions = ({ questions, onQuestionClick }: SuggestedQuestionsProps) => {
  if (!questions?.length) return null;

  return (
    <div className="mt-4 space-y-2">
      <h4 className="text-sm text-gray-400">Suggested questions:</h4>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-purple-500/10 hover:bg-purple-500/20 transition-colors text-sm"
          >
            <MessageSquare size={14} />
            <span>{question}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
