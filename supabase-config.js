import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)

export const createCountdownsTable = async () => {
  const { data, error } = await supabase.rpc('create_countdowns_table_if_not_exists')
  if (error) {
    console.error('Error creating table:', error)
  }
  return { data, error }
}

export const getCountdowns = async () => {
  const { data, error } = await supabase
    .from('countdowns')
    .select('*')
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const createCountdown = async (countdown) => {
  const { data, error } = await supabase
    .from('countdowns')
    .insert([{
      name: countdown.name,
      target_date: countdown.targetDate,
      created_at: new Date().toISOString()
    }])
    .select()
  
  return { data, error }
}

export const deleteCountdown = async (id) => {
  const { data, error } = await supabase
    .from('countdowns')
    .delete()
    .eq('id', id)
  
  return { data, error }
}