import { joinGameSession } from '@/lib/services/game-session'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { code } = body

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Invalid game code' }, { status: 400 })
    }

    // Normalize code (uppercase, trim)
    const normalizedCode = code.toUpperCase().trim();

    const session = await joinGameSession(user.id, normalizedCode)

    return NextResponse.json({ data: { gameId: session.id, code: normalizedCode } })
  } catch (error: any) {
    console.error('Game join error:', error)
    const message = error.message || 'Internal Server Error'
    
    // Map specific errors to 400/404/409 if needed, or just generic 400 for business logic errors
    if (message === 'Invalid game code') {
        return NextResponse.json({ error: message }, { status: 404 })
    }
    if (message === 'Game is full' || message === 'Game is already in progress or finished') {
        return NextResponse.json({ error: message }, { status: 409 }) // Conflict
    }

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
