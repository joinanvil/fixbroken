import { useState, useEffect, useRef, useId } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import './App.css'

const CALENDLY_URL = 'https://calendly.com/daniel-joinanvil/30min'
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
        <div className="mp-step mp-done"><span className="mp-dot mp-dot--done">✓</span>Your app uses React + a Node.js backend</div>
        <div className="mp-step mp-done"><span className="mp-dot mp-dot--done">✓</span>Found your database and environment variables</div>
        <div className="mp-step mp-done"><span className="mp-dot mp-dot--done">✓</span>Setting up your server in the cloud</div>
        <div className="mp-step mp-active"><span className="mp-dot mp-dot--active">●</span>Connecting your custom domain…</div>
        <div className="mp-step mp-muted"><span className="mp-dot mp-dot--muted">○</span>Turning on SSL so your users are secure</div>
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
        <div className="mp-step mp-active"><span className="mp-dot mp-dot--active">●</span>Opening a pull request for you to review…</div>
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

const DEMO_TABS = [
  { label: 'Ship to Cloud', icon: '☁' },
  { label: 'Monitor',       icon: '📊' },
  { label: 'Fix Bugs',      icon: '🔧' },
]
const DEMO_PANELS = [DeployPanel, MonitorPanel, FixPanel]

function AppMockup() {
  const [tab, setTab] = useState(0)
  const Panel = DEMO_PANELS[tab]

  return (
    <section className="mockup-section">
      <motion.div
        className="mockup-eyebrow"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
      >
        <span className="features-eyebrow">How it works</span>
        <h2 className="features-title">Your app, handled<br />end to end</h2>
        <p className="tech-stack-desc">Share your GitHub link. We take it from there — no setup, no DevOps, no surprises.</p>
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
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              className="mockup-panel-area"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <Panel />
            </motion.div>
          </AnimatePresence>

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
        <p className="tech-stack-desc">Whatever your AI tool generated — we know how to deploy it, wire it up, and keep it running. No DevOps degree required.</p>
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

function useTheme() {
  const timer = useRef(null)
  useEffect(() => {
    const setTheme = (t) => document.documentElement.setAttribute('data-theme', t)
    const onActivity = () => {
      if (timer.current) return
      timer.current = setTimeout(() => setTheme('light'), 1000)
    }
    window.addEventListener('mousemove', onActivity)
    window.addEventListener('scroll', onActivity, { passive: true })
    window.addEventListener('keydown', onActivity)
    return () => {
      clearTimeout(timer.current)
      window.removeEventListener('mousemove', onActivity)
      window.removeEventListener('scroll', onActivity)
      window.removeEventListener('keydown', onActivity)
    }
  }, [])
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

const FEATURES = [
  {
    img: '/deploy.png',
    title: 'Ship to the Cloud',
    label: 'Deploy',
    body: 'Your code, live on the cloud. We handle domains, SSL, and infrastructure so your app is fast, reliable, and ready to scale.',
  },
  {
    img: '/monitor.png',
    title: '24/7 Monitoring',
    label: 'Monitor',
    body: 'We watch your app around the clock. Uptime checks, error alerts, and performance tracking — so your users never hit a wall.',
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
        <h2 className="features-title">Everything your app needs<br />to go from code to production</h2>
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

const HOW_STEPS = [
  {
    num: '01',
    title: 'Connect your GitHub',
    body: 'Grant us read access to your repo — that\'s it. No code changes, no config files, no setup wizard.',
    icon: '🔗',
  },
  {
    num: '02',
    title: 'Our agent reads your code',
    body: 'Our AI scans your project, figures out your stack, and sets up the right cloud infrastructure automatically.',
    icon: '🤖',
  },
  {
    num: '03',
    title: 'Your app goes live',
    body: 'We deploy it, hook up your domain, turn on SSL, and start watching. From there we handle updates, alerts, and fixes.',
    icon: '🚀',
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
        <h2 className="features-title">Three steps from repo<br />to running in production</h2>
        <p className="tech-stack-desc">All we need is access to your GitHub. The rest is on us.</p>
      </motion.div>

      <div className="how-steps">
        {HOW_STEPS.map((step, i) => (
          <motion.div
            key={step.num}
            className="how-step"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
          >
            <div className="how-step-top">
              <span className="how-num">{step.num}</span>
              <span className="how-icon">{step.icon}</span>
            </div>
            <h3 className="how-title">{step.title}</h3>
            <p className="how-body">{step.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function PriceCalc({ onCta }) {
  const [servers, setServers] = useState(1)
  const [dbs, setDbs] = useState(1)

  const serverPrice = servers * 29
  const dbPrice = dbs * 19
  const base = 29
  const total = base + serverPrice + dbPrice

  const recommended = total <= 79 ? 'Starter' : total <= 249 ? 'Pro' : 'Scale'

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
          <p className="calc-sub">Drag the sliders to match your setup. We&rsquo;ll show you what fits.</p>

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
            <div className="calc-line"><span>Base plan</span><span>$29</span></div>
            <div className="calc-line"><span>{servers} server{servers > 1 ? 's' : ''} × $29</span><span>${serverPrice}</span></div>
            <div className="calc-line"><span>{dbs} database{dbs > 1 ? 's' : ''} × $19</span><span>${dbPrice}</span></div>
            <div className="calc-total-line" />
            <div className="calc-total">
              <span>Estimated total</span>
              <span className="calc-total-price">${total}<span className="calc-mo">/mo</span></span>
            </div>
          </div>
          <div className="calc-rec">
            Closest plan: <strong>{recommended}</strong>
          </div>
          <button className="btn-primary calc-cta" onClick={onCta}>
            Get an exact quote →
          </button>
        </div>
      </motion.div>
    </div>
  )
}

const PLANS = [
  {
    name: 'Starter',
    price: 49,
    desc: 'One app, live and looked after.',
    features: [
      '1 cloud server',
      '1 database',
      'Automatic deployments',
      'Uptime monitoring',
      'SSL + custom domain',
    ],
    cta: 'Get started',
  },
  {
    name: 'Pro',
    price: 149,
    desc: 'For apps with real users that need active care.',
    popular: true,
    features: [
      '3 cloud servers',
      '2 databases',
      '24/7 monitoring & alerts',
      'Bug fixes included',
      'Automatic deployments',
      'Priority support',
    ],
    cta: 'Get started',
  },
  {
    name: 'Scale',
    price: 399,
    desc: 'Multiple apps, full coverage, no limits.',
    features: [
      'Unlimited servers',
      'Unlimited databases',
      'Everything in Pro',
      'Dedicated engineer',
      '99.9% uptime SLA',
    ],
    cta: 'Talk to us',
  },
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
        <h2 className="features-title">Simple, predictable pricing</h2>
        <p className="tech-stack-desc">No hidden fees. No infrastructure surprises. One flat monthly rate for a fully managed app.</p>
      </motion.div>

      <div className="pricing-grid">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.name}
            className={`pricing-card${plan.popular ? ' pricing-card--pop' : ''}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            {plan.popular && <div className="pricing-badge">Most popular</div>}
            <div className="pricing-name">{plan.name}</div>
            <div className="pricing-price-row">
              <span className="pricing-dollar">$</span>
              <span className="pricing-amount">{plan.price}</span>
              <span className="pricing-per">/mo</span>
            </div>
            <p className="pricing-desc">{plan.desc}</p>
            <ul className="pricing-features">
              {plan.features.map(f => (
                <li key={f}><span className="pricing-check">✓</span>{f}</li>
              ))}
            </ul>
            <button
              className={`pricing-cta${plan.popular ? ' pricing-cta--pop' : ''}`}
              onClick={onCta}
            >
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

const HEADLINE_VARIANT = Math.random() < 0.5 ? 'a' : 'b'
const HEADLINES = {
  a: 'Your AI app, live on the internet.',
  b: 'Take your AI app live.',
}

function App() {
  useTheme()
  const fromAd = new URLSearchParams(window.location.search).get('book') === 'true'
  const [modalOpen, setModalOpen] = useState(() => fromAd)
  const [isExitIntent, setIsExitIntent] = useState(false)
  const showAdModal = fromAd || isExitIntent
  const [email, setEmail] = useState('')
  const [isValid, setIsValid] = useState(false)
  const emailTracked = useRef(false)
  const exitFired = useRef(false)

  const track = (event, params = {}) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, params)
    }
  }

  useEffect(() => {
    track('headline_variant_shown', { variant: HEADLINE_VARIANT, headline: HEADLINES[HEADLINE_VARIANT] })
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (exitFired.current || e.clientY > 20) return
      exitFired.current = true
      setIsExitIntent(true)
      setModalOpen(true)
      track('exit_intent')
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

      {/* Nav */}
      <nav className="nav">
        <div className="logo">
          <CloudLogo className="logo-icon" />
          Anvil
        </div>
        <button className="nav-link" onClick={() => { track('cta_click', { button: 'get_help' }); setModalOpen(true) }}>
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
            onClick={() => { track('cta_click', { button: 'get_app_fixed' }); setModalOpen(true) }}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            Get your app live
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

      <HowItWorks />
      <SectionDivider />
      <TechStack />
      <SectionDivider />
      <AppMockup />
      <SectionDivider />
      <Features />
      <SectionDivider />
      <Pricing onCta={() => { track('cta_click', { button: 'pricing' }); setModalOpen(true) }} />
      <PriceCalc onCta={() => { track('cta_click', { button: 'calc' }); setModalOpen(true) }} />

      <LogoTicker />

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="modal-overlay"
            onClick={() => setModalOpen(false)}
            initial={showAdModal ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className={`modal${showAdModal ? ' modal-ad' : ''}`}
              onClick={(e) => e.stopPropagation()}
              initial={showAdModal ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
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
                    We&rsquo;ll take production<br />off your plate.
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
