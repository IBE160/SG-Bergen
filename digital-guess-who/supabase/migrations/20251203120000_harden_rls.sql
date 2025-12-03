-- Drop existing permissive policies
drop policy if exists "Enable all access for game_sessions" on public.game_sessions;
drop policy if exists "Enable all access for players" on public.players;
drop policy if exists "Enable all access for moves" on public.moves;

-- RLS for public.game_sessions
-- Allow authenticated users to view game sessions they are part of (host or player)
create policy "Allow participants to view game sessions"
on public.game_sessions for select
to authenticated
using (
    (host_id = auth.uid()) OR
    (id IN (SELECT game_id FROM public.players WHERE user_id = auth.uid()))
);

-- Allow authenticated users to create game sessions where they are the host
create policy "Allow host to create game sessions"
on public.game_sessions for insert
to authenticated
with check (host_id = auth.uid());

-- Allow host to update game sessions
create policy "Allow host to update game sessions"
on public.game_sessions for update
to authenticated
using (host_id = auth.uid());

-- Allow host to delete game sessions
create policy "Allow host to delete game sessions"
on public.game_sessions for delete
to authenticated
using (host_id = auth.uid());


-- RLS for public.players
-- Allow participants to view players in games they belong to
create policy "Allow participants to view players"
on public.players for select
to authenticated
using (
    game_id IN (
        SELECT game_id FROM public.players WHERE user_id = auth.uid()
    )
);

-- Allow authenticated users to join a game (insert player record for themselves)
create policy "Allow players to join games"
on public.players for insert
to authenticated
with check (user_id = auth.uid());

-- Allow authenticated users to update their own player status (e.g., is_ready)
create policy "Allow players to update their own status"
on public.players for update
to authenticated
using (user_id = auth.uid());

-- Allow authenticated users to leave a game (delete their own player record)
create policy "Allow players to leave games"
on public.players for delete
to authenticated
using (user_id = auth.uid());


-- RLS for public.moves
-- Allow participants to view moves for games they are part of
create policy "Allow participants to view moves"
on public.moves for select
to authenticated
using (
    game_id IN (
        SELECT game_id FROM public.players WHERE user_id = auth.uid()
    )
);

-- Allow authenticated users to insert moves for games they are part of, as their own player
create policy "Allow players to insert their own moves"
on public.moves for insert
to authenticated
with check (
    player_id IN (SELECT id FROM public.players WHERE user_id = auth.uid() AND game_id = public.moves.game_id)
);
