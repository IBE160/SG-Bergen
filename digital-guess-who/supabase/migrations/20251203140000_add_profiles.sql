-- Create a profiles table to store usernames
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text,
  updated_at timestamp with time zone,
  avatar_url text,
  website text
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." 
  on public.profiles for select 
  using ( true );

create policy "Users can insert their own profile." 
  on public.profiles for insert 
  with check ( auth.uid() = id );

create policy "Users can update own profile." 
  on public.profiles for update 
  using ( auth.uid() = id );

-- Trigger to handle new user signups
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'full_name'); -- Try full_name or just leave null/email
  return new;
end;
$$ language plpgsql security definer;

-- Check if trigger exists before creating to avoid error
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
