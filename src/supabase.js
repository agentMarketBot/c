import { createClient } from '@supabase/supabase-js'

export class SupabaseClient {
  constructor() {
    this.supabase = null
    this.initialized = false
  }

  async init() {
    // In a real app, these would come from environment variables
    // For demo purposes, using placeholder values
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
    
    // Note: In production, you should set these in a .env file:
    // VITE_SUPABASE_URL=your_actual_supabase_url
    // VITE_SUPABASE_ANON_KEY=your_actual_anon_key
    
    try {
      this.supabase = createClient(supabaseUrl, supabaseKey)
      this.initialized = true
      console.log('Supabase client initialized')
      
      // Test connection if real credentials are provided
      if (supabaseUrl !== 'https://your-project.supabase.co') {
        await this.testConnection()
      }
    } catch (error) {
      console.warn('Supabase initialization failed:', error)
      // Fall back to local storage for demo purposes
      this.initLocalStorage()
    }
  }

  async testConnection() {
    try {
      const { data, error } = await this.supabase
        .from('countdowns')
        .select('count', { count: 'exact', head: true })
      
      if (error) throw error
      console.log('Supabase connection test successful')
    } catch (error) {
      console.warn('Supabase connection test failed:', error)
      this.initLocalStorage()
    }
  }

  initLocalStorage() {
    console.log('Using localStorage as fallback')
    this.supabase = null
    this.initialized = true
  }

  async getCountdowns() {
    if (this.supabase) {
      const { data, error } = await this.supabase
        .from('countdowns')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } else {
      // Fallback to localStorage
      const stored = localStorage.getItem('countdowns')
      return stored ? JSON.parse(stored) : []
    }
  }

  async createCountdown(title, targetDate, description = '') {
    const countdown = {
      id: crypto.randomUUID(),
      title,
      target_date: targetDate,
      description,
      created_at: new Date().toISOString()
    }

    if (this.supabase) {
      const { data, error } = await this.supabase
        .from('countdowns')
        .insert([countdown])
        .select()
        .single()
      
      if (error) throw error
      return data
    } else {
      // Fallback to localStorage
      const existing = await this.getCountdowns()
      existing.unshift(countdown)
      localStorage.setItem('countdowns', JSON.stringify(existing))
      return countdown
    }
  }

  async deleteCountdown(id) {
    if (this.supabase) {
      const { error } = await this.supabase
        .from('countdowns')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    } else {
      // Fallback to localStorage
      const existing = await this.getCountdowns()
      const filtered = existing.filter(c => c.id !== id)
      localStorage.setItem('countdowns', JSON.stringify(filtered))
    }
  }

  async updateCountdown(id, updates) {
    if (this.supabase) {
      const { data, error } = await this.supabase
        .from('countdowns')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    } else {
      // Fallback to localStorage
      const existing = await this.getCountdowns()
      const index = existing.findIndex(c => c.id === id)
      if (index !== -1) {
        existing[index] = { ...existing[index], ...updates }
        localStorage.setItem('countdowns', JSON.stringify(existing))
        return existing[index]
      }
      throw new Error('Countdown not found')
    }
  }
}