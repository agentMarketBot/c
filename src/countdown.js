import { SupabaseClient } from './supabase.js'

export class CountdownApp {
  constructor(element) {
    this.element = element
    this.supabase = new SupabaseClient()
    this.countdowns = []
    this.activeTimers = new Map()
  }

  async init() {
    await this.supabase.init()
    await this.loadCountdowns()
    this.render()
  }

  async loadCountdowns() {
    try {
      this.countdowns = await this.supabase.getCountdowns()
      this.startActiveTimers()
    } catch (error) {
      console.error('Error loading countdowns:', error)
    }
  }

  startActiveTimers() {
    this.countdowns.forEach(countdown => {
      if (new Date(countdown.target_date) > new Date()) {
        this.startTimer(countdown.id)
      }
    })
  }

  startTimer(countdownId) {
    if (this.activeTimers.has(countdownId)) {
      clearInterval(this.activeTimers.get(countdownId))
    }

    const timer = setInterval(() => {
      this.updateCountdownDisplay(countdownId)
    }, 1000)

    this.activeTimers.set(countdownId, timer)
  }

  stopTimer(countdownId) {
    if (this.activeTimers.has(countdownId)) {
      clearInterval(this.activeTimers.get(countdownId))
      this.activeTimers.delete(countdownId)
    }
  }

  updateCountdownDisplay(countdownId) {
    const countdown = this.countdowns.find(c => c.id === countdownId)
    if (!countdown) return

    const now = new Date().getTime()
    const target = new Date(countdown.target_date).getTime()
    const difference = target - now

    const element = document.querySelector(`[data-countdown-id="${countdownId}"] .time-remaining`)
    if (!element) return

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      element.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`
    } else {
      element.textContent = 'Time\'s up!'
      element.classList.add('expired')
      this.stopTimer(countdownId)
    }
  }

  async createCountdown(title, targetDate, description = '') {
    try {
      const newCountdown = await this.supabase.createCountdown(title, targetDate, description)
      this.countdowns.push(newCountdown)
      this.startTimer(newCountdown.id)
      this.render()
      return newCountdown
    } catch (error) {
      console.error('Error creating countdown:', error)
      throw error
    }
  }

  async deleteCountdown(id) {
    try {
      await this.supabase.deleteCountdown(id)
      this.countdowns = this.countdowns.filter(c => c.id !== id)
      this.stopTimer(id)
      this.render()
    } catch (error) {
      console.error('Error deleting countdown:', error)
      throw error
    }
  }

  render() {
    this.element.innerHTML = `
      <div class="countdown-form">
        <h2>Create New Countdown</h2>
        <form id="countdown-form">
          <input type="text" id="title" placeholder="Countdown title" required>
          <input type="datetime-local" id="target-date" required>
          <textarea id="description" placeholder="Description (optional)"></textarea>
          <button type="submit">Create Countdown</button>
        </form>
      </div>
      
      <div class="countdowns-list">
        <h2>Active Countdowns</h2>
        ${this.countdowns.length === 0 ? 
          '<p class="no-countdowns">No countdowns yet. Create your first one above!</p>' :
          this.countdowns.map(countdown => this.renderCountdownItem(countdown)).join('')
        }
      </div>
    `

    this.attachEventListeners()
  }

  renderCountdownItem(countdown) {
    const now = new Date().getTime()
    const target = new Date(countdown.target_date).getTime()
    const isExpired = target <= now

    return `
      <div class="countdown-item ${isExpired ? 'expired' : ''}" data-countdown-id="${countdown.id}">
        <div class="countdown-header">
          <h3>${countdown.title}</h3>
          <button class="delete-btn" data-id="${countdown.id}">✕</button>
        </div>
        ${countdown.description ? `<p class="description">${countdown.description}</p>` : ''}
        <div class="target-date">Target: ${new Date(countdown.target_date).toLocaleString()}</div>
        <div class="time-remaining ${isExpired ? 'expired' : ''}">
          ${isExpired ? 'Time\'s up!' : 'Calculating...'}
        </div>
      </div>
    `
  }

  attachEventListeners() {
    const form = document.getElementById('countdown-form')
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      
      const title = document.getElementById('title').value
      const targetDate = document.getElementById('target-date').value
      const description = document.getElementById('description').value

      if (!title || !targetDate) return

      try {
        await this.createCountdown(title, targetDate, description)
        form.reset()
      } catch (error) {
        alert('Error creating countdown: ' + error.message)
      }
    })

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id
        if (confirm('Are you sure you want to delete this countdown?')) {
          try {
            await this.deleteCountdown(id)
          } catch (error) {
            alert('Error deleting countdown: ' + error.message)
          }
        }
      })
    })

    // Update displays for existing countdowns
    this.countdowns.forEach(countdown => {
      this.updateCountdownDisplay(countdown.id)
    })
  }
}