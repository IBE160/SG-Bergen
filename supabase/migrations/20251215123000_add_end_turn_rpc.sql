-- Secure RPC to allow any player in the game to end their turn
CREATE OR REPLACE FUNCTION end_turn(p_game_id UUID, p_next_player_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with privileges of the function creator (admin), bypassing RLS
AS $$
DECLARE
    v_is_player BOOLEAN;
BEGIN
    -- Verify the caller is actually a player in this game
    SELECT EXISTS (
        SELECT 1 FROM public.players 
        WHERE game_id = p_game_id 
        AND user_id = auth.uid()
    ) INTO v_is_player;

    IF NOT v_is_player THEN
        RAISE EXCEPTION 'Not authorized to end turn in this game';
    END IF;

    -- Update the game session
    UPDATE public.game_sessions
    SET current_turn_player_id = p_next_player_id
    WHERE id = p_game_id;
END;
$$;
