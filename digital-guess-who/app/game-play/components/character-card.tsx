import { Character } from "@/lib/data/characters";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CharacterCardProps {
  character: Character;
  isSelected?: boolean;
  isEliminated?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function CharacterCard({
  character,
  isSelected,
  isEliminated,
  onClick,
  disabled
}: CharacterCardProps) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={cn(
        "relative aspect-[3/4] cursor-pointer rounded-xl border-2 transition-all duration-200",
        isSelected
          ? "border-green-500 ring-4 ring-green-500/50 scale-105 z-10"
          : "border-border hover:border-primary/50",
        isEliminated ? "opacity-40 grayscale" : "opacity-100",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-lg bg-card">
         <Image
            src={character.imageUrl}
            alt={character.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 10vw"
          />
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-center text-white backdrop-blur-sm">
          <span className="text-sm font-bold sm:text-base">{character.name}</span>
        </div>
      </div>
      {/* Selected Indicator Overlay */}
      {isSelected && (
        <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
      )}
    </div>
  );
}
