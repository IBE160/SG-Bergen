import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GuessModal from '@/app/game-play/components/GuessModal';
import { useGameStore } from '@/app/game-play/store/game-store';

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

describe('GuessModal', () => {
  beforeEach(() => {
    useGameStore.setState({ isGuessing: true });
  });

  it('renders when isGuessing is true', () => {
    render(<GuessModal onConfirmGuess={() => {}} />);
    expect(screen.getByText('Make Your Final Guess')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm Guess')).toBeInTheDocument();
  });

  it('disables confirm button initially', () => {
    render(<GuessModal onConfirmGuess={() => {}} />);
    const confirmBtn = screen.getByText('Confirm Guess');
    expect(confirmBtn).toBeDisabled();
  });

  it('enables confirm button after selection', () => {
    render(<GuessModal onConfirmGuess={() => {}} />);
    const images = screen.getAllByRole('img');
    fireEvent.click(images[0]); // Select first character
    const confirmBtn = screen.getByText('Confirm Guess');
    expect(confirmBtn).toBeEnabled();
  });

  it('calls onConfirmGuess with ID', () => {
    const mockConfirm = jest.fn();
    render(<GuessModal onConfirmGuess={mockConfirm} />);
    const images = screen.getAllByRole('img');
    fireEvent.click(images[0]); // Assuming first char has ID 1
    fireEvent.click(screen.getByText('Confirm Guess'));
    expect(mockConfirm).toHaveBeenCalledWith(1);
  });
});
