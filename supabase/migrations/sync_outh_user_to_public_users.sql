-- Creates a public.users entry for a new user in auth.users
    create function public.handle_new_user()
    returns trigger
    language plpgsql
    security definer set search_path = public
    as $$
    begin
      insert into public.users (id)
      values (new.id);
      return new;
    end;
    $$;
    
    -- Fire the trigger after every new user is created
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();