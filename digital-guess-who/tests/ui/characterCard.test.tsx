import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { CharacterCard } from '../../app/game-play/components/character-card';
import { Character } from '../../lib/data/characters';

describe('CharacterCard', () => {
  const mockCharacter: Character = {
    id: 1,
    name: 'Test Character',
    imageUrl: '/test.png',
    tags: []
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders correctly', () => {
    render(<CharacterCard character={mockCharacter} onClick={mockOnClick} />);
    const card = screen.getByRole('button', { name: /Test Character, active/i });
    expect(card).toBeInTheDocument();
  });

  it('applies eliminated styles when isEliminated is true', () => {
    render(<CharacterCard character={mockCharacter} onClick={mockOnClick} isEliminated={true} />);
    const card = screen.getByRole('button', { name: /Test Character, eliminated/i });
    expect(card).toHaveClass('grayscale');
    expect(card).toHaveClass('opacity-40');
  });

  it('calls onClick when clicked', () => {
    render(<CharacterCard character={mockCharacter} onClick={mockOnClick} />);
    const card = screen.getByRole('button');
    fireEvent.click(card);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Enter key is pressed', () => {
    render(<CharacterCard character={mockCharacter} onClick={mockOnClick} />);
    const card = screen.getByRole('button');
    card.focus();
    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Space key is pressed', () => {
    render(<CharacterCard character={mockCharacter} onClick={mockOnClick} />);
    const card = screen.getByRole('button');
    card.focus();
    fireEvent.keyDown(card, { key: ' ', code: 'Space' });
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    render(<CharacterCard character={mockCharacter} onClick={mockOnClick} disabled={true} />);
    const card = screen.getByRole('button');
    fireEvent.click(card);
    expect(mockOnClick).not.toHaveBeenCalled();
    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });
    expect(mockOnClick).not.toHaveBeenCalled();
  });
});
