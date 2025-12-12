import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GameClient } from '../../app/game-play/[code]/game-client';
import { useGameStore } from '../../lib/store/game';
import { ALL_CHARACTERS } from '../../lib/data/characters';

// Mocks
jest.mock('../../lib/store/game');
jest.mock('../../lib/hooks/use-gameplay-subscription', () => ({
  useGameplaySubscription: jest.fn()
}));

const mockInsert = jest.fn();
const mockUpdate = jest.fn().mockReturnThis(); 
const mockEq = jest.fn().mockReturnThis();

const mockSupabase = {
    auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } })
    },
    from: jest.fn().mockImplementation((table) => {
        if (table === 'game_sessions') {
            return {
                select: () => ({
                    eq: () => ({
                        single: jest.fn().mockResolvedValue({ 
                            data: { id: 'game-1', difficulty: 'medium', status: 'waiting' } 
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
                             single: jest.fn().mockResolvedValue({ data: { id: 'player-1' } })
                         })
                    })
                }),
                update: mockUpdate
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

// Chain fix for update().eq()
mockUpdate.mockReturnValue({ eq: mockEq });
mockEq.mockResolvedValue({ error: null });

jest.mock('../../lib/supabase/client', () => ({
    createClient: () => mockSupabase
}));

describe('Secret Selection Integration', () => {
    beforeEach(() => {
        (useGameStore as unknown as jest.Mock).mockReturnValue({
            characters: ALL_CHARACTERS.slice(0, 24),
            selectedCharacterId: 1, // Pre-selected
            gameStatus: 'waiting',
            setCharacters: jest.fn(),
            selectCharacter: jest.fn(),
        });
        mockInsert.mockResolvedValue({ error: null });
    });

    it('submits secret selection to player_secrets', async () => {
        render(<GameClient gameCode="XYZ" />);
        
        // Wait for loading to finish (useEffect)
        await waitFor(() => expect(mockSupabase.auth.getUser).toHaveBeenCalled());

        const confirmBtn = screen.getByText('Confirm Selection');
        fireEvent.click(confirmBtn);

        await waitFor(() => {
            expect(mockInsert).toHaveBeenCalledWith({
                player_id: 'player-1',
                character_id: 1
            });
            expect(mockUpdate).toHaveBeenCalledWith({ is_ready: true });
        });
    });
});
