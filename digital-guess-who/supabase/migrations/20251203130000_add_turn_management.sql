-- Add current_turn_player_id to game_sessions
-- referencing auth.users because the application logic tracks turns by User ID.

alter table public.game_sessions 
add column current_turn_player_id uuid references auth.users(id);
