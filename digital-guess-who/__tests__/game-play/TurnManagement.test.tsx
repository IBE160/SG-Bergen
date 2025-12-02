import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
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

const MOCK_OPPONENT_USER: User = {
    id: 'test-opponent-id-456',
    aud: 'authenticated',
    email: 'opponent@example.com',
    created_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {},
};

describe('TurnManagement UI Integration', () => {
    let postgresChangesCallback: (payload: any) => void;
    const mockChannel = {
        on: jest.fn((event, filter, callback) => {
            if (event === 'postgres_changes') {
                postgresChangesCallback = callback;
            }
            return mockChannel;
        }),
        subscribe: jest.fn(() => ({
            unsubscribe: jest.fn(),
        })),
    };

    const mockSupabaseClient = {
        auth: {
            getUser: jest.fn().mockResolvedValue({ data: { user: MOCK_USER }, error: null }),
        },
        channel: jest.fn().mockReturnValue(mockChannel),
        removeChannel: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);
    });

    it('should display "Your Turn" and enable buttons if it is current user\'s turn', async () => {
        render(<GamePlayPage params={{ 'game-id': 'test-game-id' }} />);

        act(() => {
            postgresChangesCallback({
                new: { current_turn_player_id: MOCK_USER.id },
            });
        });

        await waitFor(() => {
            expect(screen.getByText('Your Turn')).toBeInTheDocument();
            expect(screen.getByText('Ask Question')).toBeEnabled();
            expect(screen.getByText('Make Guess')).toBeEnabled();
        });
    });

    it('should display "Opponent\'s Turn" and disable buttons if it is opponent\'s turn', async () => {
        render(<GamePlayPage params={{ 'game-id': 'test-game-id' }} />);

        act(() => {
            postgresChangesCallback({
                new: { current_turn_player_id: MOCK_OPPONENT_USER.id },
            });
        });

        await waitFor(() => {
            expect(screen.getByText("Opponent's Turn")).toBeInTheDocument();
            expect(screen.getByText('Ask Question')).toBeDisabled();
            expect(screen.getByText('Make Guess')).toBeDisabled();
        });
    });

    it('should switch turn indicator and button states when turn changes', async () => {
        render(<GamePlayPage params={{ 'game-id': 'test-game-id' }} />);

        // Simulate opponent's turn first
        act(() => {
            postgresChangesCallback({
                new: { current_turn_player_id: MOCK_OPPONENT_USER.id },
            });
        });

        await waitFor(() => {
            expect(screen.getByText("Opponent's Turn")).toBeInTheDocument();
        });

        // Simulate turn switching to current user
        act(() => {
            postgresChangesCallback({
                new: { current_turn_player_id: MOCK_USER.id },
            });
        });

        await waitFor(() => {
            expect(screen.getByText('Your Turn')).toBeInTheDocument();
            expect(screen.getByText('Ask Question')).toBeEnabled();
        });
    });
});

