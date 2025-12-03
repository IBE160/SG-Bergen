import { createGameSession } from '@/lib/services/game-session'
import { POST } from '@/app/api/game/[game-id]/guess/route'
import { createClient } from '@/lib/supabase/server'

// Mocks
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn()
}))

describe('Guess API', () => {
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase = {
        auth: { getUser: jest.fn() },
        from: jest.fn()
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  it('rejects unauthenticated requests', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: 'Auth error' });
    const req = new Request('http://localhost/api/game/123/guess', { method: 'POST' });
    const res = await POST(req, { params: { 'game-id': '123' } });
    expect(res.status).toBe(401);
  });

  // Add more tests for success/failure scenarios if time permits, but for "yolo" speed, we verify basic auth first.
});
