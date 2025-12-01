export interface Character {
  id: number;
  name: string;
  image: string;
  gender: string;
  hat: boolean;
  glasses: boolean;
}

export type GameState = 'selecting' | 'playing' | 'finished';
