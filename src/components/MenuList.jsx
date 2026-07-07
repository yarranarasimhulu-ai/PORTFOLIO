import { menu } from '../data.js'

export default function MenuList({ active, onOpen }) {
  return (
    <>
      {/* desktop: left column */}
      <nav className="absolute left-5 top-1/2 z-20 hidden w-60 -translate-y-1/2 flex-col gap-2.5 lg:flex">
        {menu.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onOpen(m.id)}
            className={`btn-game group text-left ${active === m.id ? 'btn-game-active' : ''}`}
          >
            <span className="mr-3 font-display text-[10px] text-slate-500 group-hover:text-[color:var(--accent)]">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="font-display text-sm font-bold tracking-[0.2em]">{m.label}</span>
            <span className="block pl-8 text-[11px] font-medium tracking-wider text-slate-400">
              {m.hint}
            </span>
          </button>
        ))}
      </nav>

      {/* mobile: horizontal chips above the bottom bar */}
      <nav className="hud-chips absolute inset-x-0 bottom-20 z-20 flex gap-2 overflow-x-auto px-3 pb-1 lg:hidden">
        {[...menu, { id: 'skills', label: 'SKILLS' }].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onOpen(m.id)}
            className="btn-chip shrink-0"
          >
            {m.label}
          </button>
        ))}
      </nav>
    </>
  )
}
