"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/lib/store/game";
import { ALL_CHARACTERS } from "@/lib/data/characters";
import { CharacterGrid } from "../components/character-grid";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface GameClientProps {
  gameCode: string;
}

export function GameClient({ gameCode }: GameClientProps) {
  const { setCharacters, selectedCharacterId, selectCharacter } = useGameStore();
  const [status, setStatus] = useState<'selecting' | 'playing'>('selecting');
  const [isLoading, setIsLoading] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    // 1. Fetch difficulty (mocked for now, defaulting to medium)
    setCharacters(ALL_CHARACTERS.slice(0, 24));

    // 2. Fetch current player ID
    const fetchPlayer = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Find the game session first to get ID
      const { data: session } = await supabase
        .from('game_sessions')
        .select('id')
        .eq('code', gameCode)
        .single();
      
      if (!session) return;

      const { data: player } = await supabase
        .from('players')
        .select('id, is_ready')
        .eq('game_id', session.id)
        .eq('user_id', user.id)
        .single();

      if (player) {
        setPlayerId(player.id);
        
        // Check if already selected (via secrets table)
        const { data: secret } = await supabase
            .from('player_secrets' as any) // Cast as any until types are regenerated
            .select('character_id')
            .eq('player_id', player.id)
            .single();
        
        if (secret) {
            console.log("Found existing secret:", secret.character_id);
            selectCharacter(secret.character_id);
            setStatus('playing'); 
        }
      }
    };

    fetchPlayer();
  }, [gameCode, setCharacters, selectCharacter, supabase]);

  const handleConfirmSelection = async () => {
    if (!selectedCharacterId || !playerId) return;
    setIsLoading(true);

    try {
        // 1. Save secret
        const { error: secretError } = await supabase
            .from('player_secrets' as any)
            .insert({
                player_id: playerId,
                character_id: selectedCharacterId
            });
        
        if (secretError) throw secretError;

        // 2. Mark ready
        const { error: playerError } = await supabase
            .from('players')
            .update({ is_ready: true })
            .eq('id', playerId);

        if (playerError) throw playerError;

        setStatus('playing');
        toast.success("Character selected!");
    } catch (error) {
        console.error("Error confirming selection:", error);
        toast.error("Failed to confirm selection");
    } finally {
        setIsLoading(false);
    }
  };

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
                {status === 'selecting' ? "Select Your Secret Character" : "Game Board"}
            </h2>
            {status === 'selecting' && (
                <Button 
                    onClick={handleConfirmSelection} 
                    disabled={!selectedCharacterId || isLoading || !playerId}
                    size="lg"
                    className="gap-2"
                >
                    {isLoading ? "Confirming..." : "Confirm Selection"}
                </Button>
            )}
        </div>
        
        <CharacterGrid selectionMode={status === 'selecting'} />
      </main>
    </div>
  );
}