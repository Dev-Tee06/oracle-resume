-- Allow authenticated admin users to create a settings row if one is missing.
CREATE POLICY "settings_admin_insert" ON public.site_settings
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());
