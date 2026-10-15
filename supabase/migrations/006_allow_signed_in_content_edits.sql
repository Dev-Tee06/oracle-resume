-- The admin UI allows any signed-in account to manage portfolio content.
-- These explicit policies do not depend on admin_users or is_admin().
-- Run this migration in the Supabase SQL Editor for the connected project.

DROP POLICY IF EXISTS "projects_admin_all" ON public.portfolio_projects;
DROP POLICY IF EXISTS "projects_authenticated_all" ON public.portfolio_projects;
CREATE POLICY "projects_authenticated_all" ON public.portfolio_projects
  FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "images_admin_all" ON public.portfolio_images;
DROP POLICY IF EXISTS "images_authenticated_all" ON public.portfolio_images;
CREATE POLICY "images_authenticated_all" ON public.portfolio_images
  FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "sections_admin_all" ON public.portfolio_sections;
DROP POLICY IF EXISTS "sections_authenticated_all" ON public.portfolio_sections;
CREATE POLICY "sections_authenticated_all" ON public.portfolio_sections
  FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "settings_admin_write" ON public.site_settings;
DROP POLICY IF EXISTS "settings_admin_insert" ON public.site_settings;
DROP POLICY IF EXISTS "settings_authenticated_all" ON public.site_settings;
CREATE POLICY "settings_authenticated_all" ON public.site_settings
  FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "storage_public_read" ON storage.objects;
DROP POLICY IF EXISTS "storage_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "storage_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "storage_admin_delete" ON storage.objects;
DROP POLICY IF EXISTS "storage_authenticated_insert" ON storage.objects;
DROP POLICY IF EXISTS "storage_authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "storage_authenticated_delete" ON storage.objects;

CREATE POLICY "storage_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-images');
CREATE POLICY "storage_authenticated_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "storage_authenticated_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio-images' AND auth.uid() IS NOT NULL)
  WITH CHECK (bucket_id = 'portfolio-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "storage_authenticated_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio-images' AND auth.uid() IS NOT NULL);
