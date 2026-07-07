# Yerra Narasimhulu — Portfolio (Game Lobby)

A Free Fire–style game-lobby portfolio: 3D character center stage, skills as
attributes, projects as missions. Built with React + Vite + Tailwind CSS +
React Three Fiber + Framer Motion.

## Run locally


```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Edit content

All text lives in **`src/data.js`** — name, skills, missions, experience,
achievements. Update the links marked `TODO` (GitHub, LinkedIn, Weather Agent
live URL). The resume served by "Download Player Card" is `public/resume.pdf`
— replace that file to update it.

## The 3D avatar

The lobby loads **`public/avatar.glb`** (created with https://avaturn.me from a
selfie). To change your look, export a new GLB from Avaturn and overwrite that
file — scaling and animation are handled automatically. While the file streams
in, a procedural hologram-bot stands in as the loading placeholder.

## Robo chatbot (naive RAG + Groq)

The robot pet is a chat assistant. Questions go to `POST /api/chat`
(`api/chat.js` on Vercel, a Vite middleware in dev), which runs a naive RAG
pipeline in `api/_chatcore.js`: the resume in `src/data.js` is chunked by
topic, the top-4 chunks are retrieved per question, and Groq
(`llama-3.3-70b-versatile`) generates an answer grounded in them. If the API
is unreachable, `src/chatbot.js` answers offline from keywords.

Local dev needs `.env.local` (gitignored) with `GROQ_API_KEY=...`.

## Deploy

Push this folder to a GitHub repo → import it at https://vercel.com → deploy.
Vercel auto-detects Vite and the `api/` folder. Add `GROQ_API_KEY` in
Project → Settings → Environment Variables, or the chatbot will use its
offline fallback.
