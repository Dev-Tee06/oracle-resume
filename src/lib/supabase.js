import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id')

if (!isConfigured) {
  console.warn(
    '\n⚠️  SUPABASE NOT CONFIGURED\n' +
    'Create .env.local with your Supabase credentials.\n' +
    'See .env.example for required variables.\n'
  )
}

export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isConfigured ? supabaseAnonKey : 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)

export const STORAGE_BUCKET = 'portfolio-images'
export const IS_SUPABASE_CONFIGURED = isConfigured
