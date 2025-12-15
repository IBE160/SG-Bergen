CREATE OR REPLACE FUNCTION handle_turn_end()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_next_player_id UUID;
    v_current_turn_player_id UUID;
BEGIN
    -- Only act on 'guess' actions for now as these signify a turn completion related to the game's end condition
    IF NEW.action_type = 'guess' THEN -- Removed 'answer' from here
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
