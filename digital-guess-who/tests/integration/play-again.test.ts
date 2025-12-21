/**
 * @jest-environment node
 */
import { POST } from '@/app/api/game/[gameId]/play-again/route';
import { NextRequest } from 'next/server';

// Mock Supabase User Client (Read/Auth)
const mockSupabase = {
  auth: {
    getUser: jest.fn()
  },
  from: jest.fn()
};

// Mock Supabase Admin Client (Write)
const mockSupabaseAdmin = {
  from: jest.fn()
};

// Mock @/lib/supabase/server
jest.mock('@/lib/supabase/server', () => ({
  createClient: () => Promise.resolve(mockSupabase)
}));

// Mock @supabase/supabase-js
jest.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabaseAdmin
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

        mockSupabase.from.mockReturnValue(gameChain);

        const req = new NextRequest('http://localhost/api/game/1/play-again', { method: 'POST' });
        const res = await POST(req, { params: Promise.resolve({ gameId: '1' }) });
        
        expect(res.status).toBe(403);
    });

    it('creates new game and adds players if valid', async () => {
        const userId = 'user1';
        const opponentId = 'user2';
        const gameId = 'game1';
        const newGameId = 'new-game-id';

        // 1. Auth & Reads (User Client)
        mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: userId } }, error: null });

        // Setup reads on user client
        mockSupabase.from.mockImplementation((table) => {
            if (table === 'game_sessions') {
                return {
                    select: jest.fn().mockReturnThis(),
                    eq: jest.fn().mockReturnThis(),
                    single: jest.fn().mockResolvedValue({ 
                        data: { status: 'finished', difficulty: 'hard', host_id: 'old-host' }, 
                        error: null 
                    })
                };
            }
            if (table === 'players') {
                return {
                    select: jest.fn().mockReturnThis(),
                    eq: jest.fn().mockResolvedValue({ 
                        data: [
                            { id: 'p1', user_id: userId },
                            { id: 'p2', user_id: opponentId }
                        ], 
                        error: null 
                    })
                };
            }
            return { select: () => ({ eq: () => ({ single: () => ({}) }) }) };
        });

        // 2. Writes (Admin Client)
        const insertGameChain = {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ 
                data: { id: newGameId, code: 'ABCD' }, 
                error: null 
            })
        };

        const insertPlayersChain = {
            insert: jest.fn().mockResolvedValue({ error: null })
        };
        
        // Mock cleanup delete
        const deleteGameChain = {
            delete: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis()
        };

        // Mock channel broadcast
        const channelMock = {
            subscribe: jest.fn((callback) => {
                callback('SUBSCRIBED');
                return Promise.resolve();
            }),
            send: jest.fn().mockResolvedValue({}),
            unsubscribe: jest.fn()
        };

        mockSupabaseAdmin.channel = jest.fn().mockReturnValue(channelMock);
        mockSupabaseAdmin.removeChannel = jest.fn();

        mockSupabaseAdmin.from.mockImplementation((table) => {
            if (table === 'game_sessions') {
                return {
                    ...insertGameChain,
                    ...deleteGameChain
                };
            }
            if (table === 'players') {
                return insertPlayersChain;
            }
        });


        const req = new NextRequest(`http://localhost/api/game/${gameId}/play-again`, { method: 'POST' });
        const res = await POST(req, { params: Promise.resolve({ gameId }) });
        
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.new_game_code).toBe('ABCD');
        expect(data.new_game_id).toBe(newGameId);

        // Verify writes on ADMIN client
        expect(mockSupabaseAdmin.from).toHaveBeenCalledWith('game_sessions');
        expect(insertGameChain.insert).toHaveBeenCalledWith({
            code: 'ABCD',
            host_id: userId,
            difficulty: 'hard',
            status: 'waiting',
            phase: 'lobby'
        });

        expect(mockSupabaseAdmin.from).toHaveBeenCalledWith('players');
        expect(insertPlayersChain.insert).toHaveBeenCalledWith([
            { game_id: newGameId, user_id: userId, is_ready: false },
            { game_id: newGameId, user_id: opponentId, is_ready: false }
        ]);
        
        // Verify broadcast
        expect(mockSupabaseAdmin.channel).toHaveBeenCalledWith(`game-play:${gameId}`);
        expect(channelMock.subscribe).toHaveBeenCalled();
        expect(channelMock.send).toHaveBeenCalledWith({
            type: 'broadcast',
            event: 'play-again',
            payload: { newCode: 'ABCD' }
        });
        expect(mockSupabaseAdmin.removeChannel).toHaveBeenCalledWith(channelMock);
    });
});