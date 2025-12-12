do $$
begin
  -- Ensure players table is in publication
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'players') then
    alter publication supabase_realtime add table public.players;
  end if;

  -- Ensure game_sessions table is in publication
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'game_sessions') then
    alter publication supabase_realtime add table public.game_sessions;
  end if;
end;
$$;
