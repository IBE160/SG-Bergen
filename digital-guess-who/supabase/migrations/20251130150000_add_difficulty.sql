-- Add difficulty enum and column to game_sessions

-- Create Enum if it doesn't exist (safe check logic is complex in pure SQL without plpgsql, so we'll just try to create it and ignore error if it exists, or better, assume it's needed)
-- However, for a migration file, we can just create it.
create type public.difficulty_level as enum ('Easy', 'Medium', 'Hard');

-- Add difficulty column to game_sessions
alter table public.game_sessions 
add column difficulty public.difficulty_level not null default 'Medium';
