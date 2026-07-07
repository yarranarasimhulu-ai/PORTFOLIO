import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { player, projects, techStack, experience, certifications } from '../data.js'
import AttributesPanel from './AttributesPanel.jsx'

const TITLES = {
  profile: 'ABOUT ME',
  projects: 'PROJECTS',
  techstack: 'TECH STACK',
  experience: 'WORK EXPERIENCE',
  certifications: 'CERTIFICATIONS & ACHIEVEMENTS',
  contact: 'CONTACT ME',
  skills: 'SKILLS',
}

function Stars({ n }) {
  return (
    <span className="glow-text tracking-widest" title={`Complexity: ${n}/5`}>
      {'★'.repeat(n)}
      {'☆'.repeat(5 - n)}
    </span>
  )
}

function ProjectCard({ p }) {
  return (
    <article className="game-panel flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="font-display text-[10px] tracking-[0.25em] text-slate-500">
          {p.category}
        </div>
        <span className={`status-badge ${p.status === 'LIVE' ? 'status-live' : 'status-done'}`}>
          {p.status}
        </span>
      </div>
      <h3 className="font-display text-lg font-bold text-slate-100">{p.name}</h3>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{p.period}</span>
        <Stars n={p.complexity} />
      </div>
      <p className="text-sm text-slate-300">{p.briefing}</p>
      <ul className="space-y-1 text-sm text-slate-400">
        {p.intel.map((x) => (
          <li key={x} className="flex gap-2">
            <span className="glow-text">▸</span>
            <span>{x}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-1.5">
        {p.loadout.map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-auto flex gap-2 pt-2">
        <a
          href={p.repo}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary flex-1 text-center"
        >
          VIEW CODE
        </a>
        {p.live && (
          <a
            href={p.live}
            target="_blank"
            rel="noreferrer"
            className="btn-primary-sm flex-1 text-center"
          >
            LIVE DEMO
          </a>
        )}
      </div>
    </article>
  )
}

function Profile() {
  const stats = [
    { label: 'PROJECTS', value: '03' },
    { label: 'CERTS', value: '06' },
    { label: 'DSA DAYS', value: '160' },
    { label: 'CGPA', value: player.education.cgpa.split(' ')[0] },
  ]
  return (
    <div className="grid gap-5 md:grid-cols-5">
      <div className="md:col-span-3">
        <div className="flex items-center gap-4">
          <div className="hex-emblem !h-16 !w-16 !text-2xl font-display">{player.initials}</div>
          <div>
            <div className="font-display text-lg font-bold tracking-wider text-slate-100">
              {player.name}
            </div>
            <div className="glow-text text-xs font-semibold tracking-[0.3em]">{player.title}</div>
            <div className="mt-1 text-xs text-slate-400">📍 {player.location}</div>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">{player.summary}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="game-panel p-2 text-center">
              <div className="glow-text font-display text-lg font-black">{s.value}</div>
              <div className="text-[9px] tracking-[0.2em] text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="md:col-span-2">
        <div className="game-panel h-full p-4">
          <div className="font-display text-[10px] tracking-[0.25em] text-slate-500">
            EDUCATION
          </div>
          <h3 className="mt-2 font-display text-sm font-bold text-slate-100">
            {player.education.degree}
          </h3>
          <p className="mt-1 text-sm text-slate-300">{player.education.college}</p>
          <div className="mt-3 flex justify-between text-xs text-slate-400">
            <span>{player.education.years}</span>
            <span className="glow-text font-semibold">CGPA {player.education.cgpa}</span>
          </div>
          <div className="mt-4 border-t border-[color:var(--line)] pt-3 text-xs text-slate-400">
            {player.tagline}
          </div>
        </div>
      </div>
    </div>
  )
}

function TechStack() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {techStack.map((item) => (
        <div key={item.name} className={`game-panel p-3 text-center level-${item.level}`}>
          <div className="font-display text-sm font-bold text-slate-100">{item.name}</div>
          <div className="mt-1 text-[10px] tracking-wider text-slate-400">{item.type}</div>
          <div className="level-label mt-1.5 font-display text-[9px] font-bold tracking-[0.25em]">
            {item.level.toUpperCase()}
          </div>
        </div>
      ))}
    </div>
  )
}

function Experience() {
  return (
    <div className="space-y-4">
      {experience.map((e) => (
        <article key={e.org} className="game-panel flex flex-col gap-2 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`status-badge ${e.status === 'CURRENT' ? 'status-live' : 'status-done'}`}
            >
              {e.status}
            </span>
            <h3 className="font-display text-base font-bold text-slate-100">{e.role}</h3>
            <span className="ml-auto text-xs text-slate-400">{e.period}</span>
          </div>
          <div className="glow-text text-sm font-semibold">
            {e.org} · <span className="font-normal text-slate-400">{e.mode}</span>
          </div>
          <ul className="space-y-1 text-sm text-slate-300">
            {e.highlights.map((h) => (
              <li key={h} className="flex gap-2">
                <span className="glow-text">▸</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}

function Certifications() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {certifications.map((c) => (
        <div key={c.title} className={`game-panel badge-card p-4 text-center tier-${c.tier}`}>
          <div className="badge-icon text-3xl">{c.icon}</div>
          <div className="mt-2 font-display text-sm font-bold text-slate-100">{c.title}</div>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">{c.desc}</p>
        </div>
      ))}
    </div>
  )
}

function Contact() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-300">
        Looking for an AI engineer for your team? Reach out — quick response guaranteed.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <a className="contact-row" href={`mailto:${player.email}`}>
          📧 <span className="truncate">{player.email}</span>
        </a>
        <div className="contact-row">📱 {player.phone}</div>
        <a className="contact-row" href={player.github} target="_blank" rel="noreferrer">
          🐙 GitHub
        </a>
        <a className="contact-row" href={player.linkedin} target="_blank" rel="noreferrer">
          💼 LinkedIn
        </a>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href={`mailto:${player.email}?subject=Job%20Opportunity%20%E2%80%94%20AI%20Engineer`}
          className="btn-primary-sm flex-1 text-center"
        >
          SEND EMAIL
        </a>
        <a href={player.resumeFile} download className="btn-secondary flex-1 text-center">
          DOWNLOAD RESUME
        </a>
      </div>
    </div>
  )
}

function PanelBody({ panel }) {
  switch (panel) {
    case 'profile':
      return <Profile />
    case 'projects':
      return (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.name} p={p} />
          ))}
        </div>
      )
    case 'techstack':
      return <TechStack />
    case 'experience':
      return <Experience />
    case 'certifications':
      return <Certifications />
    case 'contact':
      return <Contact />
    case 'skills':
      return (
        <div className="h-96">
          <AttributesPanel />
        </div>
      )
    default:
      return null
  }
}

export default function Panels({ panel, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {panel && (
        <motion.div
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="game-panel accent-edge flex max-h-full w-full max-w-4xl flex-col"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-[color:var(--line)] px-4 py-3 sm:px-5">
              <h2 className="glow-text font-display text-sm font-bold tracking-[0.3em] sm:text-base">
                {TITLES[panel]}
              </h2>
              <div className="flex items-center gap-3">
                <span className="hidden text-[10px] tracking-[0.2em] text-slate-500 sm:block">
                  [ESC] CLOSE
                </span>
                <button type="button" onClick={onClose} className="icon-btn">
                  ✕
                </button>
              </div>
            </header>
            <div className="game-scroll overflow-y-auto p-4 sm:p-5">
              <PanelBody panel={panel} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
