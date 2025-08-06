import { createClient } from '@supabase/supabase-js'

// These would typically come from environment variables
// For demo purposes, users should replace with their own Supabase credentials
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database operations for countdowns
export const countdownService = {
  // Get all countdowns
  async getCountdowns() {
    const { data, error } = await supabase
      .from('countdowns')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Create a new countdown
  async createCountdown(title, targetDate) {
    const { data, error } = await supabase
      .from('countdowns')
      .insert([
        {
          title,
          target_date: targetDate,
          created_at: new Date().toISOString()
        }
      ])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete a countdown
  async deleteCountdown(id) {
    const { error } = await supabase
      .from('countdowns')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}