/**
 * Database Schema Reference
 * 
 * This file mirrors the SQL schema defined in db/schema.sql.
 * Ideally, we rely on the generated types in db/types.ts, 
 * but this file serves as a reference for the table structure.
 */

export const schemaSql = `
-- Create Enums
create type public.game_status as enum ('waiting', 'active', 'finished');
create type public.difficulty_level as enum ('Easy', 'Medium', 'Hard');

-- Create game_sessions table
create table public.game_sessions (
  id uuid not null default gen_random_uuid(),
  code text not null,
  status public.game_status not null default 'waiting',
  host_id uuid not null references auth.users(id),
  difficulty public.difficulty_level not null default 'Medium',
  winner_id uuid references auth.users(id),
  created_at timestamp with time zone not null default now(),
  constraint game_sessions_pkey primary key (id),
  constraint game_sessions_code_key unique (code)
);

-- Create players table
create table public.players (
  id uuid not null default gen_random_uuid(),
  game_id uuid not null references public.game_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id),
  character_id integer,
  is_ready boolean not null default false,
  created_at timestamp with time zone not null default now(),
  constraint players_pkey primary key (id),
  constraint players_game_user_unique unique (game_id, user_id)
);

-- Create moves table
create table public.moves (
  id uuid not null default gen_random_uuid(),
  game_id uuid not null references public.game_sessions(id) on delete cascade,
  player_id uuid not null references public.players(id),
  action_type public.action_type not null,
  details jsonb,
  created_at timestamp with time zone not null default now(),
  constraint moves_pkey primary key (id)
);

-- Enable RLS
alter table public.game_sessions enable row level security;
alter table public.players enable row level security;
alter table public.moves enable row level security;

-- Create permissive policies (MVP)
create policy "Enable all access for game_sessions" on public.game_sessions for all using (true) with check (true);
create policy "Enable all access for players" on public.players for all using (true) with check (true);
create policy "Enable all access for moves" on public.moves for all using (true) with check (true);
`;
