// digital-guess-who/app/game-lobby/[code]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CopyIcon } from 'lucide-react'; // Assuming lucide-react is installed

export default function GameLobbyPage() {
  const params = useParams();
  const gameCode = params.code as string;

  const handleCopyCode = () => {
    if (gameCode) {
      navigator.clipboard.writeText(gameCode);
      // Optional: Add a toast notification for "Copied!"
      console.log('Game code copied to clipboard:', gameCode);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Game Lobby</h1>

      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-xl font-semibold mb-4">Share this code with your friend:</h2>

        <div className="flex w-full max-w-sm items-center space-x-2 mx-auto mb-8">
          <Label htmlFor="game-code" className="sr-only">Game Code</Label>
          <Input id="game-code" value={gameCode} readOnly className="flex-1 text-center text-2xl font-mono tracking-widest bg-gray-700 border-gray-600 focus:border-primary" />
          <Button onClick={handleCopyCode} className="bg-primary hover:bg-primary/90">
            <CopyIcon className="h-5 w-5 mr-2" /> Copy
          </Button>
        </div>

        {/* Placeholder for player list and ready status */}
        <div className="mt-8 text-lg text-gray-400">
          <p>Waiting for other players...</p>
          {/* Future: Display list of players, their ready status, etc. */}
        </div>

        <Button className="mt-8 w-full text-lg py-6 bg-secondary hover:bg-secondary/90">
          I'm Ready
        </Button>
      </div>
    </div>
  );
}
