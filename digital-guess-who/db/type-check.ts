import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

// This file validates that the generated types are working correctly.
// It is not meant to be executed, but rather checked by the TypeScript compiler.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

async function testTypeSafety() {
  // Test 1: Query game_sessions and ensure types are inferred
  const { data: session, error } = await supabase
    .from('game_sessions')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    console.error('Error:', error)
    return
  }

  if (session) {
    // These properties should be autocompleted and typed
    const id: string = session.id
    const code: string = session.code
    const status: 'waiting' | 'active' | 'finished' = session.status
    
    console.log(`Session ${id} is ${status}`)
  }

  // Test 2: Insert a player (ensure required fields are checked)
  const { error: insertError } = await supabase
    .from('players')
    .insert({
      game_id: 'some-uuid', // UUID
      user_id: 'some-uuid', // UUID
      is_ready: false,      // boolean
      // character_id is optional number
    })
    
  // Test 3: Enums
  const moveType: Database['public']['Enums']['action_type'] = 'question'
  
  console.log('Types validated successfully')
}
