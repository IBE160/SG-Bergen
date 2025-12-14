"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/lib/store/game";
import { ALL_CHARACTERS } from "@/lib/data/characters";
import { CharacterGrid } from "../components/character-grid";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useGameplaySubscription } from "@/lib/hooks/use-gameplay-subscription";

interface GameClientProps {
  gameCode: string;
}

export function GameClient({ gameCode }: GameClientProps) {
  const { setCharacters, selectedCharacterId, selectCharacter, gamePhase, setGamePhase, currentTurnPlayerId } = useGameStore();
  const [isLoading, setIsLoading] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createClient();

  // Integrate Realtime Subscription
  useGameplaySubscription(gameId);

  const isMyTurn = userId === currentTurnPlayerId; // Derive isMyTurn

  useEffect(() => {
    const initGame = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      // 1. Fetch Session & Difficulty
      const { data: session } = await supabase
        .from('game_sessions')
        .select('id, difficulty, status, phase, current_turn_player_id') // Fetch current_turn_player_id
        .eq('code', gameCode)
        .single();
      
      if (!session) {
        toast.error("Game session not found");
        return;
      }

      setGameId(session.id);
      if (session.phase) setGamePhase(session.phase);
      // set current turn player in the store
      useGameStore.getState().setCurrentTurn(session.current_turn_player_id);

      // Set Characters based on Difficulty
      let charCount = 24; // Default Medium
      if (session.difficulty === 'easy') charCount = 12;
      if (session.difficulty === 'hard') charCount = 48;
      
      setCharacters(ALL_CHARACTERS.slice(0, charCount));

      // 2. Fetch Player
      const { data: player } = await supabase
        .from('players')
        .select('id, is_ready')
        .eq('game_id', session.id)
        .eq('user_id', user.id)
        .single();

      if (player) {
        setPlayerId(player.id);
        
        // Check if already selected
        const { data: secret } = await supabase
            .from('player_secrets' as any)
            .select('character_id')
            .eq('player_id', player.id)
            .single();
        
        if (secret) {
            selectCharacter(secret.character_id);
        }
      }
    };

    initGame();
  }, [gameCode, setCharacters, selectCharacter, supabase, setGamePhase]);

  const handleConfirmSelection = async () => {
    if (!selectedCharacterId || !playerId) return;
    setIsLoading(true);

    try {
        const { error: secretError } = await supabase
            .from('player_secrets' as any)
            .insert({
                player_id: playerId,
                character_id: selectedCharacterId
            });
        
        if (secretError) throw secretError;

        const { error: playerError } = await supabase
            .from('players')
            .update({ is_ready: true })
            .eq('id', playerId);

        if (playerError) throw playerError;

        toast.success("Character selected! Waiting for opponent...");
    } catch (error) {
        console.error("Error confirming selection:", error);
        toast.error("Failed to confirm selection");
    } finally {
        setIsLoading(false);
    }
  };

  // Determine mode based on global phase
  const isSelecting = gamePhase === 'selection';
  const isGameActive = gamePhase === 'active';

  return (
    <div className="container mx-auto flex min-h-screen flex-col p-4">
      <header className="mb-6 flex items-center justify-between">
        <div className="text-2xl font-bold">Guess Who?</div>
        <div className="rounded-full bg-secondary px-4 py-1 text-sm font-medium">
          Room: {gameCode}
        </div>
      </header>

      <main className="flex-1">
        <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
                {isSelecting ? "Select Your Secret Character" : "Game Board"}
            </h2>
            {isSelecting && (
                <Button 
                    onClick={handleConfirmSelection} 
                    disabled={!selectedCharacterId || isLoading || !playerId}
                    size="lg"
                    className="gap-2"
                >
                    {isLoading ? "Confirming..." : "Confirm Selection"}
                </Button>
            )}
            {!isSelecting && isGameActive && (
                <div className="flex items-center space-x-2">
                    {isMyTurn ? (
                        <span className="rounded-full bg-green-500 px-3 py-1 text-sm font-medium text-white">Your Turn</span>
                    ) : (
                        <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white">Opponent's Turn</span>
                    )}
                    <Button disabled={!isMyTurn} variant="outline">Ask Question</Button>
                    <Button disabled={!isMyTurn}>Make Guess</Button>
                </div>
            )}
        </div>
        
        <CharacterGrid selectionMode={isSelecting} />
      </main>
    </div>
  );
}
