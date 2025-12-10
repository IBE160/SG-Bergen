-- Fix RLS Policies

-- 1. Users Table
DROP POLICY IF EXISTS "Enable all access for all users" ON public.users;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

CREATE POLICY "Public profiles are viewable by everyone" ON public.users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 2. Game Sessions Table
DROP POLICY IF EXISTS "Enable all access for all users" ON public.game_sessions;
DROP POLICY IF EXISTS "Games are viewable by everyone" ON public.game_sessions;
DROP POLICY IF EXISTS "Authenticated users can create games" ON public.game_sessions;
DROP POLICY IF EXISTS "Hosts can update their games" ON public.game_sessions;
DROP POLICY IF EXISTS "Hosts can delete their games" ON public.game_sessions;

CREATE POLICY "Games are viewable by everyone" ON public.game_sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create games" ON public.game_sessions FOR INSERT TO authenticated WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Hosts can update their games" ON public.game_sessions FOR UPDATE TO authenticated USING (auth.uid() = host_id);
CREATE POLICY "Hosts can delete their games" ON public.game_sessions FOR DELETE TO authenticated USING (auth.uid() = host_id);

-- 3. Players Table
DROP POLICY IF EXISTS "Enable all access for all users" ON public.players;
DROP POLICY IF EXISTS "Players are viewable by authenticated users" ON public.players;
DROP POLICY IF EXISTS "Users can join games" ON public.players;
DROP POLICY IF EXISTS "Users can update own player status" ON public.players;

-- SELECT: Open to authenticated for now (Lobby/Counts), restricted later via View
CREATE POLICY "Players are viewable by authenticated users" ON public.players FOR SELECT TO authenticated USING (true);
-- INSERT: Only join as yourself
CREATE POLICY "Users can join games" ON public.players FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
-- UPDATE: Only update yourself (e.g. is_ready)
CREATE POLICY "Users can update own player status" ON public.players FOR UPDATE TO authenticated USING (auth.uid() = user_id);
