import { submitQuestion, submitAnswer, endPlayerTurn } from '../../lib/game-logic';

// Mock Supabase
const mockInsert = jest.fn();
const mockSelect = jest.fn();
const mockEq = jest.fn();
const mockRpc = jest.fn();

const mockFrom = jest.fn((table) => {
    if (table === 'players') {
        return {
            select: jest.fn(() => ({
                eq: jest.fn().mockResolvedValue({ 
                    data: [{ id: 'player-1' }, { id: 'player-2' }], 
                    error: null 
                })
            }))
        };
    }
    return {
        insert: mockInsert.mockReturnValue({
            select: mockSelect.mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: { id: 'move-123' }, error: null })
            })
        }),
        update: jest.fn(() => ({
            eq: jest.fn().mockResolvedValue({ error: null })
        }))
    };
});

jest.mock('@/lib/supabase/client', () => ({
    createClient: () => ({
        from: mockFrom,
        rpc: mockRpc.mockResolvedValue({ error: null })
    })
}));

describe('Move Submission Logic', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('submits a question correctly', async () => {
        await submitQuestion('game-1', 'player-1', 'Is it a male?');
        expect(mockFrom).toHaveBeenCalledWith('moves');
        expect(mockInsert).toHaveBeenCalledWith({
            game_id: 'game-1',
            player_id: 'player-1',
            action_type: 'question',
            details: { question_text: 'Is it a male?' }
        });
    });

    it('submits an answer correctly', async () => {
        await submitAnswer('game-1', 'player-2', 'Yes', 'move-question-1');
        expect(mockFrom).toHaveBeenCalledWith('moves');
        expect(mockInsert).toHaveBeenCalledWith({
            game_id: 'game-1',
            player_id: 'player-2',
            action_type: 'answer',
            details: { answer: 'Yes', related_question_id: 'move-question-1' }
        });
    });

    it('ends turn using secure RPC', async () => {
        await endPlayerTurn('game-1', 'player-1');
        // Should fetch players first
        expect(mockFrom).toHaveBeenCalledWith('players');
        // Should call RPC with correct params (player-2 is the opponent)
        expect(mockRpc).toHaveBeenCalledWith('end_turn', {
            p_game_id: 'game-1',
            p_next_player_id: 'player-2'
        });
    });
});
