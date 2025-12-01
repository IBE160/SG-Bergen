'use client';

import { useEffect } from "react";
import { useGameStore } from "../store";
import { CharacterCard } from "./CharacterCard";
import { Character } from "../types";

export function CharacterGrid() {
  const { characters, setCharacters, mySecretCharacter, setMySecretCharacter, eliminatedCharacterIds, toggleEliminated, gameState } = useGameStore();

  useEffect(() => {
    async function loadCharacters() {
      try {
        const res = await fetch('/assets/data/characters.json');
        if (!res.ok) throw new Error('Failed to load characters');
        const data = await res.json();
        setCharacters(data);
      } catch (error) {
        console.error("Error loading characters:", error);
      }
    }
    if (characters.length === 0) {
        loadCharacters();
    }
  }, [setCharacters, characters.length]);

  const handleCardClick = (character: Character) => {
    if (gameState === 'selecting') {
      setMySecretCharacter(character);
    } else if (gameState === 'playing') {
      toggleEliminated(character.id);
    }
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 p-4">
      {characters.map((char) => (
        <CharacterCard
          key={char.id}
          character={char}
          isSelected={mySecretCharacter?.id === char.id}
          isEliminated={eliminatedCharacterIds.includes(char.id)}
          onClick={() => handleCardClick(char)}
        />
      ))}
    </div>
  );
}
