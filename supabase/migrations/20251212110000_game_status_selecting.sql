-- Add 'selecting' to game_status enum
ALTER TYPE public.game_status ADD VALUE IF NOT EXISTS 'selecting';

-- Update Trigger Function
create or replace function public.handle_game_start()
returns trigger as $$
declare
  total_players int;
  ready_players int;
  current_status public.game_status;
  first_turn_player_id uuid;
begin
  -- Only proceed if is_ready was changed to true
  if new.is_ready = true and (old.is_ready = false or old.is_ready is null) then
    
    -- Get current game status
    select status into current_status from public.game_sessions where id = new.game_id;

    -- Count players in the session
    select count(*) into total_players
    from public.players
    where game_id = new.game_id;

    -- Count ready players
    select count(*) into ready_players
    from public.players
    where game_id = new.game_id
    and is_ready = true;

    -- PHASE 1: Lobby -> Selecting
    if current_status = 'waiting' and total_players = 2 and ready_players = 2 then
      -- Update status to selecting
      update public.game_sessions
      set status = 'selecting'
      where id = new.game_id;

      -- Reset is_ready to false for all players (to prepare for Phase 2)
      update public.players
      set is_ready = false
      where game_id = new.game_id;
    end if;

    -- PHASE 2: Selecting -> Active
    if current_status = 'selecting' and total_players = 2 and ready_players = 2 then
      
      -- Pick a random player for first turn
      select id into first_turn_player_id
      from public.players
      where game_id = new.game_id
      order by random()
      limit 1;

      -- Update game session
      update public.game_sessions
      set 
        status = 'active',
        current_turn_player_id = first_turn_player_id
      where id = new.game_id;
      
    end if;

  end if;
  return new;
end;
$$ language plpgsql security definer;
