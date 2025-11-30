import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Database } from '@/db/types'
import { createGameSession } from '@/lib/services/game-session'

type Difficulty = Database['public']['Enums']['difficulty_level']

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { difficulty } = body

    if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      return NextResponse.json({ error: 'Invalid difficulty' }, { status: 400 })
    }

    // createGameSession is an async function that interacts with DB, it should be awaited.
    // It calls createClient inside, which calls cookies(), which is fine in a Route Handler (POST).
    const session = await createGameSession(user.id, difficulty as Difficulty)

    return NextResponse.json({ data: { code: session.code } })
  } catch (error: any) {
    // Log the full error object for debugging
    console.error('Game creation error:', error)
    
    const message = error.message || 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}