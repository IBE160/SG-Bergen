 -- Create the new enum type for difficulty
        CREATE TYPE public.game_difficulty AS ENUM ('easy', 'medium', 'hard');
    
        -- Add the 'difficulty' column to the 'game_sessions' table
       ALTER TABLE public.game_sessions
      ADD COLUMN difficulty public.game_difficulty;