// Placeholder for pure functions related to turn management logic.
// This might contain helper functions used by the Zustand store.

export function getNextPlayerId(currentPlayerId: string, playerIds: string[]): string {
  const currentIndex = playerIds.indexOf(currentPlayerId);
  if (currentIndex === -1) {
    throw new Error("Current player not found in player list.");
  }
  const nextIndex = (currentIndex + 1) % playerIds.length;
  return playerIds[nextIndex];
}

export function isGameWon(guessedCharacterId: number, secretCharacterId: number): boolean {
  return guessedCharacterId === secretCharacterId;
}
