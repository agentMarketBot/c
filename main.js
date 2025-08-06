import { supabase, getCountdowns, createCountdown, deleteCountdown } from './supabase-config.js'

class CountdownApp {
    constructor() {
        this.countdowns = []
        this.intervals = new Map()
        this.init()
    }

    async init() {
        this.setupEventListeners()
        await this.loadCountdowns()
        this.startCountdownUpdates()
    }

    setupEventListeners() {
        const form = document.getElementById('countdown-form')
        form.addEventListener('submit', this.handleFormSubmit.bind(this))
    }

    async handleFormSubmit(event) {
        event.preventDefault()
        
        const nameInput = document.getElementById('countdown-name')
        const dateInput = document.getElementById('countdown-date')
        
        const name = nameInput.value.trim()
        const targetDate = dateInput.value
        
        if (!name || !targetDate) {
            alert('Please fill in all fields')
            return
        }

        // Validate that the date is in the future
        const target = new Date(targetDate)
        const now = new Date()
        
        if (target <= now) {
            alert('Please select a future date and time')
            return
        }

        try {
            const { data, error } = await createCountdown({
                name: name,
                targetDate: targetDate
            })

            if (error) {
                console.error('Error creating countdown:', error)
                alert('Failed to create countdown. Please try again.')
                return
            }

            // Clear form
            nameInput.value = ''
            dateInput.value = ''
            
            // Reload countdowns
            await this.loadCountdowns()
            
        } catch (error) {
            console.error('Error:', error)
            alert('Failed to create countdown. Please check your Supabase configuration.')
        }
    }

    async loadCountdowns() {
        try {
            const { data, error } = await getCountdowns()
            
            if (error) {
                console.error('Error loading countdowns:', error)
                this.showError('Failed to load countdowns. Please check your Supabase configuration.')
                return
            }
            
            this.countdowns = data || []
            this.renderCountdowns()
        } catch (error) {
            console.error('Error:', error)
            this.showError('Failed to connect to database. Please check your Supabase configuration.')
        }
    }

    renderCountdowns() {
        const container = document.getElementById('countdown-list')
        
        if (this.countdowns.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.7); margin-top: 2rem;">No countdowns yet. Create your first one above!</p>'
            return
        }
        
        container.innerHTML = this.countdowns.map(countdown => `
            <div class="countdown-item" data-id="${countdown.id}">
                <div class="countdown-name">${this.escapeHtml(countdown.name)}</div>
                <div class="countdown-display" id="display-${countdown.id}">
                    ${this.calculateTimeRemaining(countdown.target_date)}
                </div>
                <button class="delete-btn" onclick="app.deleteCountdown('${countdown.id}')">
                    Delete
                </button>
                <div style="clear: both;"></div>
            </div>
        `).join('')
    }

    calculateTimeRemaining(targetDate) {
        const now = new Date().getTime()
        const target = new Date(targetDate).getTime()
        const difference = target - now

        if (difference <= 0) {
            return '<span class="countdown-expired">⏰ Time\'s up!</span>'
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        return `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
    }

    startCountdownUpdates() {
        // Clear existing intervals
        this.intervals.forEach(interval => clearInterval(interval))
        this.intervals.clear()

        // Update countdowns every second
        const updateInterval = setInterval(() => {
            this.countdowns.forEach(countdown => {
                const displayElement = document.getElementById(`display-${countdown.id}`)
                if (displayElement) {
                    displayElement.innerHTML = this.calculateTimeRemaining(countdown.target_date)
                }
            })
        }, 1000)

        this.intervals.set('main', updateInterval)
    }

    async deleteCountdown(id) {
        if (!confirm('Are you sure you want to delete this countdown?')) {
            return
        }

        try {
            const { error } = await deleteCountdown(id)
            
            if (error) {
                console.error('Error deleting countdown:', error)
                alert('Failed to delete countdown. Please try again.')
                return
            }
            
            await this.loadCountdowns()
        } catch (error) {
            console.error('Error:', error)
            alert('Failed to delete countdown. Please try again.')
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div')
        div.textContent = text
        return div.innerHTML
    }

    showError(message) {
        const container = document.getElementById('countdown-list')
        container.innerHTML = `
            <div style="background: rgba(255, 107, 107, 0.2); border: 1px solid #ff6b6b; border-radius: 10px; padding: 1rem; text-align: center; color: #ff6b6b;">
                <strong>⚠️ Error:</strong><br>
                ${message}<br><br>
                <small>Make sure to update the Supabase configuration in supabase-config.js with your project details.</small>
            </div>
        `
    }
}

// Initialize the app
const app = new CountdownApp()

// Make app globally available for button callbacks
window.app = app