import { createClient } from '@supabase/supabase-js'

// These would typically be environment variables
// For demo purposes, using placeholder values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database operations
export const countdownService = {
  // Create a new countdown
  async createCountdown(title, targetDate) {
    const { data, error } = await supabase
      .from('countdowns')
      .insert([{ title, target_date: targetDate }])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Get all countdowns
  async getCountdowns() {
    const { data, error } = await supabase
      .from('countdowns')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Delete a countdown
  async deleteCountdown(id) {
    const { error } = await supabase
      .from('countdowns')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Subscribe to real-time changes
  subscribeToChanges(callback) {
    return supabase
      .channel('countdowns-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'countdowns' },
        callback
      )
      .subscribe()
  }
}