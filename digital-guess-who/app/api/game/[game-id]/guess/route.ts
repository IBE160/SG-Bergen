import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { 'game-id': string } }
) {
  const gameId = params['game-id']
  
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { characterId } = body

    if (!characterId) {
        return NextResponse.json({ error: 'Character ID required' }, { status: 400 })
    }

    // 1. Verify Game State & Turn
    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .select('status, current_turn_player_id')
      .eq('id', gameId)
      .single()

    if (sessionError || !session) {
        return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }

    if (session.status !== 'active') {
        return NextResponse.json({ error: 'Game is not active' }, { status: 400 })
    }

    // 2. Get Players to verify identity
    const { data: players, error: playersError } = await supabase
        .from('players')
        .select('id, user_id')
        .eq('game_id', gameId)

    if (playersError || !players) {
        return NextResponse.json({ error: 'Players not found' }, { status: 500 })
    }

    const myPlayer = players.find(p => p.user_id === user.id)
    const opponentPlayer = players.find(p => p.user_id !== user.id)

    if (!myPlayer || !opponentPlayer) {
         return NextResponse.json({ error: 'Invalid players' }, { status: 500 })
    }

    // Note: current_turn_player_id is now referencing auth.users(id)
    if (session.current_turn_player_id !== user.id) {
        return NextResponse.json({ error: 'Not your turn' }, { status: 403 })
    }

    // 3. Check Guess using Admin Client (Secrets)
    const adminSupabase = createAdminClient()
    const { data: opponentSecret, error: secretError } = await adminSupabase
        .from('player_secrets')
        .select('character_id')
        .eq('player_id', opponentPlayer.id)
        .single()

    if (secretError || !opponentSecret || opponentSecret.character_id === null) {
        console.error('Secret fetch error:', secretError)
        return NextResponse.json({ error: 'Opponent secret not found' }, { status: 500 })
    }

    const isCorrect = opponentSecret.character_id === characterId
    const winnerId = isCorrect ? user.id : opponentPlayer.user_id

    // 4. Update Game
    const { error: updateError } = await supabase
        .from('game_sessions')
        .update({
            status: 'finished',
            winner_id: winnerId
        })
        .eq('id', gameId)

    if (updateError) {
        throw updateError
    }

    // 5. Insert 'guess' move for history
    await supabase.from('moves').insert({
        game_id: gameId,
        player_id: myPlayer.id,
        action_type: 'guess',
        details: { guessedCharacterId: characterId, isCorrect }
    })

    return NextResponse.json({ 
        success: true, 
        result: isCorrect ? 'win' : 'loss',
        correctCharacterId: opponentSecret.character_id 
    })

  } catch (error: any) {
    console.error('Guess error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
