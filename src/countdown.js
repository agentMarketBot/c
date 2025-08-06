import { supabase } from './supabase.js'

class CountdownApp {
  constructor() {
    this.countdowns = []
    this.activeIntervals = new Map()
  }

  async init() {
    await this.loadCountdowns()
    this.render()
  }

  async loadCountdowns() {
    try {
      const { data, error } = await supabase
        .from('countdowns')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error loading countdowns:', error)
        return
      }
      
      this.countdowns = data || []
    } catch (error) {
      console.error('Error connecting to database:', error)
      this.countdowns = []
    }
  }

  async saveCountdown(title, targetDate) {
    try {
      const { data, error } = await supabase
        .from('countdowns')
        .insert([
          {
            title: title,
            target_date: targetDate,
            created_at: new Date().toISOString()
          }
        ])
        .select()

      if (error) {
        console.error('Error saving countdown:', error)
        return null
      }

      return data[0]
    } catch (error) {
      console.error('Error saving to database:', error)
      return null
    }
  }

  async deleteCountdown(id) {
    try {
      const { error } = await supabase
        .from('countdowns')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting countdown:', error)
        return false
      }

      this.stopCountdown(id)
      this.countdowns = this.countdowns.filter(c => c.id !== id)
      this.render()
      return true
    } catch (error) {
      console.error('Error deleting from database:', error)
      return false
    }
  }

  calculateTimeRemaining(targetDate) {
    const now = new Date().getTime()
    const target = new Date(targetDate).getTime()
    const difference = target - now

    if (difference <= 0) {
      return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    return { expired: false, days, hours, minutes, seconds }
  }

  startCountdown(id) {
    const countdown = this.countdowns.find(c => c.id === id)
    if (!countdown) return

    this.stopCountdown(id)

    const interval = setInterval(() => {
      this.updateCountdownDisplay(id)
    }, 1000)

    this.activeIntervals.set(id, interval)
    this.updateCountdownDisplay(id)
  }

  stopCountdown(id) {
    if (this.activeIntervals.has(id)) {
      clearInterval(this.activeIntervals.get(id))
      this.activeIntervals.delete(id)
    }
  }

  updateCountdownDisplay(id) {
    const countdown = this.countdowns.find(c => c.id === id)
    if (!countdown) return

    const timeRemaining = this.calculateTimeRemaining(countdown.target_date)
    const element = document.getElementById(`countdown-${id}`)
    
    if (!element) return

    if (timeRemaining.expired) {
      element.innerHTML = '<span class="expired">EXPIRED</span>'
      this.stopCountdown(id)
    } else {
      element.innerHTML = `
        <div class="time-block">
          <span class="time-value">${timeRemaining.days}</span>
          <span class="time-label">Days</span>
        </div>
        <div class="time-block">
          <span class="time-value">${timeRemaining.hours}</span>
          <span class="time-label">Hours</span>
        </div>
        <div class="time-block">
          <span class="time-value">${timeRemaining.minutes}</span>
          <span class="time-label">Minutes</span>
        </div>
        <div class="time-block">
          <span class="time-value">${timeRemaining.seconds}</span>
          <span class="time-label">Seconds</span>
        </div>
      `
    }
  }

  async addNewCountdown() {
    const title = document.getElementById('countdown-title').value.trim()
    const date = document.getElementById('countdown-date').value
    const time = document.getElementById('countdown-time').value

    if (!title || !date || !time) {
      alert('Please fill in all fields')
      return
    }

    const targetDate = new Date(`${date}T${time}`).toISOString()
    const savedCountdown = await this.saveCountdown(title, targetDate)

    if (savedCountdown) {
      this.countdowns.unshift(savedCountdown)
      this.render()
      
      document.getElementById('countdown-title').value = ''
      document.getElementById('countdown-date').value = ''
      document.getElementById('countdown-time').value = ''
    } else {
      alert('Failed to save countdown. Please check your database connection.')
    }
  }

  render() {
    const app = document.getElementById('app')
    
    app.innerHTML = `
      <div class="countdown-app">
        <h1>Countdown App</h1>
        
        <div class="add-countdown">
          <h2>Add New Countdown</h2>
          <div class="form-group">
            <input type="text" id="countdown-title" placeholder="Event title">
            <input type="date" id="countdown-date">
            <input type="time" id="countdown-time">
            <button id="add-countdown-btn">Add Countdown</button>
          </div>
        </div>

        <div class="countdowns-list">
          <h2>Active Countdowns</h2>
          ${this.countdowns.length === 0 
            ? '<p class="no-countdowns">No countdowns yet. Add one above!</p>' 
            : this.countdowns.map(countdown => `
              <div class="countdown-item" data-id="${countdown.id}">
                <div class="countdown-header">
                  <h3>${countdown.title}</h3>
                  <button class="delete-btn" data-id="${countdown.id}">×</button>
                </div>
                <div class="countdown-display" id="countdown-${countdown.id}">
                  Loading...
                </div>
                <div class="countdown-target">
                  Target: ${new Date(countdown.target_date).toLocaleString()}
                </div>
              </div>
            `).join('')
          }
        </div>
      </div>
    `

    document.getElementById('add-countdown-btn')?.addEventListener('click', () => this.addNewCountdown())
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id)
        if (confirm('Are you sure you want to delete this countdown?')) {
          this.deleteCountdown(id)
        }
      })
    })

    this.countdowns.forEach(countdown => {
      this.startCountdown(countdown.id)
    })
  }
}

export { CountdownApp }