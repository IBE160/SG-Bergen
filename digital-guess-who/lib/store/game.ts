import { create } from 'zustand';
import { Character } from '@/lib/data/characters';

interface GameState {
  characters: Character[];
  selectedCharacterId: number | null;
  eliminatedCharacterIds: number[];
  isMyTurn: boolean;
  gameStatus: 'waiting' | 'selecting' | 'active' | 'finished';
  gamePhase: string; // Added phase
  players: any[]; 
  currentTurnPlayerId: string | null;
  
  // Actions
  setCharacters: (characters: Character[]) => void;
  selectCharacter: (id: number) => void;
  toggleElimination: (id: number) => void;
  setTurn: (isMyTurn: boolean) => void;
  setGameStatus: (status: GameState['gameStatus']) => void;
  setGamePhase: (phase: string) => void; // Added action
  setPlayers: (players: any[]) => void;
  setCurrentTurn: (playerId: string | null) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  characters: [],
  selectedCharacterId: null,
  eliminatedCharacterIds: [],
  isMyTurn: false,
  gameStatus: 'selecting',
  gamePhase: 'selection', // Default to selection since we arrive here for selection
  players: [],
  currentTurnPlayerId: null,

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
  setTurn: (isMyTurn) => set({ isMyTurn }),
  setGameStatus: (status) => set({ gameStatus: status }),
  setGamePhase: (phase) => set({ gamePhase: phase }),
  setPlayers: (players) => set({ players }),
  setCurrentTurn: (id) => set({ currentTurnPlayerId: id }),
  reset: () => set({ 
    characters: [], 
    selectedCharacterId: null, 
    eliminatedCharacterIds: [], 
    isMyTurn: false,
    gameStatus: 'selecting',
    gamePhase: 'selection',
    players: [],
    currentTurnPlayerId: null
  }),
}));