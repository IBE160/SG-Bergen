-- Add email column
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email text;

-- Update trigger function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

-- Attempt to backfill existing users (simplified for migration safety)
DO $$
BEGIN
  -- Check if we have permissions to read auth.users (usually yes in migrations)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
    UPDATE public.users pu
    SET email = au.email
    FROM auth.users au
    WHERE pu.id = au.id AND pu.email IS NULL;
  END IF;
END $$;
