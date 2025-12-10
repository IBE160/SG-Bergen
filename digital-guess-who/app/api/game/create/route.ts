// digital-guess-who/app/api/game/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server'; // Use the dedicated server helper
import { generateGameCode } from '@/lib/utils';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { difficulty } = await request.json();

  if (!difficulty || !['easy', 'medium', 'hard'].includes(difficulty)) {
    return NextResponse.json({ error: 'Invalid difficulty' }, { status: 400 });
  }

  try {
    const gameCode = generateGameCode();

    // Insert into game_sessions table
    const { data: gameSession, error: gameError } = await supabase
      .from('game_sessions')
      .insert({
        code: gameCode,
        host_id: user.id,
        status: 'waiting',
        difficulty: difficulty,
      })
      .select()
      .single();

    if (gameError || !gameSession) {
      console.error('Error creating game session:', gameError);
      return NextResponse.json({ error: gameError?.message || 'Failed to create game session' }, { status: 500 });
    }

    // Insert into players table for the host
    const { data: player, error: playerError } = await supabase
      .from('players')
      .insert({
        game_id: gameSession.id,
        user_id: user.id,
        is_ready: false, // Host is not ready by default
      })
      .select()
      .single();

    if (playerError || !player) {
      console.error('Error creating player record for host:', playerError);
      
      // Cleanup orphaned game session
      const { error: cleanupError } = await supabase
        .from('game_sessions')
        .delete()
        .eq('id', gameSession.id);

      if (cleanupError) {
        console.error('Failed to cleanup orphaned game session:', cleanupError);
      }

      return NextResponse.json({ error: playerError?.message || 'Failed to create player record' }, { status: 500 });
    }

    return NextResponse.json({ gameId: gameSession.id, code: gameCode }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error during game creation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
