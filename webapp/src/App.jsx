import { useState, useEffect, useRef, useId, Fragment } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import './App.css'
import DashboardPage from './Dashboard.jsx'

const CALENDLY_URL = 'https://calendly.com/daniel-joinanvil/30min'
const API_URL = 'https://fixbroken-f36a.vercel.app'
const SHEET_URL = 'https://script.google.com/macros/s/AKfycby7YupguaO55A_GT_D1GsC9GZ_QLtcmlaZgnlmUBvr8uk3-m2c0GJD943M3wakrjB8P/exec'

function CloudLogo({ width = 34, className }) {
  const uid = useId().replace(/:/g, '')
  const height = Math.round(width * 22 / 34)
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 34 22" fill="none">
      <defs>
        {/* Mask cuts a gap around the front cloud so both shapes read as separate */}
        <mask id={uid}>
          <rect width="34" height="22" fill="white"/>
          <ellipse cx="24" cy="15" rx="11.5" ry="7"   fill="black"/>
          <circle  cx="19" cy="11" r="8"              fill="black"/>
          <circle  cx="27" cy="8"  r="9.5"            fill="black"/>
        </mask>
      </defs>
      {/* Back cloud */}
      <g mask={`url(#${uid})`} fill="#6c63ff">
        <ellipse cx="11" cy="15" rx="9"   ry="5.5"/>
        <circle  cx="7"  cy="11" r="5.5"/>
        <circle  cx="15" cy="9"  r="6.5"/>
      </g>
      {/* Front cloud */}
      <g fill="#6c63ff">
        <ellipse cx="24" cy="15" rx="10"  ry="5.5"/>
        <circle  cx="19" cy="11" r="6.5"/>
        <circle  cx="27" cy="8"  r="8"/>
      </g>
    </svg>
  )
}

const LOGOS = [
  { name: 'Google',   src: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
  { name: 'AWS',      src: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
  { name: 'Azure',    src: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Microsoft_Azure_Logo.svg' },
  { name: 'Lovable',  src: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Lovable_Logo_%2B_Wordmark_Black.png', height: 48 },
  { name: 'Base44',   src: 'https://assets.sonary.com/wp-content/uploads/2025/08/18115434/Base44_l.svg' },
]

const TECH_LOGOS = [
  { name: 'React',   src: 'https://upload.wikimedia.org/wikipedia/commons/3/30/React_Logo_SVG.svg' },
  { name: 'Node.js', src: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg' },
  { name: 'Python',  src: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Python_logo_01.svg' },
  { name: 'MongoDB', src: 'https://upload.wikimedia.org/wikipedia/en/5/5a/MongoDB_Fores-Green.svg' },
  { name: 'GitHub',     src: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg' },
  { name: 'PostgreSQL', src: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg' },
  { name: 'MySQL',      src: 'https://upload.wikimedia.org/wikipedia/en/d/dd/MySQL_logo.svg' },
  { name: 'and more', src: null },
]

const ORB_CONFIG = [
  { x: '15%', y: '20%', size: 400, color: 'rgba(108,99,255,0.06)', duration: 25 },
  { x: '75%', y: '60%', size: 350, color: 'rgba(167,139,250,0.05)', duration: 30 },
  { x: '50%', y: '80%', size: 300, color: 'rgba(99,140,255,0.04)', duration: 20 },
]

const PARTICLES = Array.from({ length: 20 }, () => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  yDelta: -30 - Math.random() * 40,
  duration: 4 + Math.random() * 6,
  delay: Math.random() * 5,
}))

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
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="particle"
          style={{ left: p.left, top: p.top }}
          animate={{ y: [0, p.yDelta, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function SectionDivider() {
  return (
    <motion.div
      className="section-divider"
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    />
  )
}

function DeployPanel() {
  return (
    <div className="mp-panel">
      <div className="mp-agent-row">
        <div className="mp-avatar">
          <CloudLogo width={18} />
        </div>
        <div>
          <div className="mp-agent-name">Anvil Deploy Agent</div>
          <div className="mp-agent-sub">Reading your project…</div>
        </div>
        <span className="mp-pulse" />
      </div>

      <div className="mp-card mp-repo">
        <span className="mp-repo-icon">⚡</span>
        <div>
          <div className="mp-repo-name">github.com/acme/my-ai-app</div>
          <div className="mp-repo-branch">main · just now</div>
        </div>
      </div>

      <div className="mp-steps">
        <div className="mp-step mp-done"><span className="mp-dot mp-dot--done">✓</span>Your app uses a website and a server</div>
        <div className="mp-step mp-done"><span className="mp-dot mp-dot--done">✓</span>Found your database and environment variables</div>
        <div className="mp-step mp-done"><span className="mp-dot mp-dot--done">✓</span>Setting up your server in the cloud</div>
        <div className="mp-step mp-active"><span className="mp-dot mp-dot--active">●</span>Connecting your custom domain…</div>
        <div className="mp-step mp-muted"><span className="mp-dot mp-dot--muted">○</span>Turning on encryption so your users are secure</div>
      </div>

      <div className="mp-progress">
        <div className="mp-progress-fill" style={{ width: '72%' }} />
      </div>
      <div className="mp-progress-label">Almost there — your app is going live</div>
    </div>
  )
}

function MonitorPanel() {
  return (
    <div className="mp-panel">
      <div className="mp-monitor-top">
        <span className="mp-monitor-title">Live Activity</span>
        <span className="mp-alert-pill">● 2 issues spotted</span>
      </div>

      <div className="mp-card mp-logs">
        <div className="mp-log"><span className="mp-log-time">2:14 PM</span><span>User signed up successfully · fast ✓</span></div>
        <div className="mp-log mp-log-warn"><span className="mp-log-time">2:15 PM</span><span>⚠ Page loaded slowly for some users (2.3s)</span></div>
        <div className="mp-log mp-log-err"><span className="mp-log-time">2:15 PM</span><span>✕ Something broke connecting to the database — happened 3 times</span></div>
        <div className="mp-log mp-log-err"><span className="mp-log-time">2:16 PM</span><span>✕ 8 people couldn't load their profile</span></div>
      </div>

      <div className="mp-card mp-ticket">
        <div className="mp-ticket-eyebrow">📋 Ticket created for your team</div>
        <div className="mp-ticket-title">Users can't log in — database is struggling</div>
        <div className="mp-ticket-meta">
          <span className="mp-severity">High priority</span>
          <span>· Assigned to Anvil</span>
        </div>
      </div>
    </div>
  )
}

function FixPanel() {
  return (
    <div className="mp-panel">
      <div className="mp-agent-row">
        <div className="mp-avatar">
          <CloudLogo width={18} />
        </div>
        <div>
          <div className="mp-agent-name">Anvil Fix Agent</div>
          <div className="mp-agent-sub">Working on: users can't log in</div>
        </div>
      </div>

      <div className="mp-steps">
        <div className="mp-step mp-done"><span className="mp-dot mp-dot--done">✓</span>Read through the error logs</div>
        <div className="mp-step mp-done"><span className="mp-dot mp-dot--done">✓</span>Found the problem — too many users connecting at once</div>
        <div className="mp-step mp-done"><span className="mp-dot mp-dot--done">✓</span>Wrote a fix and tested it</div>
        <div className="mp-step mp-active"><span className="mp-dot mp-dot--active">●</span>Sending the fix to GitHub for your review…</div>
      </div>

      <div className="mp-card mp-pr">
        <div className="mp-pr-top">
          <span className="mp-pr-num">#47</span>
          <span className="mp-pr-title">Fix: more people can use your app at the same time</span>
        </div>
        <div className="mp-pr-meta">
          <span className="mp-diff-add">+3 lines</span>
          <span className="mp-diff-del">−1 line</span>
          <span className="mp-pr-branch">main ← fix/db-pool</span>
        </div>
        <div className="mp-pr-cta">Review on GitHub →</div>
      </div>
    </div>
  )
}

function IconGitHub() {
  return <img src="https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg" alt="GitHub" width={28} height={28} className="how-icon-github" />
}

function IconScan() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function IconCloudBuild() {
  return <CloudLogo width={28} />
}

function IconShield() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function IconEye() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconPulse() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}

function SecurityPanel() {
  return (
    <div className="mp-panel">
      <div className="mp-agent-row">
        <div className="mp-avatar">
          <CloudLogo width={18} />
        </div>
        <div>
          <div className="mp-agent-name">Anvil Security Agent</div>
          <div className="mp-agent-sub">Full audit completed on deploy</div>
        </div>
      </div>

      <div className="mp-security-list">
        <div className="mp-sec-item mp-sec-ok"><span className="mp-sec-icon">✓</span>Environment variables secured &amp; encrypted</div>
        <div className="mp-sec-item mp-sec-ok"><span className="mp-sec-icon">✓</span>No secrets found in source code</div>
        <div className="mp-sec-item mp-sec-warn">
          <span className="mp-sec-icon mp-sec-icon--warn">⚠</span>
          <span>Outdated dependency with known security flaw</span>
          <span className="mp-sec-patch">Auto-patching →</span>
        </div>
        <div className="mp-sec-item mp-sec-ok"><span className="mp-sec-icon">✓</span>SSL certificate active &amp; auto-renewing</div>
        <div className="mp-sec-item mp-sec-ok"><span className="mp-sec-icon">✓</span>Security protections activated</div>
      </div>

      <div className="mp-card mp-sec-summary">
        <span className="mp-sec-count mp-sec-count--ok">4 passed</span>
        <span className="mp-sec-count mp-sec-count--warn">1 auto-patched</span>
        <span className="mp-sec-count mp-sec-count--crit">0 critical</span>
        <span className="mp-sec-free">This audit is free</span>
      </div>
    </div>
  )
}

const DEMO_TABS = [
  { label: 'Ship to Cloud', icon: '☁' },
  { label: 'Monitor',       icon: '📊' },
  { label: 'Fix Bugs',      icon: '🔧' },
  { label: 'Security Audit', icon: '🔒' },
]
const DEMO_PANELS = [DeployPanel, MonitorPanel, FixPanel, SecurityPanel]

function AppMockup() {
  const [tab, setTab] = useState(0)
  const sectionRef = useRef(null)
  const Panel = DEMO_PANELS[tab]

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const { top, height } = el.getBoundingClientRect()
      const scrollRange = height - window.innerHeight
      if (scrollRange <= 0) return
      const progress = Math.max(0, Math.min(1, -top / scrollRange))
      const newTab = Math.min(DEMO_TABS.length - 1, Math.floor(progress * DEMO_TABS.length))
      setTab(newTab)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={sectionRef} className="mockup-scroll-container">
      <div className="mockup-sticky-wrap">
        <section className="mockup-section">
          <motion.div
            className="mockup-eyebrow"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
          >
            <span className="features-eyebrow">See it in action</span>
            <h2 className="features-title">Your app, handled<br />end to end</h2>
            <p className="tech-stack-desc">Share your GitHub link. We take it from there — no setup, no hassle, no surprises.</p>
          </motion.div>

          <motion.div
            className="mockup-frame"
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="mockup-titlebar">
              <div className="mockup-wdots">
                <span className="mockup-wdot wd-red" />
                <span className="mockup-wdot wd-yellow" />
                <span className="mockup-wdot wd-green" />
              </div>
              <div className="mockup-breadcrumb">
                <CloudLogo width={14} />
                <span>my-ai-app</span>
                <span className="mockup-sep">›</span>
                <span>Dashboard</span>
              </div>
            </div>

            <div className="mockup-demotabs">
              {DEMO_TABS.map((t, i) => (
                <button
                  key={t.label}
                  className={`mockup-demotab${tab === i ? ' mockup-demotab--on' : ''}`}
                  onClick={() => setTab(i)}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            <div className="mockup-content-wrap">
              <motion.div
                key={tab}
                className="mockup-panel-area"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Panel />
              </motion.div>

              {/* Progress nav */}
              <div className="mockup-progress-nav">
                {DEMO_TABS.map((t, i) => (
                  <button
                    key={i}
                    className={`mpn-step${tab === i ? ' mpn-step--on' : ''}${i < tab ? ' mpn-step--done' : ''}`}
                    onClick={() => setTab(i)}
                    title={t.label}
                  >
                    <span className="mpn-dot" />
                    <span className="mpn-label">{t.label}</span>
                    {i < DEMO_TABS.length - 1 && <span className="mpn-line" />}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}

function TechStack() {
  return (
    <section className="tech-stack">
      <motion.div
        className="tech-stack-header"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.55 }}
      >
        <span className="features-eyebrow">Any stack</span>
        <h2 className="features-title">We handle the complexity.<br />You stay focused on building.</h2>
        <p className="tech-stack-desc">Whatever your AI tool generated — we know how to put it live, connect all the parts, and keep it running. No technical knowledge required.</p>
      </motion.div>
      <div className="tech-stack-grid">
        {TECH_LOGOS.map((logo, i) => (
          <motion.div
            key={logo.name}
            className={`tech-stack-item${logo.src === null ? ' tech-stack-more' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
          >
            {logo.src === null ? (
              <span className="tech-stack-more-text">+ more</span>
            ) : (
              <>
                <img src={logo.src} alt={logo.name} className="tech-stack-logo" />
                <span className="tech-stack-name">{logo.name}</span>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function SkyOverlay() {
  return (
    <div className="sky-overlay">
      <div className="sun" />
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="cloud cloud-3" />
    </div>
  )
}

function useTheme(pathname) {
  const timer = useRef(null)
  useEffect(() => {
    const setTheme = (t) => document.documentElement.setAttribute('data-theme', t)
    const alreadySeen = localStorage.getItem('anvil_theme') === 'light'

    if (pathname !== '/') {
      clearTimeout(timer.current)
      timer.current = null
      setTheme('light')
      return
    }

    // Homepage, already transitioned before — stay light, no animation
    if (alreadySeen) {
      setTheme('light')
      return
    }

    // Homepage, first ever visit — start dark, animate to light on activity
    document.documentElement.removeAttribute('data-theme')
    timer.current = null

    const onActivity = () => {
      if (timer.current) return
      timer.current = setTimeout(() => {
        setTheme('light')
        localStorage.setItem('anvil_theme', 'light')
      }, 1000)
    }
    window.addEventListener('mousemove', onActivity)
    window.addEventListener('scroll', onActivity, { passive: true })
    window.addEventListener('keydown', onActivity)
    return () => {
      clearTimeout(timer.current)
      timer.current = null
      window.removeEventListener('mousemove', onActivity)
      window.removeEventListener('scroll', onActivity)
      window.removeEventListener('keydown', onActivity)
    }
  }, [pathname])
}

function useAuth() {
  return useState(() => {
    try { return JSON.parse(localStorage.getItem('anvil_user')) } catch { return null }
  })[0]
}

function LogoTicker() {
  const doubled = [...LOGOS, ...LOGOS]
  return (
    <div className="logo-ticker-section">
      <span className="logo-ticker-label">Trusted by teams<br />building with AI</span>
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

const FEATURES = [
  {
    img: '/deploy.png',
    title: 'Ship to the Cloud',
    label: 'Deploy',
    body: 'Your code, live on the internet. We handle domains, servers, and all the technical setup so your app is fast and reliable from day one.',
  },
  {
    img: '/monitor.png',
    title: '24/7 Monitoring',
    label: 'Monitor',
    body: 'We watch your app around the clock. If something goes wrong, we know before your users do — and we\'re already on it.',
  },
  {
    img: '/bugfix.png',
    title: 'Bugs Fixed Fast',
    label: 'Fix',
    body: 'Bugs happen. We catch them first. Fast diagnosis, fast fixes — your product stays polished and your users stay happy.',
  },
]

function Features() {
  return (
    <section className="features">
      <motion.div
        className="features-header"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
      >
        <span className="features-eyebrow">What we do</span>
        <h2 className="features-title">Everything your app needs<br />to go from code to live on the internet</h2>
      </motion.div>

      <div className="features-grid">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.label}
            className="feature-card"
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: i * 0.12, ease: 'easeOut' }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
          >
            <div className="feature-img-wrap">
              <img src={f.img} alt={f.title} className="feature-img" />
              <div className="feature-img-fade" />
            </div>
            <div className="feature-body">
              <span className="feature-label">{f.label}</span>
              <h3 className="feature-card-title">{f.title}</h3>
              <p className="feature-card-desc">{f.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

const HOW_PHASES = [
  {
    num: '01',
    Icon: IconGitHub,
    title: 'Connect your GitHub',
    body: 'Give us read access to your code in one click — that\'s it. No forms to fill out, no files to upload, no setup wizard. You stay in control the whole time.',
    callout: null,
    chips: [],
    details: [],
  },
  {
    num: '02',
    Icon: IconScan,
    title: 'Our agent maps your app',
    body: 'We send an AI agent into your code to understand what you\'ve built. It figures out every piece of your app — the website visitors see, the logic running behind the scenes, the data your app stores — before touching anything.',
    callout: 'Think of it like hiring a senior developer to read through everything and write up a plan before starting any work.',
    chips: [],
    details: [
      'Identifies your website / user interface',
      'Finds your backend logic and API',
      'Spots any databases your app uses',
      'Maps how all the pieces connect',
    ],
  },
  {
    num: '03',
    Icon: IconCloudBuild,
    title: 'We build your cloud setup',
    body: 'Based on what your app actually needs, we set up the right hosting, databases, and connections — all packaged up and ready to run. We then send a suggestion to your GitHub for you to look over and approve before anything changes.',
    callout: 'We send a "suggestion" — a tidy list of the changes we want to make — to your GitHub for you to review. You approve it, and we do the rest.',
    chips: [],
    details: [
      'Hosting for your website & backend',
      'Database setup if your app stores data',
      'Secure connections between all parts',
      'You approve every change before it goes in',
    ],
  },
  {
    num: '04',
    Icon: IconShield,
    title: 'Security audit — included free',
    body: 'Before anything goes live, our agent scans your code for common mistakes that could expose your users or your business. We catch things developers often miss, and we fix them automatically where we can.',
    callout: null,
    chips: [{ label: 'Always free', color: 'green' }],
    details: [
      'Passwords & API keys accidentally left in the code',
      'User data that could be seen by the wrong people',
      'Outdated libraries with known security issues',
      'Missing encryption on connections (SSL)',
      'Environment variables properly protected',
    ],
  },
  {
    num: '05',
    Icon: IconEye,
    title: 'Preview it before anyone else sees it',
    body: 'Before your app goes public, you get a private link — a "staging" copy — that looks and works exactly like the real thing. Test it, share it with your team, and make sure you\'re happy with everything.',
    callout: 'Nothing goes live until you give the green light.',
    chips: [],
    details: [
      'Full working copy of your app, privately accessible',
      'Share with teammates or clients for feedback',
      'Test every feature before real users see it',
      'Flip to live in one click when you\'re ready',
    ],
  },
  {
    num: '06',
    Icon: IconPulse,
    title: 'Live — and we keep watching',
    body: 'Your app is on the internet, your domain is connected, and we\'re watching it 24/7. If something breaks, we\'re on it — often before you even notice. Updates, fixes, and improvements happen automatically.',
    callout: null,
    chips: [],
    details: [
      'Domain & SSL set up automatically',
      '24/7 uptime monitoring',
      'Instant alerts if something goes wrong',
      'Bug fixes sent as code suggestions for your review',
    ],
  },
]

function HowItWorks() {
  return (
    <section className="how-section">
      <motion.div
        className="how-header"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
      >
        <span className="features-eyebrow">How it works</span>
        <h2 className="features-title">From your code to live —<br />here&rsquo;s exactly what happens</h2>
        <p className="tech-stack-desc">Written in plain English. No tech jargon. All you need to do is share your GitHub link.</p>
      </motion.div>

      <div className="how-timeline">
        {HOW_PHASES.map((phase, i) => (
          <motion.div
            key={phase.num}
            className="how-phase"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: 0.05 }}
          >
            <div className="how-phase-left">
              <div className="how-phase-num">{phase.num}</div>
              {i < HOW_PHASES.length - 1 && <div className="how-phase-line" />}
            </div>

            <div className="how-phase-right">
              <div className="how-phase-icon"><phase.Icon /></div>
              <div className="how-phase-header">
                <h3 className="how-phase-title">{phase.title}</h3>
                {phase.chips.map(c => (
                  <span key={c.label} className={`how-chip how-chip--${c.color}`}>{c.label}</span>
                ))}
              </div>
              <p className="how-phase-body">{phase.body}</p>

              {phase.details.length > 0 && (
                <ul className="how-phase-details">
                  {phase.details.map(d => (
                    <li key={d}><span className="how-check">✓</span>{d}</li>
                  ))}
                </ul>
              )}

              {phase.callout && (
                <div className="how-callout">
                  <span className="how-callout-icon">💬</span>
                  {phase.callout}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

const FREE_INCLUDED = [
  'Dashboard & monitoring',
  'Automatic deployments',
  'Bug fixes & code suggestions',
  'Secure connection (HTTPS) + domain setup',
  '24/7 uptime alerts',
  'Automatic code review',
  'Password & secrets protection',
  'Security audit (on signup)',
]

const RATES = [
  { label: 'Cloud server', price: 29, desc: 'Per server/mo · 10% off per server added (up to 50%)', icon: '☁', footnote: '*' },
  { label: 'Database',     price: 19, desc: 'Per database, per month', icon: '🗄', footnote: '†' },
]

function Pricing({ onCta }) {
  return (
    <section className="pricing">
      <motion.div
        className="pricing-header"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
      >
        <span className="features-eyebrow">Pricing</span>
        <h2 className="features-title">Your UI is <span className="pricing-free-highlight">free.</span><br />Pay only for what runs.</h2>
        <p className="tech-stack-desc">Everything you see — the dashboard, bug fixes, deployments, monitoring — costs you nothing. You only pay for the cloud servers and databases we actually run for you.</p>
        <div className="pricing-first-month-banner">
          <strong>First month free.</strong> No credit card required. Cancel anytime.
        </div>
      </motion.div>

      <div className="pricing-model">
        {/* Free column */}
        <motion.div
          className="pricing-free-card"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="pricing-free-label">Always included</div>
          <div className="pricing-free-price">Free</div>
          <ul className="pricing-features">
            {FREE_INCLUDED.map(f => (
              <li key={f}><span className="pricing-check">✓</span>{f}</li>
            ))}
          </ul>
        </motion.div>

        <div className="pricing-plus">+</div>

        {/* Rate cards */}
        <div className="pricing-rates">
          {RATES.map((r, i) => (
            <motion.div
              key={r.label}
              className="pricing-rate-card"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <span className="pricing-rate-icon">{r.icon}</span>
              <div className="pricing-rate-label">{r.label}</div>
              <div className="pricing-rate-price">
                <span className="pricing-dollar">$</span>
                <span className="pricing-amount">{r.price}</span>
                <span className="pricing-per">/mo</span>
                {r.footnote && <sup className="pricing-footnote-mark">{r.footnote}</sup>}
              </div>
              <div className="pricing-rate-desc">{r.desc}</div>
            </motion.div>
          ))}
          <motion.div
            className="pricing-rate-card pricing-rate-cta-card"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="pricing-rate-cta-text">Not sure what you need? Use the calculator below or just talk to us.</p>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={onCta}>
              Get a quote →
            </button>
          </motion.div>
        </div>
      </div>

      <div className="pricing-footnotes">
        <p><sup>*</sup> 2 vCPUs, 4 GB RAM. Price is per calendar month.</p>
        <p><sup>†</sup> Managed database with 10 GB of storage.</p>
      </div>
    </section>
  )
}

function PriceCalc({ onCta }) {
  const [servers, setServers] = useState(1)
  const [dbs, setDbs] = useState(1)

  const discountPct = Math.min((servers - 1) * 10, 50)
  const discountedRate = parseFloat((29 * (1 - discountPct / 100)).toFixed(2))
  const serverPrice = parseFloat((servers * discountedRate).toFixed(2))
  const dbPrice = dbs * 19
  const total = parseFloat((serverPrice + dbPrice).toFixed(2))
  const fullServerPrice = servers * 29
  const savings = parseFloat((fullServerPrice - serverPrice).toFixed(2))

  return (
    <div className="calc-wrap">
      <motion.div
        className="calc-card"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6 }}
      >
        <div className="calc-left">
          <div className="calc-title">Estimate your cost</div>
          <p className="calc-sub">Tell us how many servers and databases your app uses. The rest is free.</p>

          <div className="calc-slider-group">
            <div className="calc-slider-label">
              <span>Cloud servers</span>
              <span className="calc-val">{servers}</span>
            </div>
            <input
              type="range" min="1" max="10" value={servers}
              onChange={e => setServers(Number(e.target.value))}
              className="calc-slider"
            />
            <div className="calc-range-labels"><span>1</span><span>10</span></div>
            {discountPct > 0 && (
              <div className="calc-discount-badge">
                {discountPct}% volume discount applied
                {discountPct >= 50 && ' (max)'}
              </div>
            )}
          </div>

          <div className="calc-slider-group">
            <div className="calc-slider-label">
              <span>Databases</span>
              <span className="calc-val">{dbs}</span>
            </div>
            <input
              type="range" min="1" max="10" value={dbs}
              onChange={e => setDbs(Number(e.target.value))}
              className="calc-slider"
            />
            <div className="calc-range-labels"><span>1</span><span>10</span></div>
          </div>
        </div>

        <div className="calc-right">
          <div className="calc-breakdown">
            <div className="calc-line muted"><span>Dashboard, monitoring, fixes</span><span className="calc-free">Free</span></div>
            <div className="calc-line">
              <span>
                {servers} server{servers > 1 ? 's' : ''} × ${discountedRate}
                {discountPct > 0 && <span className="calc-was"> (was $29)</span>}
              </span>
              <span>${serverPrice}</span>
            </div>
            <div className="calc-line"><span>{dbs} database{dbs > 1 ? 's' : ''} × $19</span><span>${dbPrice}</span></div>
            <div className="calc-total-line" />
            <div className="calc-total">
              <span>Your monthly cost</span>
              <span className="calc-total-price">${total}<span className="calc-mo">/mo</span></span>
            </div>
            {savings > 0 && (
              <div className="calc-savings">You save ${savings}/mo</div>
            )}
          </div>
          <button className="btn-primary calc-cta" onClick={onCta}>
            Get started →
          </button>
        </div>
      </motion.div>
    </div>
  )
}

const HEADLINE_VARIANT = Math.random() < 0.5 ? 'a' : 'b'
const HEADLINES = {
  a: 'Your AI app, live on the internet.',
  b: 'Take your AI app live.',
}

function SignupGraphic() {
  const steps = [
    {
      key: 'github',
      icon: <img src="https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg" alt="GitHub" width={18} height={18} style={{ filter: 'invert(1) opacity(0.9)' }} />,
      name: 'github.com/you/my-app',
      sub: 'main · just now',
      badge: 'Connected',
      badgeCls: 'sg-badge--ok',
    },
    {
      key: 'anvil',
      icon: <CloudLogo width={18} />,
      name: 'Anvil Agent',
      sub: 'Reading your code…',
      active: true,
    },
    {
      key: 'live',
      icon: <CloudLogo width={18} />,
      name: 'your-app.joinanvil.ai',
      sub: 'Live in ~10 minutes',
      badge: '↑ Live',
      badgeCls: 'sg-badge--live',
    },
  ]
  return (
    <div className="sg-scene">
      <div className="sg-headline">From your code to the internet —<br />we handle everything in between.</div>
      {steps.map((step, i) => (
        <Fragment key={step.key}>
          <motion.div
            className={`sg-card${step.active ? ' sg-card--active' : ''}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.18, duration: 0.4 }}
          >
            <div className="sg-card-icon">{step.icon}</div>
            <div className="sg-card-text">
              <div className="sg-card-name">{step.name}</div>
              <div className="sg-card-sub">{step.sub}</div>
            </div>
            {step.badge && <span className={`sg-badge ${step.badgeCls}`}>{step.badge}</span>}
            {step.active && (
              <motion.span
                className="sg-pulse-dot"
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
            )}
          </motion.div>
          {i < steps.length - 1 && (
            <motion.div
              className="sg-connector"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.25 + i * 0.18, duration: 0.3 }}
            />
          )}
        </Fragment>
      ))}
    </div>
  )
}

function SignupPage() {
  const navigate = useNavigate()
  return (
    <div className="signup-page">
      <div className="signup-left">
        <button className="signup-logo" onClick={() => navigate('/')}>
          <CloudLogo width={26} />
          <span>Anvil</span>
        </button>

        <div className="signup-form">
          <div className="signup-eyebrow">Get started free</div>
          <h1 className="signup-title">Deploy your app<br />in minutes, not days.</h1>
          <p className="signup-desc">
            Connect your GitHub and give us read access to your code.
            We&rsquo;ll analyze it, set up your cloud, and get you live —
            automatically. <strong>No technical knowledge needed.</strong>
          </p>

          <div className="signup-free-badge">
            First month free — no credit card required
          </div>

          <a href={`${API_URL}/auth/github`} className="btn-github-signin">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg" alt="" width={20} height={20} />
            Continue with GitHub
          </a>

          <div className="signup-perks">
            <span><span className="perk-check">✓</span> Read-only repository access</span>
            <span><span className="perk-check">✓</span> Cancel anytime</span>
          </div>
        </div>
      </div>

      <div className="signup-right">
        <SignupGraphic />
      </div>
    </div>
  )
}

function AuthCallbackPage() {
  const navigate = useNavigate()
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1))
    const token = params.get('token')
    if (!token) { navigate('/signup?error=1'); return }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      localStorage.setItem('anvil_token', token)
      localStorage.setItem('anvil_user', JSON.stringify({
        id: payload.sub,
        login: payload.login,
        name: payload.name,
        email: payload.email,
        avatar: payload.avatar,
      }))
      navigate('/dashboard')
    } catch {
      navigate('/signup?error=1')
    }
  }, [navigate])

  return (
    <div className="auth-callback-page">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}>
        <CloudLogo width={36} />
      </motion.div>
      <p>Signing you in…</p>
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Nav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const user = useAuth()
  return (
    <nav className="nav">
      <button className="logo" onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
        <CloudLogo className="logo-icon" />
        Anvil
      </button>
      <div className="nav-links">
        <button className={`nav-link${pathname === '/' ? ' nav-link--on' : ''}`} onClick={() => navigate('/')}>Home</button>
        <button className={`nav-link${pathname === '/how-it-works' ? ' nav-link--on' : ''}`} onClick={() => navigate('/how-it-works')}>How it works</button>
        <button className={`nav-link${pathname === '/pricing' ? ' nav-link--on' : ''}`} onClick={() => navigate('/pricing')}>Pricing</button>
        {user ? (
          <div className="nav-user-wrap">
            <button className="nav-user">
              <img src={user.avatar} alt={user.name || user.login} className="nav-avatar" />
              <span className="nav-user-name">{user.name || user.login}</span>
            </button>
            <div className="nav-user-dropdown">
              <button className="nav-dropdown-item" onClick={() => navigate('/dashboard')}>Dashboard</button>
              <button className="nav-dropdown-item nav-dropdown-item--danger" onClick={() => {
                localStorage.removeItem('anvil_token')
                localStorage.removeItem('anvil_user')
                navigate('/')
                window.location.reload()
              }}>Sign out</button>
            </div>
          </div>
        ) : (
          <button className="nav-link nav-link--cta" onClick={() => navigate('/signup')}>Get started &rarr;</button>
        )}
      </div>
    </nav>
  )
}

function HowItWorksPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HowItWorks />
    </motion.div>
  )
}

function PricingPage({ onCta }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Pricing onCta={onCta} />
        <PriceCalc onCta={onCta} />
      </motion.div>
    </>
  )
}

function HomePage() {
  const navigate = useNavigate()
  return (
    <>
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
          {HEADLINES[HEADLINE_VARIANT]}
        </motion.h1>

        <motion.p
          className="subtitle"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Built it with AI? We&rsquo;ll put it online and keep it running.
          No servers, no DevOps, no stress. Just share your link.
        </motion.p>

        <motion.div
          className="cta-group"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.button
            className="btn-primary"
            onClick={() => navigate('/signup')}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            Get your app live
            <span>&rarr;</span>
          </motion.button>
          <button className="btn-secondary" onClick={() => navigate('/pricing')}>
            See pricing
          </button>
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
              <span className="stat-label">You own your code</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value">0</span>
              <span className="stat-label">Long-term contracts</span>
            </div>
          </div>
        </motion.div>
      </main>

      <TechStack />
      <SectionDivider />
      <AppMockup />
      <SectionDivider />
      <Features />
    </>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <HomePage />
          </motion.div>
        } />
        <Route path="/how-it-works" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <HowItWorksPage />
          </motion.div>
        } />
        <Route path="/pricing" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <PricingPage onCta={() => navigate('/signup')} />
          </motion.div>
        } />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const { pathname } = useLocation()
  useTheme(pathname)
  const fromAd = new URLSearchParams(window.location.search).get('book') === 'true'
  const [modalOpen, setModalOpen] = useState(() => fromAd)
  const [isExitIntent, setIsExitIntent] = useState(false)
  const showAdModal = fromAd || isExitIntent
  const [email, setEmail] = useState('')
  const [isValid, setIsValid] = useState(false)
  const emailTracked = useRef(false)
  const modalOpenedAt = useRef(0)

  const track = (event, params = {}) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, params)
    }
  }

  const openModal = (btn) => {
    track('cta_click', { button: btn })
    modalOpenedAt.current = Date.now()
    setModalOpen(true)
  }

  useEffect(() => {
    track('headline_variant_shown', { variant: HEADLINE_VARIANT, headline: HEADLINES[HEADLINE_VARIANT] })
  }, [])

  useEffect(() => {
    if (localStorage.getItem('anvil_ei')) return // already shown on this device
    const handler = (e) => {
      if (e.clientY > 10) return
      localStorage.setItem('anvil_ei', '1')
      modalOpenedAt.current = Date.now()
      setIsExitIntent(true)
      setModalOpen(true)
      track('exit_intent')
      document.removeEventListener('mouseleave', handler)
    }
    document.addEventListener('mouseleave', handler)
    return () => document.removeEventListener('mouseleave', handler)
  }, [])

  const handleEmailChange = (e) => {
    const val = e.target.value
    setEmail(val)
    setIsValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
    if (!emailTracked.current && val.length > 0) {
      emailTracked.current = true
      track('email_input_started', { source: fromAd ? 'ad' : isExitIntent ? 'exit_intent' : 'organic' })
    }
  }

  const handleBook = () => {
    track('book_submitted', { source: fromAd ? 'ad' : isExitIntent ? 'exit_intent' : 'organic' })
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
      <SkyOverlay />
      <FloatingOrbs />
      <Particles />
      <motion.div
        className="glow"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="grid-bg" />

      <ScrollToTop />
      {pathname !== '/signup' && pathname !== '/auth/callback' && <Nav />}

      <AnimatedRoutes />

      {pathname !== '/signup' && pathname !== '/auth/callback' && <LogoTicker />}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="modal-overlay"
            onClick={() => { if (Date.now() - modalOpenedAt.current > 400) setModalOpen(false) }}
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className={`modal${showAdModal ? ' modal-ad' : ''}`}
              onClick={(e) => e.stopPropagation()}
              initial={false}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <button className="modal-close" onClick={() => setModalOpen(false)}>
                &times;
              </button>

              {showAdModal ? (
                <>
                  <div className="modal-ad-badge">From broken to live</div>
                  <h2 className="modal-title modal-ad-title">
                    We&rsquo;ll take running<br />your app off your plate.
                  </h2>
                  <p className="modal-desc">
                    Your app works locally. We make it work for everyone else &mdash; and keep it that way.
                  </p>
                  <ul className="modal-ad-perks">
                    <li><span className="perk-check">✓</span> Cloud deployment &amp; domain setup</li>
                    <li><span className="perk-check">✓</span> 24/7 uptime monitoring</li>
                    <li><span className="perk-check">✓</span> Bugs fixed fast, usually within hours</li>
                  </ul>
                  <p className="modal-ad-cta-label">Let&rsquo;s start</p>
                </>
              ) : (
                <>
                  <h2 className="modal-title">Book a call</h2>
                  <p className="modal-desc">
                    Enter your email and we&rsquo;ll get you on the calendar.
                  </p>
                </>
              )}
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
                {showAdModal ? 'Get started →' : 'Book →'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
