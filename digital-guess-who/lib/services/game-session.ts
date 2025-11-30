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

export async function joinGameSession(userId: string, code: string) {
  const supabase = await createClient()

  // 1. Fetch game session
  const { data: session, error: sessionError } = await supabase
    .from('game_sessions')
    .select('id, status')
    .eq('code', code)
    .maybeSingle()

  if (sessionError) throw sessionError
  if (!session) throw new Error('Invalid game code')

  if (session.status !== 'waiting') {
    throw new Error('Game is already in progress or finished')
  }

  // 2. Check current player count
  const { count, error: countError } = await supabase
    .from('players')
    .select('*', { count: 'exact', head: true })
    .eq('game_id', session.id)

  if (countError) throw countError

  // 3. Check if user is already joined
  const { data: existingPlayer } = await supabase
    .from('players')
    .select('id')
    .eq('game_id', session.id)
    .eq('user_id', userId)
    .maybeSingle()

  if (existingPlayer) {
    return session // Already joined
  }

  // 4. Check for full game (max 2 players)
  if (count !== null && count >= 2) {
    throw new Error('Game is full')
  }

  // 5. Insert player
  const { error: insertError } = await supabase
    .from('players')
    .insert({
      game_id: session.id,
      user_id: userId,
      is_ready: false
    })

  if (insertError) {
    // Handle race condition where another player joined just now
    if (insertError.code === '23505') { // unique_violation (user+game)
        return session
    }
    throw insertError
  }

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
