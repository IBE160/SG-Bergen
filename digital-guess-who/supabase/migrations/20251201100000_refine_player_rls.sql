-- Refine RLS policies for players and game_sessions tables

-- Drop existing permissive policies
drop policy "Enable all access for players" on public.players;
drop policy "Enable all access for game_sessions" on public.game_sessions;


-- Policies for players table
create policy "Allow auth users to select players in their game"
on public.players for select
using (
  auth.uid() in (
    select user_id from public.players p where p.game_id = players.game_id
  )
);

create policy "Allow auth users to update their own readiness"
on public.players for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Allow auth users to insert a player record for themselves"
on public.players for insert
with check (auth.uid() = user_id);


-- Policies for game_sessions table
create policy "Allow auth users to select games they are in"
on public.game_sessions for select
using (
  auth.uid() in (
    select user_id from public.players p where p.game_id = game_sessions.id
  )
);

create policy "Allow host to update game status"
on public.game_sessions for update
using (auth.uid() = host_id)
with check (auth.uid() = host_id);

-- Keep insert open for game_sessions as it's handled by a trusted API route.
create policy "Allow authenticated users to create game sessions"
on public.game_sessions for insert
with check (auth.role() = 'authenticated');
