import { useState } from 'react'
import './CountdownItem.css'

export default function CountdownItem({ countdown, currentTime, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const calculateTimeLeft = () => {
    const targetDate = new Date(countdown.target_date)
    const difference = targetDate - currentTime

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)
      const seconds = Math.floor((difference / 1000) % 60)

      return { days, hours, minutes, seconds, isExpired: false }
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
  }

  const timeLeft = calculateTimeLeft()
  const targetDate = new Date(countdown.target_date)

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDelete = () => {
    onDelete(countdown.id)
    setShowDeleteConfirm(false)
  }

  return (
    <div className={`countdown-item ${timeLeft.isExpired ? 'expired' : ''}`}>
      <div className="countdown-header">
        <h3 className="countdown-title">{countdown.title}</h3>
        <button
          className="delete-button"
          onClick={() => setShowDeleteConfirm(true)}
          title="Delete countdown"
        >
          🗑️
        </button>
      </div>

      {countdown.description && (
        <p className="countdown-description">{countdown.description}</p>
      )}

      <div className="target-date">
        📅 {formatDate(targetDate)}
      </div>

      {timeLeft.isExpired ? (
        <div className="expired-message">
          <h2>🎉 Time's Up!</h2>
          <p>This countdown has expired</p>
        </div>
      ) : (
        <div className="time-display">
          <div className="time-unit">
            <span className="time-value">{timeLeft.days}</span>
            <span className="time-label">Days</span>
          </div>
          <div className="time-unit">
            <span className="time-value">{timeLeft.hours}</span>
            <span className="time-label">Hours</span>
          </div>
          <div className="time-unit">
            <span className="time-value">{timeLeft.minutes}</span>
            <span className="time-label">Minutes</span>
          </div>
          <div className="time-unit">
            <span className="time-value">{timeLeft.seconds}</span>
            <span className="time-label">Seconds</span>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="delete-confirm">
          <p>Delete this countdown?</p>
          <div className="confirm-buttons">
            <button onClick={handleDelete} className="confirm-delete">
              Yes, Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="cancel-delete"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}