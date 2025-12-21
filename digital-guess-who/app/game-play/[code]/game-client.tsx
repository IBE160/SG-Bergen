"use client";

import { useEffect, useState, useMemo } from "react";
import { useGameStore } from "@/lib/store/game";
import { ALL_CHARACTERS } from "@/lib/data/characters";
import { CharacterGrid } from "../components/character-grid";
import { InteractionPanel, InteractionState } from "../components/interaction-panel";
import { GuessConfirmationModal } from "../components/guess-confirmation-modal";
import { QuitConfirmationModal } from "../components/quit-confirmation-modal";
import { GameResultView } from "../components/GameResultView";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useGameplaySubscription } from "@/lib/hooks/use-gameplay-subscription";
import { endPlayerTurn, submitQuestion, submitAnswer } from "@/lib/game-logic";
import { useGameResult } from "@/lib/hooks/use-game-result";
import { useRouter } from "next/navigation";
import { useLobbyStore } from "@/lib/store/lobby";

interface GameClientProps {
  gameCode: string;
}

export function GameClient({ gameCode }: GameClientProps) {
  const router = useRouter();
  const { 
    setCharacters, 
    characters,
    selectedCharacterId, 
    selectCharacter, 
    gameStatus,
    gamePhase, 
    setGamePhase, 
    currentTurnPlayerId,
    currentInteraction,
    lastMove,
    makeGuess,
    winnerId
  } = useGameStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isGuessModalOpen, setIsGuessModalOpen] = useState(false);
  const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
  const [isGuessing, setIsGuessing] = useState(false);
  const [isGuessSelectionMode, setIsGuessSelectionMode] = useState(false);
  const [guessTargetId, setGuessTargetId] = useState<number | null>(null);
  const [isPlayAgainLoading, setIsPlayAgainLoading] = useState(false);

  const [playerId, setPlayerId] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  const supabase = useMemo(() => createClient(), []);

  // Integrate Realtime Subscription
  useGameplaySubscription(gameId);

  // Listen for Play Again Broadcast
  useEffect(() => {
    if (!gameId) return;

    const channel = supabase.channel(`game-play:${gameId}`)
        .on('broadcast', { event: 'play-again' }, (payload) => {
            const newCode = payload.payload.newCode;
            if (newCode) {
                toast.success("Starting new game...");
                useGameStore.getState().reset();
                useLobbyStore.getState().reset();
                router.push(`/game-lobby/${newCode}`);
            }
        })
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
  }, [gameId, supabase, router]);
  
  // Fetch Game Result Details when finished
  const { opponentCharacter, isLoading: isLoadingResult } = useGameResult({ 
    gameId, 
    gameStatus: gameStatus 
  });

  const isMyTurn = playerId === currentTurnPlayerId;

  // Derive UI State from Store
  const hasAsked = lastMove?.action_type === 'answer' && lastMove?.player_id !== playerId && isMyTurn;

  const interactionState: InteractionState = {
    status: currentInteraction ? 'answering' : (hasAsked ? 'asked' : 'idle'),
    questionText: currentInteraction?.text,
    answer: lastMove?.details?.answer
  };

  const mappedLastMove = lastMove ? {
      player: lastMove.player_id === playerId ? "You" : "Opponent",
      action: lastMove.action_type,
      text: lastMove.action_type === 'question' 
            ? `Asked: "${lastMove.details.question_text}"` 
            : `Answered: ${lastMove.details.answer}`,
      timestamp: new Date(lastMove.created_at)
  } : undefined;

  const mySecretCharacter = characters.find(c => c.id === selectedCharacterId);
  // For the modal, we use the specific target selected for guessing
  const guessTargetCharacter = characters.find(c => c.id === guessTargetId);

  useEffect(() => {
    return () => toast.dismiss();
  }, []);

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

      // Check for session change to reset persisted state (like eliminated characters)
      const currentStoredGameId = useGameStore.getState().gameId;
      if (currentStoredGameId !== session.id) {
          useGameStore.getState().reset();
          useGameStore.getState().setGameId(session.id);
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

  const handleGuessButtonClick = () => {
      if (isGuessSelectionMode) {
          setIsGuessSelectionMode(false);
          setGuessTargetId(null);
      } else {
          setIsGuessSelectionMode(true);
          toast.info("Select the character on the board you want to guess.", { duration: 4000 });
      }
  };

  const handleGridCardClick = (id: number) => {
      setGuessTargetId(id);
      setIsGuessModalOpen(true);
      setIsGuessSelectionMode(false); // Exit selection mode once picked
  };

  const handleConfirmGuess = async () => {
      if (!gameId || !guessTargetId || !userId) return;
      setIsGuessing(true);
      try {
          await makeGuess(gameId, guessTargetId, userId);
          // Success handled by store update/realtime
          setIsGuessModalOpen(false);
      } catch (error: any) {
          toast.error(error.message || "Failed to make guess");
      } finally {
          setIsGuessing(false);
          setGuessTargetId(null);
      }
  };

  const handleReturnToMenu = () => {
    // If game is active, require confirmation
    if (gameStatus === 'active') {
        setIsQuitModalOpen(true);
        return;
    }
    
    // Otherwise proceed directly
    executeReturnToMenu();
  };

  const executeReturnToMenu = () => {
      toast.dismiss();
      useGameStore.getState().reset();
      useLobbyStore.getState().reset();
      router.push('/');
  };

  const handlePlayAgain = async () => {
      if (!gameId) return;
      setIsPlayAgainLoading(true);
      
      try {
          const res = await fetch(`/api/game/${gameId}/play-again`, { method: 'POST' });
          if (!res.ok) throw new Error('Failed to create new game');
          
          const { new_game_code } = await res.json();
          
          // Broadcast is now handled server-side to ensure reliability
          
          // Redirect self
          useGameStore.getState().reset();
          useLobbyStore.getState().reset();
          router.push(`/game-lobby/${new_game_code}`);
          
      } catch (e) {
          console.error("Play again error:", e);
          toast.error("Failed to start new game");
          setIsPlayAgainLoading(false);
      }
  };

  // Determine mode based on global phase
  const isSelecting = gamePhase === 'selection';
  const isGameActive = gamePhase === 'active' || gamePhase === 'game';

  return (
    <div className="container mx-auto flex min-h-screen flex-col p-4">
      <header className="mb-6 flex items-center justify-between">
        <div className="text-2xl font-bold">Guess Who?</div>
        <div className="flex items-center gap-4">
            <div className="rounded-full bg-secondary px-4 py-1 text-sm font-medium">
            Room: {gameCode}
            </div>
            <Button variant="ghost" size="sm" onClick={handleReturnToMenu}>
                Exit
            </Button>
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
                    onGuessClick={handleGuessButtonClick}
                    isGuessDisabled={false} // Always enabled now to trigger selection mode
                    isGuessMode={isGuessSelectionMode}
                />
            )}
        </div>
        
        {isGuessSelectionMode && (
            <div className="mb-4 p-4 bg-primary/10 border border-primary rounded-lg text-center animate-pulse">
                <p className="font-bold text-primary">GUESS MODE ACTIVE: Click on the character you suspect is your opponent's!</p>
            </div>
        )}
        
        <CharacterGrid 
            selectionMode={isSelecting} 
            onCardClick={isGuessSelectionMode ? handleGridCardClick : undefined}
        />

        {/* Modals and Overlays */}
        <QuitConfirmationModal 
            isOpen={isQuitModalOpen}
            onConfirm={executeReturnToMenu}
            onCancel={() => setIsQuitModalOpen(false)}
        />
        
        {guessTargetCharacter && (
            <GuessConfirmationModal 
                isOpen={isGuessModalOpen}
                character={guessTargetCharacter}
                onConfirm={handleConfirmGuess}
                onCancel={() => {
                    setIsGuessModalOpen(false);
                    setGuessTargetId(null);
                }}
                isSubmitting={isGuessing}
            />
        )}

        {gameStatus === 'finished' && (
            <GameResultView 
                winnerId={winnerId}
                currentUserId={userId || ''}
                opponentCharacter={opponentCharacter}
                isLoadingOpponent={isLoadingResult}
                onPlayAgain={handlePlayAgain}
                onReturnToMenu={handleReturnToMenu}
                isPlayAgainLoading={isPlayAgainLoading}
            />
        )}
      </main>
    </div>
  );
}