-- Dedicated, private storage and metadata for one MP4 video per project.
-- Apply this migration in the connected Supabase project before using video uploads.

CREATE TABLE IF NOT EXISTS public.portfolio_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL UNIQUE REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
  storage_path text NOT NULL UNIQUE,
  file_name text NOT NULL,
  mime_type text NOT NULL CHECK (mime_type = 'video/mp4'),
  file_size bigint NOT NULL CHECK (file_size > 0 AND file_size <= 3000000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "portfolio_videos_published_read" ON public.portfolio_videos;
CREATE POLICY "portfolio_videos_published_read" ON public.portfolio_videos
  FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.portfolio_projects p
    WHERE p.id = project_id AND p.status = 'published'
  ));

DROP POLICY IF EXISTS "portfolio_videos_authenticated_manage" ON public.portfolio_videos;
CREATE POLICY "portfolio_videos_authenticated_manage" ON public.portfolio_videos
  FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('portfolio-videos', 'portfolio-videos', false, 3000000, ARRAY['video/mp4'])
ON CONFLICT (id) DO UPDATE
SET public = false,
    file_size_limit = 3000000,
    allowed_mime_types = ARRAY['video/mp4'];

DROP POLICY IF EXISTS "portfolio_videos_storage_read" ON storage.objects;
CREATE POLICY "portfolio_videos_storage_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (
    bucket_id = 'portfolio-videos'
    AND (
      auth.uid() IS NOT NULL
      OR EXISTS (
        SELECT 1
        FROM public.portfolio_videos v
        JOIN public.portfolio_projects p ON p.id = v.project_id
        WHERE v.storage_path = name AND p.status = 'published'
      )
    )
  );

DROP POLICY IF EXISTS "portfolio_videos_storage_insert" ON storage.objects;
CREATE POLICY "portfolio_videos_storage_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio-videos' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "portfolio_videos_storage_update" ON storage.objects;
CREATE POLICY "portfolio_videos_storage_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio-videos' AND auth.uid() IS NOT NULL)
  WITH CHECK (bucket_id = 'portfolio-videos' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "portfolio_videos_storage_delete" ON storage.objects;
CREATE POLICY "portfolio_videos_storage_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio-videos' AND auth.uid() IS NOT NULL);
