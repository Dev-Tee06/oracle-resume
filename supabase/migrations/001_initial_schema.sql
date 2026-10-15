-- ============================================================
-- Oracle's Mind — Supabase Database Schema
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLE: admin_users
-- Only the authorized portfolio owner should exist here.
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'admin' CHECK (role = 'admin'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- TABLE: portfolio_projects
-- ============================================================
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  short_description text,
  full_description text,
  category text,
  technologies text[] DEFAULT '{}',
  client_name text,
  project_date date,
  live_url text,
  source_url text,
  cover_image_id uuid, -- FK added after portfolio_images
  is_featured boolean DEFAULT false,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- TABLE: portfolio_images
-- ============================================================
CREATE TABLE IF NOT EXISTS portfolio_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES portfolio_projects ON DELETE CASCADE NOT NULL,
  storage_path text NOT NULL,
  public_url text NOT NULL,
  alt_text text DEFAULT '',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Add cover_image FK now that portfolio_images exists
ALTER TABLE portfolio_projects
  ADD CONSTRAINT fk_cover_image
  FOREIGN KEY (cover_image_id)
  REFERENCES portfolio_images(id)
  ON DELETE SET NULL;

-- ============================================================
-- TABLE: portfolio_sections
-- ============================================================
CREATE TABLE IF NOT EXISTS portfolio_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  section_type text NOT NULL CHECK (section_type IN (
    'selected_work', 'testimonials', 'services', 'skills',
    'experience', 'certifications', 'stats', 'custom'
  )),
  subtitle text,
  content jsonb DEFAULT '{}',
  is_enabled boolean DEFAULT true,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- TABLE: site_settings
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text NOT NULL UNIQUE,
  setting_value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- Insert default settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
  ('hero', '{"name": "Oracle''s Mind", "tagline": "Vision • Insight • Creation", "subtitle": "Oracle''s Mind is a creative space driven by perception and intention — translating abstract ideas into clear visual language, meaningful design, and thoughtful digital expression.", "quote": "Every design begins with insight — clarity follows.", "cta_primary_label": "View Portfolio", "cta_primary_url": "/portfolio", "cta_secondary_label": "Contact", "cta_secondary_url": "/contact"}'),
  ('stats', '{"items": [{"value": "150+", "label": "Projects Completed"}, {"value": "3+", "label": "Years of Experience"}, {"value": "40+", "label": "Happy Clients"}]}'),
  ('contact', '{"phone": "08146040037", "email": "deoracle711@gmail.com", "location": "Lagos, Nigeria", "whatsapp_url": "https://wa.me/qr/F3PQMBZKCQBFK1", "pinterest_url": "https://www.pinterest.com/OracleMind02/", "instagram_url": "https://www.instagram.com/oracle__mind"}')
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_projects_status ON portfolio_projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON portfolio_projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON portfolio_projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_sort ON portfolio_projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_images_project ON portfolio_images(project_id);
CREATE INDEX IF NOT EXISTS idx_sections_status ON portfolio_sections(status);
CREATE INDEX IF NOT EXISTS idx_sections_enabled ON portfolio_sections(is_enabled);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Helper function: check if current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users
    WHERE auth_user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- admin_users: only the admin can see/modify their own record
CREATE POLICY "admin_users_select_own" ON admin_users
  FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "admin_users_insert" ON admin_users
  FOR INSERT WITH CHECK (false); -- Only via service role / migration

CREATE POLICY "admin_users_update_own" ON admin_users
  FOR UPDATE USING (auth_user_id = auth.uid());

-- portfolio_projects: public reads published; admin full access
CREATE POLICY "projects_public_read" ON portfolio_projects
  FOR SELECT USING (status = 'published');

CREATE POLICY "projects_admin_all" ON portfolio_projects
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- portfolio_images: public reads; admin full access
CREATE POLICY "images_public_read" ON portfolio_images
  FOR SELECT USING (true);

CREATE POLICY "images_admin_all" ON portfolio_images
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- portfolio_sections: public reads enabled+published; admin full access
CREATE POLICY "sections_public_read" ON portfolio_sections
  FOR SELECT USING (is_enabled = true AND status = 'published');

CREATE POLICY "sections_admin_all" ON portfolio_sections
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- site_settings: public reads; admin can update
CREATE POLICY "settings_public_read" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "settings_admin_write" ON site_settings
  FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

-- ============================================================
-- STORAGE BUCKET SETUP (run in SQL editor)
-- ============================================================
-- Note: Create the 'portfolio-images' bucket in:
-- Supabase Dashboard > Storage > New Bucket
-- Name: portfolio-images
-- Public: YES (toggle on)
--
-- Then add these Storage RLS policies:

-- If you want to add Storage policies via SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "storage_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-images');

CREATE POLICY "storage_admin_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'portfolio-images' AND is_admin()
  );

CREATE POLICY "storage_admin_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'portfolio-images' AND is_admin()
  );

CREATE POLICY "storage_admin_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'portfolio-images' AND is_admin()
  );

-- ============================================================
-- ADMIN USER SETUP
-- After running this migration:
-- 1. Go to Supabase Dashboard > Authentication > Users > Invite User
-- 2. Enter your email address
-- 3. Accept the invitation and set your password
-- 4. Then run this INSERT to grant admin access
--    (replace the UUID with your actual auth user ID):
-- ============================================================
-- INSERT INTO admin_users (auth_user_id, email, role)
-- VALUES ('your-auth-user-uuid-here', 'deoracle711@gmail.com', 'admin');
