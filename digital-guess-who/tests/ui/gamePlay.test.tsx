// digital-guess-who/tests/ui/gamePlay.test.tsx
import '@testing-library/jest-dom';
import { render, screen, act, waitFor } from '@testing-library/react';
import { GameClient } from '@/app/game-play/[code]/game-client';
import { useGameStore } from '@/lib/store/game';

// --- Mocks ---

// Mock useAuth
jest.mock('@/lib/hooks/use-auth', () => ({
  useAuth: () => ({ user: { id: 'mock-user-id-123' } }),
}));

const mockSingle = jest.fn();

// Mock Supabase
const mockSupabase = {
  from: jest.fn((table) => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        // Handle game_sessions single()
        single: mockSingle,
        // Handle players chain: eq().eq().single()
        eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
                data: { id: 'p1', is_ready: true },
                error: null
            })
        }))
      }))
    })),
    insert: jest.fn().mockResolvedValue({ error: null }),
    update: jest.fn().mockResolvedValue({ error: null })
  })),
  channel: jest.fn(() => ({
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn()
  })),
  removeChannel: jest.fn(),
  auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'mock-user-id-123'} } })
  }
};

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}));

// Mock Sonner
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
  },
}));

describe('GameClient UI - Turn Management', () => {
  const GAME_CODE = 'TESTGAME';
  const MY_ID = 'mock-user-id-123';
  const OPPONENT_ID = 'opponent-id';

  beforeEach(() => {
    jest.clearAllMocks();
    act(() => {
        useGameStore.getState().reset();
        // Set initial required state to render the board
        useGameStore.getState().setGamePhase('active');
        useGameStore.getState().setGameStatus('active');
    });
  });

  it('displays "Your Turn" and enables buttons when it is my turn', async () => {
    // Setup mock to return MY_ID as current turn
    mockSingle.mockResolvedValue({
        data: {
            id: 'g1',
            difficulty: 'medium',
            status: 'active',
            phase: 'active',
            current_turn_player_id: MY_ID
        },
        error: null
    });

    await act(async () => {
        render(<GameClient gameCode={GAME_CODE} />);
    });

    await waitFor(() => {
        expect(screen.getByText('Your Turn')).toBeInTheDocument();
    });

    const askBtn = screen.getByRole('button', { name: /Ask Question/i });
    const guessBtn = screen.getByRole('button', { name: /Make Guess/i });

    expect(askBtn).not.toBeDisabled();
    expect(guessBtn).not.toBeDisabled();
  });

  it('displays "Opponent\'s Turn" and disables buttons when it is opponent\'s turn', async () => {
    // Setup mock to return OPPONENT_ID as current turn
    mockSingle.mockResolvedValue({
        data: {
            id: 'g1',
            difficulty: 'medium',
            status: 'active',
            phase: 'active',
            current_turn_player_id: OPPONENT_ID
        },
        error: null
    });

    await act(async () => {
        render(<GameClient gameCode={GAME_CODE} />);
    });

    await waitFor(() => {
        expect(screen.getByText("Opponent's Turn")).toBeInTheDocument();
    });

    const askBtn = screen.getByRole('button', { name: /Ask Question/i });
    const guessBtn = screen.getByRole('button', { name: /Make Guess/i });

    expect(askBtn).toBeDisabled();
    expect(guessBtn).toBeDisabled();
  });
});
