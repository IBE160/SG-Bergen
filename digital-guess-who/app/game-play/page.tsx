import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/db/types';
import { User } from '@supabase/supabase-js';
import { useGameStore } from './store/game-store';
import TurnIndicator from './components/TurnIndicator';
import QuestionBox from './components/QuestionBox';
import AnswerBox from './components/AnswerBox';
import CharacterGrid from './components/CharacterGrid';
import GuessModal from './components/GuessModal';
import GameOverOverlay from './components/GameOverOverlay';
import { CHARACTERS, Character } from '@/lib/game-logic/characters';
import { useRouter } from 'next/navigation';

export default function GamePlayPage({ params }: { params: { 'game-id': string } }) {
  const gameId = params['game-id'];
  const supabase = createClient();
  const router = useRouter();
  
  const setCurrentTurnPlayerId = useGameStore((state) => state.setCurrentTurnPlayerId);
  const currentTurnPlayerId = useGameStore((state) => state.currentTurnPlayerId);
  const setLastMove = useGameStore((state) => state.setLastMove);
  const lastMove = useGameStore((state) => state.lastMove);
  const setIsGuessing = useGameStore((state) => state.setIsGuessing);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<string>('active');
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [opponentCharacter, setOpponentCharacter] = useState<Character | undefined>(undefined);
  
  const [hasSelectedCharacter, setHasSelectedCharacter] = useState<boolean>(false);
  const [selectionModeCharacterId, setSelectionModeCharacterId] = useState<number | null>(null);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    }
    getUser();
  }, [supabase]);

  useEffect(() => {
    if (!currentUser || !gameId) return;
    async function fetchPlayerId() {
      const { data } = await supabase
        .from('players')
        .select('id, has_selected_character')
        .eq('game_id', gameId)
        .eq('user_id', currentUser.id)
        .single();
      if (data) {
        setMyPlayerId(data.id);
        setHasSelectedCharacter(data.has_selected_character);
      }
    }
    fetchPlayerId();
  }, [currentUser, gameId, supabase]);

  useEffect(() => {
    if (!gameId) return;

    console.log('[GamePlay] Mounting. Game ID:', gameId);

    const fetchInitialGameState = async () => {
      console.log('[GamePlay] Fetching initial game state...');
      
      // Fetch session data
      const sessionPromise = supabase
        .from('game_sessions')
        .select('current_turn_player_id, status, winner_id')
        .eq('id', gameId)
        .single();

      // Fetch last move
      const movePromise = supabase
        .from('moves')
        .select('*')
        .eq('game_id', gameId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const [sessionResult, moveResult] = await Promise.all([sessionPromise, movePromise]);
      
      if (sessionResult.error) {
        console.error('[GamePlay] Error fetching initial game session:', sessionResult.error);
      } else if (sessionResult.data) {
        console.log('[GamePlay] Initial session data:', sessionResult.data);
        setCurrentTurnPlayerId(sessionResult.data.current_turn_player_id);
        setGameStatus(sessionResult.data.status);
        setWinnerId(sessionResult.data.winner_id);
      }

      if (moveResult.error) {
        console.error('[GamePlay] Error fetching last move:', moveResult.error);
      } else if (moveResult.data) {
        console.log('[GamePlay] Initial last move:', moveResult.data);
        setLastMove(moveResult.data);
      }
    };

    fetchInitialGameState();

    const channel = supabase.channel(`game:${gameId}`);

    channel
      .on<any>(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_sessions',
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          console.log('[GamePlay] Received Realtime payload (session update):', payload);
          if (payload.new.hasOwnProperty('current_turn_player_id')) {
            setCurrentTurnPlayerId(payload.new.current_turn_player_id);
          }
          if (payload.new.hasOwnProperty('status')) {
             setGameStatus(payload.new.status);
          }
          if (payload.new.hasOwnProperty('winner_id')) {
             setWinnerId(payload.new.winner_id);
          }
        }
      )
      .on<any>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'moves',
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          console.log('[GamePlay] Received Realtime payload (new move):', payload);
          setLastMove(payload.new);
        }
      )
      .subscribe((status) => {
        console.log(`[GamePlay] Realtime channel subscription status: ${status}`);
      });

    return () => {
      console.log('[GamePlay] Unmounting, removing channel subscription.');
      supabase.removeChannel(channel);
    };
  }, [gameId, supabase, setCurrentTurnPlayerId, setLastMove]);

  // TODO: Implement secure reveal of opponent character
  // useEffect(() => {
  //   if (gameStatus === 'finished' && currentUser) {
  //       const fetchOpponent = async () => {
  //           // This is insecure and was deprecated. 
  //           // We need a secure API endpoint to reveal the character only when the game is finished.
  //       };
  //       fetchOpponent();
  //   }
  // }, [gameStatus, currentUser, gameId, supabase]);


  const isMyTurn = currentUser && currentTurnPlayerId === currentUser.id;

  const handleSelectSecretCharacter = async () => {
      if (!selectionModeCharacterId || !myPlayerId) return;

      // Insert into player_secrets
      const { error } = await supabase.from('player_secrets').insert({
          player_id: myPlayerId,
          character_id: selectionModeCharacterId
      });

      if (error) {
          console.error('Error selecting character:', error);
          alert('Failed to select character. Please try again.');
          return;
      }

      setHasSelectedCharacter(true);
  };

  const handleAskQuestion = async (question: string) => {
    if (!myPlayerId) return;
    const { error } = await supabase.from('moves').insert({
      game_id: gameId,
      player_id: myPlayerId,
      action_type: 'question',
      details: { question }
    });
    if (error) console.error('Error asking question:', error);
  };

  const handleAnswerQuestion = async (answer: 'yes' | 'no') => {
    if (!myPlayerId) return;
    const { error } = await supabase.from('moves').insert({
      game_id: gameId,
      player_id: myPlayerId,
      action_type: 'answer',
      details: { answer }
    });
    if (error) console.error('Error answering:', error);
  };

  const handleEndTurn = async () => {
    if (!gameId || !currentUser) return;

    const response = await fetch(`/api/game/${gameId}/end-turn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Failed to end turn: ${errorData.error}`);
    }
  };

  const handleMakeGuess = () => {
    setIsGuessing(true);
  };

  const handleConfirmGuess = async (characterId: number) => {
      const response = await fetch(`/api/game/${gameId}/guess`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ characterId })
      });

      if (!response.ok) {
          const error = await response.json();
          alert(`Guess failed: ${error.error}`);
      } else {
          const data = await response.json();
          // If guess was successful (win or lose), data.correctCharacterId contains the opponent's char
          if (data.correctCharacterId) {
              const char = CHARACTERS.find(c => c.id === data.correctCharacterId);
              setOpponentCharacter(char);
          }
      }
  };

  // Logic to determine what to show
  const showQuestionBox = isMyTurn && (!lastMove || lastMove.action_type === 'answer' || lastMove.action_type === 'guess' || lastMove.action_type === 'flip' || lastMove.player_id !== myPlayerId); 
  const amIWaitingForAnswer = isMyTurn && lastMove?.action_type === 'question';
  const showAnswerBox = !isMyTurn && lastMove?.action_type === 'question';
  const showLastAnswer = lastMove?.action_type === 'answer';
  const lastAnswerValue = showLastAnswer ? (lastMove.details as any)?.answer : null;

  if (!hasSelectedCharacter) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900 gap-6">
              <div className="text-center">
                  <h1 className="text-3xl font-bold mb-2">Select Your Secret Character</h1>
                  <p className="text-gray-600 dark:text-gray-400">Choose the character your opponent will try to guess.</p>
              </div>
              
              <div className="w-full max-w-6xl">
                  <CharacterGrid 
                      onCharacterClick={(char) => setSelectionModeCharacterId(char.id)}
                      selectedCharacterId={selectionModeCharacterId}
                  />
              </div>

              <button
                  disabled={!selectionModeCharacterId}
                  onClick={handleSelectSecretCharacter}
                  className="px-8 py-3 bg-blue-600 text-white text-lg font-bold rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-all"
              >
                  Confirm Selection
              </button>
          </div>
      );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 bg-gray-50 dark:bg-gray-900 gap-8 relative">
      
      {gameStatus === 'finished' && (
          <GameOverOverlay 
            isWinner={currentUser?.id === winnerId} 
            opponentCharacter={opponentCharacter}
            onPlayAgain={() => router.push('/lobby')} // Placeholder
            onMainMenu={() => router.push('/')}
          />
      )}

      <GuessModal onConfirmGuess={handleConfirmGuess} />

      {/* Header / Status Area */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold">Digital Guess Who</h1>
             <p className="text-xs text-gray-500">ID: {gameId}</p>
          </div>
          <TurnIndicator />
          
          {isMyTurn && (
              <div className="flex gap-2">
                <button 
                    className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 shadow-sm"
                    onClick={handleEndTurn}
                >
                    End Turn
                </button>
              </div>
          )}
      </div>

      {/* Interaction Area (Q&A) */}
      <div className="w-full max-w-xl z-10">
        {/* State: My Turn, Haven't asked yet */}
        {showQuestionBox && !amIWaitingForAnswer && (
           <QuestionBox onAsk={handleAskQuestion} disabled={false} />
        )}

        {/* State: My Turn, Waiting for Answer */}
        {amIWaitingForAnswer && (
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg text-center animate-pulse shadow-md">
                <p className="font-semibold">Waiting for opponent to answer...</p>
                <p className="italic text-sm mt-2">"{(lastMove.details as any)?.question}"</p>
            </div>
        )}

        {/* State: Opponent Turn, I need to Answer */}
        {showAnswerBox && (
            <AnswerBox 
                question={(lastMove.details as any)?.question} 
                onAnswer={handleAnswerQuestion} 
                disabled={false} 
            />
        )}

        {/* State: Opponent Turn, They are thinking/acting */}
        {!isMyTurn && !showAnswerBox && (
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center text-gray-500 shadow-inner">
                Waiting for opponent to move...
            </div>
        )}

        {/* Display Last Answer (Informational) */}
        {showLastAnswer && (
            <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg text-center mb-4 shadow-md border border-green-200 dark:border-green-800">
                <p className="font-bold text-lg">Answer Received: {lastAnswerValue?.toUpperCase()}</p>
                {isMyTurn && <p className="text-sm mt-1">Eliminate characters now, then end your turn.</p>}
            </div>
        )}
        
        {isMyTurn && (
             <div className="flex justify-center mt-4">
                 <button
                    className="px-6 py-3 rounded-full text-white font-bold bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg transform hover:scale-105 transition-all"
                    onClick={handleMakeGuess}
                 >
                    Make Final Guess
                 </button>
             </div>
        )}
      </div>

      {/* Game Board Area */}
      <div className="w-full max-w-6xl">
         <h2 className="text-lg font-semibold mb-2 ml-2 text-gray-700 dark:text-gray-300">Your Board</h2>
         <CharacterGrid />
      </div>

    </div>
  );
}
