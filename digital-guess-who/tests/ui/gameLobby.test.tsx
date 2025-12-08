// digital-guess-who/tests/ui/gameLobby.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import CreateGamePage from '@/app/game-lobby/create/page';
import GameLobbyPage from '@/app/game-lobby/[code]/page';

// Mock useRouter and useParams from next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useParams: () => ({
    code: 'TESTCODE', // Mock a game code for LobbyPage
  }),
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe('CreateGamePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('renders without crashing', () => {
    render(<CreateGamePage />);
    expect(screen.getByText('Create New Game')).toBeInTheDocument();
  });

  it('allows selecting a difficulty', () => {
    render(<CreateGamePage />);
    const hardRadio = screen.getByLabelText(/Hard/i);
    fireEvent.click(hardRadio);
    expect(hardRadio).toHaveAttribute('aria-checked', 'true');
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
    expect(global.fetch).toHaveBeenCalledWith('/api/game/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ difficulty: 'medium' }), // Default value is medium
    });
    expect(mockPush).toHaveBeenCalledWith('/game-lobby/TESTCODE');
  });

  it('shows an alert if API call fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Test API Error' }),
    });
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {}); // Mock window.alert

    render(<CreateGamePage />);
    const createButton = screen.getByRole('button', { name: /Create Game/i });

    await act(async () => {
      fireEvent.click(createButton);
    });

    expect(alertSpy).toHaveBeenCalledWith('Error creating game: Test API Error');
    alertSpy.mockRestore(); // Restore original alert
  });
});

describe('GameLobbyPage', () => {
  it('renders without crashing and displays the game code', () => {
    render(<GameLobbyPage />);
    expect(screen.getByText('Game Lobby')).toBeInTheDocument();
    expect(screen.getByDisplayValue('TESTCODE')).toBeInTheDocument();
  });

  it('has a copy-to-clipboard button', () => {
    render(<GameLobbyPage />);
    expect(screen.getByRole('button', { name: /Copy/i })).toBeInTheDocument();
  });

  it('copies the game code to clipboard when copy button is clicked', async () => {
    render(<GameLobbyPage />);
    const copyButton = screen.getByRole('button', { name: /Copy/i });

    await act(async () => {
      fireEvent.click(copyButton);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('TESTCODE');
  });
});
