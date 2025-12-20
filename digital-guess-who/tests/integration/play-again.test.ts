/**
 * @jest-environment node
 */
import { POST } from '@/app/api/game/[gameId]/play-again/route';
import { NextRequest } from 'next/server';

// Mock Supabase
const mockSupabase = {
  auth: {
    getUser: jest.fn()
  },
  from: jest.fn()
};

// Mock @/lib/supabase/server
jest.mock('@/lib/supabase/server', () => ({
  createClient: () => Promise.resolve(mockSupabase)
}));

// Mock utils
jest.mock('@/lib/utils', () => ({
  generateGameCode: () => 'ABCD'
}));

describe('API Route: POST /api/game/[gameId]/play-again', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns 401 if user is not authenticated', async () => {
        mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: new Error('No user') });
        
        const req = new NextRequest('http://localhost/api/game/1/play-again', { method: 'POST' });
        const res = await POST(req, { params: Promise.resolve({ gameId: '1' }) });
        
        expect(res.status).toBe(401);
    });

    it('returns 403 if original game is not finished', async () => {
        mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user1' } }, error: null });
        
        const gameChain = {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: { status: 'active', difficulty: 'easy' }, error: null })
        };

        mockSupabase.from.mockImplementation((table) => {
             if (table === 'game_sessions') return gameChain;
             return { select: () => ({ eq: () => ({}) }) };
        });

        const req = new NextRequest('http://localhost/api/game/1/play-again', { method: 'POST' });
        const res = await POST(req, { params: Promise.resolve({ gameId: '1' }) });
        
        expect(res.status).toBe(403);
    });

    it('creates new game and adds players if valid', async () => {
        const userId = 'user1';
        const opponentId = 'user2';
        const gameId = 'game1';
        const newGameId = 'new-game-id';

        // Auth
        mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: userId } }, error: null });

        // 1. Fetch old game
        const oldGameChain = {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ 
                data: { status: 'finished', difficulty: 'hard', host_id: 'old-host' }, 
                error: null 
            })
        };

        // 2. Fetch players
        const playersChain = {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ 
                data: [
                    { id: 'p1', user_id: userId },
                    { id: 'p2', user_id: opponentId }
                ], 
                error: null 
            }),
            insert: jest.fn().mockResolvedValue({ error: null })
        };

        // 3. Insert new game
        const insertGameChain = {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ 
                data: { id: newGameId, code: 'ABCD' }, 
                error: null 
            }),
            delete: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis()
        };

        mockSupabase.from.mockImplementation((table) => {
            if (table === 'game_sessions') {
                // Return different mocks based on method calls (simplified by returning merged object or specific logic)
                // But since we call .from('game_sessions') twice (once for select, once for insert), 
                // we can just return a mock that handles all chain possibilities or use jest.fn to return specific chains based on call order if needed.
                // Or simpler: just return an object with all methods mocked.
                return {
                    select: jest.fn().mockImplementation((cols) => {
                        if (cols && cols.includes('status')) return oldGameChain.select(cols); // first call
                        return insertGameChain.select(cols); // second call after insert
                    }),
                    insert: insertGameChain.insert,
                    delete: insertGameChain.delete
                };
            }
            if (table === 'players') return playersChain;
            return { select: () => ({ eq: () => ({ single: () => ({}) }) }) };
        });

        // We need to fine-tune the select mock because checking equality of arguments is hard in simple return
        // Let's rely on the sequence. 
        // 1st .from('game_sessions') -> .select(...) -> .eq(id, gameId) -> .single()
        // 2nd .from('game_sessions') -> .insert(...) -> .select() -> .single()
        
        // Let's refine the mock
        const gameSelectMock = jest.fn();
        const gameInsertMock = jest.fn();

        gameSelectMock.mockReturnValue({
             eq: jest.fn().mockReturnValue({
                 single: jest.fn().mockResolvedValue({ 
                    data: { status: 'finished', difficulty: 'hard', host_id: 'old-host' }, 
                    error: null 
                 })
             })
        });

        gameInsertMock.mockReturnValue({
            select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ 
                    data: { id: newGameId, code: 'ABCD' }, 
                    error: null 
                })
            })
        });

        mockSupabase.from.mockImplementation((table) => {
            if (table === 'game_sessions') {
                return {
                    select: (...args: any[]) => {
                         // Distinguish between the initial fetch and the insert result fetch
                         // In implementation: 
                         // 1. .select('status...').eq...
                         // 2. .insert(...).select().single()
                         // So checking args helps.
                         if (args[0] && args[0].includes('status')) return gameSelectMock(args); // old game
                         return { single: jest.fn().mockResolvedValue({ data: { id: newGameId, code: 'ABCD' }, error: null }) }; // new game insert return
                    },
                    insert: gameInsertMock,
                    delete: jest.fn().mockReturnThis(),
                    eq: jest.fn().mockReturnThis()
                };
            }
            if (table === 'players') return playersChain;
        });


        const req = new NextRequest(`http://localhost/api/game/${gameId}/play-again`, { method: 'POST' });
        const res = await POST(req, { params: Promise.resolve({ gameId }) });
        
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.new_game_code).toBe('ABCD');
        expect(data.new_game_id).toBe(newGameId);

        // Verify inserts
        expect(gameInsertMock).toHaveBeenCalledWith({
            code: 'ABCD',
            host_id: userId,
            difficulty: 'hard',
            status: 'waiting'
        });

        expect(playersChain.insert).toHaveBeenCalledWith([
            { game_id: newGameId, user_id: userId, is_ready: false },
            { game_id: newGameId, user_id: opponentId, is_ready: false }
        ]);
    });
});
