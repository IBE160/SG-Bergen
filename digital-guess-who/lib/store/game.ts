import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Character } from '@/lib/data/characters';

// Define Move type
export type Move = {
    id: string;
    game_id: string;
    player_id: string;
    action_type: 'question' | 'answer';
    details: any;
    created_at: string;
}

export type Interaction = {
    id: string; // move id of the question
    player_id: string; // asker id
    text: string;
    status: 'pending_answer' | 'completed';
}

interface GameState {
  gameId: string | null; // Added to track session
  characters: Character[];
  selectedCharacterId: number | null;
  eliminatedCharacterIds: number[];
  gameStatus: 'waiting' | 'selecting' | 'active' | 'finished';
  gamePhase: string;
  players: any[]; 
  currentTurnPlayerId: string | null;
  winnerId: string | null;
  
  // New State
  currentInteraction: Interaction | null;
  lastMove: Move | null;
  
  // Actions
  setGameId: (id: string | null) => void;
  setCharacters: (characters: Character[]) => void;
  selectCharacter: (id: number) => void;
  toggleElimination: (id: number) => void;
  setGameStatus: (status: GameState['gameStatus']) => void;
  setGamePhase: (phase: string) => void;
  setPlayers: (players: any[]) => void;
  setCurrentTurn: (playerId: string | null) => void;
  setWinner: (winnerId: string | null) => void;
  
  // New Actions
  setInteraction: (interaction: Interaction | null) => void;
  setLastMove: (move: Move | null) => void;
  makeGuess: (gameId: string, characterId: number) => Promise<void>;

  reset: () => void;
}

export const useGameStore = create(
  persist<GameState>(
    (set) => ({
      gameId: null,
      characters: [],
      selectedCharacterId: null,
      eliminatedCharacterIds: [],
      gameStatus: 'selecting',
      gamePhase: 'selection',
      players: [],
      currentTurnPlayerId: null,
      winnerId: null,

      currentInteraction: null,
      lastMove: null,

      setGameId: (id) => set({ gameId: id }),
      setCharacters: (characters) => set({ characters }),
      selectCharacter: (id) => set({ selectedCharacterId: id }),
      toggleElimination: (id) => set((state) => {
        const isEliminated = state.eliminatedCharacterIds.includes(id);
        return {
          eliminatedCharacterIds: isEliminated
            ? state.eliminatedCharacterIds.filter((existingId) => existingId !== id)
            : [...state.eliminatedCharacterIds, id],
        };
      }),
      setGameStatus: (status) => set({ gameStatus: status }),
      setGamePhase: (phase) => set({ gamePhase: phase }),
      setPlayers: (players) => set({ players }),
      setCurrentTurn: (id) => set({ currentTurnPlayerId: id }),
      setWinner: (id) => set({ winnerId: id }),

      setInteraction: (interaction) => set({ currentInteraction: interaction }),
      setLastMove: (move) => set({ lastMove: move }),
      
      makeGuess: async (gameId, characterId) => {
        try {
            const response = await fetch(`/api/game/${gameId}/guess`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guess_character_id: characterId })
            });
            
            if (!response.ok) {
                const error = await response.json();
                 throw new Error(error.error || 'Failed to submit guess');
            }
            
            const data = await response.json();
            
            if (data.result === 'win' || data.result === 'lose') {
                 set({ gameStatus: 'finished' });
            }
    
        } catch (e) {
            console.error("Guess error:", e);
            throw e;
        }
      },

      reset: () => set({ 
        gameId: null,
        characters: [], 
        selectedCharacterId: null, 
        eliminatedCharacterIds: [], 
        gameStatus: 'selecting',
        gamePhase: 'selection',
        players: [],
        currentTurnPlayerId: null,
        winnerId: null,
        currentInteraction: null,
        lastMove: null
      }),
    }),
    {
      name: 'game-storage',
      getStorage: () => localStorage,
    }
  )
);
