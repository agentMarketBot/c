import { useState, useEffect } from 'react'
import CountdownItem from './CountdownItem'
import './CountdownList.css'

export default function CountdownList({ countdowns, onDelete }) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (countdowns.length === 0) {
    return (
      <div className="countdown-list-container">
        <h2>📅 Your Countdowns</h2>
        <div className="empty-state">
          <p>No countdowns yet!</p>
          <p>Create your first countdown above to get started.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="countdown-list-container">
      <h2>📅 Your Countdowns ({countdowns.length})</h2>
      <div className="countdown-grid">
        {countdowns.map((countdown) => (
          <CountdownItem
            key={countdown.id}
            countdown={countdown}
            currentTime={currentTime}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}