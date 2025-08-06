import './style.css'
import { countdownService } from './supabase.js'

// Global state
let countdowns = []
let countdownIntervals = new Map()

// DOM elements
const app = document.querySelector('#app')

// Initialize the app
function init() {
  renderApp()
  loadCountdowns()
  setupRealTimeSubscription()
}

// Render the main app structure
function renderApp() {
  app.innerHTML = `
    <div class="container">
      <header>
        <h1>🕰️ Countdown App</h1>
        <p>Create and track your important countdowns</p>
      </header>
      
      <div class="add-countdown-section">
        <h2>Add New Countdown</h2>
        <form id="countdown-form" class="countdown-form">
          <div class="form-group">
            <label for="title">Title:</label>
            <input type="text" id="title" name="title" required placeholder="Enter countdown title">
          </div>
          
          <div class="form-group">
            <label for="description">Description:</label>
            <textarea id="description" name="description" placeholder="Optional description"></textarea>
          </div>
          
          <div class="form-group">
            <label for="target-date">Target Date & Time:</label>
            <input type="datetime-local" id="target-date" name="targetDate" required>
          </div>
          
          <button type="submit" class="btn btn-primary">Create Countdown</button>
        </form>
      </div>
      
      <div class="countdowns-section">
        <h2>Active Countdowns</h2>
        <div id="countdowns-list" class="countdowns-list">
          <div class="loading">Loading countdowns...</div>
        </div>
      </div>
    </div>
  `
  
  // Add event listeners
  document.getElementById('countdown-form').addEventListener('submit', handleAddCountdown)
}

// Load countdowns from database
async function loadCountdowns() {
  try {
    countdowns = await countdownService.getAllCountdowns()
    renderCountdowns()
    startCountdownTimers()
  } catch (error) {
    console.error('Error loading countdowns:', error)
    showError('Failed to load countdowns. Please check your Supabase configuration.')
  }
}

// Render the countdowns list
function renderCountdowns() {
  const countdownsList = document.getElementById('countdowns-list')
  
  if (countdowns.length === 0) {
    countdownsList.innerHTML = '<div class="empty-state">No active countdowns. Create one above!</div>'
    return
  }
  
  countdownsList.innerHTML = countdowns.map(countdown => `
    <div class="countdown-card" data-id="${countdown.id}">
      <div class="countdown-header">
        <h3>${countdown.title}</h3>
        <button class="btn btn-danger btn-small" onclick="deleteCountdown('${countdown.id}')">Delete</button>
      </div>
      ${countdown.description ? `<p class="countdown-description">${countdown.description}</p>` : ''}
      <div class="countdown-display" id="countdown-${countdown.id}">
        Calculating...
      </div>
      <div class="countdown-target">
        Target: ${new Date(countdown.target_date).toLocaleString()}
      </div>
    </div>
  `).join('')
}

// Start countdown timers
function startCountdownTimers() {
  // Clear existing intervals
  countdownIntervals.forEach(interval => clearInterval(interval))
  countdownIntervals.clear()
  
  countdowns.forEach(countdown => {
    const interval = setInterval(() => {
      updateCountdownDisplay(countdown.id, countdown.target_date)
    }, 1000)
    countdownIntervals.set(countdown.id, interval)
    
    // Initial update
    updateCountdownDisplay(countdown.id, countdown.target_date)
  })
}

// Update individual countdown display
function updateCountdownDisplay(countdownId, targetDate) {
  const element = document.getElementById(`countdown-${countdownId}`)
  if (!element) return
  
  const now = new Date().getTime()
  const target = new Date(targetDate).getTime()
  const difference = target - now
  
  if (difference <= 0) {
    element.innerHTML = '<span class="countdown-finished">🎉 Time\'s up!</span>'
    const interval = countdownIntervals.get(countdownId)
    if (interval) {
      clearInterval(interval)
      countdownIntervals.delete(countdownId)
    }
    return
  }
  
  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)
  
  element.innerHTML = `
    <div class="time-units">
      <div class="time-unit">
        <span class="time-value">${days}</span>
        <span class="time-label">Days</span>
      </div>
      <div class="time-unit">
        <span class="time-value">${hours}</span>
        <span class="time-label">Hours</span>
      </div>
      <div class="time-unit">
        <span class="time-value">${minutes}</span>
        <span class="time-label">Minutes</span>
      </div>
      <div class="time-unit">
        <span class="time-value">${seconds}</span>
        <span class="time-label">Seconds</span>
      </div>
    </div>
  `
}

// Handle form submission
async function handleAddCountdown(e) {
  e.preventDefault()
  
  const formData = new FormData(e.target)
  const countdown = {
    title: formData.get('title'),
    description: formData.get('description') || null,
    target_date: new Date(formData.get('targetDate')).toISOString()
  }
  
  // Validate target date is in the future
  if (new Date(countdown.target_date) <= new Date()) {
    showError('Target date must be in the future!')
    return
  }
  
  try {
    await countdownService.createCountdown(countdown)
    e.target.reset()
    showSuccess('Countdown created successfully!')
    loadCountdowns() // Reload to show new countdown
  } catch (error) {
    console.error('Error creating countdown:', error)
    showError('Failed to create countdown. Please try again.')
  }
}

// Delete countdown
window.deleteCountdown = async function(id) {
  if (!confirm('Are you sure you want to delete this countdown?')) return
  
  try {
    await countdownService.deleteCountdown(id)
    showSuccess('Countdown deleted successfully!')
    loadCountdowns() // Reload to remove deleted countdown
  } catch (error) {
    console.error('Error deleting countdown:', error)
    showError('Failed to delete countdown. Please try again.')
  }
}

// Setup real-time subscription
function setupRealTimeSubscription() {
  countdownService.subscribeToCountdowns((payload) => {
    console.log('Real-time update:', payload)
    loadCountdowns() // Reload when data changes
  })
}

// Utility functions
function showError(message) {
  showNotification(message, 'error')
}

function showSuccess(message) {
  showNotification(message, 'success')
}

function showNotification(message, type) {
  const notification = document.createElement('div')
  notification.className = `notification notification-${type}`
  notification.textContent = message
  
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.remove()
  }, 3000)
}

// Start the app
init()