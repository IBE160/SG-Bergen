import { useGameStore } from '@/app/game-play/store/game-store';

describe('Game Store - Elimination', () => {
  beforeEach(() => {
    useGameStore.setState({ eliminatedCharacterIds: [] });
  });

  it('starts with no eliminated characters', () => {
    expect(useGameStore.getState().eliminatedCharacterIds).toEqual([]);
  });

  it('toggles character elimination on and off', () => {
    useGameStore.getState().toggleCharacterElimination(1);
    expect(useGameStore.getState().eliminatedCharacterIds).toContain(1);

    useGameStore.getState().toggleCharacterElimination(1);
    expect(useGameStore.getState().eliminatedCharacterIds).not.toContain(1);
  });

  it('can eliminate multiple characters', () => {
    useGameStore.getState().toggleCharacterElimination(1);
    useGameStore.getState().toggleCharacterElimination(2);
    expect(useGameStore.getState().eliminatedCharacterIds).toEqual(expect.arrayContaining([1, 2]));
  });

  it('resets eliminations', () => {
    useGameStore.getState().toggleCharacterElimination(1);
    useGameStore.getState().resetEliminations();
    expect(useGameStore.getState().eliminatedCharacterIds).toEqual([]);
  });
});
