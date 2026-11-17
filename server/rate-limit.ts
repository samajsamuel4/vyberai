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

/** Default: 20 chat POSTs / minute / key (IP or identity). */
export const CHAT_RATE_LIMIT = 20
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

/** Extract client IP from Node req, Fetch Request, or headers bag. */
export function clientIpFromRequest(requestLike: unknown): string {
  const headers = readHeaders(requestLike)
  const forwarded = headers['x-forwarded-for'] || headers['x-real-ip']
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first.slice(0, 128)
  }

  if (
    requestLike &&
    typeof requestLike === 'object' &&
    'socket' in requestLike &&
    requestLike.socket &&
    typeof requestLike.socket === 'object' &&
    'remoteAddress' in requestLike.socket
  ) {
    const addr = (requestLike.socket as { remoteAddress?: string }).remoteAddress
    if (addr) return addr
  }

  return 'unknown'
}

function readHeaders(requestLike: unknown): Record<string, string> {
  const out: Record<string, string> = {}
  if (!requestLike || typeof requestLike !== 'object') return out

  if ('headers' in requestLike && requestLike.headers) {
    const h = requestLike.headers as
      | Headers
      | Record<string, string | string[] | undefined>
      | { get?: (name: string) => string | null }

    if (typeof (h as Headers).get === 'function') {
      const get = (h as Headers).get.bind(h)
      for (const name of ['x-forwarded-for', 'x-real-ip']) {
        const v = get(name)
        if (v) out[name] = v
      }
      return out
    }

    for (const [k, v] of Object.entries(h as Record<string, string | string[] | undefined>)) {
      if (v == null) continue
      out[k.toLowerCase()] = Array.isArray(v) ? v.join(',') : String(v)
    }
  }

  return out
}

/** Test helper — clears buckets between tests / smoke runs. */
export function resetRateLimitsForTests(): void {
  buckets.clear()
}
