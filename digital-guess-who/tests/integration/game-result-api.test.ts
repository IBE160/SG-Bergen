/**
 * @jest-environment node
 */
import { GET } from '@/app/api/game/[gameId]/result/route';
import { NextRequest } from 'next/server';

// Mock Supabase
const mockSupabase = {
  auth: {
    getUser: jest.fn()
  },
  from: jest.fn()
};

const mockAdminClient = {
    from: jest.fn()
};

// Mock @/lib/supabase/server
jest.mock('@/lib/supabase/server', () => ({
  createClient: () => Promise.resolve(mockSupabase)
}));

// Mock @supabase/supabase-js
jest.mock('@supabase/supabase-js', () => ({
    createClient: () => mockAdminClient
}));

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-key';

describe('API Route: GET /api/game/[gameId]/result', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns 401 if user is not authenticated', async () => {
        mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: new Error('No user') });
        
        const req = new NextRequest('http://localhost/api/game/1/result');
        const res = await GET(req, { params: Promise.resolve({ gameId: '1' }) });
        
        expect(res.status).toBe(401);
    });

    it('returns 403 if game is not finished', async () => {
        mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user1' } }, error: null });
        
        // Mock game session query
        const gameChain = {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: { status: 'active' }, error: null })
        };

        mockSupabase.from.mockImplementation((table) => {
             if (table === 'game_sessions') return gameChain;
             return { select: () => ({ eq: () => ({}) }) };
        });

        const req = new NextRequest('http://localhost/api/game/1/result');
        const res = await GET(req, { params: Promise.resolve({ gameId: '1' }) });
        
        expect(res.status).toBe(403);
        const data = await res.json();
        expect(data.error).toBe('Game results not available until game is finished');
    });

    it('returns correct data when game is finished', async () => {
        const userId = 'user1';
        const opponentId = 'user2';
        const gameId = 'game1';
        const playerId1 = 'p1';
        const playerId2 = 'p2';
        const opponentCharacterId = 1; // Albert

        // Auth
        mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: userId } }, error: null });

        // Game Session Query Mock
        const gameChain = {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: { status: 'finished', winner_id: userId }, error: null })
        };

        // Players Query Mock
        const playersChain = {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockImplementation(() => Promise.resolve({ 
                data: [
                    { id: playerId1, user_id: userId },
                    { id: playerId2, user_id: opponentId }
                ], 
                error: null 
            }))
        };

        // We need to handle multiple calls to .from()
        mockSupabase.from.mockImplementation((table) => {
            if (table === 'game_sessions') return gameChain;
            if (table === 'players') return playersChain;
            return { select: () => ({ eq: () => ({ single: () => ({}) }) }) };
        });

        // Admin Client Secret Fetch
        const secretChain = {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: { character_id: opponentCharacterId }, error: null })
        };
        mockAdminClient.from.mockReturnValue(secretChain);

        const req = new NextRequest(`http://localhost/api/game/${gameId}/result`);
        const res = await GET(req, { params: Promise.resolve({ gameId }) });
        
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.winner_id).toBe(userId);
        expect(data.opponent_character.name).toBe('Albert');
        expect(data.opponent_character.id).toBe(1);
    });
});
