import { POST } from '../../app/api/game/join/route'
import { createClient } from '@/lib/supabase/server'
import { joinGameSession } from '@/lib/services/game-session'

// Mock dependencies
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

jest.mock('@/lib/services/game-session', () => ({
  joinGameSession: jest.fn(),
}))

describe('POST /api/game/join', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 401 if not authenticated', async () => {
    (createClient as jest.Mock).mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: 'Auth error' }),
      },
    })

    const request = new Request('http://localhost/api/game/join', {
      method: 'POST',
      body: JSON.stringify({ code: 'ABCDEF' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it('returns 400 if code is missing', async () => {
     (createClient as jest.Mock).mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null }),
      },
    })
    const request = new Request('http://localhost/api/game/join', {
      method: 'POST',
      body: JSON.stringify({ }),
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('joins a game session when valid', async () => {
    (createClient as jest.Mock).mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-456' } }, error: null }),
      },
    })

    ;(joinGameSession as jest.Mock).mockResolvedValue({
      id: 'session-123',
      code: 'ABCDEF',
      status: 'waiting'
    })

    const request = new Request('http://localhost/api/game/join', {
      method: 'POST',
      body: JSON.stringify({ code: 'abcdef' }), // Test lowercase normalization
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.data.gameId).toBe('session-123')
    expect(joinGameSession).toHaveBeenCalledWith('user-456', 'ABCDEF') // Expect uppercase
  })

  it('returns 404 for invalid game code', async () => {
    (createClient as jest.Mock).mockResolvedValue({
        auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-456' } } }) }
    });
    (joinGameSession as jest.Mock).mockRejectedValue(new Error('Invalid game code'));

    const request = new Request('http://localhost/api/game/join', {
        method: 'POST',
        body: JSON.stringify({ code: 'WRONG' })
    });

    const response = await POST(request);
    expect(response.status).toBe(404);
  });

  it('returns 409 for full game', async () => {
    (createClient as jest.Mock).mockResolvedValue({
        auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-456' } } }) }
    });
    (joinGameSession as jest.Mock).mockRejectedValue(new Error('Game is full'));

    const request = new Request('http://localhost/api/game/join', {
        method: 'POST',
        body: JSON.stringify({ code: 'FULL12' })
    });

    const response = await POST(request);
    expect(response.status).toBe(409);
  });
})
