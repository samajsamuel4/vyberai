import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const host = process.env.HOST || '0.0.0.0'
const port = Number(process.env.PORT || 3000)

const TYPES = {
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

function safeJoin(base, requestPath) {
  const decoded = decodeURIComponent((requestPath || '/').split('?')[0] || '/')
  const joined = path.normalize(path.join(base, decoded))
  if (!joined.startsWith(base)) return null
  return joined
}

async function send(res, status, body, type) {
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': status === 200 ? 'public, max-age=60' : 'no-store',
  })
  res.end(body)
}

async function resolveFile(requestPath) {
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

const server = createServer(async (req, res) => {
  try {
    const filePath = await resolveFile(req.url || '/')
    if (!filePath) {
      await send(res, 404, 'Not found', 'text/plain; charset=utf-8')
      return
    }

    const ext = path.extname(filePath).toLowerCase()
    const type = TYPES[ext] || 'application/octet-stream'
    const body = await readFile(filePath)
    await send(res, 200, body, type)
  } catch (err) {
    console.error(err)
    await send(res, 500, 'Server error', 'text/plain; charset=utf-8')
  }
})

server.listen(port, host, () => {
  console.log(`VyberAI serving ${root} on http://${host}:${port}`)
})
