import { useState } from 'react'
import { motion } from 'framer-motion'
import { skills } from '../data.js'

/** Skill stat bars — docked on the right on desktop, opened as a panel on mobile. */
export default function AttributesPanel() {
  const [tab, setTab] = useState(0)
  const group = skills[tab]

  return (
    <section className="game-panel accent-edge flex h-full w-full flex-col p-4">
      <h2 className="glow-text font-display text-xs font-bold tracking-[0.3em]">SKILLS</h2>

      <div className="mt-3 flex gap-1.5">
        {skills.map((g, i) => (
          <button
            key={g.tab}
            type="button"
            onClick={() => setTab(i)}
            className={`tab-btn ${i === tab ? 'tab-btn-active' : ''}`}
          >
            {g.tab}
          </button>
        ))}
      </div>
      <div className="mt-1.5 text-[10px] tracking-[0.25em] text-slate-500">
        {group.subtitle.toUpperCase()}
      </div>

      <div className="game-scroll mt-3 flex-1 space-y-3 overflow-y-auto pr-1">
        {group.items.map((s, i) => (
          <div key={s.name}>
            <div className="mb-1 flex items-baseline justify-between">
              <span className="text-sm font-semibold tracking-wide text-slate-200">{s.name}</span>
              <span className="glow-text font-display text-xs">{s.value}</span>
            </div>
            <div className="stat-track">
              <motion.div
                key={`${tab}-${s.name}`}
                className="stat-fill"
                initial={{ width: 0 }}
                animate={{ width: `${s.value}%` }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
