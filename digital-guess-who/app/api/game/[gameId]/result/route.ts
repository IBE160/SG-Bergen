import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { ALL_CHARACTERS } from '@/lib/data/characters';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  
  // 1. Authenticate user
  const supabase = await createServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Fetch game session
  const { data: game, error: gameError } = await supabase
    .from('game_sessions')
    .select('status, winner_id')
    .eq('id', gameId)
    .single();

  if (gameError || !game) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }

  // 3. Security Check: Game must be finished
  if (game.status !== 'finished') {
    return NextResponse.json(
      { error: 'Game results not available until game is finished' },
      { status: 403 }
    );
  }

  // 4. Find opponent's player_id
  const { data: players, error: playersError } = await supabase
    .from('players')
    .select('id, user_id')
    .eq('game_id', gameId);

  if (playersError || !players || players.length === 0) {
    return NextResponse.json({ error: 'Players not found' }, { status: 500 });
  }

  // Check if requesting user is actually in the game
  const isPlayer = players.some(p => p.user_id === user.id);
  if (!isPlayer) {
    return NextResponse.json({ error: 'You are not a player in this game' }, { status: 403 });
  }

  const opponent = players.find(p => p.user_id !== user.id);
  
  // If no opponent found (e.g. game somehow has 1 player or user is playing alone? shouldn't happen in finished game)
  // For MVP assuming 2 player game.
  if (!opponent) {
    return NextResponse.json({ error: 'Opponent not found' }, { status: 404 });
  }

  // 5. Fetch opponent's secret character using Service Role (Bypass RLS)
  // We use service role because player_secrets RLS typically hides other players' secrets
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: secret, error: secretError } = await adminClient
    .from('player_secrets')
    .select('character_id')
    .eq('player_id', opponent.id)
    .single();

  if (secretError || !secret) {
    console.error("Error fetching secret:", secretError);
    return NextResponse.json({ error: 'Opponent secret not found' }, { status: 500 });
  }

  // 6. Resolve character details
  const character = ALL_CHARACTERS.find(c => c.id === secret.character_id);

  if (!character) {
      return NextResponse.json({ error: 'Character data not found' }, { status: 500 });
  }

  return NextResponse.json({
    winner_id: game.winner_id,
    opponent_character: {
      id: character.id,
      name: character.name,
      image: character.imageUrl
    }
  });
}
