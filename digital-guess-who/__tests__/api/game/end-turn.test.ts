import { POST } from '../../../app/api/game/[game-id]/end-turn/route';
import { createClient } from '../../../lib/supabase/server';
import { updateCurrentTurnPlayer } from '../../../lib/services/game-session';
import { NextRequest } from 'next/server';

// Mock the Supabase server client
jest.mock('../../../lib/supabase/server', () => ({
  createClient: jest.fn(),
}));

// Mock the game-session service
jest.mock('../../../lib/services/game-session', () => ({
  updateCurrentTurnPlayer: jest.fn(),
}));

describe('POST /api/game/[game-id]/end-turn', () => {
  const MOCK_USER_ID = 'test-user-id-123';
  const MOCK_GAME_ID = 'test-game-id-456';
  const mockSupabaseClient = {
    auth: {
      getUser: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockResolvedValue(mockSupabaseClient);
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: MOCK_USER_ID } },
      error: null,
    });
  });

  it('should return 401 if user is not authenticated', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const mockRequest = {} as NextRequest;
    const response = await POST(mockRequest, { params: { 'game-id': 'some-game-id' } });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'Unauthorized' });
  });

  it('should call updateCurrentTurnPlayer and return success message', async () => {
    const mockRequest = {} as NextRequest;
    const response = await POST(mockRequest, { params: { 'game-id': MOCK_GAME_ID } });

    expect(updateCurrentTurnPlayer).toHaveBeenCalledWith(MOCK_GAME_ID, MOCK_USER_ID);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: `Turn for game ${MOCK_GAME_ID} updated successfully.` });
  });

  it('should return 500 if updateCurrentTurnPlayer throws an error', async () => {
    const errorMessage = 'Failed to update turn in service';
    (updateCurrentTurnPlayer as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const mockRequest = {} as NextRequest;
    const response = await POST(mockRequest, { params: { 'game-id': MOCK_GAME_ID } });

    expect(updateCurrentTurnPlayer).toHaveBeenCalledWith(MOCK_GAME_ID, MOCK_USER_ID);
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: errorMessage });
  });
});
