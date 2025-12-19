import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/db/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  // 1. Auth Check (User Client)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { gameId } = await params;

  // 2. Parse Body
  let guess_character_id: number;
  try {
    const body = await request.json();
    guess_character_id = body.guess_character_id;
    if (typeof guess_character_id !== 'number') throw new Error('Invalid guess');
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Admin Client for Privileged Operations
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is missing');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  const supabaseAdmin = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  try {
    // 3. Get Game Session & Player Info
    // We can use Admin or User client here. User client is safer to ensure visibility.
    const { data: game, error: gameError } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('id', gameId)
      .single();

    if (gameError || !game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    if (game.status !== 'active') {
      return NextResponse.json({ error: 'Game is not active' }, { status: 400 });
    }

    // 4. Get Current Player (My Player)
    const { data: myPlayer, error: myPlayerError } = await supabase
      .from('players')
      .select('id')
      .eq('game_id', gameId)
      .eq('user_id', user.id)
      .single();

    if (myPlayerError || !myPlayer) {
      return NextResponse.json({ error: 'Player not found in this game' }, { status: 403 });
    }

    // 5. Verify Turn
    if (game.current_turn_player_id !== myPlayer.id) {
       return NextResponse.json({ error: 'Not your turn' }, { status: 403 });
    }

    // 6. Get Opponent
    const { data: opponent, error: opponentError } = await supabase
      .from('players')
      .select('id, user_id')
      .eq('game_id', gameId)
      .neq('id', myPlayer.id)
      .single();

    if (opponentError || !opponent) {
      return NextResponse.json({ error: 'Opponent not found' }, { status: 500 });
    }

    // 7. Get Opponent's Secret (PRIVILEGED)
    const { data: secret, error: secretError } = await supabaseAdmin
      .from('player_secrets')
      .select('character_id')
      .eq('player_id', opponent.id)
      .single();
    
    if (secretError || !secret) {
        console.error('Secret lookup failed for opponent:', opponent.id);
        console.error('Error details:', secretError);
        console.warn('Check if SUPABASE_SERVICE_ROLE_KEY is valid and has bypass-RLS permissions.');
        return NextResponse.json({ 
            error: 'Opponent secret not found',
            details: secretError?.message 
        }, { status: 500 });
    }

    // 8. Determine Outcome
    const isWin = secret.character_id === guess_character_id;
    const winnerId = isWin ? user.id : opponent.user_id; // user.id is my user id
    const result = isWin ? 'win' : 'lose';

    // 9. Update Game Session (Finish Game) (PRIVILEGED)
    const { error: updateError } = await supabaseAdmin
      .from('game_sessions')
      .update({
        status: 'finished',
        winner_id: winnerId,
      })
      .eq('id', gameId);

    if (updateError) {
      console.error('Update game error:', updateError);
      throw updateError;
    }
    
    // 10. Record Move (Guess) (PRIVILEGED)
    await supabaseAdmin.from('moves').insert({
        game_id: gameId,
        player_id: myPlayer.id,
        action_type: 'guess',
        details: {
            guess_character_id,
            result,
            correct_character_id: secret.character_id
        }
    });

    return NextResponse.json({ 
        result, 
        correct_character_id: secret.character_id 
    });

  } catch (error: any) {
    console.error('Error processing guess:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
