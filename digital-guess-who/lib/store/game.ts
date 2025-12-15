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
  characters: Character[];
  selectedCharacterId: number | null;
  eliminatedCharacterIds: number[];
  gameStatus: 'waiting' | 'selecting' | 'active' | 'finished';
  gamePhase: string; // Added phase
  players: any[]; 
  currentTurnPlayerId: string | null;
  
  // New State
  currentInteraction: Interaction | null;
  lastMove: Move | null;
  
  // Actions
  setCharacters: (characters: Character[]) => void;
  selectCharacter: (id: number) => void;
  toggleElimination: (id: number) => void;
  setGameStatus: (status: GameState['gameStatus']) => void;
  setGamePhase: (phase: string) => void; // Added action
  setPlayers: (players: any[]) => void;
  setCurrentTurn: (playerId: string | null) => void;
  
  // New Actions
  setInteraction: (interaction: Interaction | null) => void;
  setLastMove: (move: Move | null) => void;

  reset: () => void;
}

export const useGameStore = create(
  persist<GameState>(
    (set) => ({
      characters: [],
      selectedCharacterId: null,
      eliminatedCharacterIds: [],
      gameStatus: 'selecting',
      gamePhase: 'selection', // Default to selection since we arrive here for selection
      players: [],
      currentTurnPlayerId: null,

      currentInteraction: null,
      lastMove: null,

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

      setInteraction: (interaction) => set({ currentInteraction: interaction }),
      setLastMove: (move) => set({ lastMove: move }),

      reset: () => set({ 
        characters: [], 
        selectedCharacterId: null, 
        eliminatedCharacterIds: [], 
        gameStatus: 'selecting',
        gamePhase: 'selection',
        players: [],
        currentTurnPlayerId: null,
        currentInteraction: null,
        lastMove: null
      }),
    }),
    {
      name: 'game-storage', // unique name
      getStorage: () => localStorage, // Use localStorage for persistence
    }
  )
);
