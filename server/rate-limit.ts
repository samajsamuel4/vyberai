/**
 * Simple in-memory sliding-window rate limiter (per process).
 * Good enough for a single-instance Cursor Apps deploy.
 */

export type RateLimitResult =
  | { ok: true; remaining: number; limit: number; resetMs: number }
  | {
      ok: false
      remaining: 0
      limit: number
      resetMs: number
      retryAfterSec: number
    }

type Hit = number

type Bucket = {
  hits: Hit[]
}

const buckets = new Map<string, Bucket>()

/** General chat POSTs / minute / IP (fallback + LLM). */
export const CHAT_RATE_LIMIT = 12
/** Extra cap when a request may burn paid OpenAI. */
export const CHAT_LLM_RATE_LIMIT = 6
export const CHAT_RATE_WINDOW_MS = 60_000

const MAX_BUCKETS = 5_000

function pruneBucket(bucket: Bucket, now: number, windowMs: number) {
  const cutoff = now - windowMs
  while (bucket.hits.length > 0 && bucket.hits[0]! < cutoff) {
    bucket.hits.shift()
  }
}

function pruneStale(now: number, windowMs: number) {
  if (buckets.size < MAX_BUCKETS) return
  for (const [key, bucket] of buckets) {
    pruneBucket(bucket, now, windowMs)
    if (bucket.hits.length === 0) buckets.delete(key)
  }
  // Hard cap: drop oldest-ish keys if still oversized
  if (buckets.size >= MAX_BUCKETS) {
    const overflow = buckets.size - Math.floor(MAX_BUCKETS * 0.8)
    let i = 0
    for (const key of buckets.keys()) {
      if (i++ >= overflow) break
      buckets.delete(key)
    }
  }
}

export function checkRateLimit(
  key: string,
  limit = CHAT_RATE_LIMIT,
  windowMs = CHAT_RATE_WINDOW_MS,
): RateLimitResult {
  const now = Date.now()
  pruneStale(now, windowMs)

  let bucket = buckets.get(key)
  if (!bucket) {
    bucket = { hits: [] }
    buckets.set(key, bucket)
  }

  pruneBucket(bucket, now, windowMs)

  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0] ?? now
    const resetMs = oldest + windowMs
    const retryAfterSec = Math.max(1, Math.ceil((resetMs - now) / 1000))
    return {
      ok: false,
      remaining: 0,
      limit,
      resetMs,
      retryAfterSec,
    }
  }

  bucket.hits.push(now)
  const remaining = Math.max(0, limit - bucket.hits.length)
  const oldest = bucket.hits[0] ?? now
  return {
    ok: true,
    remaining,
    limit,
    resetMs: oldest + windowMs,
  }
}

/**
 * Rate-limit key from the platform-trusted connection address when available.
 * On serverless Web Request (no socket), fall back to Cursor platform
 * forwarding headers only — never trust a bare client-supplied IP alone
 * without a platform hop marker.
 */
export function clientIpFromRequest(requestLike: unknown): string {
  if (!requestLike || typeof requestLike !== 'object') return 'unknown'

  const fromSocket = remoteAddressOf(
    'socket' in requestLike ? (requestLike as { socket?: unknown }).socket : undefined,
  )
  if (fromSocket) return fromSocket

  // Older Node / some proxies expose connection.remoteAddress
  const fromConnection = remoteAddressOf(
    'connection' in requestLike
      ? (requestLike as { connection?: unknown }).connection
      : undefined,
  )
  if (fromConnection) return fromConnection

  // Cursor Apps / Vercel edge: socket is absent; use first X-Forwarded-For hop
  // only when the platform also set a forwarding fingerprint.
  const headers = headersOf(requestLike)
  if (headers) {
    const vercelId =
      headerGet(headers, 'x-vercel-id') ||
      headerGet(headers, 'x-cursor-edge') ||
      headerGet(headers, 'cf-ray')
    const xff = headerGet(headers, 'x-forwarded-for')
    if (vercelId && xff) {
      const first = xff.split(',')[0]?.trim()
      if (first) return first.slice(0, 128)
    }
  }

  return 'unknown'
}

function headersOf(requestLike: unknown): unknown {
  if (!requestLike || typeof requestLike !== 'object') return null
  if ('headers' in requestLike) return (requestLike as { headers: unknown }).headers
  return null
}

function headerGet(headers: unknown, name: string): string | null {
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

function remoteAddressOf(sock: unknown): string | null {
  if (!sock || typeof sock !== 'object') return null
  if (!('remoteAddress' in sock)) return null
  const addr = (sock as { remoteAddress?: unknown }).remoteAddress
  if (typeof addr !== 'string' || !addr.trim()) return null
  return addr.trim().slice(0, 128)
}

/** Test helper — clears buckets between tests / smoke runs. */
export function resetRateLimitsForTests(): void {
  buckets.clear()
}
