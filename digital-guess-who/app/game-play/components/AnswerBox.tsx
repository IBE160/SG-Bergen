'use client';

import { Button } from '@/components/ui/button';

interface AnswerBoxProps {
  question: string;
  onAnswer: (answer: 'yes' | 'no') => void;
  disabled: boolean;
}

export default function AnswerBox({ question, onAnswer, disabled }: AnswerBoxProps) {
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 w-full max-w-md border-blue-500">
      <h3 className="text-lg font-semibold text-blue-600">Incoming Question!</h3>
      <p className="text-xl font-medium text-center py-4">{question}</p>
      <div className="flex justify-center gap-4">
        <Button 
          variant="default" 
          className="w-24 bg-green-600 hover:bg-green-700"
          onClick={() => onAnswer('yes')}
          disabled={disabled}
        >
          Yes
        </Button>
        <Button 
          variant="destructive" 
          className="w-24"
          onClick={() => onAnswer('no')}
          disabled={disabled}
        >
          No
        </Button>
      </div>
    </div>
  );
}
