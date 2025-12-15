import { render, screen, fireEvent } from '@testing-library/react';
import { CharacterGrid } from '../../app/game-play/components/character-grid';
import { useGameStore } from '../../lib/store/game';
import { ALL_CHARACTERS } from '../../lib/data/characters';

// Mock zustand store
jest.mock('../../lib/store/game');

describe('CharacterGrid', () => {
  const mockSelectCharacter = jest.fn();
  const mockToggleElimination = jest.fn();

  beforeEach(() => {
    (useGameStore as unknown as jest.Mock).mockReturnValue({
      characters: ALL_CHARACTERS.slice(0, 12),
      selectedCharacterId: null,
      eliminatedCharacterIds: [],
      selectCharacter: mockSelectCharacter,
      toggleElimination: mockToggleElimination,
    });
  });

  it('renders correct number of characters', () => {
    render(<CharacterGrid selectionMode={false} />);
    // Cards are now buttons
    const cards = screen.getAllByRole('button');
    expect(cards).toHaveLength(12);
  });

  it('handles click in selection mode', () => {
    render(<CharacterGrid selectionMode={true} />);
    const cards = screen.getAllByRole('button');
    fireEvent.click(cards[0]); 
    expect(mockSelectCharacter).toHaveBeenCalledWith(1);
  });

  it('handles click in elimination mode', () => {
    render(<CharacterGrid selectionMode={false} />);
    const cards = screen.getAllByRole('button');
    fireEvent.click(cards[0]);
    expect(mockToggleElimination).toHaveBeenCalledWith(1);
  });
});
