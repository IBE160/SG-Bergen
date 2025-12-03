'use client';

import { CHARACTERS, Character } from '@/lib/game-logic/characters';
import CharacterCard from './CharacterCard';

interface CharacterGridProps {
  onCharacterClick?: (character: Character) => void;
  selectedCharacterId?: number | null;
}

export default function CharacterGrid({ onCharacterClick, selectedCharacterId }: CharacterGridProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 p-4 bg-gray-100/50 rounded-xl border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700">
      {CHARACTERS.map((char) => (
        <CharacterCard 
          key={char.id} 
          character={char} 
          onClick={onCharacterClick}
          isSelected={selectedCharacterId === char.id}
        />
      ))}
    </div>
  );
}