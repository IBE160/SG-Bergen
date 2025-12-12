export const schema = `
-- Create enums
create type public.game_status as enum ('waiting', 'active', 'finished');
create type public.game_difficulty as enum ('easy', 'medium', 'hard');
create type public.action_type as enum ('question', 'answer', 'guess', 'flip');

-- Create tables
create table public.users (
  id uuid references auth.users not null primary key,
  username text,
  avatar_url text,
  email text
);

create table public.game_sessions (
  id uuid default gen_random_uuid() primary key,
  code text not null,
  status public.game_status default 'waiting'::public.game_status not null,
  phase text default 'lobby' not null,
  host_id uuid references public.users(id) not null,
  winner_id uuid references public.users(id),
  difficulty public.game_difficulty,
  current_turn_player_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.players (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  game_id uuid references public.game_sessions(id) not null,
  character_id integer, -- Deprecated in favor of player_secrets
  is_ready boolean default false not null
);

create table public.player_secrets (
  id uuid default gen_random_uuid() primary key,
  player_id uuid references public.players(id) not null unique,
  character_id integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.moves (
  id uuid default gen_random_uuid() primary key,
  game_id uuid references public.game_sessions(id) not null,
  player_id uuid references public.players(id) not null,
  action_type public.action_type not null,
  details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;
alter table public.game_sessions enable row level security;
alter table public.players enable row level security;
alter table public.player_secrets enable row level security;
alter table public.moves enable row level security;

-- Policies (Refer to migration files for exact policies)
`;