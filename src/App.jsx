import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen.jsx'
import AvatarStage from './components/AvatarStage.jsx'
import TopHUD from './components/TopHUD.jsx'
import MenuList from './components/MenuList.jsx'
import AttributesPanel from './components/AttributesPanel.jsx'
import BottomHUD from './components/BottomHUD.jsx'
import Panels from './components/Panels.jsx'
import ChatWindow from './components/ChatWindow.jsx'

// Theme accent — 'orange' | 'cyan' | 'violet' (defined in index.css)
const ACCENT = 'orange'
const ACCENT_HEX = { orange: '#ffb020', cyan: '#22d3ee', violet: '#a78bfa' }[ACCENT]

// Pet speech-bubble timing: pops up every SHOW_EVERY ms, hides after SHOW_FOR ms.
const BUBBLE_SHOW_FOR = 5000
const BUBBLE_SHOW_EVERY = 8000
const BUBBLE_MESSAGES = [
  '👆 Click me! Ask about Narasimhulu',
  '💬 Click me to chat about his skills!',
  '🚀 Click me! I can show his projects',
  '📫 Click me for his contact info!',
]

export default function App() {
  const [booting, setBooting] = useState(true)
  const [panel, setPanel] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [bubble, setBubble] = useState(null)
  const bubbleIdx = useRef(0)

  useEffect(() => {
    document.documentElement.dataset.accent = ACCENT
  }, [])

  // Bubble loop — paused while the chat, a panel, or the loading screen is up.
  useEffect(() => {
    if (booting || chatOpen || panel) {
      setBubble(null)
      return
    }
    let hideTimer
    const show = () => {
      setBubble(BUBBLE_MESSAGES[bubbleIdx.current++ % BUBBLE_MESSAGES.length])
      hideTimer = setTimeout(() => setBubble(null), BUBBLE_SHOW_FOR)
    }
    const firstTimer = setTimeout(show, 2500)
    const loopTimer = setInterval(show, BUBBLE_SHOW_EVERY)
    return () => {
      clearTimeout(firstTimer)
      clearInterval(loopTimer)
      clearTimeout(hideTimer)
      setBubble(null)
    }
  }, [booting, chatOpen, panel])

  return (
    <div className="relative h-full w-full select-none overflow-hidden">
      <div className="lobby-bg" />
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <div className="lobby-grid" />
      <div className="lobby-floor" />
      <AvatarStage
        accentHex={ACCENT_HEX}
        bubble={bubble}
        onPetClick={() => setChatOpen(true)}
      />
      <div className="scanlines" />
      <div className="vignette" />

      <TopHUD onOpen={setPanel} />
      <MenuList active={panel} onOpen={setPanel} />
      <div className="absolute bottom-24 right-4 top-24 z-20 hidden w-80 lg:block">
        <AttributesPanel />
      </div>
      <BottomHUD onOpen={setPanel} />

      <Panels panel={panel} onClose={() => setPanel(null)} />

      <AnimatePresence>
        {chatOpen && <ChatWindow onClose={() => setChatOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {booting && <LoadingScreen onDone={() => setBooting(false)} />}
      </AnimatePresence>
    </div>
  )
}
