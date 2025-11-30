import { createGameSession } from '@/lib/services/game-session'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Database } from '@/db/types'

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

    const session = await createGameSession(user.id, difficulty as Difficulty)

    return NextResponse.json({ data: { code: session.code } })
  } catch (error) {
    console.error('Game creation error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
