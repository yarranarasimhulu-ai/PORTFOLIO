# Pet Chatbot Plan — "Robo Assistant"

**Concept:** The robo pet standing next to the avatar becomes an interactive
assistant. It periodically shows a small speech bubble above its head inviting
visitors to chat. Clicking the bubble (or the pet) opens a game-styled chat
window where visitors ask questions about Narasimhulu — skills, projects,
frameworks, experience, contact — and get instant answers built from the
resume data already in `src/data.js`.

---

## 1. User Experience Flow

```
   ┌────────────────────────┐
   │ 💬 Ask me about        │   ← bubble pops above pet's head
   │    Narasimhulu!        │      every ~7s, hides after ~5s
   └───────────┬────────────┘
               ▼
          ┌─────────┐
          │ 🤖 pet  │  ← clicking bubble OR pet opens the chat
          └─────────┘
               ▼
   ┌──────────────────────────────┐
   │ ROBO ASSISTANT           ✕  │
   │──────────────────────────────│
   │ 🤖 Hi! I'm Robo. Ask me     │
   │    anything about           │
   │    Narasimhulu!             │
   │                              │
   │ [What are his skills?]       │  ← suggested question chips
   │ [Show me his projects]       │
   │ [Work experience?]           │
   │ [How to contact him?]        │
   │──────────────────────────────│
   │ Type a question…      [SEND] │
   └──────────────────────────────┘
```

## 2. Speech Bubble (above the pet's head)

- Rendered with drei's `<Html>` **anchored to the pet in 3D space** — the
  bubble tracks the pet's head even while the camera auto-rotates or zooms.
- **Timing (per user spec):** appears every **7 seconds**, auto-hides after
  **5 seconds**. Pauses while the chat window or any panel is open.
- **Rotating invitation messages** so it feels alive:
  - "💬 Ask me about Narasimhulu!"
  - "🧠 Curious about his skills?"
  - "🚀 Want to see his projects?"
  - "📫 Need his contact info?"
- Animated: pop-in scale + soft fade-out; small tail pointing at the pet.
- Clicking the bubble **or the pet itself** opens the chat window. Pet gets a
  pointer cursor + slight glow on hover so it's discoverably clickable.

## 3. Chat Window

- Game-styled panel (same angled `game-panel` look) docked to the
  **bottom-right**, near the pet; full-screen sheet on mobile.
- Header: 🤖 ROBO ASSISTANT + ONLINE dot + close ✕ (Esc also closes).
- Message list: user messages right (accent), bot messages left (dark),
  auto-scroll to the latest.
- **Typing indicator**: bot waits ~600ms with animated dots before answering —
  feels like a real assistant instead of an instant lookup.
- **Suggested question chips** shown at start (and after each answer):
  "What are his skills?" · "Show me his projects" · "What frameworks does he
  know?" · "Work experience?" · "Education?" · "How to contact him?"
- Text input + SEND button; Enter to send.

## 4. Answer Engine (Phase 1 — no API, ships today)

A small intent matcher in `src/chatbot.js`. No server, no API key, free,
instant, works on static hosting. Answers are **generated from `src/data.js`**
— so when the resume data updates, the bot's answers update automatically.

| Visitor asks about… | Matched keywords (examples) | Answer source |
|---|---|---|
| Skills | skill, know, good at, expertise | `skills` tabs + top values |
| Projects | project, built, portfolio, work(s) | `projects` names + briefs + links |
| Specific project | trendpulse, weather, chatbot | that project's full card |
| Frameworks/tools | framework, langchain, react, tech stack, tools | `techStack` by level |
| Experience | experience, job, company, intern, energy lab | `experience` entries |
| Education | education, college, degree, cgpa, btech | `player.education` |
| Certifications | certification, achievement, hackerrank, gfg | `certifications` list |
| Contact / hire | contact, email, phone, hire, linkedin, github | `player` contact fields |
| Resume | resume, cv, download | resume download link |
| About / who | who, about, introduce, yourself | `player.summary` |
| Greetings | hi, hello, hey | friendly intro + chips |
| Anything else | — | fallback: "I can tell you about his skills, projects, experience…" + chips |

- Matching: lowercase the input, score each intent by keyword hits, pick the
  best; fallback when nothing scores.
- Bot answers support simple formatting (line breaks, bullet dots, links that
  open GitHub/LinkedIn/live demo in a new tab).

## 5. Phase 2 (optional, after deploy) — Real LLM upgrade

Make Robo a genuine AI chatbot — a strong resume signal for an AI engineer:
- Add a **Vercel serverless function** (`/api/chat`) that calls the
  **Groq API** (Narasimhulu already uses it — free tier available) with a
  system prompt containing the resume data, so answers stay grounded.
- The API key lives in a Vercel environment variable — **never** in frontend
  code (anyone can read a static site's JS).
- Add simple rate limiting to avoid abuse of the free tier.
- The chat UI doesn't change — only the answer engine swaps. Phase 1's
  intent matcher stays as offline fallback if the API call fails.

## 6. Implementation Pieces

| Piece | Where |
|---|---|
| Intent matcher + answer builder | `src/chatbot.js` (new) |
| Chat window component | `src/components/ChatWindow.jsx` (new) |
| Speech bubble (drei `<Html>`) + clickable pet | `src/components/AvatarStage.jsx` (extend `PetBot`) |
| Bubble timing state (7s show / 5s hide loop) | `App.jsx` |
| `chatOpen` state + wiring | `App.jsx` |

## 7. Build Order — ✅ ALL DONE (Groq RAG included from day one)

1. [x] `src/chatbot.js` — offline fallback bot (keyword intents from `data.js`)
2. [x] **Naive RAG + Groq** — `api/_chatcore.js`: resume chunked by topic →
       top-4 retrieval per question → grounded generation with
       `llama-3.3-70b-versatile`. `api/chat.js` = Vercel endpoint with rate
       limiting; the same core is served locally by a Vite dev middleware.
3. [x] Speech bubble above pet head — shows 5s, reappears every 8s, rotating
       messages; click bubble or pet opens chat; pet has pointer cursor
4. [x] Chat window — game-styled, suggestion chips, typing dots, linkified
       URLs, Enter/SEND, ✕ close; falls back to offline bot if API fails
5. [x] Bubbles pause while chat/panel/loading screen is open
6. [x] End-to-end tested: skills + project questions answered correctly by Groq

**Key handling:** `GROQ_API_KEY` lives in `.env.local` (gitignored) for local
dev. On Vercel: add it under Project → Settings → Environment Variables.
⚠️ Regenerate the key in the Groq console before going public — it was shared
in chat once.

## 8. Success Criteria

- Bubble appears above the pet's head on schedule and never blocks clicks on
  the lobby when hidden.
- Every suggested chip returns a correct, readable answer sourced from
  `data.js`.
- Free-text questions like "what frameworks does he know" or "how do I email
  him" hit the right intent.
- Chat works on mobile; closing is obvious; no console errors; build passes.
