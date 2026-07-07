import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Serves POST /api/chat during `npm run dev` with the same handler core that
// Vercel runs in production, so the chatbot works locally without vercel CLI.
function chatDevApi(env) {
  return {
    name: 'chat-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('POST only')
          return
        }
        let body = ''
        req.on('data', (chunk) => (body += chunk))
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json')
          try {
            const coreUrl = pathToFileURL(path.resolve('api/_chatcore.js')).href
            const { answerChat } = await import(coreUrl)
            const result = await answerChat(JSON.parse(body), env.GROQ_API_KEY)
            res.end(JSON.stringify(result))
          } catch (err) {
            res.statusCode = 502
            res.end(JSON.stringify({ error: String(err?.message || err) }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), chatDevApi(env)],
  }
})
