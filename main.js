import './style.css'
import { createClient } from '@supabase/supabase-js'

// Supabase configuration - These should be environment variables in production
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

class CountdownApp {
  constructor() {
    this.countdowns = []
    this.intervalIds = new Map()
    this.init()
  }

  async init() {
    this.bindEvents()
    await this.loadCountdowns()
    this.startCountdownUpdates()
  }

  bindEvents() {
    const createBtn = document.getElementById('create-countdown')
    createBtn.addEventListener('click', () => this.createCountdown())

    // Allow Enter key to submit
    document.getElementById('countdown-name').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.createCountdown()
    })
    document.getElementById('countdown-date').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.createCountdown()
    })
  }

  async loadCountdowns() {
    try {
      // In a real app, you would load from Supabase here
      // const { data, error } = await supabase
      //   .from('countdowns')
      //   .select('*')
      //   .order('target_date', { ascending: true })
      
      // For now, load from localStorage as fallback
      const saved = localStorage.getItem('countdowns')
      if (saved) {
        this.countdowns = JSON.parse(saved)
        this.renderCountdowns()
      }
    } catch (error) {
      console.error('Error loading countdowns:', error)
      // Fallback to localStorage
      const saved = localStorage.getItem('countdowns')
      if (saved) {
        this.countdowns = JSON.parse(saved)
        this.renderCountdowns()
      }
    }
  }

  async createCountdown() {
    const nameInput = document.getElementById('countdown-name')
    const dateInput = document.getElementById('countdown-date')
    
    const name = nameInput.value.trim()
    const targetDate = new Date(dateInput.value)
    
    if (!name || !dateInput.value) {
      alert('Please fill in both name and date')
      return
    }

    if (targetDate <= new Date()) {
      alert('Please select a future date')
      return
    }

    const countdown = {
      id: Date.now().toString(),
      name,
      target_date: targetDate.toISOString(),
      created_at: new Date().toISOString()
    }

    try {
      // In a real app, you would save to Supabase here
      // const { data, error } = await supabase
      //   .from('countdowns')
      //   .insert([countdown])
      
      // For now, save to localStorage and memory
      this.countdowns.push(countdown)
      this.saveToLocalStorage()
      this.renderCountdowns()
      
      // Clear form
      nameInput.value = ''
      dateInput.value = ''
    } catch (error) {
      console.error('Error creating countdown:', error)
      alert('Failed to create countdown')
    }
  }

  async deleteCountdown(id) {
    try {
      // In a real app, you would delete from Supabase here
      // const { error } = await supabase
      //   .from('countdowns')
      //   .delete()
      //   .eq('id', id)
      
      // For now, remove from memory and localStorage
      this.countdowns = this.countdowns.filter(c => c.id !== id)
      this.saveToLocalStorage()
      this.renderCountdowns()
      
      // Clear any running interval for this countdown
      if (this.intervalIds.has(id)) {
        clearInterval(this.intervalIds.get(id))
        this.intervalIds.delete(id)
      }
    } catch (error) {
      console.error('Error deleting countdown:', error)
      alert('Failed to delete countdown')
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('countdowns', JSON.stringify(this.countdowns))
  }

  renderCountdowns() {
    const container = document.getElementById('countdowns')
    
    if (this.countdowns.length === 0) {
      container.innerHTML = '<p>No countdowns yet. Create one above!</p>'
      return
    }

    container.innerHTML = this.countdowns.map(countdown => 
      this.renderCountdownItem(countdown)
    ).join('')

    // Bind delete buttons
    this.countdowns.forEach(countdown => {
      const deleteBtn = document.querySelector(`[data-id="${countdown.id}"]`)
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => this.deleteCountdown(countdown.id))
      }
    })
  }

  renderCountdownItem(countdown) {
    const targetDate = new Date(countdown.target_date)
    const now = new Date()
    const timeLeft = targetDate - now
    const isCompleted = timeLeft <= 0

    let timeDisplay
    if (isCompleted) {
      timeDisplay = 'COMPLETED!'
    } else {
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
      
      timeDisplay = `${days}d ${hours}h ${minutes}m ${seconds}s`
    }

    return `
      <div class="countdown-item ${isCompleted ? 'completed' : ''}">
        <div class="countdown-name">${countdown.name}</div>
        <div class="countdown-target">Target: ${targetDate.toLocaleDateString()} ${targetDate.toLocaleTimeString()}</div>
        <div class="countdown-display" id="display-${countdown.id}">${timeDisplay}</div>
        <button class="delete-btn" data-id="${countdown.id}">Delete</button>
      </div>
    `
  }

  startCountdownUpdates() {
    // Update all countdowns every second
    setInterval(() => {
      this.countdowns.forEach(countdown => {
        const displayElement = document.getElementById(`display-${countdown.id}`)
        if (displayElement) {
          const targetDate = new Date(countdown.target_date)
          const now = new Date()
          const timeLeft = targetDate - now

          if (timeLeft <= 0) {
            displayElement.textContent = 'COMPLETED!'
            displayElement.parentElement.classList.add('completed')
          } else {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
            
            displayElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`
          }
        }
      })
    }, 1000)
  }
}

// Initialize the app
new CountdownApp()