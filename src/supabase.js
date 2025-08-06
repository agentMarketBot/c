import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from '../supabase.config.js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey)

// Database operations for countdowns
export const countdownService = {
  // Get all active countdowns
  async getAllCountdowns() {
    const { data, error } = await supabase
      .from('countdowns')
      .select('*')
      .eq('is_active', true)
      .order('target_date', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Create a new countdown
  async createCountdown(countdown) {
    const { data, error } = await supabase
      .from('countdowns')
      .insert([countdown])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Update a countdown
  async updateCountdown(id, updates) {
    const { data, error } = await supabase
      .from('countdowns')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete a countdown (soft delete by setting is_active to false)
  async deleteCountdown(id) {
    const { data, error } = await supabase
      .from('countdowns')
      .update({ is_active: false })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Subscribe to real-time changes
  subscribeToCountdowns(callback) {
    return supabase
      .channel('countdowns')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'countdowns' }, 
        callback
      )
      .subscribe()
  }
};