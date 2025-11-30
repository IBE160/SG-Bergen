import { POST } from '../../app/api/game/create/route'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createGameSession } from '@/lib/services/game-session'

// Mock dependencies
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

jest.mock('@/lib/services/game-session', () => ({
  createGameSession: jest.fn(),
}))

describe('POST /api/game/create', () => {
  it('returns 401 if not authenticated', async () => {
    (createClient as jest.Mock).mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: 'Auth error' }),
      },
    })

    const request = new Request('http://localhost/api/game/create', {
      method: 'POST',
      body: JSON.stringify({ difficulty: 'Medium' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it('creates a game session when authenticated', async () => {
    (createClient as jest.Mock).mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null }),
      },
    })

    ;(createGameSession as jest.Mock).mockResolvedValue({
      code: 'TEST12',
      id: 'session-123'
    })

    const request = new Request('http://localhost/api/game/create', {
      method: 'POST',
      body: JSON.stringify({ difficulty: 'Hard' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.data.code).toBe('TEST12')
    expect(createGameSession).toHaveBeenCalledWith('user-123', 'Hard')
  })

  it('returns 400 for invalid difficulty', async () => {
    (createClient as jest.Mock).mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null }),
      },
    })

    const request = new Request('http://localhost/api/game/create', {
      method: 'POST',
      body: JSON.stringify({ difficulty: 'Insane' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })
})
