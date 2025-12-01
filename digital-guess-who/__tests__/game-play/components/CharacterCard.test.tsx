import { render, screen, fireEvent } from '@testing-library/react';
import { CharacterCard } from '../../../app/game-play/components/CharacterCard';
import { Character } from '../../../app/game-play/types';
import '@testing-library/jest-dom';

const mockCharacter: Character = {
  id: 1,
  name: 'Alex',
  image: '/alex.png',
  gender: 'male',
  hat: false,
  glasses: false
};

// Mock Next/Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt} />,
}));

describe('CharacterCard', () => {
  it('renders character name', () => {
    render(<CharacterCard character={mockCharacter} onClick={() => {}} />);
    expect(screen.getByText('Alex')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<CharacterCard character={mockCharacter} onClick={handleClick} />);
    fireEvent.click(screen.getByText('Alex'));
    expect(handleClick).toHaveBeenCalled();
  });
});
