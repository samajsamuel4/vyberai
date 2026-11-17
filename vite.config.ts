import type { IncomingMessage, ServerResponse } from 'node:http'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { handleChatApi, type ChatApiBody } from './server/chat-api'
import { getPublicStatus } from './server/status'

function sendJson(
  res: ServerResponse,
  status: number,
  body: unknown,
  extraHeaders?: Record<string, string>,
) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'private, no-store',
    ...extraHeaders,
  })
  res.end(JSON.stringify(body))
}

function chatApiPlugin(): Plugin {
  return {
    name: 'vyberai-chat-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] || ''
        const nodeReq = req as IncomingMessage
        const nodeRes = res as ServerResponse

        if (url === '/api/status' && nodeReq.method === 'GET') {
          sendJson(nodeRes, 200, getPublicStatus())
          return
        }

        if (url !== '/api/chat') {
          next()
          return
        }

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
          sendJson(nodeRes, 405, { error: 'Metóda nie je povolená.' })
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
          sendJson(
            nodeRes,
            status,
            payload,
            'error' in result ? result.headers : undefined,
          )
        } catch {
          sendJson(nodeRes, 400, { error: 'Neplatný JSON.' })
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), chatApiPlugin()],
})
