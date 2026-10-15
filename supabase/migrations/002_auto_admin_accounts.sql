-- Grant admin access to every Supabase Auth user, as requested.
-- Run this migration in the Supabase SQL Editor for the connected project.

CREATE OR REPLACE FUNCTION public.create_admin_profile_for_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.admin_users (auth_user_id, email, role)
  VALUES (NEW.id, NEW.email, 'admin')
  ON CONFLICT (auth_user_id)
  DO UPDATE SET email = EXCLUDED.email;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_admin_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_admin_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_admin_profile_for_auth_user();

-- Existing accounts also receive admin access so they can sign in after
-- applying this migration.
INSERT INTO public.admin_users (auth_user_id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email IS NOT NULL
ON CONFLICT (auth_user_id)
DO UPDATE SET email = EXCLUDED.email;
