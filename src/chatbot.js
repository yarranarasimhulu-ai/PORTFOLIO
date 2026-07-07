// Offline fallback bot: keyword-matched answers built from data.js.
// Used only when /api/chat (Groq) is unreachable or rate-limited.
import { player, skills, projects, techStack, experience, certifications } from './data.js'

export const SUGGESTED = [
  'What are his skills?',
  'Show me his projects',
  'What frameworks does he know?',
  'Work experience?',
  'How can I contact him?',
]

const INTENTS = [
  {
    keys: ['hi', 'hello', 'hey', 'yo', 'hai'],
    answer: () =>
      `Hi! I'm Robo 🤖 — ask me about ${firstName()}'s skills, projects, work experience, certifications, education or contact info.`,
  },
  {
    keys: ['skill', 'skills', 'good at', 'expertise', 'strength'],
    answer: () =>
      `${firstName()}'s core skills:\n` +
      skills
        .map((g) => `• ${g.tab}: ${g.items.slice(0, 5).map((s) => s.name).join(', ')}`)
        .join('\n'),
  },
  {
    keys: ['project', 'projects', 'built', 'build', 'portfolio', 'demo', 'trendpulse', 'weather', 'chatbot'],
    answer: () =>
      `He has built:\n` +
      projects
        .map((p) => `• ${p.name} (${p.period}) — ${p.briefing} Code: ${p.repo}${p.live ? ` · Live: ${p.live}` : ''}`)
        .join('\n'),
  },
  {
    keys: ['framework', 'frameworks', 'stack', 'tech', 'tools', 'technologies', 'langchain', 'react', 'fastapi', 'learned'],
    answer: () =>
      `His tech stack:\n• Expert: ${byLevel('expert')}\n• Advanced: ${byLevel('advanced')}\n• Proficient: ${byLevel('proficient')}\n• Familiar: ${byLevel('familiar')}`,
  },
  {
    keys: ['experience', 'work', 'job', 'company', 'intern', 'internship', 'career', 'energy'],
    answer: () =>
      `Work experience:\n` +
      experience
        .map((e) => `• ${e.role} @ ${e.org} (${e.period}, ${e.status.toLowerCase()}) — ${e.highlights[0]}`)
        .join('\n'),
  },
  {
    keys: ['education', 'college', 'degree', 'cgpa', 'btech', 'graduate', 'study', 'fresher'],
    answer: () =>
      `${player.education.degree} — ${player.education.college} (${player.education.years}), CGPA ${player.education.cgpa}.`,
  },
  {
    keys: ['certification', 'certifications', 'certificate', 'achievement', 'achievements', 'hackerrank', 'gfg', 'ibm', 'badge'],
    answer: () =>
      `Certifications & achievements:\n` + certifications.map((c) => `• ${c.title} — ${c.desc}`).join('\n'),
  },
  {
    keys: ['contact', 'email', 'mail', 'phone', 'reach', 'hire', 'hiring', 'linkedin', 'github', 'connect', 'touch'],
    answer: () =>
      `You can reach him at:\n• Email: ${player.email}\n• Phone: ${player.phone}\n• GitHub: ${player.github}\n• LinkedIn: ${player.linkedin}\nHe is ${player.status.toLowerCase()}!`,
  },
  {
    keys: ['resume', 'cv', 'download'],
    answer: () => `His resume is available via the CONTACT panel — the "DOWNLOAD RESUME" button — or directly at ${player.resumeFile}.`,
  },
  {
    keys: ['who', 'about', 'introduce', 'yourself', 'summary'],
    answer: () => `${player.summary} He is based in ${player.location} and is ${player.status.toLowerCase()}.`,
  },
]

function firstName() {
  return 'Narasimhulu'
}

function byLevel(level) {
  return techStack.filter((t) => t.level === level).map((t) => t.name).join(', ') || '—'
}

export function localAnswer(query) {
  const q = ` ${query.toLowerCase()} `
  let best = null
  let bestScore = 0
  for (const intent of INTENTS) {
    const score = intent.keys.reduce((n, k) => n + (q.includes(k) ? 1 : 0), 0)
    if (score > bestScore) {
      bestScore = score
      best = intent
    }
  }
  if (best) return best.answer()
  return `I'm not sure about that one 🤖 — but you can ask me about his skills, projects, frameworks, work experience, certifications, education, or how to contact him!`
}
