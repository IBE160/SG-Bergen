import { useLobbyStore, Player } from '@/app/game-lobby/store';
import { act, renderHook } from '@testing-library/react';

const mockPlayer1: Player = {
    id: '1',
    game_id: 'game1',
    user_id: 'user1',
    is_ready: false,
    character_id: null,
    created_at: new Date().toISOString(),
    users: { username: 'Player One' },
};

const mockPlayer2: Player = {
    id: '2',
    game_id: 'game1',
    user_id: 'user2',
    is_ready: false,
    character_id: null,
    created_at: new Date().toISOString(),
    users: { username: 'Player Two' },
};

describe('useLobbyStore', () => {
  it('should set players', () => {
    const { result } = renderHook(() => useLobbyStore());
    act(() => {
      result.current.setPlayers([mockPlayer1, mockPlayer2]);
    });
    expect(result.current.players).toEqual([mockPlayer1, mockPlayer2]);
  });

  it('should add a player', () => {
    const { result } = renderHook(() => useLobbyStore());
    act(() => {
        result.current.setPlayers([mockPlayer1]);
    });
    act(() => {
      result.current.addPlayer(mockPlayer2);
    });
    expect(result.current.players).toEqual([mockPlayer1, mockPlayer2]);
  });

  it('should not add a duplicate player', () => {
    const { result } = renderHook(() => useLobbyStore());
    act(() => {
        result.current.setPlayers([mockPlayer1]);
    });
    act(() => {
      result.current.addPlayer(mockPlayer1);
    });
    expect(result.current.players).toEqual([mockPlayer1]);
  });

  it('should update player status', () => {
    const { result } = renderHook(() => useLobbyStore());
    act(() => {
        result.current.setPlayers([mockPlayer1]);
    });
    act(() => {
      result.current.updatePlayerStatus('user1', true);
    });
    expect(result.current.players[0].is_ready).toBe(true);
  });

  it('should set game id', () => {
    const { result } = renderHook(() => useLobbyStore());
    act(() => {
      result.current.setGameId('game123');
    });
    expect(result.current.gameId).toBe('game123');
  });

    it('should set game status', () => {
    const { result } = renderHook(() => useLobbyStore());
    act(() => {
        result.current.setGameStatus('active');
    });
    expect(result.current.gameStatus).toBe('active');
    });
});
