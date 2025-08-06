import { useState } from 'react'
import './CountdownForm.css'

export default function CountdownForm({ onAdd }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_date: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onAdd({
        title: formData.title,
        description: formData.description,
        target_date: new Date(formData.target_date).toISOString()
      })
      
      setFormData({
        title: '',
        description: '',
        target_date: ''
      })
    } catch (error) {
      console.error('Error adding countdown:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const minDate = new Date().toISOString().slice(0, 16)

  return (
    <div className="countdown-form-container">
      <h2>➕ Create New Countdown</h2>
      <form onSubmit={handleSubmit} className="countdown-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g., New Year 2025"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="target_date">Target Date</label>
            <input
              id="target_date"
              name="target_date"
              type="datetime-local"
              value={formData.target_date}
              onChange={handleChange}
              min={minDate}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            placeholder="Add some details about this countdown..."
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>
        
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Creating...' : '🎯 Create Countdown'}
        </button>
      </form>
    </div>
  )
}