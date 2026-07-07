// Shared chatbot core: RAG-lite retrieval over the resume data + Groq generation.
// Used by api/chat.js on Vercel and by the Vite dev middleware locally.
// (Files starting with "_" in api/ are not exposed as endpoints by Vercel.)
import {
  player,
  skills,
  projects,
  techStack,
  experience,
  certifications,
} from '../src/data.js'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

// ── knowledge base: the resume chunked by topic ─────────────────
function buildChunks() {
  const chunks = []

  chunks.push({
    keywords: ['about', 'who', 'summary', 'introduce', 'yourself', 'profile', 'narasimhulu', 'yerra', 'location', 'from', 'status', 'available'],
    text: `About: ${player.name} — ${player.title}. ${player.summary} Location: ${player.location}. Focus: ${player.tagline}. Availability: ${player.status}.`,
  })

  for (const group of skills) {
    chunks.push({
      keywords: ['skill', 'skills', 'good', 'expertise', 'strengths', ...group.tab.toLowerCase().split(/[^a-z]+/), ...group.items.map((s) => s.name.toLowerCase().split(/[^a-z]+/)).flat()].filter(Boolean),
      text: `Skills — ${group.tab} (${group.subtitle}): ${group.items.map((s) => `${s.name} (${s.value}/100)`).join(', ')}.`,
    })
  }

  for (const p of projects) {
    chunks.push({
      keywords: ['project', 'projects', 'built', 'build', 'portfolio', 'app', 'demo', ...p.name.toLowerCase().split(/[^a-z]+/)].filter(Boolean),
      text: `Project "${p.name}" (${p.category.toLowerCase()}, ${p.period}, status: ${p.status}): ${p.briefing} Highlights: ${p.intel.join('; ')}. Tech used: ${p.loadout.join(', ')}. Source code: ${p.repo}${p.live ? `. Live demo: ${p.live}` : ''}.`,
    })
  }

  chunks.push({
    keywords: ['tech', 'stack', 'framework', 'frameworks', 'tools', 'technologies', 'languages', 'learned', ...techStack.map((t) => t.name.toLowerCase().split(/[^a-z]+/)).flat()].filter(Boolean),
    text: `Tech stack (proficiency): ${techStack.map((t) => `${t.name} — ${t.level} (${t.type})`).join('; ')}.`,
  })

  for (const e of experience) {
    chunks.push({
      keywords: ['experience', 'work', 'job', 'company', 'intern', 'internship', 'career', 'working', ...e.org.toLowerCase().split(/[^a-z]+/), ...e.role.toLowerCase().split(/[^a-z]+/)].filter(Boolean),
      text: `Work experience: ${e.role} at ${e.org} (${e.mode}, ${e.period}, ${e.status.toLowerCase()}). ${e.highlights.join(' ')}`,
    })
  }

  chunks.push({
    keywords: ['certification', 'certifications', 'certificate', 'achievement', 'achievements', 'hackerrank', 'gfg', 'geeksforgeeks', 'ibm', 'langchain', 'langsmith', 'academy', 'badge', 'star', 'dsa'],
    text: `Certifications & achievements: ${certifications.map((c) => `${c.title} — ${c.desc}`).join('; ')}.`,
  })

  chunks.push({
    keywords: ['education', 'college', 'university', 'degree', 'btech', 'cgpa', 'graduate', 'graduation', 'study', 'studied', 'fresher'],
    text: `Education: ${player.education.degree}, ${player.education.college}, ${player.education.years}, CGPA ${player.education.cgpa}.`,
  })

  chunks.push({
    keywords: ['contact', 'email', 'mail', 'phone', 'call', 'reach', 'hire', 'hiring', 'linkedin', 'github', 'resume', 'cv', 'connect', 'touch'],
    text: `Contact: email ${player.email}, phone ${player.phone}, GitHub ${player.github}, LinkedIn ${player.linkedin}. Resume PDF is downloadable from the site's CONTACT panel. He is ${player.status.toLowerCase()}.`,
  })

  return chunks
}

const CHUNKS = buildChunks()

// ── retrieval: keyword-overlap scoring, top-k chunks ────────────
function retrieve(query, k = 4) {
  const tokens = new Set(
    query
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 2),
  )
  const scored = CHUNKS.map((c) => ({
    c,
    score: c.keywords.reduce((n, kw) => n + (tokens.has(kw) ? 1 : 0), 0),
  }))
  scored.sort((a, b) => b.score - a.score)
  const hits = scored.filter((s) => s.score > 0).slice(0, k).map((s) => s.c)
  // tiny corpus — when nothing matches, ground the model with everything
  return hits.length ? hits : CHUNKS.map((s) => s)
}

const SYSTEM_PROMPT = (context) => `You are "Robo", the friendly little robot assistant on Yerra Narasimhulu's portfolio website. Visitors (often recruiters) ask questions about him.

Rules:
- Answer ONLY from the CONTEXT below. If the answer is not there, say you don't have that information and suggest asking about his skills, projects, experience, certifications, education or contact info.
- Be concise: 2-6 short sentences or a short bullet list. Friendly tone, refer to him in third person ("he").
- Include links from the context when relevant (plain URLs).
- Never invent facts, numbers or links.

CONTEXT:
${context}`

/**
 * @param {{messages: Array<{role: string, content: string}>}} body
 * @param {string} apiKey
 * @returns {Promise<{reply: string}>}
 */
export async function answerChat(body, apiKey) {
  if (!apiKey) throw new Error('GROQ_API_KEY is not configured')

  const incoming = Array.isArray(body?.messages) ? body.messages : []
  const history = incoming
    .filter((m) => (m?.role === 'user' || m?.role === 'assistant') && typeof m?.content === 'string')
    .slice(-8)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 600) }))
  const lastUser = [...history].reverse().find((m) => m.role === 'user')
  if (!lastUser) throw new Error('no user message')

  const context = retrieve(lastUser.content)
    .map((c, i) => `[${i + 1}] ${c.text}`)
    .join('\n')

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'system', content: SYSTEM_PROMPT(context) }, ...history],
      temperature: 0.4,
      max_tokens: 350,
    }),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Groq ${res.status}: ${detail.slice(0, 200)}`)
  }
  const data = await res.json()
  const reply = data?.choices?.[0]?.message?.content?.trim()
  if (!reply) throw new Error('empty completion')
  return { reply }
}
