-- supabase/migrations/20251214150000_add_turn_management.sql

-- Function to get the next player in a game session
CREATE OR REPLACE FUNCTION get_next_turn_player(p_game_id UUID, p_current_player_id UUID)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    next_player UUID;
BEGIN
    SELECT user_id INTO next_player
    FROM public.players
    WHERE game_id = p_game_id AND user_id != p_current_player_id
    LIMIT 1; -- Assuming only two players for now, or the next player is simply the other one

    RETURN next_player;
END;
$$;

-- Trigger to update current_turn_player_id after a turn-ending move
CREATE OR REPLACE FUNCTION handle_turn_end()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_next_player_id UUID;
    v_current_turn_player_id UUID;
BEGIN
    -- Only act on 'answer' or 'guess' actions for now as these signify a turn completion
    IF NEW.action_type = 'answer' OR NEW.action_type = 'guess' THEN
        -- Get the current turn player from game_sessions for this game
        SELECT current_turn_player_id INTO v_current_turn_player_id
        FROM public.game_sessions
        WHERE id = NEW.game_id;

        -- Determine the next player
        SELECT get_next_turn_player(NEW.game_id, v_current_turn_player_id) INTO v_next_player_id;

        -- Update the game session with the next player's turn
        UPDATE public.game_sessions
        SET current_turn_player_id = v_next_player_id
        WHERE id = NEW.game_id;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER turn_end_trigger
AFTER INSERT ON public.moves
FOR EACH ROW EXECUTE FUNCTION handle_turn_end();
