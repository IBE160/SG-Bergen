// digital-guess-who/tests/integration/game-loop.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { useGameplaySubscription } from '../../lib/hooks/use-gameplay-subscription';
import { useGameStore } from '../../lib/store/game';
import { RealtimeTestHarness } from '../helpers/RealtimeTestHarness';

// 1. Setup Harness
const mockHarness = new RealtimeTestHarness();

// 2. Mock createClient
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => {
      const queryBuilder = {
        select: () => queryBuilder,
        eq: () => queryBuilder,
        order: () => queryBuilder,
        limit: () => queryBuilder,
        single: async () => ({ data: { status: 'active', current_turn_player_id: 'p1' }, error: null }),
        then: (resolve) => resolve({ data: [] }) // Make it thenable for await
      };
      return queryBuilder;
    },
    channel: () => {
        const ch = {
            on: (type, filter, callback) => {
                mockHarness.subscribe(type, filter, callback);
                return ch; // Return self for chaining
            },
            subscribe: () => {},
            unsubscribe: () => {}
        };
        return ch;
    },
    removeChannel: () => {}
  })
}));

// Mock sonner toast to avoid errors
jest.mock('sonner', () => ({
    toast: {
        info: jest.fn(),
        error: jest.fn(),
        success: jest.fn()
    }
}));

describe('Game Loop Integration - Turn Management', () => {
  beforeEach(() => {
    mockHarness.clear();
    act(() => {
        useGameStore.getState().reset();
    });
  });

  it('updates current turn in store when Realtime UPDATE event is received', async () => {
    // 1. Initialize subscription
    const gameId = 'game-123';
    
    // Render the hook
    const { unmount } = renderHook(() => useGameplaySubscription(gameId));

    // Wait for initial fetch to complete (currentTurnPlayerId becomes 'p1' from mock)
    await waitFor(() => {
        expect(useGameStore.getState().currentTurnPlayerId).toBe('p1');
    });

    // 2. Simulate Turn Change Event (Player 1 -> Player 2)
    const newTurnPlayerId = 'player-2-id';
    
    await act(async () => {
        mockHarness.simulateUpdate(
            'game_sessions',
            { 
                id: gameId, 
                status: 'active', 
                current_turn_player_id: newTurnPlayerId 
            },
            {
                id: gameId,
                status: 'active',
                current_turn_player_id: 'p1'
            }
        );
    });

    // 3. Verify Store Update
    expect(useGameStore.getState().currentTurnPlayerId).toBe(newTurnPlayerId);
    
    unmount();
  });

  it('updates game status to finished when Realtime UPDATE event indicates game over', async () => {
    const gameId = 'game-123';
    const { unmount } = renderHook(() => useGameplaySubscription(gameId));

    await waitFor(() => {
        expect(useGameStore.getState().gameStatus).toBe('active');
    });

    const winnerId = 'player-1-id';
    
    await act(async () => {
        mockHarness.simulateUpdate(
            'game_sessions',
            { 
                id: gameId, 
                status: 'finished', 
                winner_id: winnerId 
            },
            {
                id: gameId,
                status: 'active'
            }
        );
    });

    expect(useGameStore.getState().gameStatus).toBe('finished');
    expect(useGameStore.getState().winnerId).toBe(winnerId);
    
    unmount();
  });
});
