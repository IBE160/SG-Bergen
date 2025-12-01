import { Card, CardContent } from "@/components/ui/card";
import { Character } from "../types";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CharacterCardProps {
  character: Character;
  isSelected?: boolean;
  isEliminated?: boolean;
  onClick: () => void;
}

export function CharacterCard({ character, isSelected, isEliminated, onClick }: CharacterCardProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-primary transform hover:scale-105",
        isSelected && "ring-4 ring-primary border-primary scale-105",
        isEliminated && "opacity-40 grayscale bg-gray-800 pointer-events-none scale-95"
      )}
      onClick={onClick}
    >
      <CardContent className="p-2 flex flex-col items-center gap-2">
        <div className="relative w-full aspect-square overflow-hidden rounded-md bg-muted">
            <Image 
              src={character.image} 
              alt={character.name} 
              width={200} 
              height={200} 
              className="object-cover w-full h-full"
              unoptimized
            />
        </div>
        <span className="font-semibold text-sm truncate w-full text-center select-none">
          {character.name}
        </span>
      </CardContent>
    </Card>
  );
}
