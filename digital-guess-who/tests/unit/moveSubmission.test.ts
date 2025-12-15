import { submitQuestion, submitAnswer } from '../../lib/game-logic';

// Mock Supabase
const mockInsert = jest.fn();
const mockSelect = jest.fn();
const mockFrom = jest.fn(() => ({
    insert: mockInsert.mockReturnValue({
        select: mockSelect.mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: { id: 'move-123' }, error: null })
        })
    })
}));

jest.mock('@/lib/supabase/client', () => ({
    createClient: () => ({
        from: mockFrom
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
});
