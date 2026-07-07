# Portfolio Plan — Yerra Narasimhulu ("Gaming Lobby" Edition)

**Concept:** The portfolio is a **game lobby**, styled like Free Fire / battle-royale menus. The visitor lands in a lobby where a **3D model of Narasimhulu stands in the center**, skills appear as **character attributes** (stat bars), projects are **missions**, work experience is **battle history**, and certifications are **achievement badges**. Recruiter-friendly content, game-native presentation.

---

## 1. The Lobby Layout (desktop)

```
+------------------------------------------------------------------+
| [🧑 avatar] YERRA NARASIMHULU   LV.22   XP ████████░░   [🏆] [⚙] |
|             "AI Engineer"                                         |
+------------------------------------------------------------------+
|                                                                   |
|  MENU (left panel)          CENTER              ATTRIBUTES (right)|
|  ┌───────────────┐                              ┌───────────────┐ |
|  │ ▸ PROFILE     │       3D CHARACTER           │ ⚡ Python  ▮▮▮▮▮│ |
|  │ ▸ MISSIONS    │      (me — rotating,         │ 🧠 RAG     ▮▮▮▮▯│ |
|  │ ▸ ARSENAL     │       idle animation,        │ 🤖 Agents  ▮▮▮▮▯│ |
|  │ ▸ BATTLE LOG  │       spotlight + floor      │ 🔗 LangChain▮▮▮▮│ |
|  │ ▸ ACHIEVEMENTS│       glow, drag to spin)    │ ⚛ React    ▮▮▮▯│ |
|  │ ▸ TEAM UP     │                              │ 🗄 SQL     ▮▮▮▮▯│ |
|  └───────────────┘                              └───────────────┘ |
|                                                                   |
|  [🎖 achievement ticker scrolls here]      [ ▶ START MISSION ]    |
+------------------------------------------------------------------+
```

- **Top HUD bar:** name + title as "player name", a level badge (e.g., LV = years coding or fun stat), XP progress bar, trophy icon → achievements, gear icon → theme/sound toggle.
- **Center stage:** 3D avatar on a glowing circular platform, subtle idle animation, slow auto-rotate, drag-to-rotate. This is the hero of the site.
- **Left menu:** angled/skewed game-style buttons with hover glow + sound tick. Each opens a panel/overlay (not a page reload).
- **Right panel:** ATTRIBUTES — skills as stat bars with numeric values (e.g., Python 90/100), grouped tabs: *Combat (AI/ML)*, *Weapons (Frameworks)*, *Gear (Tools)*.
- **Bottom:** "START MISSION" primary button → opens Missions (projects). Achievement ticker scrolls certifications.

## 2. Game-Metaphor Mapping (resume → lobby)

| Game element | Real content |
|---|---|
| Player name / title | Yerra Narasimhulu — AI Engineer |
| Level + XP bar | Experience progression (fresher → The Energy Lab) |
| **ATTRIBUTES** (stat bars) | Skills: Python, RAG, AI Agents, LangChain/LangGraph, FastAPI, React, SQL, Prompt Engineering, LLMOps, LoRA |
| **MISSIONS** (mission-select cards) | Projects: TrendPulse AI, Weather Agent (⭐ LIVE badge), AI Chatbot — each with difficulty stars, tech loadout tags, [GitHub] and [DEPLOY/LIVE] buttons |
| **ARSENAL / LOADOUT** | Tech stack grid — tools as inventory items with rarity colors (Docker, Git, Groq API, Railway, HuggingFace…) |
| **BATTLE LOG** (match history) | Experience: AI Engineer @ The Energy Lab (Feb 2026–Present), SQL Intern @ Slash Mark IT (Dec 2025–Apr 2026) |
| **ACHIEVEMENTS** (badges/trophies) | GfG 160 Days, HackerRank 5★ Java & SQL, IBM SkillsBuild AI, LangChain Academy ×2 |
| Player profile card | About + Education (B.Tech IT, NBKR IST, 2022–2026, CGPA 7.5) |
| **TEAM UP** (add friend) | Contact — email, LinkedIn, GitHub + "Download Player Card" = resume PDF |

## 3. The 3D "Me" in the Center

**Recommended: Ready Player Me avatar (free)**
1. You create a 3D avatar from a selfie at readyplayer.me (takes ~5 min, looks like you, stylized).
2. Export as `.glb` (free) → we add animations from **Mixamo** (idle, wave-on-load, maybe a dance easter egg on click).
3. Rendered in the browser with **Three.js via React Three Fiber** — spotlight, glowing platform, slow rotate, drag to spin.

**Fallbacks (in order):**
- A free stylized character model (e.g., from Sketchfab CC-licensed) dressed as "AI engineer" if the selfie avatar isn't wanted.
- **Mobile/low-end fallback:** pre-rendered turntable video or a floating 2.5D PNG with parallax — so weak phones still get the vibe without lag.

## 4. Tech Stack

| Piece | Choice | Why |
|---|---|---|
| Framework | **React + Vite** | React is on the resume; fast dev. |
| 3D | **Three.js + React Three Fiber + drei** | Standard for 3D avatars in React; drei gives camera/loader helpers. |
| Styling | **Tailwind CSS** + custom CSS for HUD (clip-path angled panels, neon glows, scanlines) | Game UI needs bespoke shapes Tailwind alone won't do. |
| Animations | **Framer Motion** | Panel slide-ins, stat bars filling up on open, button feedback. |
| Sound (optional) | Howler.js — UI ticks, mission-select sound. **Muted by default**, toggle in top HUD | Game feel without annoying recruiters. |
| Deploy | **Vercel** + GitHub repo | Free, fast CDN (3D model needs decent delivery). |

## 5. Design Language

- **Palette:** dark charcoal/navy base, **one neon accent** (Free Fire uses orange/yellow — we can do cyan, orange, or violet; user picks), red/orange for "LIVE" badges.
- **Typography:** wide/condensed display font for headings (e.g., Orbitron / Rajdhani), clean sans for body.
- **Panel style:** angled corners (clip-path), thin glowing borders, semi-transparent dark glass, subtle scanline/grid texture in background.
- **Feedback everywhere:** hover glow, press states, stat bars animate on reveal, achievement badges "unlock" with a shine sweep.
- **Loading screen:** game-style "ENTERING LOBBY…" with progress bar (doubles as the 3D model loader — necessity turned into theme).

## 6. Mobile Behavior

Lobby collapses like a mobile game UI: 3D character stays center (or fallback video), left menu becomes a bottom tab bar, attributes become a swipe-up drawer. Panels open full-screen. Test on a real phone before ship.

## 7. Build Phases

### Phase 1 — Lobby Shell ✅ DONE
- [x] Vite + React + Tailwind scaffold; HUD layout (top bar, left menu, right attributes, bottom bar)
- [x] Game design tokens: colors, fonts, angled-panel components, glow effects
- [x] All resume content in one `data.js` file

### Phase 2 — The 3D Center ✅ DONE (with placeholder bot)
- [x] Real 3D avatar in the lobby — created with Avaturn (Ready Player Me shut down Jan 2026), loaded from `public/avatar.glb` with its gesture animation; hologram-bot remains as the loading placeholder
- [x] React Three Fiber scene: platform, lighting, idle animation, drag-rotate
- [x] Loading screen with progress ("ENTERING LOBBY")

### Phase 3 — Panels (the content) ✅ DONE
- [x] ATTRIBUTES panel — animated stat bars with tabs (COMBAT / WEAPONS / GEAR)
- [x] MISSIONS — project cards with difficulty, tags, GitHub/Live buttons
- [x] ARSENAL — tools inventory grid with rarity colors
- [x] BATTLE LOG — experience styled as match history
- [x] ACHIEVEMENTS — badge wall with unlock shine
- [x] PROFILE + TEAM UP (contact + resume "player card" download)

### Phase 4 — Game Feel & Ship 🔶 IN PROGRESS
- [x] Framer Motion transitions, hover/press feedback, accent-color switcher (⚙ in top bar)
- [ ] Performance pass: code-split three.js chunk, Lighthouse check
- [x] SEO + Open Graph meta tags, favicon
- [ ] GitHub repo → Vercel deploy → test on real phone → add URL to resume/LinkedIn
- [ ] Replace placeholder URLs in `src/data.js` (GitHub, LinkedIn, Weather Agent live)

## 8. Needed From You

1. **The example pic** (mentioned but not attached — send it and I'll match the layout to it)
2. **Ready Player Me avatar** `.glb` (I'll give exact steps when we reach Phase 2) — or a decision to use a stock character
3. GitHub profile + 3 project repo URLs, LinkedIn URL, Weather Agent live URL
4. Accent color pick: 🟠 orange (true Free Fire) / 🔵 cyan / 🟣 violet
5. Latest resume PDF for the "Download Player Card" button

## 9. Success Criteria

- Lobby loads with 3D avatar in < 4s on desktop, graceful fallback on mobile.
- The "wow" lands in 5 seconds, but a recruiter can still reach projects + contact in 2 clicks.
- Every mission card has a working GitHub link; Weather Agent shows a working LIVE link.
- Site deployed, shareable, linked from resume and LinkedIn.
