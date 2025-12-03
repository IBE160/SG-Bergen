'use client';

import { Character } from '@/lib/game-logic/characters';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GameOverOverlayProps {
  isWinner: boolean;
  opponentCharacter?: Character;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export default function GameOverOverlay({ 
  isWinner, 
  opponentCharacter, 
  onPlayAgain, 
  onMainMenu 
}: GameOverOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md border-4 shadow-2xl animate-in fade-in zoom-in duration-300">
        <CardHeader className="text-center space-y-2">
          <CardTitle className={cn("text-4xl font-extrabold tracking-tight", isWinner ? "text-green-600" : "text-red-600")}>
            {isWinner ? "VICTORY!" : "DEFEAT"}
          </CardTitle>
          <p className="text-muted-foreground text-lg">
            {isWinner ? "You guessed correctly!" : "Better luck next time."}
          </p>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center space-y-6">
          {opponentCharacter && (
            <div className="text-center space-y-4">
              <p className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Opponent's Character
              </p>
              <div className={cn(
                "relative w-40 h-56 rounded-xl overflow-hidden border-4 shadow-xl transition-transform hover:scale-105",
                isWinner ? "border-green-500 ring-4 ring-green-200" : "border-gray-400 grayscale"
              )}>
                <Image
                  src={opponentCharacter.image}
                  alt={opponentCharacter.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 w-full bg-black/70 text-white py-2 font-bold">
                    {opponentCharacter.name}
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center pt-4">
          <Button 
            onClick={onPlayAgain} 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-lg py-6"
          >
            Play Again
          </Button>
          <Button 
            variant="outline" 
            onClick={onMainMenu}
            className="w-full sm:w-auto text-lg py-6"
          >
            Main Menu
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
