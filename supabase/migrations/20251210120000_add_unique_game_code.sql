ALTER TABLE public.game_sessions 
ADD CONSTRAINT game_sessions_code_key UNIQUE (code);
