'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface QuestionBoxProps {
  onAsk: (question: string) => void;
  disabled: boolean;
}

export default function QuestionBox({ onAsk, disabled }: QuestionBoxProps) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onAsk(question);
      setQuestion('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 w-full max-w-md">
      <h3 className="text-lg font-semibold">Ask a Question</h3>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="e.g., Does your character wear a hat?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={disabled}
          className="flex-1"
        />
        <Button type="submit" disabled={disabled || !question.trim()}>
          Ask
        </Button>
      </div>
    </form>
  );
}
