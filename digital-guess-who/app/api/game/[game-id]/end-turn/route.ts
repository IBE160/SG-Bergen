import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { updateCurrentTurnPlayer } from '@/lib/services/game-session';

export async function POST(
  req: NextRequest,
  { params }: { params: { 'game-id': string } }
) {
  const gameId = params['game-id'];
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Call the service function to update the turn
    await updateCurrentTurnPlayer(gameId, user.id);
    return NextResponse.json({ message: `Turn for game ${gameId} updated successfully.` });
  } catch (error: any) {
    console.error('Error ending turn:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
