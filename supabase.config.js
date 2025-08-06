// Supabase configuration
// Note: In production, these should be environment variables
export const supabaseConfig = {
  url: process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL',
  anonKey: process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'
};