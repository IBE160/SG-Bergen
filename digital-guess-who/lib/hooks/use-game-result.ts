import { useState, useEffect } from "react";
import { toast } from "sonner";

interface UseGameResultProps {
  gameId: string | null;
  gameStatus: string;
}

export function useGameResult({ gameId, gameStatus }: UseGameResultProps) {
  const [opponentCharacter, setOpponentCharacter] = useState<{ id: number; name: string; image: string } | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId || gameStatus !== "finished") {
      setOpponentCharacter(undefined);
      return;
    }

    // Small delay to allow store update to settle and ensure DB is consistent if latency
    // Although API checks status, optimistic update might be faster than DB write in some edge cases
    // but typically Realtime event follows DB write.
    const fetchResult = async (retryCount = 0) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/game/${gameId}/result`);
        if (!response.ok) {
          // If 403, might be because status isn't updated on server yet (Race Condition)
          if (response.status === 403 && retryCount < 3) {
             console.warn(`Result API returned 403, retrying (${retryCount + 1}/3)...`);
             await new Promise(resolve => setTimeout(resolve, 500));
             return fetchResult(retryCount + 1);
          }
          throw new Error("Failed to fetch game result");
        }
        const data = await response.json();
        setOpponentCharacter(data.opponent_character);
      } catch (err: any) {
        console.error("Error fetching result:", err);
        setError(err.message);
        // Toast is optional here as UI shows loading/empty state
      } finally {
        if (retryCount === 0 || retryCount === 3) {
            setIsLoading(false);
        }
      }
    };

    fetchResult();
  }, [gameId, gameStatus]);

  return { opponentCharacter, isLoading, error };
}
