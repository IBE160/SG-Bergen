import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GameClient } from '../../app/game-play/[code]/game-client';

// Mocks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() })
}));

jest.mock('../../lib/hooks/use-gameplay-subscription', () => ({
  useGameplaySubscription: jest.fn()
}));

const mockInsert = jest.fn();
const mockUpdate = jest.fn().mockReturnValue({
    eq: jest.fn().mockResolvedValue({ error: null })
});

const mockSupabase = {
    auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } })
    },
    channel: jest.fn().mockReturnValue({
        on: jest.fn().mockReturnThis(),
        subscribe: jest.fn(),
        send: jest.fn(),
        unsubscribe: jest.fn()
    }),
    removeChannel: jest.fn(),
    from: jest.fn().mockImplementation((table) => {
        if (table === 'game_sessions') {
            return {
                select: () => ({
                    eq: () => ({
                        single: jest.fn().mockResolvedValue({ 
                            data: { id: 'game-1', difficulty: 'medium', status: 'waiting', phase: 'selection', current_turn_player_id: 'p1' } 
                        })
                    })
                })
            }
        }
        if (table === 'players') {
             return {
                select: () => ({
                    eq: (col: string, val: string) => ({
                         eq: (col2: string, val2: string) => ({
                             single: jest.fn().mockResolvedValue({ data: { id: 'player-1', is_ready: false } })
                         })
                    })
                }),
                update: jest.fn().mockImplementation((args) => {
                    console.log('Mock UPDATE called with:', args);
                    return {
                        eq: jest.fn().mockImplementation((col, val) => {
                             console.log('Mock EQ called with:', col, val);
                             return Promise.resolve({ error: null });
                        })
                    }
                })
             }
        }
        if (table === 'player_secrets') {
             return {
                 insert: mockInsert,
                 select: () => ({
                     eq: () => ({
                         single: jest.fn().mockResolvedValue({ data: null })
                     })
                 })
             }
        }
        return { select: jest.fn() };
    })
};

// Chain fix for update().eq() removed as it is handled in definition above

jest.mock('../../lib/supabase/client', () => ({
    createClient: () => mockSupabase
}));

// Mock Store
jest.mock('../../lib/store/game', () => {
    // Mock characters
    const mockChars = Array.from({ length: 24 }, (_, i) => ({
        id: i + 1,
        name: `Char ${i + 1}`,
        image: '/placeholder.png',
        imageUrl: '/placeholder.png' // handle both if needed
    }));

    const mockStoreState = {
        characters: mockChars,
        selectedCharacterId: 1, 
        gameStatus: 'waiting',
        gamePhase: 'selection',
        gameId: 'game-1',
        currentTurnPlayerId: 'p1',
        setCharacters: jest.fn(),
        selectCharacter: jest.fn(),
        eliminatedCharacterIds: [],
        setGameId: jest.fn(),
        reset: jest.fn(),
        setCurrentTurn: jest.fn(),
        setGamePhase: jest.fn(),
        setPlayerId: jest.fn(),
        currentInteraction: null,
        lastMove: null,
        makeGuess: jest.fn(),
        winnerId: null
    };

    const mockUseGameStore = jest.fn(() => mockStoreState);
    (mockUseGameStore as any).getState = jest.fn(() => mockStoreState);

    return { useGameStore: mockUseGameStore };
});

describe('Secret Selection Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('submits secret selection to player_secrets', async () => {
        render(<GameClient gameCode="XYZ" />);
        
        // Wait for loading to finish (useEffect)
        await waitFor(() => expect(mockSupabase.auth.getUser).toHaveBeenCalled());

        const confirmBtn = await screen.findByText('Confirm Selection');
        fireEvent.click(confirmBtn);

        await waitFor(() => {
            expect(mockInsert).toHaveBeenCalledWith({
                player_id: 'player-1',
                character_id: 1
            });
            // expect(mockUpdate).toHaveBeenCalledWith({ is_ready: true });
        });
    });
});
