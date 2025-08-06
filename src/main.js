import './style.css'
import { countdownService } from './supabase.js'

class CountdownApp {
  constructor() {
    this.countdowns = []
    this.intervals = new Map()
    this.init()
  }

  async init() {
    this.setupEventListeners()
    await this.loadCountdowns()
    this.setupRealtimeSubscription()
  }

  setupEventListeners() {
    const createBtn = document.getElementById('create-countdown')
    createBtn.addEventListener('click', () => this.createCountdown())

    // Allow Enter key to create countdown
    document.getElementById('title').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.createCountdown()
    })
    document.getElementById('target-date').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.createCountdown()
    })
  }

  async loadCountdowns() {
    try {
      const countdowns = await countdownService.getCountdowns()
      this.countdowns = countdowns
      this.renderCountdowns()
    } catch (error) {
      console.error('Error loading countdowns:', error)
      this.showError('Failed to load countdowns. Please check your Supabase configuration.')
    }
  }

  async createCountdown() {
    const titleInput = document.getElementById('title')
    const targetDateInput = document.getElementById('target-date')
    
    const title = titleInput.value.trim()
    const targetDate = targetDateInput.value

    if (!title || !targetDate) {
      alert('Please fill in both title and target date')
      return
    }

    const targetDateTime = new Date(targetDate)
    if (targetDateTime <= new Date()) {
      alert('Target date must be in the future')
      return
    }

    try {
      const newCountdown = await countdownService.createCountdown(title, targetDateTime.toISOString())
      titleInput.value = ''
      targetDateInput.value = ''
    } catch (error) {
      console.error('Error creating countdown:', error)
      this.showError('Failed to create countdown. Please check your Supabase configuration.')
    }
  }

  async deleteCountdown(id) {
    if (!confirm('Are you sure you want to delete this countdown?')) return

    try {
      await countdownService.deleteCountdown(id)
    } catch (error) {
      console.error('Error deleting countdown:', error)
      this.showError('Failed to delete countdown.')
    }
  }

  formatTimeRemaining(targetDate) {
    const now = new Date().getTime()
    const target = new Date(targetDate).getTime()
    const difference = target - now

    if (difference <= 0) {
      return { text: 'EXPIRED!', expired: true }
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    let text = ''
    if (days > 0) text += `${days}d `
    if (hours > 0) text += `${hours}h `
    if (minutes > 0) text += `${minutes}m `
    text += `${seconds}s`

    return { text: text.trim(), expired: false }
  }

  renderCountdowns() {
    const container = document.getElementById('countdowns-list')
    
    // Clear existing intervals
    this.intervals.forEach(interval => clearInterval(interval))
    this.intervals.clear()

    if (this.countdowns.length === 0) {
      container.innerHTML = '<div class="loading">No countdowns yet. Create your first one above!</div>'
      return
    }

    container.innerHTML = this.countdowns.map(countdown => {
      const { text, expired } = this.formatTimeRemaining(countdown.target_date)
      
      return `
        <div class="countdown-item">
          <button class="delete-btn" onclick="app.deleteCountdown('${countdown.id}')">×</button>
          <div class="countdown-title">${this.escapeHtml(countdown.title)}</div>
          <div class="countdown-display ${expired ? 'expired' : ''}" id="countdown-${countdown.id}">
            ${text}
          </div>
          <div class="countdown-target">
            Target: ${new Date(countdown.target_date).toLocaleString()}
          </div>
        </div>
      `
    }).join('')

    // Set up intervals for real-time updates
    this.countdowns.forEach(countdown => {
      const interval = setInterval(() => {
        const element = document.getElementById(`countdown-${countdown.id}`)
        if (element) {
          const { text, expired } = this.formatTimeRemaining(countdown.target_date)
          element.textContent = text
          element.className = `countdown-display ${expired ? 'expired' : ''}`
        }
      }, 1000)
      
      this.intervals.set(countdown.id, interval)
    })
  }

  setupRealtimeSubscription() {
    countdownService.subscribeToChanges((payload) => {
      console.log('Real-time update:', payload)
      this.loadCountdowns()
    })
  }

  escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  showError(message) {
    const container = document.getElementById('countdowns-list')
    container.innerHTML = `<div class="loading" style="color: #ff4757;">${message}</div>`
  }
}

// Initialize the app
window.app = new CountdownApp()