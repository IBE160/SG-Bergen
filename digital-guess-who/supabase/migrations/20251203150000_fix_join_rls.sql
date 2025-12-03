-- Allow authenticated users to view game sessions if they know the code and it's waiting
create policy "Allow reading waiting sessions by code"
on public.game_sessions for select
to authenticated
using (
    status = 'waiting'
);

-- Allow authenticated users to view players of waiting games (to check count/names before joining)
create policy "Allow reading players of waiting games"
on public.players for select
to authenticated
using (
    exists (
        select 1 from public.game_sessions
        where id = players.game_id
        and status = 'waiting'
    )
);
