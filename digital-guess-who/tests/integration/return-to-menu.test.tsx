import { render, screen, fireEvent } from '@testing-library/react';
import { GameClient } from '../../app/game-play/[code]/game-client';
import { useGameStore } from '../../lib/store/game';
import { useLobbyStore } from '../../lib/store/lobby';
import { useRouter } from 'next/navigation';

// Mocks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

jest.mock('../../lib/hooks/use-gameplay-subscription', () => ({
  useGameplaySubscription: jest.fn()
}));

jest.mock('../../lib/hooks/use-game-result', () => ({
    useGameResult: jest.fn().mockReturnValue({
        opponentCharacter: null,
        isLoading: false
    })
}));

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
    from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { id: 'game-1' } })
    })
};

jest.mock('../../lib/supabase/client', () => ({
    createClient: () => mockSupabase
}));

jest.mock('../../lib/store/game', () => ({
    useGameStore: jest.fn()
}));

jest.mock('../../lib/store/lobby', () => ({
    useLobbyStore: jest.fn()
}));

describe('Return to Main Menu Integration', () => {
    let mockGameReset: jest.Mock;
    let mockLobbyReset: jest.Mock;
    let mockRouterPush: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockGameReset = jest.fn();
        mockLobbyReset = jest.fn();
        mockRouterPush = jest.fn();

        // Setup Router Mock
        (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });

        // Setup Game Store Mock
        const mockGameState = {
            characters: [],
            selectedCharacterId: 1, 
            gameStatus: 'finished',
            gamePhase: 'game',
            gameId: 'game-1',
            currentTurnPlayerId: 'p1',
            setCharacters: jest.fn(),
            selectCharacter: jest.fn(),
            setGameId: jest.fn(),
            reset: mockGameReset,
            setCurrentTurn: jest.fn(),
            setGamePhase: jest.fn(),
            setPlayerId: jest.fn(),
            currentInteraction: null,
            lastMove: null,
            makeGuess: jest.fn(),
            winnerId: 'p1'
        };

        (useGameStore as unknown as jest.Mock).mockReturnValue(mockGameState);
        (useGameStore as any).getState = jest.fn(() => mockGameState);

        // Setup Lobby Store Mock
        const mockLobbyState = {
            reset: mockLobbyReset
        };
        (useLobbyStore as unknown as jest.Mock).mockReturnValue(mockLobbyState);
        (useLobbyStore as any).getState = jest.fn(() => mockLobbyState);
    });

    it('resets both stores and redirects to home when "Return to Menu" is clicked', async () => {
        render(<GameClient gameCode="XYZ" />);
        
        // Wait for component to render and find the button
        const returnBtn = await screen.findByText('Return to Menu');
        
        fireEvent.click(returnBtn);

        expect(mockGameReset).toHaveBeenCalled();
        expect(mockLobbyReset).toHaveBeenCalled();
        expect(mockRouterPush).toHaveBeenCalledWith('/');
    });
});
