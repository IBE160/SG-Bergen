import { render, screen, fireEvent } from '@testing-library/react';
import { GuessConfirmationModal } from '@/app/game-play/components/guess-confirmation-modal';
import { ALL_CHARACTERS } from '@/lib/data/characters';
import '@testing-library/jest-dom';

describe('GuessConfirmationModal', () => {
  const mockCharacter = ALL_CHARACTERS[0]; // Albert
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(
      <GuessConfirmationModal
        isOpen={true}
        character={mockCharacter}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByRole('heading', { name: 'Confirm Guess' })).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to guess/)).toBeInTheDocument();
    expect(screen.getByText(mockCharacter.name)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm Guess' })).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <GuessConfirmationModal
        isOpen={false}
        character={mockCharacter}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.queryByRole('heading', { name: 'Confirm Guess' })).not.toBeInTheDocument();
  });

  it('calls onConfirm when Confirm button is clicked', () => {
    render(
      <GuessConfirmationModal
        isOpen={true}
        character={mockCharacter}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Confirm Guess' }));
    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    render(
      <GuessConfirmationModal
        isOpen={true}
        character={mockCharacter}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('disables buttons when submitting', () => {
    render(
      <GuessConfirmationModal
        isOpen={true}
        character={mockCharacter}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isSubmitting={true}
      />
    );

    expect(screen.getByRole('button', { name: 'Guessing...' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });
});
