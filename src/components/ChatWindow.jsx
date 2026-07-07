import { useEffect, useRef, useState } from 'react'
import { motion, useDragControls } from 'framer-motion'
import { localAnswer, SUGGESTED } from '../chatbot.js'

function Linkify({ text }) {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g)
  return parts.map((p, i) =>
    /^https?:\/\//.test(p) ? (
      <a
        key={i}
        href={p}
        target="_blank"
        rel="noreferrer"
        className="break-all text-[color:var(--accent)] underline"
      >
        {p}
      </a>
    ) : (
      <span key={i}>{p}</span>
    ),
  )
}

export default function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi! I'm Robo 🤖 — Narasimhulu's assistant. Ask me about his skills, projects, experience, or how to reach him!",
    },
  ])
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  // suggestions not asked yet — shown again after every bot reply
  const asked = new Set(messages.filter((m) => m.role === 'user').map((m) => m.text))
  const suggestions = SUGGESTED.filter((s) => !asked.has(s))
  const listRef = useRef(null)
  const inputRef = useRef(null)

  // draggable window: drag starts from the header, constrained to the viewport
  const dragControls = useDragControls()
  const shellRef = useRef(null)
  const [bounds, setBounds] = useState({ left: 0, right: 0, top: 0, bottom: 0 })

  useEffect(() => {
    // measure after the entrance animation settles so the bounds are accurate
    const t = setTimeout(() => {
      const r = shellRef.current?.getBoundingClientRect()
      if (!r) return
      const m = 8
      setBounds({
        left: -(r.left - m),
        top: -(r.top - m),
        right: window.innerWidth - r.right - m,
        bottom: window.innerHeight - r.bottom - m,
      })
    }, 400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    listRef.current?.scrollTo({ top: 1e9, behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function send(text) {
    const q = text.trim()
    if (!q || typing) return
    setInput('')
    const next = [...messages, { role: 'user', text: q }]
    setMessages(next)
    setTyping(true)
    const started = Date.now()
    let reply
    try {
      const history = next.slice(-8).map((m) => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.text.slice(0, 600),
      }))
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })
      if (!r.ok) throw new Error('api unavailable')
      reply = (await r.json()).reply
      if (!reply) throw new Error('empty reply')
    } catch {
      reply = localAnswer(q)
    }
    // keep the typing dots up at least half a second so it feels alive
    const wait = Math.max(0, 500 - (Date.now() - started))
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'bot', text: reply }])
      setTyping(false)
    }, wait)
  }

  return (
    <motion.div
      ref={shellRef}
      drag
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0.08}
      dragConstraints={bounds}
      className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:bottom-4 sm:right-4 sm:w-[360px]"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 30, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div className="game-panel accent-edge flex h-[480px] max-h-[calc(100dvh-6rem)] flex-col">
        {/* header — drag handle */}
        <header
          onPointerDown={(e) => dragControls.start(e)}
          style={{ touchAction: 'none' }}
          title="Drag to move"
          className="flex cursor-move items-center gap-2.5 border-b border-[color:var(--line)] px-4 py-2.5"
        >
          <span className="text-xl">🤖</span>
          <div className="min-w-0 flex-1">
            <div className="glow-text font-display text-xs font-bold tracking-[0.25em]">
              ROBO ASSISTANT
            </div>
            <div className="flex items-center gap-1.5 text-[10px] tracking-wider text-slate-400">
              <span className="status-dot !h-1.5 !w-1.5" /> ONLINE
            </div>
          </div>
          <span className="select-none text-slate-500" aria-hidden>
            ⠿
          </span>
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onClose}
            className="icon-btn !h-8 !w-8 text-sm"
          >
            ✕
          </button>
        </header>

        {/* messages */}
        <div ref={listRef} className="game-scroll flex-1 space-y-2.5 overflow-y-auto p-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] whitespace-pre-line px-3 py-2 text-sm leading-relaxed ${
                m.role === 'user' ? 'chat-user ml-auto' : 'chat-bot'
              }`}
            >
              <Linkify text={m.text} />
            </div>
          ))}
          {typing && (
            <div className="chat-bot flex w-16 items-center gap-1 px-3 py-2.5">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          )}
          {!typing && suggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {suggestions.map((s) => (
                <button key={s} type="button" onClick={() => send(s)} className="chat-chip">
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* input */}
        <form
          className="flex gap-2 border-t border-[color:var(--line)] p-3"
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about skills, projects…"
            maxLength={300}
            className="min-w-0 flex-1 border border-[color:var(--line)] bg-[#0a1120] px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-[color:var(--accent)]"
          />
          <button type="submit" className="btn-primary-sm shrink-0" disabled={typing}>
            SEND
          </button>
        </form>
      </div>
    </motion.div>
  )
}
