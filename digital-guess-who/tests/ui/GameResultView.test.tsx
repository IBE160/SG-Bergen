import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameResultView } from '@/app/game-play/components/GameResultView';

// Mock OpponentReveal to simplify test
jest.mock('@/app/game-play/components/OpponentReveal', () => ({
    OpponentReveal: ({ character, isLoading }: any) => (
        <div data-testid="opponent-reveal">
            {isLoading ? "Loading..." : character ? `Revealed: ${character.name}` : "Unknown"}
        </div>
    )
}));

describe('GameResultView', () => {
    const mockProps = {
        winnerId: 'user1',
        currentUserId: 'user1',
        opponentCharacter: { id: 1, name: 'Albert', image: 'path/to/img' },
        isLoadingOpponent: false,
        onPlayAgain: jest.fn(),
        onReturnToMenu: jest.fn(),
        isPlayAgainLoading: false
    };

    it('renders "You Win!" when current user is the winner', () => {
        render(<GameResultView {...mockProps} />);
        expect(screen.getByText('You Win!')).toBeInTheDocument();
        expect(screen.getByText('Congratulations on your victory.')).toBeInTheDocument();
    });

    it('renders "You Lose" when current user is NOT the winner', () => {
        render(<GameResultView {...mockProps} winnerId="user2" />);
        expect(screen.getByText('You Lose')).toBeInTheDocument();
        expect(screen.getByText('Better luck next time!')).toBeInTheDocument();
    });

    it('shows opponent character via OpponentReveal component', () => {
        render(<GameResultView {...mockProps} />);
        expect(screen.getByTestId('opponent-reveal')).toHaveTextContent('Revealed: Albert');
    });

    it('handles button clicks', () => {
        render(<GameResultView {...mockProps} />);
        
        fireEvent.click(screen.getByText('Play Again'));
        expect(mockProps.onPlayAgain).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByText('Return to Menu'));
        expect(mockProps.onReturnToMenu).toHaveBeenCalledTimes(1);
    });

    it('shows loading state for Play Again button', () => {
        render(<GameResultView {...mockProps} isPlayAgainLoading={true} />);
        expect(screen.getByText('Setting up...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Setting up/i })).toBeDisabled();
    });
});
