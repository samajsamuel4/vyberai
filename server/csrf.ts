/**
 * Lightweight CSRF / cross-site POST guard for /api/chat.
 * Browsers send Origin (or Referer); cross-site forged posts are rejected.
 */

const EXTRA_ALLOWED = (process.env.CHAT_ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

export type CsrfResult =
  | { ok: true }
  | { ok: false; status: number; error: string }

function headerValue(requestLike: unknown, name: string): string | null {
  if (!requestLike || typeof requestLike !== 'object') return null
  const headers =
    'headers' in requestLike
      ? (requestLike as { headers?: unknown }).headers
      : requestLike
  if (!headers || typeof headers !== 'object') return null

  if (typeof (headers as { get?: unknown }).get === 'function') {
    const v = (headers as { get: (n: string) => string | null }).get(name)
    return typeof v === 'string' && v.trim() ? v.trim() : null
  }

  const lower = name.toLowerCase()
  const record = headers as Record<string, unknown>
  const raw = record[lower] ?? record[name]
  if (typeof raw === 'string' && raw.trim()) return raw.trim()
  if (Array.isArray(raw) && typeof raw[0] === 'string' && raw[0].trim()) {
    return raw[0].trim()
  }
  return null
}

function originFromUrl(value: string): string | null {
  try {
    const u = new URL(value)
    return `${u.protocol}//${u.host}`
  } catch {
    return null
  }
}

function allowedOriginsFor(requestLike: unknown): Set<string> {
  const allowed = new Set<string>(EXTRA_ALLOWED)
  const host = headerValue(requestLike, 'host')
  const xfProto = headerValue(requestLike, 'x-forwarded-proto')
  if (host) {
    const proto = xfProto?.split(',')[0]?.trim() || 'https'
    allowed.add(`${proto}://${host}`)
    // Local / preview often hit http even when Host has no scheme
    allowed.add(`http://${host}`)
    allowed.add(`https://${host}`)
  }
  // Dev + published app defaults
  allowed.add('http://127.0.0.1:4173')
  allowed.add('http://localhost:4173')
  allowed.add('http://127.0.0.1:5173')
  allowed.add('http://localhost:5173')
  allowed.add('https://vyberai.apps.grok.bot')
  return allowed
}

/**
 * Reject cross-site browser POSTs. Same-origin app fetch keeps working.
 */
export function assertChatCsrf(requestLike: unknown): CsrfResult {
  const fetchSite = headerValue(requestLike, 'sec-fetch-site')?.toLowerCase()
  if (fetchSite === 'cross-site') {
    return {
      ok: false,
      status: 403,
      error: 'Cross-site požiadavka zamietnutá.',
    }
  }

  const allowed = allowedOriginsFor(requestLike)
  const origin = headerValue(requestLike, 'origin')
  if (origin) {
    if (!allowed.has(origin)) {
      return {
        ok: false,
        status: 403,
        error: 'Neplatný Origin pre chat API.',
      }
    }
    return { ok: true }
  }

  const referer = headerValue(requestLike, 'referer')
  if (referer) {
    const refOrigin = originFromUrl(referer)
    if (!refOrigin || !allowed.has(refOrigin)) {
      return {
        ok: false,
        status: 403,
        error: 'Neplatný Referer pre chat API.',
      }
    }
    return { ok: true }
  }

  // Non-browser / same-origin without Origin (rare). Require Sec-Fetch-Site when present.
  if (fetchSite === 'same-origin' || fetchSite === 'same-site' || fetchSite === 'none') {
    return { ok: true }
  }

  // Missing both Origin and Referer — block browser-like CSRF vectors;
  // allow only when clearly not a navigational cross-site form post.
  if (!fetchSite) {
    return {
      ok: false,
      status: 403,
      error: 'Chýba Origin/Referer pre chat API.',
    }
  }

  return { ok: true }
}
