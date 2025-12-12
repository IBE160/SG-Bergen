-- Add phase column to game_sessions
alter table public.game_sessions 
add column if not exists phase text default 'lobby' not null;

-- Update trigger to use phase logic
create or replace function public.handle_game_start()
returns trigger as $$
declare
  total_players int;
  ready_players int;
  current_phase text;
  first_turn_player_id uuid;
begin
  -- Only proceed if is_ready was changed to true
  if new.is_ready = true and (old.is_ready = false or old.is_ready is null) then
    
    -- Get current phase
    select phase into current_phase from public.game_sessions where id = new.game_id;

    -- Count players
    select count(*) into total_players from public.players where game_id = new.game_id;
    select count(*) into ready_players from public.players where game_id = new.game_id and is_ready = true;

    -- Phase 1: Lobby -> Selection
    if current_phase = 'lobby' and total_players = 2 and ready_players = 2 then
      -- Update phase
      update public.game_sessions 
      set phase = 'selection' 
      where id = new.game_id;

      -- Reset ready status for next phase
      update public.players 
      set is_ready = false 
      where game_id = new.game_id;
    end if;

    -- Phase 2: Selection -> Game (Active)
    if current_phase = 'selection' and total_players = 2 and ready_players = 2 then
      
      -- Pick start player
      select id into first_turn_player_id from public.players where game_id = new.game_id order by random() limit 1;
      
      -- Set Active and Game phase
      update public.game_sessions 
      set 
        status = 'active', 
        current_turn_player_id = first_turn_player_id,
        phase = 'game'
      where id = new.game_id;
      
    end if;

  end if;
  return new;
end;
$$ language plpgsql security definer;
