'use client';

import Image from 'next/image';
import { useGameStore } from '../store/game-store';
import { Character } from '@/lib/game-logic/characters';
import { cn } from '@/lib/utils';

interface CharacterCardProps {
  character: Character;
  disabled?: boolean;
  onClick?: (character: Character) => void;
  isSelected?: boolean;
}

export default function CharacterCard({ character, disabled = false, onClick, isSelected = false }: CharacterCardProps) {
  const eliminatedCharacterIds = useGameStore((state) => state.eliminatedCharacterIds);
  const toggleCharacterElimination = useGameStore((state) => state.toggleCharacterElimination);

  const isEliminated = eliminatedCharacterIds.includes(character.id);

  const handleClick = () => {
    if (disabled) return;
    if (onClick) {
      onClick(character);
    } else {
      toggleCharacterElimination(character.id);
    }
  };

  return (
    <div
      role="button"
      aria-label={`Flip ${character.name}`}
      onClick={handleClick}
      className={cn(
        "relative w-24 h-32 md:w-32 md:h-44 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer shadow-md",
        isSelected ? "ring-4 ring-green-500 border-green-500 scale-105 z-10" : "",
        isEliminated
          ? "border-gray-300 bg-gray-200 grayscale opacity-60"
          : (!isSelected && "border-blue-500 bg-white hover:scale-105 hover:shadow-lg hover:border-blue-400"),
        disabled && "cursor-not-allowed opacity-50 hover:scale-100"
      )}
    >
      <div className="relative w-full h-full">
        <Image
          src={character.image}
          alt={character.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100px, 150px"
        />
        <div className={cn(
            "absolute bottom-0 w-full py-1 text-center text-sm font-semibold text-white bg-black/50 backdrop-blur-sm transition-colors",
            isEliminated ? "bg-gray-600/80" : "bg-blue-600/80"
        )}>
          {character.name}
        </div>
        
        {/* Overlay for eliminated state */}
        {isEliminated && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                 <span className="sr-only">Eliminated</span>
             </div>
        )}
      </div>
    </div>
  );
}