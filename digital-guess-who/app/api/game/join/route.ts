
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const joinGameSchema = z.object({
  code: z.string().min(1, "Game code is required"),
});

// Simple in-memory rate limiter
// Note: In a serverless environment (like Vercel), this cache is per-lambda instance 
// and not shared. For production, use a distributed store like Redis/Upstash.
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // 10 requests per minute

function isRateLimited(ip: string) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  if (now - record.lastReset > WINDOW_SIZE) {
    record.count = 1;
    record.lastReset = now;
    return false;
  }

  if (record.count >= MAX_REQUESTS) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function POST(request: NextRequest) {
  // 0. Rate Limiting
  const ip = (request as any).ip ?? request.headers.get('x-forwarded-for') ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  const supabase = await createClient();

  // 1. Authenticate User
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Validate Request
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const validation = joinGameSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 });
  }

  const { code } = validation.data;

  try {
    // 3. Find Game Session
    const { data: game, error: gameError } = await supabase
      .from('game_sessions')
      .select('id, status, host_id')
      .eq('code', code)
      .single();

    if (gameError || !game) {
      // Differentiate between "not found" and other errors if needed, 
      // but for security/simplicity, "Game not found" is usually best.
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    if (game.status !== 'waiting') {
       // If game is active, allow rejoin if user is a player? 
       // For now, strict "waiting" check as per AC, unless we handle reconnects logic explicitly.
       // But AC 1 says: "The system validates... game status is 'waiting'".
       // If I am already in it, maybe I can rejoin? 
       // Let's check players first.
    }

    // 4. Check existing players
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('user_id, id')
      .eq('game_id', game.id);

    if (playersError) {
      console.error('Error fetching players:', playersError);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    const existingPlayer = players.find(p => p.user_id === user.id);

    // If user is already a player, return success immediately
    if (existingPlayer) {
      return NextResponse.json({ gameId: game.id, playerId: existingPlayer.id }, { status: 200 });
    }

    // If not a player, check status and capacity
    if (game.status !== 'waiting') {
         return NextResponse.json({ error: 'Game is already active or finished' }, { status: 409 });
    }

    if (players.length >= 2) {
      return NextResponse.json({ error: 'Game is full' }, { status: 409 });
    }

    // 5. Join Game (Insert Player)
    const { data: newPlayer, error: joinError } = await supabase
      .from('players')
      .insert({
        game_id: game.id,
        user_id: user.id,
        is_ready: false
      })
      .select()
      .single();

    if (joinError) {
      console.error('Error joining game:', joinError);
      return NextResponse.json({ error: 'Failed to join game' }, { status: 500 });
    }

    return NextResponse.json({ gameId: game.id, playerId: newPlayer.id }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error during join:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
