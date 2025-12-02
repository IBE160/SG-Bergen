import { act } from 'react';
import { useGameStore } from '../../../app/game-play/store/game-store';

describe('useGameStore', () => {
  it('should return initial state', () => {
    const { currentTurnPlayerId } = useGameStore.getState();
    expect(currentTurnPlayerId).toBeNull();
  });

  it('should set currentTurnPlayerId', () => {
    const newPlayerId = 'test-player-id-123';
    act(() => {
      useGameStore.getState().setCurrentTurnPlayerId(newPlayerId);
    });
    const { currentTurnPlayerId } = useGameStore.getState();
    expect(currentTurnPlayerId).toBe(newPlayerId);
  });

  it('should reset currentTurnPlayerId to null', () => {
    const newPlayerId = 'test-player-id-123';
    act(() => {
      useGameStore.getState().setCurrentTurnPlayerId(newPlayerId);
    });
    act(() => {
      useGameStore.getState().setCurrentTurnPlayerId(null);
    });
    const { currentTurnPlayerId } = useGameStore.getState();
    expect(currentTurnPlayerId).toBeNull();
  });
});
