-- Refine RLS and introduce player_secrets for security

-- 1. Create player_secrets table
create table if not exists public.player_secrets (
  player_id uuid not null references public.players(id) on delete cascade,
  character_id integer,
  created_at timestamp with time zone not null default now(),
  constraint player_secrets_pkey primary key (player_id)
);

alter table public.player_secrets enable row level security;

-- 1b. Add public flag to players
alter table public.players add column if not exists has_selected_character boolean not null default false;


-- 2. Policies for player_secrets
-- SELECT: Only owner
create policy "Allow users to view their own secret"
on public.player_secrets for select
using (
  auth.uid() = (select user_id from public.players where id = player_secrets.player_id)
);

-- INSERT: Only owner
create policy "Allow users to insert their own secret"
on public.player_secrets for insert
with check (
   auth.uid() = (select user_id from public.players where id = player_secrets.player_id)
);

-- UPDATE: Only owner
-- Trigger to protect character_id overwrites (Only allow if currently NULL)
create or replace function public.protect_secret_selection()
returns trigger as $$
begin
  if new.character_id is distinct from old.character_id then
    if old.character_id is not null then
       raise exception 'Cannot change character selection once made.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists protect_secret_selection_trigger on public.player_secrets;
create trigger protect_secret_selection_trigger
before update on public.player_secrets
for each row execute function public.protect_secret_selection();

create policy "Allow users to update their own secret"
on public.player_secrets for update
using (
   auth.uid() = (select user_id from public.players where id = player_secrets.player_id)
)
with check (
   auth.uid() = (select user_id from public.players where id = player_secrets.player_id)
);

-- Trigger to update players.has_selected_character when secret is set
create or replace function public.update_player_selection_status()
returns trigger as $$
begin
  if new.character_id is not null then
    update public.players set has_selected_character = true where id = new.player_id;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_player_selection_status_trigger on public.player_secrets;
create trigger update_player_selection_status_trigger
after insert or update on public.player_secrets
for each row execute function public.update_player_selection_status();


-- 3. Policies for players (Public Game State)
-- Drop old policies
drop policy if exists "Enable all access for players" on public.players;
drop policy if exists "Allow auth users to select players in their game" on public.players;
drop policy if exists "Allow auth users to update their own readiness" on public.players;
drop policy if exists "Allow auth users to insert a player record for themselves" on public.players;
drop policy if exists "Allow users to view their own player record" on public.players;
drop policy if exists "Allow users to update their own player record" on public.players;
drop policy if exists "Allow users to join game" on public.players;
drop policy if exists "Allow users to view players in their game" on public.players;

-- SELECT: Allow everyone in the game to see everyone else (for Lobby/Readiness/Game Status)
create policy "Allow users to view players in their game"
on public.players for select
using (
  auth.uid() in (
    select user_id from public.players p where p.game_id = players.game_id
  )
);

-- INSERT: Join game
create policy "Allow users to join game"
on public.players for insert
with check (auth.uid() = user_id);

-- UPDATE: Readiness (and potentially other public flags)
create policy "Allow users to update own player"
on public.players for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


-- 4. Game Sessions Policies (Ensure they are correct)
drop policy if exists "Enable all access for game_sessions" on public.game_sessions;
drop policy if exists "Allow auth users to select games they are in" on public.game_sessions;
drop policy if exists "Allow host to update game status" on public.game_sessions;
drop policy if exists "Allow authenticated users to create game sessions" on public.game_sessions;

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

create policy "Allow authenticated users to create game sessions"
on public.game_sessions for insert
with check (auth.role() = 'authenticated');