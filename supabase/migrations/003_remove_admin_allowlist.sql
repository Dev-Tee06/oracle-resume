-- Allow any signed-in Supabase Auth user to use the admin data policies.
-- Public visitors who are not signed in still have only public read access.
-- Run this migration in the Supabase SQL Editor for the connected project.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT auth.uid() IS NOT NULL;
$$;
