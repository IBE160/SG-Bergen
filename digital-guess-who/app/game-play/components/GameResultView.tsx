import { Button } from "@/components/ui/button";
import { Trophy, Frown, RotateCcw, Home } from "lucide-react";
import { OpponentReveal } from "./OpponentReveal";

interface GameResultViewProps {
  winnerId: string | null;
  currentUserId: string;
  opponentCharacter?: {
    id: number;
    name: string;
    image: string;
  };
  isLoadingOpponent: boolean;
  onPlayAgain: () => void;
  onReturnToMenu: () => void;
  isPlayAgainLoading?: boolean;
}

export function GameResultView({
  winnerId,
  currentUserId,
  opponentCharacter,
  isLoadingOpponent,
  onPlayAgain,
  onReturnToMenu,
  isPlayAgainLoading = false
}: GameResultViewProps) {
  const isWinner = winnerId === currentUserId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm animate-in fade-in duration-300 p-4">
      <div className="relative w-full max-w-lg rounded-2xl border bg-card p-8 shadow-2xl flex flex-col items-center gap-8 text-center">
        
        {/* Header / Outcome Message */}
        <div className="flex flex-col items-center gap-2">
          {isWinner ? (
            <>
              <div className="p-4 rounded-full bg-primary/20 text-primary mb-2">
                <Trophy className="h-12 w-12" />
              </div>
              <h1 className="text-4xl font-extrabold text-primary tracking-tight">You Win!</h1>
              <p className="text-muted-foreground text-lg">Congratulations on your victory.</p>
            </>
          ) : (
            <>
              <div className="p-4 rounded-full bg-destructive/20 text-destructive mb-2">
                <Frown className="h-12 w-12" />
              </div>
              <h1 className="text-4xl font-extrabold text-destructive tracking-tight">You Lose</h1>
              <p className="text-muted-foreground text-lg">Better luck next time!</p>
            </>
          )}
        </div>

        {/* Character Reveal */}
        <div className="w-full py-4 border-y border-border/50 bg-muted/20 rounded-lg">
          <OpponentReveal 
            character={opponentCharacter} 
            isLoading={isLoadingOpponent} 
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-2">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={onReturnToMenu}
            className="w-full sm:w-auto gap-2"
          >
            <Home className="h-4 w-4" />
            Return to Menu
          </Button>
          
          <Button 
            variant="default" 
            size="lg" 
            onClick={onPlayAgain}
            disabled={isPlayAgainLoading}
            className="w-full sm:w-auto gap-2 min-w-[140px]"
          >
            {isPlayAgainLoading ? (
              "Setting up..."
            ) : (
              <>
                <RotateCcw className="h-4 w-4" />
                Play Again
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
