import { create } from 'zustand';
import { Database } from '@/db/types';

type Move = Database['public']['Tables']['moves']['Row'];

interface GameState {
  currentTurnPlayerId: string | null;
  lastMove: Move | null;
  eliminatedCharacterIds: number[];
  setCurrentTurnPlayerId: (playerId: string | null) => void;
  setLastMove: (move: Move | null) => void;
  toggleCharacterElimination: (characterId: number) => void;
  resetEliminations: () => void;
  isGuessing: boolean;
  setIsGuessing: (isGuessing: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentTurnPlayerId: null,
  lastMove: null,
  eliminatedCharacterIds: [],
  isGuessing: false,
  setCurrentTurnPlayerId: (playerId) => set({ currentTurnPlayerId: playerId }),
  setLastMove: (move) => set({ lastMove: move }),
  toggleCharacterElimination: (characterId) =>
    set((state) => {
      const isEliminated = state.eliminatedCharacterIds.includes(characterId);
      return {
        eliminatedCharacterIds: isEliminated
          ? state.eliminatedCharacterIds.filter((id) => id !== characterId)
          : [...state.eliminatedCharacterIds, characterId],
      };
    }),
  resetEliminations: () => set({ eliminatedCharacterIds: [] }),
  setIsGuessing: (isGuessing) => set({ isGuessing }),
}));
