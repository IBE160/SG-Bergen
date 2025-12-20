import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateGameCode } from '@/lib/utils';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  
  // 1. Authenticate user
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Fetch original game session
  const { data: game, error: gameError } = await supabase
    .from('game_sessions')
    .select('status, difficulty, host_id')
    .eq('id', gameId)
    .single();

  if (gameError || !game) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }

  // 3. Security Check: Game must be finished
  if (game.status !== 'finished') {
    return NextResponse.json(
      { error: 'Play again is only available for finished games' },
      { status: 403 }
    );
  }

  // 4. Find original players
  const { data: players, error: playersError } = await supabase
    .from('players')
    .select('id, user_id')
    .eq('game_id', gameId);

  if (playersError || !players || players.length === 0) {
    return NextResponse.json({ error: 'Players not found' }, { status: 500 });
  }

  // Check if requesting user was a player
  const isPlayer = players.some(p => p.user_id === user.id);
  if (!isPlayer) {
    return NextResponse.json({ error: 'You were not a player in this game' }, { status: 403 });
  }

  // 5. Create new game session (Using Admin Client to bypass potential RLS on insertion)
  // We need to bypass RLS specifically for inserting the OTHER player.
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  const newGameCode = generateGameCode();
  
  const { data: newGame, error: createGameError } = await supabaseAdmin
    .from('game_sessions')
    .insert({
      code: newGameCode,
      host_id: user.id, // Requester becomes new host
      difficulty: game.difficulty, // Copy difficulty
      status: 'waiting', // Start as waiting
      phase: 'lobby' // Explicitly start in lobby phase
    })
    .select()
    .single();

  if (createGameError || !newGame) {
    console.error('Error creating new game session:', createGameError);
    return NextResponse.json({ error: 'Failed to create new game session' }, { status: 500 });
  }

  // 6. Add both players to the new game
  // We use the original user_ids.
  // Note: We can add multiple rows in one insert.
  const newPlayersData = players.map(p => ({
    game_id: newGame.id,
    user_id: p.user_id,
    is_ready: false // Reset readiness
  }));

  const { error: createPlayersError } = await supabaseAdmin
    .from('players')
    .insert(newPlayersData);

  if (createPlayersError) {
    console.error('Error adding players to new game:', createPlayersError);
    // Cleanup
    await supabaseAdmin.from('game_sessions').delete().eq('id', newGame.id);
    return NextResponse.json({ error: 'Failed to add players to new game' }, { status: 500 });
  }

  return NextResponse.json({ 
    new_game_code: newGame.code,
    new_game_id: newGame.id
  });
}
