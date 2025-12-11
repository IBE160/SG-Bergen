import { useGameStore } from '../../lib/store/game';
import { act } from '@testing-library/react';

describe('useGameStore', () => {
  beforeEach(() => {
    act(() => {
      useGameStore.getState().reset();
    });
  });

  it('selects a character', () => {
    act(() => {
      useGameStore.getState().selectCharacter(1);
    });
    expect(useGameStore.getState().selectedCharacterId).toBe(1);
  });

  it('toggles elimination', () => {
    act(() => {
      useGameStore.getState().toggleElimination(1);
    });
    expect(useGameStore.getState().eliminatedCharacterIds).toContain(1);

    act(() => {
      useGameStore.getState().toggleElimination(1);
    });
    expect(useGameStore.getState().eliminatedCharacterIds).not.toContain(1);
  });
});
