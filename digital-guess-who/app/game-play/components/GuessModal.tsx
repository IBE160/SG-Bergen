'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useGameStore } from '../store/game-store';
import { CHARACTERS } from '@/lib/game-logic/characters';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface GuessModalProps {
  onConfirmGuess: (characterId: number) => void;
}

export default function GuessModal({ onConfirmGuess }: GuessModalProps) {
  const isGuessing = useGameStore((state) => state.isGuessing);
  const setIsGuessing = useGameStore((state) => state.setIsGuessing);
  const [selectedCharId, setSelectedCharId] = useState<number | null>(null);

  const handleClose = () => {
    setIsGuessing(false);
    setSelectedCharId(null);
  };

  const handleConfirm = () => {
    if (selectedCharId) {
      onConfirmGuess(selectedCharId);
      handleClose();
    }
  };

  return (
    <Dialog open={isGuessing} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Make Your Final Guess</DialogTitle>
          <DialogDescription>
            Select the character you think your opponent has. If you are wrong, you lose!
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 p-4">
          {CHARACTERS.map((char) => (
            <div
              key={char.id}
              onClick={() => setSelectedCharId(char.id)}
              className={cn(
                "relative w-full aspect-[3/4] rounded-lg overflow-hidden border-4 cursor-pointer transition-all",
                selectedCharId === char.id 
                  ? "border-green-500 ring-4 ring-green-200 scale-105" 
                  : "border-transparent hover:border-blue-300"
              )}
            >
              <Image
                src={char.image}
                alt={char.name}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 w-full bg-black/60 text-white text-center text-xs py-1">
                {char.name}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button 
            variant="destructive" 
            disabled={!selectedCharId}
            onClick={handleConfirm}
          >
            Confirm Guess
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
