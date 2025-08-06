import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import CountdownForm from './components/CountdownForm'
import CountdownList from './components/CountdownList'
import Auth from './components/Auth'
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [countdowns, setCountdowns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) {
      fetchCountdowns()
    }
  }, [session])

  async function fetchCountdowns() {
    try {
      const { data, error } = await supabase
        .from('countdowns')
        .select('*')
        .eq('is_active', true)
        .order('target_date', { ascending: true })

      if (error) throw error
      setCountdowns(data || [])
    } catch (error) {
      console.error('Error fetching countdowns:', error.message)
    }
  }

  async function addCountdown(newCountdown) {
    try {
      const { data, error } = await supabase
        .from('countdowns')
        .insert([{ ...newCountdown, user_id: session.user.id }])
        .select()

      if (error) throw error
      setCountdowns([...countdowns, ...data])
    } catch (error) {
      console.error('Error adding countdown:', error.message)
    }
  }

  async function deleteCountdown(id) {
    try {
      const { error } = await supabase
        .from('countdowns')
        .update({ is_active: false })
        .eq('id', id)

      if (error) throw error
      setCountdowns(countdowns.filter(countdown => countdown.id !== id))
    } catch (error) {
      console.error('Error deleting countdown:', error.message)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!session) {
    return <Auth />
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎯 Countdown App</h1>
        <button 
          onClick={() => supabase.auth.signOut()}
          className="sign-out-button"
        >
          Sign Out
        </button>
      </header>
      
      <main>
        <CountdownForm onAdd={addCountdown} />
        <CountdownList 
          countdowns={countdowns} 
          onDelete={deleteCountdown}
        />
      </main>
    </div>
  )
}

export default App