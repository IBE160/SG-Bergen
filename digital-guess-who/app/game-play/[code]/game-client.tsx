"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/lib/store/game";
import { ALL_CHARACTERS } from "@/lib/data/characters";
import { CharacterGrid } from "../components/character-grid";
import { InteractionPanel, InteractionState } from "../components/interaction-panel";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useGameplaySubscription } from "@/lib/hooks/use-gameplay-subscription";
import { endPlayerTurn, submitQuestion, submitAnswer } from "@/lib/game-logic";

interface GameClientProps {
  gameCode: string;
}

export function GameClient({ gameCode }: GameClientProps) {
  const { 
    setCharacters, 
    selectedCharacterId, 
    selectCharacter, 
    gamePhase, 
    setGamePhase, 
    currentTurnPlayerId,
    currentInteraction,
    lastMove
  } = useGameStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  const supabase = createClient();

  // Integrate Realtime Subscription
  useGameplaySubscription(gameId);

  const isMyTurn = playerId === currentTurnPlayerId;

  // Derive UI State from Store
  const interactionState: InteractionState = {
    status: currentInteraction ? 'answering' : 'idle',
    questionText: currentInteraction?.text
  };

  const mappedLastMove = lastMove ? {
      player: lastMove.player_id === playerId ? "You" : "Opponent",
      action: lastMove.action_type,
      text: lastMove.action_type === 'question' 
            ? `Asked: "${lastMove.details.question_text}"` 
            : `Answered: ${lastMove.details.answer}`,
      timestamp: new Date(lastMove.created_at)
  } : undefined;

  useEffect(() => {
    if (isMyTurn && lastMove?.action_type === 'answer') {
        toast.info("Eliminate characters based on the answer!", {
            duration: 5000,
            action: {
                label: "Got it",
                onClick: () => console.log("User acknowledged elimination prompt")
            }
        });
    }
  }, [lastMove, isMyTurn]);

  useEffect(() => {
    const initGame = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      // 1. Fetch Session & Difficulty
      const { data: session } = await supabase
        .from('game_sessions')
        .select('id, difficulty, status, phase, current_turn_player_id') 
        .eq('code', gameCode)
        .single();
      
      if (!session) {
        toast.error("Game session not found");
        return;
      }

      setGameId(session.id);
      if (session.phase) setGamePhase(session.phase);
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
            .from('player_secrets')
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
            .from('player_secrets')
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

  const handleAskQuestion = async (text: string) => {
      if (!gameId || !playerId) return;
      try {
          await submitQuestion(gameId, playerId, text);
      } catch (error) {
          toast.error("Failed to send question");
      }
  };

  const handleAnswerQuestion = async (answer: 'Yes' | 'No') => {
      if (!gameId || !playerId || !currentInteraction) return;
      try {
          await submitAnswer(gameId, playerId, answer, currentInteraction.id);
      } catch (error) {
          toast.error("Failed to send answer");
      }
  };

  const handleEndTurn = async () => {
    if (!gameId || !playerId) return;
    try {
        await endPlayerTurn(gameId, playerId);
        toast.success("Turn ended. Waiting for opponent.");
    } catch (error) {
        console.error("Failed to end turn:", error);
        toast.error("Failed to end turn.");
    }
  };

  // Determine mode based on global phase
  const isSelecting = gamePhase === 'selection';
  const isGameActive = gamePhase === 'active' || gamePhase === 'game';

  return (
    <div className="container mx-auto flex min-h-screen flex-col p-4">
      <header className="mb-6 flex items-center justify-between">
        <div className="text-2xl font-bold">Guess Who?</div>
        <div className="rounded-full bg-secondary px-4 py-1 text-sm font-medium">
          Room: {gameCode}
        </div>
      </header>

      <main className="flex-1">
        <div className="mb-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
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
                        <Button disabled={!isMyTurn} variant="secondary" onClick={handleEndTurn}>End Turn</Button>
                        <Button disabled={!isMyTurn} variant="destructive">Make Guess</Button>
                    </div>
                )}
            </div>

            {!isSelecting && isGameActive && (
                <InteractionPanel 
                    isMyTurn={!!isMyTurn}
                    interactionState={interactionState}
                    lastMove={mappedLastMove}
                    onAskQuestion={handleAskQuestion}
                    onAnswerQuestion={handleAnswerQuestion}
                />
            )}
        </div>
        
        <CharacterGrid selectionMode={isSelecting} />
      </main>
    </div>
  );
}
