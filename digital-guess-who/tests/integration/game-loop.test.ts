// digital-guess-who/tests/integration/game-loop.test.ts
import { renderHook, act } from '@testing-library/react';
import { useGameplaySubscription } from '../../lib/hooks/use-gameplay-subscription';
import { useGameStore } from '../../lib/store/game';
import { RealtimeTestHarness } from '../helpers/RealtimeTestHarness';

// 1. Setup Harness
const harness = new RealtimeTestHarness();

// 2. Mock createClient
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: { status: 'active', current_turn_player_id: 'p1' }, error: null }),
          data: [] // for players select
        })
      })
    }),
    channel: () => {
        const ch = {
            on: (type: string, filter: any, callback: any) => {
                harness.subscribe(type, filter, callback);
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
    harness.clear();
    act(() => {
        useGameStore.getState().reset();
    });
  });

  it('updates current turn in store when Realtime UPDATE event is received', async () => {
    // 1. Initialize subscription
    const gameId = 'game-123';
    
    // Render the hook
    const { unmount } = renderHook(() => useGameplaySubscription(gameId));

    // 2. Simulate Turn Change Event (Player 1 -> Player 2)
    const newTurnPlayerId = 'player-2-id';
    
    await act(async () => {
        harness.simulateUpdate(
            'game_sessions',
            { 
                id: gameId, 
                status: 'active', 
                current_turn_player_id: newTurnPlayerId 
            },
            {
                id: gameId,
                status: 'active',
                current_turn_player_id: 'player-1-id'
            }
        );
    });

    // 3. Verify Store Update
    expect(useGameStore.getState().currentTurnPlayerId).toBe(newTurnPlayerId);
    
    unmount();
  });
});
