import './style.css'
import { countdownService } from './supabase.js'

class CountdownApp {
  constructor() {
    this.countdowns = []
    this.updateInterval = null
    this.init()
  }

  async init() {
    this.bindEvents()
    await this.loadCountdowns()
    this.startUpdateLoop()
  }

  bindEvents() {
    const addButton = document.getElementById('add-countdown')
    const titleInput = document.getElementById('title')
    const targetDateInput = document.getElementById('target-date')

    addButton.addEventListener('click', () => this.addCountdown())
    
    // Allow adding countdown by pressing Enter
    titleInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addCountdown()
    })
    
    targetDateInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addCountdown()
    })
  }

  async loadCountdowns() {
    try {
      this.countdowns = await countdownService.getCountdowns()
      this.renderCountdowns()
    } catch (error) {
      console.error('Error loading countdowns:', error)
      this.showError('Failed to load countdowns. Please check your Supabase configuration.')
    }
  }

  async addCountdown() {
    const titleInput = document.getElementById('title')
    const targetDateInput = document.getElementById('target-date')
    
    const title = titleInput.value.trim()
    const targetDate = targetDateInput.value

    if (!title || !targetDate) {
      this.showError('Please fill in both title and target date.')
      return
    }

    try {
      const newCountdown = await countdownService.createCountdown(title, targetDate)
      this.countdowns.unshift(newCountdown)
      this.renderCountdowns()
      
      // Clear form
      titleInput.value = ''
      targetDateInput.value = ''
    } catch (error) {
      console.error('Error creating countdown:', error)
      this.showError('Failed to create countdown. Please check your Supabase configuration.')
    }
  }

  async deleteCountdown(id) {
    try {
      await countdownService.deleteCountdown(id)
      this.countdowns = this.countdowns.filter(countdown => countdown.id !== id)
      this.renderCountdowns()
    } catch (error) {
      console.error('Error deleting countdown:', error)
      this.showError('Failed to delete countdown.')
    }
  }

  renderCountdowns() {
    const countdownList = document.getElementById('countdown-list')
    
    if (this.countdowns.length === 0) {
      countdownList.innerHTML = '<p>No countdowns yet. Create your first one!</p>'
      return
    }

    countdownList.innerHTML = this.countdowns.map(countdown => {
      const timeRemaining = this.calculateTimeRemaining(countdown.target_date)
      return `
        <div class="countdown-item">
          <div class="countdown-title">${this.escapeHtml(countdown.title)}</div>
          <div class="countdown-display">${timeRemaining.display}</div>
          <div class="countdown-target">Target: ${new Date(countdown.target_date).toLocaleString()}</div>
          <button class="delete-btn" onclick="app.deleteCountdown(${countdown.id})">Delete</button>
        </div>
      `
    }).join('')
  }

  calculateTimeRemaining(targetDate) {
    const now = new Date().getTime()
    const target = new Date(targetDate).getTime()
    const difference = target - now

    if (difference <= 0) {
      return { display: '🎉 Time\'s up!', expired: true }
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    let display = ''
    if (days > 0) display += `${days}d `
    if (hours > 0) display += `${hours}h `
    if (minutes > 0) display += `${minutes}m `
    display += `${seconds}s`

    return { display, expired: false }
  }

  startUpdateLoop() {
    // Update countdowns every second
    this.updateInterval = setInterval(() => {
      this.renderCountdowns()
    }, 1000)
  }

  showError(message) {
    // Simple error display - in a real app you'd want better UX
    alert(message)
  }

  escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }
}

// Initialize the app
const app = new CountdownApp()

// Make app available globally for event handlers
window.app = app