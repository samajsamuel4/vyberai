import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { handleChatApi, type ChatApiBody } from '../server/chat-api.ts'
import {
  BodyTooLargeError,
  InvalidJsonError,
  readJsonBodyCapped,
} from '../server/read-body.ts'
import { getPublicStatus } from '../server/status.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const host = process.env.HOST || '0.0.0.0'
const port = Number(process.env.PORT || 3000)

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
}

if (!existsSync(root)) {
  console.error(`Missing ${root}. Run "npm run build" first.`)
  process.exit(1)
}

function safeJoin(base: string, requestPath: string) {
  const decoded = decodeURIComponent((requestPath || '/').split('?')[0] || '/')
  const joined = path.normalize(path.join(base, decoded))
  if (!joined.startsWith(base)) return null
  return joined
}

function send(
  res: ServerResponse,
  status: number,
  body: string | Buffer,
  type: string,
) {
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': status === 200 ? 'public, max-age=60' : 'no-store',
  })
  res.end(body)
}

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

async function resolveFile(requestPath: string) {
  const candidate = safeJoin(root, requestPath)
  if (!candidate) return null

  try {
    const info = await stat(candidate)
    if (info.isFile()) return candidate
    if (info.isDirectory()) {
      const nested = path.join(candidate, 'index.html')
      if (existsSync(nested)) return nested
    }
  } catch {
    // fall through to SPA index
  }

  const fallback = path.join(root, 'index.html')
  return existsSync(fallback) ? fallback : null
}

async function handleApiStatus(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Metóda nie je povolená.' })
    return
  }
  sendJson(res, 200, getPublicStatus())
}

async function handleApiChat(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'content-type',
      'Cache-Control': 'no-store',
    })
    res.end()
    return
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Metóda nie je povolená.' })
    return
  }

  let body: ChatApiBody
  try {
    body = (await readJsonBodyCapped(req)) as ChatApiBody
  } catch (err) {
    if (err instanceof BodyTooLargeError) {
      sendJson(res, 413, { error: err.message })
      return
    }
    if (err instanceof InvalidJsonError) {
      sendJson(res, 400, { error: err.message })
      return
    }
    sendJson(res, 400, { error: 'Neplatný JSON.' })
    return
  }

  const result = await handleChatApi(req, body)
  if ('error' in result) {
    sendJson(res, result.status, { error: result.error }, result.headers)
    return
  }
  sendJson(res, 200, result)
}

const server = createServer(async (req, res) => {
  try {
    const urlPath = (req.url || '/').split('?')[0] || '/'
    if (urlPath === '/api/status') {
      await handleApiStatus(req, res)
      return
    }
    if (urlPath === '/api/chat') {
      await handleApiChat(req, res)
      return
    }

    const filePath = await resolveFile(req.url || '/')
    if (!filePath) {
      send(res, 404, 'Not found', 'text/plain; charset=utf-8')
      return
    }

    const ext = path.extname(filePath).toLowerCase()
    const type = TYPES[ext] || 'application/octet-stream'
    const body = await readFile(filePath)
    send(res, 200, body, type)
  } catch (err) {
    console.error(err)
    send(res, 500, 'Server error', 'text/plain; charset=utf-8')
  }
})

server.listen(port, host, () => {
  console.log(`VyberAI serving ${root} on http://${host}:${port}`)
})
