-- Fix function to get the next player using player_id instead of user_id
CREATE OR REPLACE FUNCTION get_next_turn_player(p_game_id UUID, p_current_player_id UUID)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    next_player UUID;
BEGIN
    SELECT id INTO next_player
    FROM public.players
    WHERE game_id = p_game_id AND id != p_current_player_id
    LIMIT 1;

    RETURN next_player;
END;
$$;
