import { act, renderHook } from '@testing-library/react';
import { useGameStore } from '../../app/game-play/store';
import { Character } from '../../app/game-play/types';

const mockCharacter: Character = {
  id: 1,
  name: 'Test',
  image: 'test.png',
  gender: 'male',
  hat: false,
  glasses: false
};

describe('GamePlayStore', () => {
  it('should set characters', () => {
    const { result } = renderHook(() => useGameStore());
    act(() => {
      result.current.setCharacters([mockCharacter]);
    });
    expect(result.current.characters).toHaveLength(1);
  });

  it('should set secret character', () => {
    const { result } = renderHook(() => useGameStore());
    act(() => {
      result.current.setMySecretCharacter(mockCharacter);
    });
    expect(result.current.mySecretCharacter).toEqual(mockCharacter);
  });

  it('should toggle eliminated character', () => {
    const { result } = renderHook(() => useGameStore());
    act(() => {
      result.current.toggleEliminated(1);
    });
    expect(result.current.eliminatedCharacterIds).toContain(1);
    
    act(() => {
      result.current.toggleEliminated(1);
    });
    expect(result.current.eliminatedCharacterIds).not.toContain(1);
  });
});
