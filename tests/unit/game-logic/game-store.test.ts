import { useGameStore } from '@/lib/store/game-store';
import { act } from 'react'; // Updated import

// Mock Supabase Realtime for unit tests
const mockSupabaseChannel = {
  on: jest.fn().mockReturnThis(),
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
  send: jest.fn(),
};

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    channel: jest.fn(() => mockSupabaseChannel),
    // ... other Supabase client mocks if needed
  })),
}));

describe('Game Zustand Store', () => {
  beforeEach(() => {
    act(() => {
      useGameStore.setState({
        currentTurnPlayerId: null,
        players: [{ id: 'player1', name: 'Player 1', secretCharacterId: null }, { id: 'player2', name: 'Player 2', secretCharacterId: null }],
        gameStatus: 'waiting',
        winnerId: null,
      });
    });
    jest.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const state = useGameStore.getState();
    expect(state.gameStatus).toBe('waiting');
    expect(state.currentTurnPlayerId).toBeNull();
    expect(state.winnerId).toBeNull();
    expect(state.players).toHaveLength(2);
  });

  it('should start the game and set the first player\'s turn', () => {
    const store = useGameStore.getState();
    act(() => store.startGame());
    expect(useGameStore.getState().gameStatus).toBe('active');
    expect(useGameStore.getState().currentTurnPlayerId).toBe('player1');
  });

  it('should switch turn to the next player', () => {
    const store = useGameStore.getState();
    act(() => useGameStore.setState({ gameStatus: 'active', currentTurnPlayerId: 'player1' }));
    act(() => store.nextTurn('player2'));
    expect(useGameStore.getState().currentTurnPlayerId).toBe('player2');

    act(() => store.nextTurn('player1'));
    expect(useGameStore.getState().currentTurnPlayerId).toBe('player1');
  });

  it('should eliminate a character (placeholder logic)', () => {
    const store = useGameStore.getState();
    const consoleSpy = jest.spyOn(console, 'log');
    act(() => store.eliminateCharacter(5));
    expect(consoleSpy).toHaveBeenCalledWith('Eliminating character: 5');
    consoleSpy.mockRestore();
  });

  describe('makeGuess action', () => {
    // Mock fetch for API call within makeGuess
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    beforeEach(() => {
      // Set game to active and player1's turn
      act(() => useGameStore.setState({
        gameStatus: 'active',
        currentTurnPlayerId: 'player1',
        players: [{ id: 'player1', name: 'Player 1', secretCharacterId: null }, { id: 'player2', name: 'Player 2', secretCharacterId: 10 }],
      }));
    });

    it('should set winner and game status if guess is correct (mocked API)', async () => {
      const store = useGameStore.getState();
      // Mock correct guess response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ winner: 'player1', message: 'Correct guess! You win.' }),
      });

      const result = await act(() => store.makeGuess('player1', 10)); // Player 1 guesses character 10
      expect(result).toBe(true);
      expect(useGameStore.getState().winnerId).toBe('player1');
      expect(useGameStore.getState().gameStatus).toBe('finished');
    });

    it('should set opponent as winner if guess is incorrect (mocked API)', async () => {
      const store = useGameStore.getState();
      // Mock incorrect guess response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ winner: 'player2', message: 'Incorrect guess. You lose.' }),
      });

      const result = await act(() => store.makeGuess('player1', 5)); // Player 1 guesses character 5 (incorrect)
      expect(result).toBe(false);
      expect(useGameStore.getState().winnerId).toBe('player2'); // Opponent (player2) should be winner
      expect(useGameStore.getState().gameStatus).toBe('finished');
    });
  });

  it('should set the winner and end the game', () => {
    const store = useGameStore.getState();
    act(() => store.setWinner('player1'));
    expect(useGameStore.getState().winnerId).toBe('player1');
    expect(useGameStore.getState().gameStatus).toBe('finished');
  });
});
