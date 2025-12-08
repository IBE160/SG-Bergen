import { Database } from '@/db/types';

// Type assertion helper
type AssertType<T, U> = T extends U ? (U extends T ? true : false) : false;

describe('Database Types', () => {
  it('should have the correct table structure', () => {
    // Check Users Table
    type UserRow = Database['public']['Tables']['users']['Row'];
    const userCheck: AssertType<UserRow, {
      id: string;
      username: string | null;
      avatar_url: string | null;
    }> = true;
    expect(userCheck).toBe(true);

    // Check Game Sessions Table
    type GameSessionRow = Database['public']['Tables']['game_sessions']['Row'];
    const gameSessionCheck: AssertType<GameSessionRow, {
        id: string;
        code: string;
        status: 'waiting' | 'active' | 'finished';
        host_id: string;
        winner_id: string | null;
        difficulty: 'easy' | 'medium' | 'hard' | null;
        created_at: string;
    }> = true;
    expect(gameSessionCheck).toBe(true);

     // Check Players Table
     type PlayerRow = Database['public']['Tables']['players']['Row'];
     const playerCheck: AssertType<PlayerRow, {
         id: string;
         user_id: string;
         game_id: string;
         character_id: number | null;
         is_ready: boolean;
     }> = true;
     expect(playerCheck).toBe(true);

     // Check Moves Table
     type MoveRow = Database['public']['Tables']['moves']['Row'];
     const moveCheck: AssertType<MoveRow['action_type'], 'question' | 'answer' | 'guess' | 'flip'> = true;
     expect(moveCheck).toBe(true);
  });
});
