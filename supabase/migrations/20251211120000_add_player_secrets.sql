-- Create player_secrets table for secure character selection
create table if not exists public.player_secrets (
  id uuid default gen_random_uuid() primary key,
  player_id uuid references public.players(id) not null unique,
  character_id integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on player_secrets
alter table public.player_secrets enable row level security;

-- Policy: Users can only select their own secret
create policy "Users can select own secret"
  on public.player_secrets for select
  using (
    exists (
      select 1 from public.players
      where players.id = player_secrets.player_id
      and players.user_id = auth.uid()
    )
  );

-- Policy: Users can insert their own secret
create policy "Users can insert own secret"
  on public.player_secrets for insert
  with check (
    exists (
      select 1 from public.players
      where players.id = player_secrets.player_id
      and players.user_id = auth.uid()
    )
  );

-- Policy: Users can update their own secret
create policy "Users can update own secret"
  on public.player_secrets for update
  using (
    exists (
      select 1 from public.players
      where players.id = player_secrets.player_id
      and players.user_id = auth.uid()
    )
  );

-- Tighten players table policies
-- First drop the permissive one if it exists
drop policy if exists "Enable all access for all users" on public.players;

-- Allow reading players (needed for lobby visibility)
create policy "Enable read access for all users"
  on public.players for select
  using (true);

-- Allow inserting own player
create policy "Users can insert themselves"
  on public.players for insert
  with check (auth.uid() = user_id);

-- Allow updating own player (e.g. is_ready)
create policy "Users can update own player"
  on public.players for update
  using (auth.uid() = user_id);
