import { Character } from "@/lib/data/characters";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { KeyboardEvent } from "react";

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
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  const statusLabel = isEliminated ? "eliminated" : "active";
  const selectedLabel = isSelected ? ", selected" : "";
  const label = `${character.name}, ${statusLabel}${selectedLabel}`;

  return (
    <div
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-disabled={disabled}
      className={cn(
        "relative aspect-[3/4] cursor-pointer rounded-xl border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        !disabled && !isEliminated && "hover:-translate-y-1 hover:shadow-xl hover:border-primary/80",
        isSelected
          ? "border-green-500 ring-4 ring-green-500/50 scale-105 z-10 shadow-2xl"
          : "border-border",
        isEliminated ? "grayscale" : "opacity-100",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-lg bg-card">
         <Image
            src={character.imageUrl}
            alt="" // Decorative since we have aria-label on the button container
            fill
            className={cn(
                "object-cover transition-opacity duration-300",
                isEliminated ? "opacity-30" : "opacity-100"
            )}
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 10vw"
          />
        
        {/* Eliminated Overlay */}
        {isEliminated && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-grayscale">
                <div className="h-12 w-12 rounded-full border-4 border-destructive/50 flex items-center justify-center bg-destructive/10">
                    <span className="sr-only">Eliminated</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-destructive/70" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
        )}

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
