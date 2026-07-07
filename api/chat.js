// Vercel serverless function: POST /api/chat
// The Groq key stays server-side (Vercel env var GROQ_API_KEY).
import { answerChat } from './_chatcore.js'

// Best-effort per-instance rate limit: 20 requests / 5 min per IP.
const WINDOW_MS = 5 * 60 * 1000
const MAX_REQ = 20
const hits = new Map()

function rateLimited(ip) {
  const now = Date.now()
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  list.push(now)
  hits.set(ip, list)
  return list.length > MAX_REQ
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' })
  }
  const ip = (req.headers['x-forwarded-for'] || 'unknown').toString().split(',')[0]
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'rate_limited' })
  }
  try {
    const result = await answerChat(req.body, process.env.GROQ_API_KEY)
    return res.status(200).json(result)
  } catch (err) {
    console.error('chat error:', err?.message)
    return res.status(502).json({ error: 'chat_failed' })
  }
}
