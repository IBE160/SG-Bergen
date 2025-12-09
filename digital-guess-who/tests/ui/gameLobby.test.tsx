// digital-guess-who/tests/ui/gameLobby.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import CreateGamePage from '@/app/game-lobby/create/page';
import GameLobbyPage from '@/app/game-lobby/[code]/page';
import { toast } from 'sonner';
import { useLobbyStore } from '@/lib/store/lobby';

// --- Mocks ---

// Mock useRouter and useParams
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useParams: () => ({
    code: 'TESTCODE',
  }),
}));

// Mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

// Mock Supabase Client
const mockUpdate = jest.fn().mockResolvedValue({ error: null });
const mockChannelOn = jest.fn().mockReturnThis();
const mockSubscribe = jest.fn();

// We need a way to trigger the 'on' callbacks
let realtimeCallbacks: Record<string, (payload: any) => void> = {};

// Helper to create a thenable mock that can be awaited or chained
const createMockBuilder = (resultData: any = null) => {
    const builder: any = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: resultData, error: null }),
        update: mockUpdate, // For update calls
        then: (resolve: any) => resolve({ data: resultData, error: null }) // For awaiting the list
    };
    return builder;
};

const mockSupabase = {
  from: jest.fn(),
  auth: {
    getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }),
  },
  channel: jest.fn().mockImplementation(() => ({
    on: (event: string, filter: any, callback: any) => {
      if (filter && filter.event) {
          realtimeCallbacks[filter.event] = callback;
      }
      return { on: mockChannelOn.mockImplementation((e, f, c) => {
          if (f && f.event) realtimeCallbacks[f.event] = c;
          return { on: mockChannelOn, subscribe: mockSubscribe }
      }), subscribe: mockSubscribe };
    },
    subscribe: mockSubscribe,
  })),
  removeChannel: jest.fn(),
};

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}));

// Mock Sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe('CreateGamePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('renders without crashing', () => {
    render(<CreateGamePage />);
    expect(screen.getByText('Create New Game')).toBeInTheDocument();
  });
    
  it('calls the create game API and navigates to lobby on button click', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ gameId: 'mock-game-id', code: 'TESTCODE' }),
    });

    render(<CreateGamePage />);
    const createButton = screen.getByRole('button', { name: /Create Game/i });

    await act(async () => {
      fireEvent.click(createButton);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/game-lobby/TESTCODE');
  });
});

describe('GameLobbyPage Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset Store
    act(() => {
        useLobbyStore.setState({ players: [], isLoading: false, error: null });
    });
    // Reset callbacks
    realtimeCallbacks = {};
    
    // Setup specific table mocks
    mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'game_sessions') {
            return createMockBuilder({ id: 'game-123' }); // Single will return this
        }
        if (table === 'players') {
            const initialPlayers = [{
                id: 'p1', 
                user_id: 'user-1', 
                game_id: 'game-123', 
                is_ready: false,
                users: { id: 'user-1', username: 'HostUser' } 
            }];
            return createMockBuilder(initialPlayers); // List will return this
        }
        if (table === 'users') {
             // For the hook fetch
             return createMockBuilder({ id: 'user-2', username: 'GuestUser' });
        }
        return createMockBuilder();
    });
  });

  it('AC1: Updates UI instantly when another player joins (Realtime INSERT)', async () => {
    render(<GameLobbyPage />);
    
    // Wait for initial load
    await waitFor(() => expect(screen.getByText('HostUser (You)')).toBeInTheDocument());

    // Simulate Realtime INSERT event
    const newPlayer = {
        id: 'p2',
        user_id: 'user-2',
        game_id: 'game-123',
        is_ready: false
    };
    
    await act(async () => {
        if (realtimeCallbacks['INSERT']) {
            await realtimeCallbacks['INSERT']({ new: newPlayer });
        }
    });

    // Assert UI update
    expect(screen.getByText('GuestUser')).toBeInTheDocument();
    expect(toast.info).toHaveBeenCalledWith('A new player has joined!');
  });

  it('AC2: Updates status and disables button when clicking Ready', async () => {
    render(<GameLobbyPage />);
    await waitFor(() => expect(screen.getByText('HostUser (You)')).toBeInTheDocument());
    
    const readyButton = screen.getByRole('button', { name: "I'm Ready" });
    
    await act(async () => {
        fireEvent.click(readyButton);
    });

    // 1. Verify DB Update called (Integration Check)
    expect(mockUpdate).toHaveBeenCalledWith({ is_ready: true });
    expect(mockUpdate).toHaveBeenCalledTimes(1);

    // 2. Verify UI Update (Button changes)
    expect(screen.getByRole('button', { name: "Waiting for opponent..." })).toBeDisabled();
    expect(screen.getByText('Ready')).toHaveClass('text-green-400');
  });

  it('AC3: Navigates to gameplay when both players are ready', async () => {
    render(<GameLobbyPage />);
    await waitFor(() => expect(screen.getByText('HostUser (You)')).toBeInTheDocument());

    // 1. Add second player via store directly to simulate pre-existing state or rapid join
    act(() => {
        useLobbyStore.getState().addPlayer({
            id: 'p2', user_id: 'user-2', game_id: 'game-123', is_ready: true,
            users: { id: 'user-2', username: 'GuestUser' }
        });
    });
    
    await waitFor(() => expect(screen.getByText('GuestUser')).toBeInTheDocument());

    // 2. Make myself ready
    const readyButton = screen.getByRole('button', { name: "I'm Ready" });
    await act(async () => {
        fireEvent.click(readyButton);
    });
    
    // Wait for navigation
    await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/game-play/TESTCODE');
    });
    
    expect(toast.success).toHaveBeenCalledWith('Both players ready! Starting game...');
  });
});