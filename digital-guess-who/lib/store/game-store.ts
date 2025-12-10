import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

export type GameStatus = 'waiting' | 'active' | 'finished';

export interface Player {
  id: string;
  name: string;
  secretCharacterId: number | null;
}

interface GameState {
  gameStatus: GameStatus;
  currentTurnPlayerId: string | null;
  players: Player[];
  winnerId: string | null;
  
  // Actions
  setGameStatus: (status: GameStatus) => void;
  startGame: () => void;
  nextTurn: (nextPlayerId: string) => void;
  eliminateCharacter: (characterId: number) => void;
  makeGuess: (guesserId: string, characterId: number) => Promise<boolean>;
  setWinner: (winnerId: string) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  gameStatus: 'waiting',
  currentTurnPlayerId: null,
  players: [],
  winnerId: null,

  setGameStatus: (status) => set({ gameStatus: status }),

  startGame: () => {
    const { players } = get();
    if (players.length > 0) {
      set({ 
        gameStatus: 'active', 
        currentTurnPlayerId: players[0].id 
      });
    }
  },

  nextTurn: (nextPlayerId) => set({ currentTurnPlayerId: nextPlayerId }),

  eliminateCharacter: (characterId) => {
    console.log(`Eliminating character: ${characterId}`);
    // In a real app, update local state of eliminated cards
  },

  makeGuess: async (guesserId, characterId) => {
    // Placeholder for API call
    try {
      const response = await fetch('/api/game/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guesserId, characterId }),
      });
      
      const data = await response.json();
      
      if (data.winner) {
        set({ winnerId: data.winner, gameStatus: 'finished' });
        return data.winner === guesserId;
      }
      return false;
    } catch (error) {
        console.error("Guess failed", error);
        return false;
    }
  },

  setWinner: (winnerId) => set({ winnerId, gameStatus: 'finished' }),
}));
