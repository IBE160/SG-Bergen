'use client';

import { useEffect, useState, use } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useGameStore } from '../store';
import { CharacterGrid } from '../components/CharacterGrid';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function GamePlayPage({ params }: { params: Promise<{ code: string }> }) {
  const router = useRouter();
  const { code } = use(params); // Unwrap params
  const supabase = createClient();
  const { 
    mySecretCharacter, 
    gameState, 
    setGameState, 
    // setTurn 
  } = useGameStore();
  
  const [gameId, setGameId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("Select your Secret Character");

  // 1. Init: Get User and Game
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserId(user.id);

      // Get Game ID from code
      const { data: game } = await supabase
        .from('game_sessions')
        .select('id, status, host_id')
        .eq('code', code)
        .single();

      if (!game) {
        router.push('/');
        return;
      }
      setGameId(game.id);
      
      // Load initial player state
      const { data: player } = await supabase
        .from('players')
        .select('id, has_selected_character')
        .eq('game_id', game.id)
        .eq('user_id', user.id)
        .single();
        
      if (player?.has_selected_character) {
         setIsConfirmed(true);
         setMessage("Waiting for opponent...");
      }

      // Check opponent status
      const { data: players } = await supabase
        .from('players')
        .select('id, user_id, has_selected_character')
        .eq('game_id', game.id);
        
      const opponent = players?.find(p => p.user_id !== user.id);
      if (opponent?.has_selected_character) {
        setOpponentReady(true);
      }

      setIsLoading(false);
    };
    init();
  }, [code, router, supabase]);

  // 2. Realtime: Listen for updates
  useEffect(() => {
    if (!gameId) return;

    console.log("Setting up Realtime subscription for Game ID:", gameId);

    const channel = supabase.channel(`game-play:${gameId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'players',
        // Removing filter to test if it helps, filtering manually below
      }, (payload) => {
        console.log("Received Realtime Event:", payload);
        const newRow = payload.new as any;
        
        // Manual filter
        if (newRow.game_id !== gameId) return;

        if (newRow.user_id !== userId) {
            console.log("Opponent updated (Realtime):", newRow);
            // Opponent update
            if (newRow.has_selected_character) {
                console.log("Opponent is ready!");
                setOpponentReady(true);
            }
        }
      })
      .subscribe((status) => {
        console.log("Realtime Subscription Status:", status);
      });

    return () => {
      console.log("Cleaning up Realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [gameId, userId, supabase]);

  // 3. Logic: Transition to Playing
  useEffect(() => {
    console.log("Checking Game Start Conditions:", { isConfirmed, opponentReady, gameState });
    if (isConfirmed && opponentReady && gameState === 'selecting') {
        console.log("Starting Game!");
        setGameState('playing');
        setMessage("Game Started!");
    }
  }, [isConfirmed, opponentReady, gameState, setGameState]);

  const handleConfirmSelection = async () => {
    if (!mySecretCharacter || !gameId || !userId) return;

    setIsLoading(true);
    
    // 1. Get my player ID
    const { data: player } = await supabase
        .from('players')
        .select('id')
        .eq('game_id', gameId)
        .eq('user_id', userId)
        .single();

    if (!player) return;

    // 2. Insert Secret
    const { error } = await supabase
        .from('player_secrets')
        .insert({
            player_id: player.id,
            character_id: mySecretCharacter.id
        });

    if (error) {
        console.error("Error confirming character:", error);
        // If 409 Conflict or RLS, assume success if it was us?
        // Or show error.
    } else {
        setIsConfirmed(true);
        setMessage("Waiting for opponent to select...");
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Game Room: {code}</h1>
        <div className="text-lg font-semibold px-4 py-2 bg-secondary/20 rounded-md">
          {message}
        </div>
      </div>

      {gameState === 'selecting' && !isConfirmed && (
        <div className="sticky top-4 z-10 bg-background/80 backdrop-blur-sm p-4 border rounded-lg shadow-lg flex justify-between items-center">
            <div className="flex items-center gap-4">
                <span className="text-muted-foreground">Selected:</span>
                {mySecretCharacter ? (
                    <span className="font-bold text-primary">{mySecretCharacter.name}</span>
                ) : (
                    <span className="italic">None</span>
                )}
            </div>
            <Button 
                onClick={handleConfirmSelection} 
                disabled={!mySecretCharacter}
                size="lg"
            >
                Confirm Selection
            </Button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="bg-green-500/10 border border-green-500 text-green-700 p-4 rounded-lg text-center font-bold text-xl">
            GAME ACTIVE! It is someone's turn.
        </div>
      )}

      <CharacterGrid />
    </div>
  );
}