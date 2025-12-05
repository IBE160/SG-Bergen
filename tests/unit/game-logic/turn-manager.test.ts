import { getNextPlayerId, isGameWon } from 'lib/game-logic/turn-manager';

describe('Turn Manager Logic', () => {
  const playerIds = ['player1', 'player2'];

  it('should return the next player ID correctly', () => {
    expect(getNextPlayerId('player1', playerIds)).toBe('player2');
    expect(getNextPlayerId('player2', playerIds)).toBe('player1');
  });

  it('should throw an error if current player not found', () => {
    expect(() => getNextPlayerId('player3', playerIds)).toThrow("Current player not found in player list.");
  });

  it('should correctly identify a winning guess', () => {
    expect(isGameWon(10, 10)).toBe(true);
    expect(isGameWon(5, 10)).toBe(false);
  });
});