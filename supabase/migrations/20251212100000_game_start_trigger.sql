-- Function to handle game start logic
create or replace function public.handle_game_start()
returns trigger as $$
declare
  total_players int;
  ready_players int;
  first_turn_player_id uuid;
begin
  -- Only proceed if is_ready was changed to true
  if new.is_ready = true and (old.is_ready = false or old.is_ready is null) then
    
    -- Count players in the session
    select count(*) into total_players
    from public.players
    where game_id = new.game_id;

    -- Count ready players
    select count(*) into ready_players
    from public.players
    where game_id = new.game_id
    and is_ready = true;

    -- If we have 2 players and both are ready
    if total_players = 2 and ready_players = 2 then
      
      -- Pick a random player for first turn
      select id into first_turn_player_id
      from public.players
      where game_id = new.game_id
      order by random()
      limit 1;

      -- Update game session
      update public.game_sessions
      set 
        status = 'active', -- Corrected from 'playing' to 'active'
        current_turn_player_id = first_turn_player_id
      where id = new.game_id;
      
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger
drop trigger if exists on_player_ready_start_game on public.players;
create trigger on_player_ready_start_game
after update on public.players
for each row
execute function public.handle_game_start();