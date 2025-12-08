// digital-guess-who/tests/ui/gameLobby.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import CreateGamePage from '@/app/game-lobby/create/page';
import GameLobbyPage from '@/app/game-lobby/[code]/page';
import { NextRequest, NextResponse } from 'next/server';
import { POST } from '@/app/api/game/create/route';

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

// Mock the API route for game creation
jest.mock('@/app/api/game/create/route', () => ({
  POST: jest.fn(),
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
    (POST as jest.Mock).mockResolvedValue(NextResponse.json({ gameId: 'mock-game-id', code: 'TESTCODE' }, { status: 201 }));
  });

  it('renders without crashing', () => {
    render(<CreateGamePage />);
    expect(screen.getByText('Create New Game')).toBeInTheDocument();
  });

  it('allows selecting a difficulty', () => {
    render(<CreateGamePage />);
    const hardRadio = screen.getByLabelText('Hard');
    fireEvent.click(hardRadio);
    expect(hardRadio.closest('div')).toHaveAttribute('data-state', 'checked');
  });

  it('calls the create game API and navigates to lobby on button click', async () => {
    render(<CreateGamePage />);
    const createButton = screen.getByRole('button', { name: /Create Game/i });

    await act(async () => {
      fireEvent.click(createButton);
    });

    expect(POST).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/game-lobby/TESTCODE');
  });

  it('shows an alert if API call fails', async () => {
    (POST as jest.Mock).mockResolvedValue(NextResponse.json({ error: 'Test API Error' }, { status: 500 }));
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
