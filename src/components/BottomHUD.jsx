import { certifications, projects } from '../data.js'

export default function BottomHUD({ onOpen }) {
  const tickerItems = certifications.map((c) => `${c.icon} ${c.title} — ${c.desc}`)
  const liveCount = projects.filter((p) => p.status === 'LIVE').length

  return (
    <footer className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-3 px-3 py-3 sm:px-5">
      {/* achievement ticker */}
      <div className="game-panel hud-ticker hidden min-w-0 flex-1 overflow-hidden px-4 py-2.5 md:block">
        <div className="ticker-track flex gap-10 whitespace-nowrap text-sm text-slate-300">
          {[...tickerItems, ...tickerItems].map((t, i) => (
            <span key={i} className="tracking-wide">
              {t}
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpen('projects')}
        className="btn-primary ml-auto w-full font-display sm:w-auto"
      >
        ▶ VIEW PROJECTS
        <span className="block text-[9px] font-semibold tracking-[0.25em] opacity-80">
          {projects.length} PROJECTS · {liveCount} LIVE DEMO
        </span>
      </button>
    </footer>
  )
}
