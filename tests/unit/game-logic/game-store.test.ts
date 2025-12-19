import { useGameStore } from '@/lib/store/game';
import { act } from 'react';

// Mock localStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem: function(key: string) {
      return store[key] || null;
    },
    setItem: function(key: string, value: string) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    },
    removeItem: function(key: string) {
      delete store[key];
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Game Zustand Store', () => {
  beforeEach(() => {
    act(() => {
      useGameStore.setState({
        gameId: 'game-123',
        gameStatus: 'waiting',
        currentTurnPlayerId: null,
        players: [
            { id: 'player1', user_id: 'user1', name: 'Player 1', is_ready: true }, 
            { id: 'player2', user_id: 'user2', name: 'Player 2', is_ready: true }
        ],
        winnerId: null,
        characters: [],
        selectedCharacterId: null,
        eliminatedCharacterIds: [],
        gamePhase: 'selection'
      });
    });
    jest.clearAllMocks();
  });

  it('should initialize with provided state', () => {
    const state = useGameStore.getState();
    expect(state.gameStatus).toBe('waiting');
    expect(state.players).toHaveLength(2);
  });

  it('should switch turn to the next player', () => {
    const store = useGameStore.getState();
    act(() => useGameStore.setState({ gameStatus: 'active', currentTurnPlayerId: 'player1' }));
    act(() => store.setCurrentTurn('player2'));
    expect(useGameStore.getState().currentTurnPlayerId).toBe('player2');
  });

  it('should eliminate a character', () => {
    const store = useGameStore.getState();
    act(() => store.toggleElimination(5));
    expect(useGameStore.getState().eliminatedCharacterIds).toContain(5);
    
    act(() => store.toggleElimination(5)); // Toggle back
    expect(useGameStore.getState().eliminatedCharacterIds).not.toContain(5);
  });

  describe('makeGuess action', () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    beforeEach(() => {
      act(() => useGameStore.setState({
        gameStatus: 'active',
        currentTurnPlayerId: 'player1', // player1 is playing
        players: [
            { id: 'player1', user_id: 'user1', name: 'Player 1' }, 
            { id: 'player2', user_id: 'user2', name: 'Player 2' }
        ],
      }));
    });

    it('should set winner (me) if guess is correct', async () => {
      const store = useGameStore.getState();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ result: 'win', correct_character_id: 10 }),
      });

      // User1 makes a guess against game-123
      await act(async () => {
          await store.makeGuess('game-123', 10, 'user1');
      });
      
      const state = useGameStore.getState();
      expect(state.winnerId).toBe('user1');
      expect(state.gameStatus).toBe('finished');
    });

    it('should set winner (opponent) if guess is incorrect', async () => {
      const store = useGameStore.getState();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ result: 'lose', correct_character_id: 99 }),
      });

      // User1 makes a WRONG guess
      await act(async () => {
          await store.makeGuess('game-123', 5, 'user1');
      });

      const state = useGameStore.getState();
      expect(state.winnerId).toBe('user2'); // user2 wins
      expect(state.gameStatus).toBe('finished');
    });
  });
});
