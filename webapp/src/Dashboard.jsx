import { useEffect } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'

function useAuth() {
  try { return JSON.parse(localStorage.getItem('anvil_user')) } catch { return null }
}

const AGENT_MESSAGES = [
  { from: 'agent', text: "Hi! I'm your Anvil agent. Once you're assigned, I'll be right here." },
  { from: 'agent', text: "I'll handle your deployment, monitor your app 24/7, and fix bugs as they come up." },
  { from: 'user',  text: "Can you deploy my app?" },
  { from: 'agent', text: "Absolutely — just share your GitHub link and I'll take it from there." },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const user = useAuth()

  useEffect(() => {
    if (!user) navigate('/signup')
  }, [user, navigate])

  if (!user) return null

  const signOut = () => {
    localStorage.removeItem('anvil_token')
    localStorage.removeItem('anvil_user')
    navigate('/')
    window.location.reload()
  }

  return (
    <div className="db-layout">

      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <header className="db-topbar">
        <button className="db-topbar-logo" onClick={() => navigate('/')}>
          <img src="/logo.png" width={20} height={20} alt="Anvil" />
          <span>Anvil</span>
        </button>
        <div className="db-topbar-right">
          <div className="nav-user-wrap">
            <button className="nav-user">
              <img src={user.avatar} alt={user.name || user.login} className="nav-avatar" />
              <span className="nav-user-name">{user.name || user.login}</span>
            </button>
            <div className="nav-user-dropdown">
              <button className="nav-dropdown-item" onClick={() => navigate('/dashboard')}>Dashboard</button>
              <button className="nav-dropdown-item nav-dropdown-item--danger" onClick={signOut}>Sign out</button>
            </div>
          </div>
        </div>
      </header>

      <div className="db-body">

        {/* ── Projects sidebar ──────────────────────────────────────────── */}
        <aside className="db-projects">
          <div className="db-sidebar-label">Projects</div>

          <div className="db-project-item db-project-item--active">
            <span className="db-project-dot db-project-dot--pending" />
            <span className="db-project-name">{user.login}&rsquo;s app</span>
            <span className="db-project-status">Queue</span>
          </div>

          <div className="db-project-add">
            <span className="db-project-add-icon">+</span>
            New project
            <span className="db-project-lock">🔒</span>
          </div>
        </aside>

        {/* ── Agent chat sidebar ────────────────────────────────────────── */}
        <aside className="db-chat">
          <div className="db-chat-messages">
            {AGENT_MESSAGES.map((m, i) => (
              <div key={i} className={`db-chat-bubble db-chat-bubble--${m.from}`}>
                {m.from === 'agent' && (
                  <img src="/logo.png" width={16} height={16} alt="" className="db-chat-agent-icon" />
                )}
                <span>{m.text}</span>
              </div>
            ))}
          </div>

          <div className="db-chat-input-row">
            <input className="db-chat-input" placeholder="Agent not yet assigned…" disabled />
            <button className="db-chat-send" disabled>↑</button>
          </div>
        </aside>

        {/* ── Main content ──────────────────────────────────────────────── */}
        <main className="db-main">
          <motion.div
            className="db-status-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="db-status-greeting">Hi, {user.name || user.login}.</h2>

            <img
              src="https://placedog.net/400/280?id=85"
              alt="Sorry dog"
              className="db-status-dog"
            />

            <div className="db-status-badge">At capacity</div>

            <h3 className="db-status-title">We&rsquo;re heads-down on current projects.</h3>
            <p className="db-status-desc">
              We&rsquo;ll notify you at <strong>{user.email || `@${user.login}`}</strong> the
              moment our agent is ready to take on new work. You&rsquo;re in the queue —
              we&rsquo;ll be in touch soon.
            </p>

            <div className="db-checklist">
              <div className="db-check-item">
                <span className="db-check-icon db-check-icon--done">✓</span>
                Account created
              </div>
              <div className="db-check-item db-check-item--pending">
                <span className="db-check-icon db-check-icon--pending">○</span>
                Agent assigned to your project
              </div>
              <div className="db-check-item db-check-item--pending">
                <span className="db-check-icon db-check-icon--pending">○</span>
                Deployment kicks off
              </div>
            </div>

            <a
              href="https://calendly.com/daniel-joinanvil/30min"
              target="_blank"
              rel="noreferrer"
              className="db-book-btn"
            >
              Book a meeting →
            </a>
          </motion.div>
        </main>

      </div>
    </div>
  )
}
