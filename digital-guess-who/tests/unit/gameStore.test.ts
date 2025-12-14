import { useGameStore } from '../../lib/store/game';
import { act } from '@testing-library/react';

describe('useGameStore', () => {
  const MOCK_MY_PLAYER_ID = 'mock-user-id-123'; // Matches the mock user in use-auth.ts
  const MOCK_OPPONENT_PLAYER_ID = 'opponent-user-id-456';

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

  it('sets the current turn player ID', () => {
    act(() => {
      useGameStore.getState().setCurrentTurn(MOCK_MY_PLAYER_ID);
    });
    expect(useGameStore.getState().currentTurnPlayerId).toBe(MOCK_MY_PLAYER_ID);
  });

  // Since isMyTurn is now derived, we need to test the derivation logic
  it('derives isMyTurn correctly when it is my turn', () => {
    act(() => {
      useGameStore.getState().setCurrentTurn(MOCK_MY_PLAYER_ID);
    });
    // To properly test derived state, we need a selector function or pass `myPlayerId` to the component that uses it.
    // For unit testing the store, we can access currentTurnPlayerId directly and verify logic.
    const state = useGameStore.getState();
    const isMyTurn = state.currentTurnPlayerId === MOCK_MY_PLAYER_ID;
    expect(isMyTurn).toBe(true);
  });

  it('derives isMyTurn correctly when it is not my turn', () => {
    act(() => {
      useGameStore.getState().setCurrentTurn(MOCK_OPPONENT_PLAYER_ID);
    });
    const state = useGameStore.getState();
    const isMyTurn = state.currentTurnPlayerId === MOCK_MY_PLAYER_ID;
    expect(isMyTurn).toBe(false);
  });
});
