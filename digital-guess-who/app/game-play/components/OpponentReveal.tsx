import { Character } from "@/lib/data/characters";
import { CharacterCard } from "./character-card";

interface OpponentRevealProps {
  character?: {
    id: number;
    name: string;
    image: string;
  };
  isLoading: boolean;
}

export function OpponentReveal({ character, isLoading }: OpponentRevealProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-muted-foreground animate-pulse">Revealing opponent's character...</p>
        <div className="h-[200px] w-[150px] rounded-xl bg-muted animate-pulse" />
      </div>
    );
  }

  if (!character) {
    return (
      <div className="flex flex-col items-center gap-4">
         <div className="h-[200px] w-[150px] rounded-xl bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
            <span className="text-muted-foreground text-sm">Unknown</span>
         </div>
      </div>
    )
  }

  // Map to Character type expected by CharacterCard
  // The API returns { id, name, image }, CharacterCard expects { id, name, imageUrl }
  const mappedCharacter: Character = {
    id: character.id,
    name: character.name,
    imageUrl: character.image
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-xl font-semibold">Opponent was:</h3>
      <div className="w-[180px] pointer-events-none">
        <CharacterCard 
          character={mappedCharacter}
          onClick={() => {}}
          disabled={false} // Show as active/normal, just pointer-events-none ensures no interaction
          isSelected={true} // Highlight it
        />
      </div>
    </div>
  );
}
