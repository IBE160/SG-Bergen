'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/db/types';
import { User } from '@supabase/supabase-js';
import { useGameStore } from './store/game-store';
import TurnIndicator from './components/TurnIndicator'; // Import the new component

export default function GamePlayPage({ params }: { params: { 'game-id': string } }) {
  const gameId = params['game-id'];
  const supabase = createClient();
  const setCurrentTurnPlayerId = useGameStore((state) => state.setCurrentTurnPlayerId);
  const currentTurnPlayerId = useGameStore((state) => state.currentTurnPlayerId);

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    }
    getUser();
  }, [supabase]);

  useEffect(() => {
    if (!gameId) return;

    const channel = supabase.channel(`game-${gameId}`);

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
          if (payload.new.current_turn_player_id) {
            setCurrentTurnPlayerId(payload.new.current_turn_player_id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, supabase, setCurrentTurnPlayerId]);

  const isMyTurn = currentUser && currentTurnPlayerId === currentUser.id;

  // Placeholder for action buttons
  const ActionButton = ({ text, disabled, onClick }: { text: string; disabled: boolean; onClick?: () => void }) => (
    <button
      className={`px-4 py-2 rounded-md text-white ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );

  const handleEndTurn = async () => {
    if (!gameId || !currentUser) return;

    // Call the API route to end the turn
    const response = await fetch(`/api/game/${gameId}/end-turn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify({ userId: currentUser.id }), // API route gets user from cookie
    });

    if (response.ok) {
      console.log('Turn ended successfully');
    } else {
      const errorData = await response.json();
      console.error('Failed to end turn:', errorData.error);
      alert(`Failed to end turn: ${errorData.error}`);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-8">Game Play Screen</h1>
      <p className="mb-4">Game ID: {gameId}</p>
      
      <div className="mb-4">
        <TurnIndicator />
      </div>

      <div className="flex space-x-4">
        <ActionButton text="Ask Question" disabled={!isMyTurn} />
        <ActionButton text="Make Guess" disabled={!isMyTurn} />
        {isMyTurn && (
            <ActionButton text="End Turn" disabled={false} onClick={handleEndTurn} />
        )}
      </div>

      {/* TODO: Add game board and other UI components here */}
    </div>
  );
}
