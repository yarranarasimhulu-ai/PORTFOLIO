import { player, certifications } from '../data.js'

export default function TopHUD({ onOpen }) {
  return (
    <header className="absolute inset-x-0 top-0 z-20 flex items-center gap-2 px-3 py-2 sm:gap-3 sm:px-5 sm:py-3">
      {/* player chip */}
      <div className="game-panel accent-edge flex items-center gap-3 px-3 py-2">
        <div className="hex-emblem font-display">{player.initials}</div>
        <div>
          <div className="font-display text-xs font-bold tracking-widest text-slate-100 sm:text-sm">
            {player.name}
          </div>
          <div className="glow-text text-[10px] font-semibold tracking-[0.3em] sm:text-[11px]">
            {player.title}
          </div>
        </div>
      </div>

      <div className="flex-1" />

      {/* availability status */}
      <div className="game-panel hidden items-center gap-3 px-4 py-2.5 md:flex">
        <span className="status-dot" />
        <div>
          <div className="font-display text-[11px] font-bold tracking-[0.2em] text-emerald-300">
            {player.status}
          </div>
          <div className="text-[10px] tracking-wider text-slate-400">📍 {player.location}</div>
        </div>
      </div>

      {/* certifications */}
      <button
        type="button"
        onClick={() => onOpen('certifications')}
        className="icon-btn"
        title="Certifications"
      >
        🏆
        <span className="badge-num">{certifications.length}</span>
      </button>
    </header>
  )
}
