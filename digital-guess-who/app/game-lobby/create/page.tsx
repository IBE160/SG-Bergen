// digital-guess-who/app/game-lobby/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function CreateGamePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const router = useRouter();

  const handleCreateGame = async () => {
    try {
      const response = await fetch('/api/game/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ difficulty: selectedDifficulty }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create game');
      }

      const { code } = await response.json();
      router.push(`/game-lobby/${code}`);
    } catch (error: any) {
      console.error('Error creating game:', error.message);
      // Optional: Display an error message to the user
      alert(`Error creating game: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Create New Game</h1>

      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Select Difficulty</h2>

        <RadioGroup
          defaultValue="medium"
          onValueChange={(value: Difficulty) => setSelectedDifficulty(value)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div>
            <RadioGroupItem value="easy" id="difficulty-easy" className="peer sr-only" />
            <Label
              htmlFor="difficulty-easy"
              className="flex flex-col items-center justify-between rounded-md border-2 border-gray-700 bg-popover p-4 hover:bg-gray-700 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="text-xl font-bold">Easy</span>
              <span className="text-sm text-gray-400">12 Characters</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="medium" id="difficulty-medium" className="peer sr-only" />
            <Label
              htmlFor="difficulty-medium"
              className="flex flex-col items-center justify-between rounded-md border-2 border-gray-700 bg-popover p-4 hover:bg-gray-700 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="text-xl font-bold">Medium</span>
              <span className="text-sm text-gray-400">24 Characters</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="hard" id="difficulty-hard" className="peer sr-only" />
            <Label
              htmlFor="difficulty-hard"
              className="flex flex-col items-center justify-between rounded-md border-2 border-gray-700 bg-popover p-4 hover:bg-gray-700 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span className="text-xl font-bold">Hard</span>
              <span className="text-sm text-gray-400">48 Characters</span>
            </Label>
          </div>
        </RadioGroup>

        <Button onClick={handleCreateGame} className="w-full text-lg py-6 bg-primary hover:bg-primary/90">
          Create Game
        </Button>
      </div>
    </div>
  );
}
