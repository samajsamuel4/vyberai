import type { IncomingMessage, ServerResponse } from 'node:http'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { handleChatApi, type ChatApiBody } from './server/chat-api'

// Inject AFFILIATE_ID at build time (Cursor app secret / CI env).
// Never prefix with VITE_ — that is reserved by Cursor Apps hosting.
const affiliateId = process.env.AFFILIATE_ID?.trim() || 'AFFILIATE_ID'

function chatApiPlugin(): Plugin {
  return {
    name: 'vyberai-chat-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] || ''
        if (url !== '/api/chat') {
          next()
          return
        }

        const nodeReq = req as IncomingMessage
        const nodeRes = res as ServerResponse

        if (nodeReq.method === 'OPTIONS') {
          nodeRes.writeHead(204, {
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'content-type',
            'Cache-Control': 'no-store',
          })
          nodeRes.end()
          return
        }

        if (nodeReq.method !== 'POST') {
          nodeRes.writeHead(405, {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
          })
          nodeRes.end(JSON.stringify({ error: 'Metóda nie je povolená.' }))
          return
        }

        try {
          const chunks: Buffer[] = []
          for await (const chunk of nodeReq) {
            chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
          }
          const raw = Buffer.concat(chunks).toString('utf8')
          const body = (raw.trim() ? JSON.parse(raw) : {}) as ChatApiBody
          const result = await handleChatApi(nodeReq, body)
          const status = 'error' in result ? result.status : 200
          const payload = 'error' in result ? { error: result.error } : result
          nodeRes.writeHead(status, {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'private, no-store',
          })
          nodeRes.end(JSON.stringify(payload))
        } catch {
          nodeRes.writeHead(400, {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
          })
          nodeRes.end(JSON.stringify({ error: 'Neplatný JSON.' }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), chatApiPlugin()],
  define: {
    __VYBER_AFFILIATE_ID__: JSON.stringify(affiliateId),
  },
})
