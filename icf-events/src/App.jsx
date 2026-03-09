import { useState } from 'react'
import ICFEventsApp from './ICFEventsApp'
import './App.css'

function LandingPage({ onSelectApp }) {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-content">
          <h1>Welcome to My Apps</h1>
          <p>A collection of interactive applications</p>
        </div>
      </header>

      <div className="apps-grid">
        <div className="app-card" onClick={() => onSelectApp('icf-events')}>
          <div className="app-card-icon">
            🛶
          </div>
          <div className="app-card-content">
            <h2>ICF Events</h2>
            <p>International Canoe Federation Events Calendar</p>
            <ul className="app-features">
              <li>📍 Interactive map with event locations</li>
              <li>⏱️ Live countdown timers</li>
              <li>🔍 Search and filter events</li>
              <li>📊 Event details and distances</li>
            </ul>
            <button className="app-link-btn">Launch App →</button>
          </div>
        </div>

        <div className="app-card coming-soon">
          <div className="app-card-icon">
            🎮
          </div>
          <div className="app-card-content">
            <h2>Coming Soon</h2>
            <p>More apps will be added here</p>
            <div className="coming-soon-badge">Upcoming</div>
          </div>
        </div>

        <div className="app-card coming-soon">
          <div className="app-card-icon">
            🚀
          </div>
          <div className="app-card-content">
            <h2>Coming Soon</h2>
            <p>More apps will be added here</p>
            <div className="coming-soon-badge">Upcoming</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [currentApp, setCurrentApp] = useState(null)

  const goBack = () => setCurrentApp(null)

  if (currentApp === 'icf-events') {
    return (
      <div className="app-wrapper">
        <button className="back-button" onClick={goBack}>← Back to Apps</button>
        <ICFEventsApp />
      </div>
    )
  }

  return <LandingPage onSelectApp={setCurrentApp} />
}
