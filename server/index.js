const express = require('express')
const cors = require('cors')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const app = express()

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const JWT_SECRET = process.env.JWT_SECRET
const WEBAPP_URL = process.env.WEBAPP_URL || 'http://localhost:5173'
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001'

app.use(cors({ origin: WEBAPP_URL, credentials: true }))
app.use(express.json())

// ── Health check ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ ok: true }))

// ── GitHub OAuth ─────────────────────────────────────────────────────────────

// Step 1: redirect user to GitHub
app.get('/auth/github', (_req, res) => {
  const state = crypto.randomBytes(16).toString('hex')
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: `${SERVER_URL}/auth/github/callback`,
    scope: 'read:user user:email',
    state,
  })
  res.redirect(`https://github.com/login/oauth/authorize?${params}`)
})

// Step 2: GitHub redirects here with ?code=...
app.get('/auth/github/callback', async (req, res) => {
  const { code } = req.query
  if (!code) return res.redirect(`${WEBAPP_URL}/auth/error?reason=no_code`)

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    })
    const { access_token, error } = await tokenRes.json()
    if (error || !access_token) throw new Error(error || 'no access token')

    // Fetch GitHub user profile
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}`, 'User-Agent': 'Anvil' },
    })
    const ghUser = await userRes.json()

    // Always fetch verified primary email from /user/emails
    // (ghUser.email is the public profile email — may be stale or wrong)
    let email = ghUser.email
    try {
      const emailRes = await fetch('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${access_token}`, 'User-Agent': 'Anvil' },
      })
      const emails = await emailRes.json()
      console.log('GitHub emails for', ghUser.login, ':', JSON.stringify(emails))
      const primary = emails.find(e => e.primary && e.verified)
        || emails.find(e => e.verified)
      if (primary) email = primary.email
    } catch (err) {
      console.error('Failed to fetch emails:', err.message)
      // fall back to profile email
    }

    // Log signup
    console.log('New signup:', { login: ghUser.login, name: ghUser.name || ghUser.login, email })

    // Log signup to Google Sheet
    if (process.env.SHEET_URL) {
      // redirect: 'manual' — Apps Script returns a 302; the script has already run at that point.
      // Following the redirect converts POST → GET and doPost() never fires.
      fetch(process.env.SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: ghUser.name || ghUser.login, email, login: ghUser.login, ts: new Date().toISOString(), source: 'github_oauth' }),
        redirect: 'manual',
      })
        .then(r => console.log('Sheet response:', r.status, r.type))
        .catch(err => console.error('Sheet write failed:', err.message))
    } else {
      console.warn('SHEET_URL not set — skipping sheet log')
    }

    // Issue a JWT with the user's GitHub info
    const payload = {
      sub: String(ghUser.id),
      login: ghUser.login,
      name: ghUser.name || ghUser.login,
      email,
      avatar: ghUser.avatar_url,
      github_token: access_token,
    }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' })

    // Redirect back to the frontend with the token in the URL hash
    // (hash so the token never hits server logs)
    res.redirect(`${WEBAPP_URL}/auth/callback#token=${token}`)
  } catch (err) {
    console.error('GitHub OAuth error:', err)
    res.redirect(`${WEBAPP_URL}/auth/error?reason=oauth_failed`)
  }
})

// ── Auth middleware ──────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  try {
    req.user = jwt.verify(header.slice(7), JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// ── Protected example route ──────────────────────────────────────────────────
app.get('/me', requireAuth, (req, res) => {
  const { sub, login, name, email, avatar } = req.user
  res.json({ id: sub, login, name, email, avatar })
})

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Anvil server running on port ${PORT}`))

module.exports = app
