import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import './App.css'

const CALENDLY_URL = 'https://calendly.com/daniel-joinanvil/30min'
const SHEET_URL = 'https://script.google.com/macros/s/AKfycby7YupguaO55A_GT_D1GsC9GZ_QLtcmlaZgnlmUBvr8uk3-m2c0GJD943M3wakrjB8P/exec'

const LOGOS = [
  { name: 'Google',   src: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
  { name: 'AWS',      src: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
  { name: 'Azure',    src: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Microsoft_Azure_Logo.svg' },
  { name: 'Lovable',  src: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Lovable_Logo_%2B_Wordmark_Black.png', height: 48 },
  { name: 'Replit',   src: 'https://mma.prnewswire.com/media/2725892/Replit_Logo.jpg?w=200' },
  { name: 'Base44',   src: 'https://assets.sonary.com/wp-content/uploads/2025/08/18115434/Base44_l.svg' },
]

const ORB_CONFIG = [
  { x: '15%', y: '20%', size: 400, color: 'rgba(108,99,255,0.06)', duration: 25 },
  { x: '75%', y: '60%', size: 350, color: 'rgba(167,139,250,0.05)', duration: 30 },
  { x: '50%', y: '80%', size: 300, color: 'rgba(99,140,255,0.04)', duration: 20 },
]

function FloatingOrbs() {
  return (
    <div className="orbs">
      {ORB_CONFIG.map((orb, i) => (
        <motion.div
          key={i}
          className="orb"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, 30, -20, 10, 0],
            y: [0, -25, 15, -10, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

function Particles() {
  return (
    <div className="particles">
      {Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30 - Math.random() * 40, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

function LogoTicker() {
  const doubled = [...LOGOS, ...LOGOS]
  return (
    <div className="logo-ticker-section">
      <span className="logo-ticker-label">Trusted by teams<br />shipping with AI</span>
      <div className="logo-ticker-wrapper">
        <div className="logo-ticker-track">
          {doubled.map((logo, i) => (
            <img
              key={i}
              src={logo.src}
              alt={logo.name}
              className="logo-ticker-img"
              style={logo.height ? { height: logo.height } : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const HEADLINE_PHRASES = ["We'll fix it.", 'We will deploy it.', 'We will maintain it.']

function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setPhraseIndex(i => (i + 1) % HEADLINE_PHRASES.length)
    }, 2800)
    return () => clearInterval(id)
  }, [])

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
      <FloatingOrbs />
      <Particles />
      <motion.div
        className="glow"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
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
        <motion.div
          className="badge"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="badge-dot" />
          Accepting new projects
        </motion.div>

        <motion.div
          className="yc-badge"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          <span className="yc-text">Backed by</span>
          <svg className="yc-logo" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="4" fill="#F26522"/>
            <path d="M17.05 18.52V23.5H14.95V18.52L10 9.5H12.35L16 16.14L19.62 9.5H22L17.05 18.52Z" fill="white"/>
          </svg>
          <span className="yc-text">Combinator</span>
        </motion.div>

        <motion.h1
          className="headline"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Your AI app is broken.
          <br />
          <span className="headline-accent-wrap">
            <AnimatePresence mode="wait">
              <motion.span
                key={phraseIndex}
                className="headline-accent"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                {HEADLINE_PHRASES[phraseIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        <motion.p
          className="subtitle"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          We rescue, repair, deploy, and maintain apps built by AI tools.
          Ship with confidence&mdash;we handle the mess.
        </motion.p>

        <motion.div
          className="cta-group"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.button
            className="btn-primary"
            onClick={() => setModalOpen(true)}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            Get your app fixed
            <span>&rarr;</span>
          </motion.button>
        </motion.div>

        <motion.div
          className="proof"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <div className="proof-stats">
            <div className="stat">
              <span className="stat-value">1-4h</span>
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
        </motion.div>
      </main>

      <LogoTicker />

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="modal-overlay"
            onClick={() => setModalOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
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
              <motion.button
                className="btn-primary modal-btn"
                disabled={!isValid}
                onClick={handleBook}
                whileHover={isValid ? { scale: 1.02 } : {}}
                whileTap={isValid ? { scale: 0.98 } : {}}
              >
                Book &rarr;
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
