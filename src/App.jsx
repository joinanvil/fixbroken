import { useState } from 'react'
import './App.css'

const CALENDLY_URL = 'https://calendly.com/daniel-joinanvil/30min'
const SHEET_URL = '' // Paste your Google Apps Script web app URL here

function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [isValid, setIsValid] = useState(false)

  const handleEmailChange = (e) => {
    const val = e.target.value
    setEmail(val)
    setIsValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
  }

  const handleBook = () => {
    if (SHEET_URL) {
      fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, ts: new Date().toISOString() }),
      }).catch(() => {})
    }

    window.open(`${CALENDLY_URL}?email=${encodeURIComponent(email)}`, '_blank')
    setModalOpen(false)
    setEmail('')
    setIsValid(false)
  }

  return (
    <div className="page">
      <div className="glow" />
      <div className="grid-bg" />

      {/* Nav */}
      <nav className="nav">
        <div className="logo">
          <div className="logo-icon">A</div>
          Anvil
        </div>
        <button className="nav-link" onClick={() => setModalOpen(true)}>
          Get help &rarr;
        </button>
      </nav>

      {/* Hero */}
      <main className="hero">
        <div className="badge">
          <span className="badge-dot" />
          Accepting new projects
        </div>

        <h1 className="headline">
          Your AI app is broken.
          <br />
          <span className="headline-accent">We&rsquo;ll fix it.</span>
        </h1>

        <p className="subtitle">
          We rescue, repair, and maintain apps built by AI tools.
          Ship with confidence&mdash;we handle the mess.
        </p>

        <div className="cta-group">
          <button className="btn-primary" onClick={() => setModalOpen(true)}>
            Get your app fixed
            <span>&rarr;</span>
          </button>
        </div>

        <div className="proof">
          <span className="proof-label">Trusted by teams shipping with AI</span>
          <div className="proof-stats">
            <div className="stat">
              <span className="stat-value">48h</span>
              <span className="stat-label">Avg turnaround</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value">100%</span>
              <span className="stat-label">Code handoff</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value">0</span>
              <span className="stat-label">Lock-in</span>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalOpen(false)}>
              &times;
            </button>
            <h2 className="modal-title">Book a call</h2>
            <p className="modal-desc">
              Enter your email and we&rsquo;ll get you on the calendar.
            </p>
            <input
              className="modal-input"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={handleEmailChange}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && isValid && handleBook()}
            />
            <button
              className="btn-primary modal-btn"
              disabled={!isValid}
              onClick={handleBook}
            >
              Book &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
