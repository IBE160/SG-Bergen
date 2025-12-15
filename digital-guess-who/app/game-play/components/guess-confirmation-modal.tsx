import { Character } from "@/lib/data/characters";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface GuessConfirmationModalProps {
  character: Character;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  isSubmitting?: boolean;
}

export function GuessConfirmationModal({
  character,
  onConfirm,
  onCancel,
  isOpen,
  isSubmitting
}: GuessConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg text-card-foreground">
        <h2 className="text-xl font-bold mb-4 text-center">Confirm Guess</h2>
        
        <div className="flex flex-col items-center gap-4 mb-6">
            <div className="relative h-48 w-36 overflow-hidden rounded-lg border-2 border-primary">
                 <Image
                    src={character.imageUrl}
                    alt={character.name}
                    fill
                    className="object-cover"
                  />
            </div>
            <p className="text-lg font-medium text-center">Are you sure you want to guess <span className="text-primary font-bold">{character.name}</span>?</p>
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm text-center w-full">
                <strong>Warning:</strong> An incorrect guess results in an immediate <strong>LOSS</strong>.
            </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Guessing..." : "Confirm Guess"}
          </Button>
        </div>
      </div>
    </div>
  );
}
