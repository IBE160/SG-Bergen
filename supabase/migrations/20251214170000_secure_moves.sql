-- Secure moves table

-- Drop existing permissive policy
DROP POLICY IF EXISTS "Enable all access for all users" ON public.moves;

-- Create restrictive policy for INSERT
CREATE POLICY "Secure move insertion" ON public.moves
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.players p
    WHERE p.id = player_id
    AND p.user_id = auth.uid()
  ) AND
  EXISTS (
    SELECT 1 FROM public.game_sessions gs
    WHERE gs.id = game_id
    AND (
      -- Questions and Guesses only by active player
      (action_type IN ('question', 'guess') AND gs.current_turn_player_id = player_id)
      OR
      -- Answers only by opponent (non-active player in the game)
      (action_type = 'answer' AND gs.current_turn_player_id != player_id)
      OR
      -- Flips can be done by anyone
      (action_type = 'flip')
    )
  )
);

-- Re-enable SELECT for game participants
CREATE POLICY "Allow reading moves for game participants" ON public.moves
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.players p
    WHERE p.game_id = game_id
    AND p.user_id = auth.uid()
  )
);
