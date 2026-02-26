import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'motion/react'

const DNS_RECORDS = [
  { type: 'A',     value: '76.223.105.230', delay: 0.4 },
  { type: 'CNAME', value: 'your-app.joinanvil.ai', delay: 0.75 },
  { type: 'SSL',   value: 'Auto-renewing certificate', delay: 1.1 },
]

const DOMAIN_RESULTS = [
  { name: 'myapp.com', free: true,  price: null,    delay: 0.3 },
  { name: 'myapp.io',  free: false, price: '$12/yr', delay: 0.5 },
  { name: 'myapp.co',  free: false, price: '$8/yr',  delay: 0.7 },
]

const TYPED_DOMAIN = 'yourdomain.com'
const TYPED_SEARCH = 'myapp'

function TypingText({ text, startDelay = 0, className }) {
  const [displayed, setDisplayed] = useState('')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let i = 0
    const t = setTimeout(() => {
      const interval = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) clearInterval(interval)
      }, 55)
      return () => clearInterval(interval)
    }, startDelay * 1000)
    return () => clearTimeout(t)
  }, [inView, text, startDelay])

  return <span ref={ref} className={className}>{displayed}<span className="domain-cursor">|</span></span>
}

export default function DomainsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="domains-section" ref={ref}>
      <motion.div
        className="domains-header"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
      >
        <span className="features-eyebrow">Domains</span>
        <h2 className="features-title">Your domain, sorted.</h2>
        <p className="tech-stack-desc">Bring what you have or buy a new one. We handle all the technical setup — DNS, SSL, everything.</p>
      </motion.div>

      <div className="domains-cards">

        {/* ── Card 1: Bring your domain ─────────────────────────── */}
        <motion.div
          className="domain-card"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="domain-card-eyebrow">
            <span className="domain-card-icon">🌐</span>
            Bring your domain
          </div>
          <h3 className="domain-card-title">Already have one?<br />Just point it at us.</h3>
          <p className="domain-card-desc">We configure everything — no touching DNS records yourself.</p>

          <div className="domain-demo">
            {/* Input row */}
            <div className="domain-input-row">
              <div className="domain-input-field">
                {inView && <TypingText text={TYPED_DOMAIN} startDelay={0.2} />}
              </div>
              <motion.div
                className="domain-input-arrow"
                initial={{ opacity: 0, x: -6 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 1.5 }}
              >→</motion.div>
            </div>

            {/* DNS records */}
            <div className="domain-dns-list">
              {DNS_RECORDS.map(({ type, value, delay }) => (
                <motion.div
                  key={type}
                  className="domain-dns-row"
                  initial={{ opacity: 0, x: -8 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: delay + 0.6 }}
                >
                  <span className="domain-dns-type">{type}</span>
                  <span className="domain-dns-value">{value}</span>
                  <motion.span
                    className="domain-dns-check"
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ delay: delay + 0.9, type: 'spring', stiffness: 300 }}
                  >✓</motion.span>
                </motion.div>
              ))}
            </div>

            {/* Connected badge */}
            <motion.div
              className="domain-connected-badge"
              initial={{ opacity: 0, y: 6 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 2.2 }}
            >
              <span className="domain-connected-dot" />
              yourdomain.com is connected
            </motion.div>
          </div>
        </motion.div>

        {/* ── Card 2: Buy a domain ──────────────────────────────── */}
        <motion.div
          className="domain-card domain-card--buy"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="domain-card-eyebrow">
            <span className="domain-card-icon">🛒</span>
            Buy a domain
            <span className="domain-free-badge">First one free</span>
          </div>
          <h3 className="domain-card-title">Don't have one?<br />We'll get you one.</h3>
          <p className="domain-card-desc">Search for a domain and we'll register it and hook everything up automatically.</p>

          <div className="domain-demo">
            {/* Search bar */}
            <div className="domain-search-bar">
              <span className="domain-search-icon">🔍</span>
              {inView && <TypingText text={TYPED_SEARCH} startDelay={0.3} className="domain-search-text" />}
            </div>

            {/* Results */}
            <div className="domain-results">
              {DOMAIN_RESULTS.map(({ name, free, price, delay }) => (
                <motion.div
                  key={name}
                  className={`domain-result${free ? ' domain-result--free' : ''}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: delay + 0.8 }}
                >
                  <span className="domain-result-name">{name}</span>
                  {free ? (
                    <span className="domain-result-free">FREE</span>
                  ) : (
                    <span className="domain-result-price">{price}</span>
                  )}
                  {free && (
                    <motion.div
                      className="domain-result-highlight"
                      initial={{ scaleX: 0 }}
                      animate={inView ? { scaleX: 1 } : {}}
                      transition={{ delay: delay + 1.0, duration: 0.4 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            <motion.p
              className="domain-buy-note"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1.8 }}
            >
              No credit card required for your first domain.
            </motion.p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
