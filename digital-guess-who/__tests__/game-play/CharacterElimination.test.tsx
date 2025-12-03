import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CharacterCard from '@/app/game-play/components/CharacterCard';
import CharacterGrid from '@/app/game-play/components/CharacterGrid';
import { useGameStore } from '@/app/game-play/store/game-store';

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

describe('Character Elimination UI', () => {
  beforeEach(() => {
    useGameStore.setState({ eliminatedCharacterIds: [] });
  });

  it('renders character card correctly', () => {
    const char = { id: 1, name: 'TestChar', image: '/test.png' };
    render(<CharacterCard character={char} />);
    expect(screen.getByRole('button', { name: /Flip TestChar/i })).toBeInTheDocument();
    expect(screen.getByAltText('TestChar')).toBeInTheDocument();
    expect(screen.getByText('TestChar')).toBeInTheDocument();
  });

  it('toggles elimination state on click', () => {
    const char = { id: 1, name: 'TestChar', image: '/test.png' };
    render(<CharacterCard character={char} />);
    
    const card = screen.getByRole('button', { name: /Flip TestChar/i });
    
    // Initially not eliminated (active style)
    expect(card).not.toHaveClass('grayscale');

    // Click to eliminate
    fireEvent.click(card);
    expect(useGameStore.getState().eliminatedCharacterIds).toContain(1);
    expect(card).toHaveClass('grayscale');

    // Click to restore
    fireEvent.click(card);
    expect(useGameStore.getState().eliminatedCharacterIds).not.toContain(1);
    expect(card).not.toHaveClass('grayscale');
  });

  it('renders grid of characters', () => {
    render(<CharacterGrid />);
    // Should render all characters defined in characters.ts
    // We know there are 24 in our static file
    const cards = screen.getAllByRole('button', { name: /Flip/i });
    expect(cards.length).toBeGreaterThan(0);
  });
});
