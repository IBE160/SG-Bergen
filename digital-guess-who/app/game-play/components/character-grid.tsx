import { useGameStore } from "@/lib/store/game";
import { CharacterCard } from "./character-card";

interface CharacterGridProps {
  selectionMode?: boolean;
  readonly?: boolean;
}

export function CharacterGrid({ selectionMode = false, readonly = false }: CharacterGridProps) {
  const { characters, selectedCharacterId, eliminatedCharacterIds, selectCharacter, toggleElimination } = useGameStore();

  const handleCardClick = (id: number) => {
    if (readonly) return;
    
    if (selectionMode) {
      selectCharacter(id);
    } else {
      toggleElimination(id);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
      {characters.map((char) => (
        <CharacterCard
          key={char.id}
          character={char}
          isSelected={selectionMode && selectedCharacterId === char.id}
          isEliminated={!selectionMode && eliminatedCharacterIds.includes(char.id)}
          onClick={() => handleCardClick(char.id)}
          disabled={readonly}
        />
      ))}
    </div>
  );
}