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
import { getLandingBySlug, knownSpaPaths } from '../src/data/landings.ts'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  injectHtmlMeta,
  type PageMeta,
} from '../src/lib/seo.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const host = process.env.HOST || '0.0.0.0'
const port = Number(process.env.PORT || 3000)
const SPA_PATHS = new Set(knownSpaPaths())

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

function cleanPath(requestPath: string): string {
  const raw = decodeURIComponent((requestPath || '/').split('?')[0] || '/')
  if (raw.length > 1 && raw.endsWith('/')) return raw.slice(0, -1) || '/'
  return raw || '/'
}

function metaForPath(urlPath: string): PageMeta {
  if (urlPath === '/') {
    return {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      path: '/',
    }
  }
  if (urlPath === '/pohyby') {
    return {
      title: 'Pohyby — VyberAI',
      description:
        'Lokálna analytika pohybov na VyberAI v tomto prehliadači. Bez indexácie.',
      path: '/pohyby',
      noindex: true,
    }
  }
  const slug = urlPath.replace(/^\//, '')
  const landing = getLandingBySlug(slug)
  if (landing) {
    return {
      title: `${landing.title} — VyberAI tipy | Alza.sk`,
      description: landing.metaDescription,
      path: `/${landing.slug}`,
    }
  }
  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: urlPath,
    noindex: true,
  }
}

async function resolveStaticFile(urlPath: string) {
  const candidate = safeJoin(root, urlPath)
  if (!candidate) return null

  try {
    const info = await stat(candidate)
    if (info.isFile()) return candidate
    if (info.isDirectory()) {
      const nested = path.join(candidate, 'index.html')
      if (existsSync(nested)) return nested
    }
  } catch {
    // not a static file
  }
  return null
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
    const urlPath = cleanPath(req.url || '/')
    if (urlPath === '/api/status') {
      await handleApiStatus(req, res)
      return
    }
    if (urlPath === '/api/chat') {
      await handleApiChat(req, res)
      return
    }

    const staticFile = await resolveStaticFile(urlPath)
    if (staticFile && path.extname(staticFile).toLowerCase() !== '.html') {
      const ext = path.extname(staticFile).toLowerCase()
      const type = TYPES[ext] || 'application/octet-stream'
      const body = await readFile(staticFile)
      send(res, 200, body, type)
      return
    }

    const indexPath = path.join(root, 'index.html')
    if (!existsSync(indexPath)) {
      send(res, 404, 'Not found', 'text/plain; charset=utf-8')
      return
    }

    if (!SPA_PATHS.has(urlPath)) {
      // Never echo the raw request path into HTML attributes (XSS).
      const notFound = injectHtmlMeta(await readFile(indexPath, 'utf8'), {
        title: 'Stránka neexistuje — VyberAI',
        description: 'Táto cesta na VyberAI neexistuje.',
        path: '/',
        noindex: true,
      })
      send(res, 404, notFound, 'text/html; charset=utf-8')
      return
    }

    const html = injectHtmlMeta(
      await readFile(indexPath, 'utf8'),
      metaForPath(urlPath),
    )
    send(res, 200, html, 'text/html; charset=utf-8')
  } catch (err) {
    console.error(err)
    send(res, 500, 'Server error', 'text/plain; charset=utf-8')
  }
})

server.listen(port, host, () => {
  console.log(`VyberAI serving ${root} on http://${host}:${port}`)
})
