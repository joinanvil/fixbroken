import { useEffect } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'

function useAuth() {
  try { return JSON.parse(localStorage.getItem('anvil_user')) } catch { return null }
}

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
    <motion.div
      className="dashboard-page"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="dashboard-card">
        <img src={user.avatar} alt={user.name || user.login} className="dashboard-avatar" />
        <h2 className="dashboard-greeting">Hi, {user.name || user.login}.</h2>

        <img
          src="https://placedog.net/400/280?id=85"
          alt="Sorry dog"
          className="dashboard-sorry-dog"
        />

        <div className="dashboard-capacity-badge">At capacity</div>

        <h3 className="dashboard-title">We&rsquo;re heads-down on current projects.</h3>
        <p className="dashboard-desc">
          We&rsquo;ll notify you at <strong>{user.email || `@${user.login}`}</strong> the
          moment our agent is ready to take on new work. You&rsquo;re in the queue —
          we&rsquo;ll be in touch soon.
        </p>

        <div className="dashboard-checklist">
          <div className="dashboard-check-item">
            <span className="dashboard-check">✓</span>Account created
          </div>
          <div className="dashboard-check-item dashboard-check-item--pending">
            <span className="dashboard-check-pending">○</span>Agent assigned to your project
          </div>
          <div className="dashboard-check-item dashboard-check-item--pending">
            <span className="dashboard-check-pending">○</span>Deployment kicks off
          </div>
        </div>

        <button className="dashboard-signout" onClick={signOut}>Sign out</button>
      </div>
    </motion.div>
  )
}
