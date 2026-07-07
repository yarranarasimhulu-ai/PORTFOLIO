import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { player } from '../data.js'

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0)
  const doneRef = useRef(false)

  useEffect(() => {
    const t0 = performance.now()
    let raf
    const tick = (t) => {
      const p = Math.min(100, ((t - t0) / 1800) * 100)
      setProgress(p)
      if (p < 100) {
        raf = requestAnimationFrame(tick)
      } else if (!doneRef.current) {
        doneRef.current = true
        setTimeout(onDone, 350)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <motion.div
      className="absolute inset-0 z-50 grid place-items-center bg-[#04070e]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-72 text-center sm:w-96">
        <div className="hex-emblem mx-auto !h-16 !w-16 !text-2xl font-display">
          {player.initials}
        </div>
        <div className="mt-6 font-display text-lg font-bold tracking-[0.35em] text-slate-100">
          LOADING PORTFOLIO
        </div>
        <div className="mt-1 text-xs tracking-[0.25em] text-slate-500">
          {player.name} · {player.title}
        </div>
        <div className="stat-track mt-6">
          <div className="stat-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-[10px] tracking-[0.2em] text-slate-500">
          <span>LOADING ASSETS</span>
          <span className="glow-text">{Math.round(progress)}%</span>
        </div>
        <div className="mt-8 text-[11px] tracking-wider text-slate-600">
          TIP: DRAG THE CHARACTER TO ROTATE
        </div>
      </div>
    </motion.div>
  )
}
