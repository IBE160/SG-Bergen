import { create } from 'zustand';

interface GameState {
  currentTurnPlayerId: string | null;
  setCurrentTurnPlayerId: (playerId: string | null) => void;
  // TODO: Add other game-related states and actions as needed by other stories
}

export const useGameStore = create<GameState>((set) => ({
  currentTurnPlayerId: null,
  setCurrentTurnPlayerId: (playerId) => set({ currentTurnPlayerId: playerId }),
}));
