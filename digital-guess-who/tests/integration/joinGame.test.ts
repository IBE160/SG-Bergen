/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/game/join/route';

const mockSupabase = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(),
};

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => mockSupabase),
}));

describe('POST /api/game/join', () => {
  const mockUser = { id: 'guest-user-id' };
  const mockGame = { id: 'game-123', status: 'waiting', host_id: 'host-1' };
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
  });

  it('should join game successfully', async () => {
    const gameChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockGame, error: null }),
    };
    
    const playersChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ data: [{ user_id: 'host-1' }], error: null }),
      insert: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: 'p-2' }, error: null }),
    };
    
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'game_sessions') return gameChain;
      if (table === 'players') return playersChain;
      return {};
    });

    const req = new NextRequest('http://localhost/api/game/join', {
      method: 'POST',
      body: JSON.stringify({ code: 'ABCD' }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ gameId: 'game-123', playerId: 'p-2' });
  });

  it('should return 404 if game not found', async () => {
    const gameChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
    };
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'game_sessions') return gameChain;
      return {};
    });

    const req = new NextRequest('http://localhost/api/game/join', {
      method: 'POST',
      body: JSON.stringify({ code: 'INVALID' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(404);
  });

  it('should return 409 if game is full', async () => {
    const gameChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockGame, error: null }),
    };
    
    const playersChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ 
        data: [{ user_id: 'p1' }, { user_id: 'p2' }], // 2 players
        error: null 
      }),
    };
    
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'game_sessions') return gameChain;
      if (table === 'players') return playersChain;
      return {};
    });

    const req = new NextRequest('http://localhost/api/game/join', {
      method: 'POST',
      body: JSON.stringify({ code: 'ABCD' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toBe('Game is full');
  });

  it('should return 200 and existing ID if user already joined', async () => {
    const gameChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockGame, error: null }),
    };
    
    const playersChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ 
        data: [{ user_id: 'host-1' }, { user_id: 'guest-user-id', id: 'existing-p-id' }], 
        error: null 
      }),
    };
    
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'game_sessions') return gameChain;
      if (table === 'players') return playersChain;
      return {};
    });

    const req = new NextRequest('http://localhost/api/game/join', {
      method: 'POST',
      body: JSON.stringify({ code: 'ABCD' }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ gameId: 'game-123', playerId: 'existing-p-id' });
  });

  it('should rate limit after 10 requests', async () => {
    // Reset or ensure rate limit counter
    // Note: Since tests run in same process, the rateLimitMap is shared.
    // We might need 11 requests to hit the limit if previous tests haven't used the same IP.
    // The previous tests used default 'unknown' IP if not mocked.
    // We'll mock a specific IP for this test.

    const ip = '127.0.0.1';
    
    // Send 10 allowed requests
    for (let i = 0; i < 10; i++) {
        // Mock request with headers
        const req = new NextRequest('http://localhost/api/game/join', {
            method: 'POST',
            body: JSON.stringify({ code: 'ABCD' }),
            headers: { 'x-forwarded-for': ip }
        });
        
        // We don't care about the DB response here, just that it doesn't 429
        const res = await POST(req);
        // It might fail validation or auth but shouldn't be 429
        expect(res.status).not.toBe(429); 
    }

    // Send 11th request - should be blocked
    const req = new NextRequest('http://localhost/api/game/join', {
        method: 'POST',
        body: JSON.stringify({ code: 'ABCD' }),
        headers: { 'x-forwarded-for': ip }
    });

    const res = await POST(req);
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error).toContain('Too many requests');
  });
});