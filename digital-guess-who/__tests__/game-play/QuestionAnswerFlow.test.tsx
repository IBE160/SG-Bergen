import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GamePlayPage from '../../app/game-play/page';
import { createClient } from '../../lib/supabase/client';
import { User } from '@supabase/supabase-js';

// Mock Supabase client
jest.mock('../../lib/supabase/client', () => ({
  createClient: jest.fn(),
}));

const MOCK_USER: User = {
  id: 'test-user-id-123',
  aud: 'authenticated',
  email: 'test@example.com',
  created_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {},
};

const GAME_ID = 'test-game-id';
const PLAYER_ID = 'player-123';

describe('QuestionAnswerFlow Integration', () => {
    let callbacks: Record<string, (payload: any) => void> = {};
    let mockInsert: jest.Mock;
    let mockSupabaseClient: any;

    beforeEach(() => {
        jest.clearAllMocks();
        callbacks = {};
        mockInsert = jest.fn().mockResolvedValue({ error: null });

        const createChain = (data: any) => {
            const chain: any = {
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                order: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data, error: null }),
                maybeSingle: jest.fn().mockResolvedValue({ data, error: null }),
                insert: mockInsert,
            };
            return chain;
        };

        const mockChannel = {
            on: jest.fn((event, config, callback) => {
                if (event === 'postgres_changes') {
                    callbacks[config.table] = callback;
                }
                return mockChannel;
            }),
            subscribe: jest.fn(() => ({ unsubscribe: jest.fn() })),
        };

        mockSupabaseClient = {
            auth: {
                getUser: jest.fn().mockResolvedValue({ data: { user: MOCK_USER }, error: null }),
            },
            from: jest.fn(), // Will be configured per test
            channel: jest.fn().mockReturnValue(mockChannel),
            removeChannel: jest.fn(),
        };

        (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);
    });

    const configureMocks = (initialTurnPlayerId: string, initialLastMove: any = null) => {
        const createChain = (data: any) => {
            return {
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                order: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data, error: null }),
                maybeSingle: jest.fn().mockResolvedValue({ data, error: null }),
                insert: mockInsert,
            };
        };

        mockSupabaseClient.from.mockImplementation((table: string) => {
             if (table === 'game_sessions') return createChain({ current_turn_player_id: initialTurnPlayerId });
             if (table === 'moves') return createChain(initialLastMove);
             if (table === 'players') return createChain({ id: PLAYER_ID });
             return createChain(null);
        });
    };

    it('allows active player to ask a question', async () => {
        configureMocks(MOCK_USER.id, null); // My turn, no previous move
        render(<GamePlayPage params={{ 'game-id': GAME_ID }} />);

        await waitFor(() => {
             expect(screen.getByPlaceholderText(/Does your character/i)).toBeInTheDocument();
        });

        const input = screen.getByPlaceholderText(/Does your character/i);
        fireEvent.change(input, { target: { value: 'Is it blue?' } });
        
        const button = screen.getByRole('button', { name: /Ask/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockInsert).toHaveBeenCalledWith({
                game_id: GAME_ID,
                player_id: PLAYER_ID,
                action_type: 'question',
                details: { question: 'Is it blue?' }
            });
        });
    });

    it('displays answer box to opponent when question is asked', async () => {
        const opponentId = 'opponent-999';
        configureMocks(opponentId, null); // Opponent's turn initially

        render(<GamePlayPage params={{ 'game-id': GAME_ID }} />);

        await waitFor(() => {
            expect(screen.getByText(/Waiting for opponent/i)).toBeInTheDocument();
        });

        // Simulate Incoming Question via Realtime
        act(() => {
            if (callbacks['moves']) {
                callbacks['moves']({
                    new: {
                        action_type: 'question',
                        details: { question: 'Is it red?' },
                        player_id: opponentId,
                        created_at: new Date().toISOString(),
                    }
                });
            }
        });

        await waitFor(() => {
            expect(screen.getByText('Incoming Question!')).toBeInTheDocument();
            expect(screen.getByText('Is it red?')).toBeInTheDocument();
        });

        // Test Answering
        fireEvent.click(screen.getByRole('button', { name: /Yes/i }));
        
        await waitFor(() => {
             expect(mockInsert).toHaveBeenCalledWith({
                game_id: GAME_ID,
                player_id: PLAYER_ID,
                action_type: 'answer',
                details: { answer: 'yes' }
            });
        });
    });
});