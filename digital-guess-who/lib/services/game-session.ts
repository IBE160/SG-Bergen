import { createClient } from '@/lib/supabase/server'
import { Database } from '@/db/types'

type Difficulty = Database['public']['Enums']['difficulty_level']

export async function createGameSession(userId: string, difficulty: Difficulty) {
  const supabase = await createClient()
  
  // Simple retry logic for code collision
  let code: string = '';
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 5) {
    code = generateGameCode();
    // Check if code exists (using count to avoid error on no rows if .single() is strictly enforced by some setups, 
    // but .single() usually returns error if no rows. using maybeSingle or explicit check is safer)
    const { data } = await supabase
      .from('game_sessions')
      .select('id')
      .eq('code', code)
      .maybeSingle();
    
    if (!data) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    throw new Error('Failed to generate unique game code');
  }

  // Create session
  const { data: session, error: sessionError } = await supabase
    .from('game_sessions')
    .insert({
      host_id: userId,
      difficulty,
      code,
      status: 'waiting'
    })
    .select()
    .single()

  if (sessionError) throw sessionError

  // Add host as player
  const { error: playerError } = await supabase
    .from('players')
    .insert({
      game_id: session.id,
      user_id: userId,
      is_ready: false
    })

  if (playerError) throw playerError

  return session
}

function generateGameCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
