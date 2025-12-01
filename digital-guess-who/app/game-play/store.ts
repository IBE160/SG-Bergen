import { create } from 'zustand';
import { Character, GameState } from './types';

interface GamePlayState {
  characters: Character[];
  mySecretCharacter: Character | null;
  opponentSecretCharacter: Character | null; // Kept null on client mostly, or populated if revealed
  turn: 'my-turn' | 'opponent-turn' | null;
  gameState: GameState;
  eliminatedCharacterIds: number[];
  
  // Actions
  setCharacters: (characters: Character[]) => void;
  setMySecretCharacter: (character: Character) => void;
  setGameState: (state: GameState) => void;
  setTurn: (turn: 'my-turn' | 'opponent-turn') => void;
  toggleEliminated: (id: number) => void;
}

export const useGameStore = create<GamePlayState>((set) => ({
  characters: [],
  mySecretCharacter: null,
  opponentSecretCharacter: null,
  turn: null,
  gameState: 'selecting',
  eliminatedCharacterIds: [],

  setCharacters: (characters) => set({ characters }),
  setMySecretCharacter: (character) => set({ mySecretCharacter: character }),
  setGameState: (gameState) => set({ gameState }),
  setTurn: (turn) => set({ turn }),
  toggleEliminated: (id) => set((state) => {
    const isEliminated = state.eliminatedCharacterIds.includes(id);
    return {
      eliminatedCharacterIds: isEliminated
        ? state.eliminatedCharacterIds.filter((cId) => cId !== id)
        : [...state.eliminatedCharacterIds, id],
    };
  }),
}));
