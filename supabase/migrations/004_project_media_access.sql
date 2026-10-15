-- Fix the project image storage setup and allow signed-in users to manage
-- portfolio content, matching the admin login behavior in the app.
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

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "storage_public_read" ON storage.objects;
DROP POLICY IF EXISTS "storage_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "storage_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "storage_admin_delete" ON storage.objects;

CREATE POLICY "storage_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-images');

CREATE POLICY "storage_admin_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "storage_admin_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio-images' AND auth.uid() IS NOT NULL)
  WITH CHECK (bucket_id = 'portfolio-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "storage_admin_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio-images' AND auth.uid() IS NOT NULL);
