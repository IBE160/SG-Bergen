/**
 * @jest-environment node
 */
import { NextRequest, NextResponse } from 'next/server';
import { POST } from '@/app/api/game/create/route';
import { generateGameCode } from '@/lib/utils';
import { cookies } from 'next/headers';

// Mock Supabase client
const mockSupabase = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(() => mockSupabase), // Allows chaining .from().insert()
  insert: jest.fn(() => mockSupabase),
  select: jest.fn(() => mockSupabase),
  delete: jest.fn(() => mockSupabase),
  eq: jest.fn(() => mockSupabase),
  single: jest.fn(),
};

// Mock the createClient function from @supabase/ssr
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => mockSupabase),
}));

// Mock next/headers for cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(() => ({ value: 'mock-cookie-value' })),
    set: jest.fn(),
  })),
}));

// Mock '@/lib/utils' to control generateGameCode for consistent testing
jest.mock('@/lib/utils', () => ({
  ...jest.requireActual('@/lib/utils'), // Keep other actual utils
  generateGameCode: jest.fn(),
}));


describe('POST /api/game/create', () => {
  const mockUser = { id: 'test-user-id', email: 'test@example.com' };
  const mockGameId = 'test-game-id';
  const mockGameCode = 'TEST';

  beforeEach(() => {
    jest.clearAllMocks();
    (mockSupabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: mockUser } });
    (generateGameCode as jest.Mock).mockReturnValue(mockGameCode); // Control generated code

    mockSupabase.single.mockResolvedValueOnce({
      data: {
        id: mockGameId,
        code: mockGameCode,
        host_id: mockUser.id,
        status: 'waiting',
        difficulty: 'easy',
      },
      error: null,
    }).mockResolvedValueOnce({
      data: {
        id: 'player-id',
        game_id: mockGameId,
        user_id: mockUser.id,
        is_ready: false,
      },
      error: null,
    });
  });

  it('should create a game session and player record for an authenticated user', async () => {
    const mockRequest = new NextRequest('http://localhost/api/game/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty: 'easy' }),
    });

    const response = await POST(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(201);
    expect(responseBody).toEqual({ gameId: mockGameId, code: mockGameCode });

    // Verify Supabase calls
    expect(mockSupabase.from).toHaveBeenCalledWith('game_sessions');
    expect(mockSupabase.insert).toHaveBeenCalledWith({
      code: mockGameCode,
      host_id: mockUser.id,
      status: 'waiting',
      difficulty: 'easy',
    });
    expect(mockSupabase.from).toHaveBeenCalledWith('players');
    expect(mockSupabase.insert).toHaveBeenCalledWith({
      game_id: mockGameId,
      user_id: mockUser.id,
      is_ready: false,
    });
  });

  it('should return 401 if user is not authenticated', async () => {
    (mockSupabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: null } });

    const mockRequest = new NextRequest('http://localhost/api/game/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty: 'easy' }),
    });

    const response = await POST(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(401);
    expect(responseBody).toEqual({ error: 'Unauthorized' });
  });

  it('should return 400 if difficulty is invalid', async () => {
    const mockRequest = new NextRequest('http://localhost/api/game/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty: 'invalid-difficulty' }),
    });

    const response = await POST(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody).toEqual({ error: 'Invalid difficulty' });
  });

  it('should return 500 if game session creation fails', async () => {
    mockSupabase.single.mockReset(); // Clear beforeEach mocks
    mockSupabase.single.mockResolvedValueOnce({
      data: null,
      error: { message: 'DB error', code: '500' },
    });

    const mockRequest = new NextRequest('http://localhost/api/game/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty: 'easy' }),
    });

    const response = await POST(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody).toEqual({ error: 'DB error' });
  });

  it('should return 500 if player record creation fails', async () => {
    mockSupabase.single.mockReset(); // Clear beforeEach mocks
    mockSupabase.single.mockResolvedValueOnce({
      data: {
        id: mockGameId,
        code: mockGameCode,
        host_id: mockUser.id,
        status: 'waiting',
        difficulty: 'easy',
      },
      error: null,
    }).mockResolvedValueOnce({
      data: null,
      error: { message: 'Player DB error', code: '500' },
    });

    const mockRequest = new NextRequest('http://localhost/api/game/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty: 'easy' }),
    });

    const response = await POST(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody).toEqual({ error: 'Player DB error' });

    // Verify cleanup: Should delete the created game session
    expect(mockSupabase.from).toHaveBeenCalledWith('game_sessions');
    expect(mockSupabase.delete).toHaveBeenCalled();
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', mockGameId);
  });
});
