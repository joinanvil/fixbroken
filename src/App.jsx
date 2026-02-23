import './App.css'

const FORM_URL = 'https://tally.so' // Replace with your actual form URL

function App() {
  return (
    <div className="page">
      <div className="glow" />
      <div className="grid-bg" />

      {/* Nav */}
      <nav className="nav">
        <div className="logo">
          <div className="logo-icon">fb</div>
          fixbroken
        </div>
        <a className="nav-link" href={FORM_URL} target="_blank" rel="noopener noreferrer">
          Get help &rarr;
        </a>
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
          <a href={FORM_URL} target="_blank" rel="noopener noreferrer">
            <button className="btn-primary">
              Get your app fixed
              <span>&rarr;</span>
            </button>
          </a>
          <a href="mailto:hello@fixbroken.dev">
            <button className="btn-secondary">
              Talk to us
            </button>
          </a>
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
    </div>
  )
}

export default App
