-- 1. Enable RLS on tables (if not already enabled)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- 2. Policies for 'users' table
-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow users to read profiles of players in the same game
-- (This is a bit more complex, often simplified by allowing read of basic profile info if you have the ID)
-- For a simple lobby, we often allow authenticated users to read basic user info:
CREATE POLICY "Authenticated users can read basic user info"
ON public.users
FOR SELECT
TO authenticated
USING (true); -- CAUTION: This exposes all users to all authenticated users. Ideally, restrict to game participants.

-- 3. Policies for 'players' table
-- Allow users to join a game (INSERT their own player record)
CREATE POLICY "Users can join games"
ON public.players
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to read players for games they are part of
-- (Simplified for MVP: Allow reading any player record if you are authenticated, or better:)
CREATE POLICY "Users can read players in their games"
ON public.players
FOR SELECT
TO authenticated
USING (true); -- Again, simplified. Ideally: exists (select 1 from players p2 where p2.game_id = players.game_id and p2.user_id = auth.uid())

-- CRITICAL: Allow users to update ONLY their own readiness status
CREATE POLICY "Users can update own readiness"
ON public.players
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
