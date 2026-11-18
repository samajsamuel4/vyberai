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
 * Rate-limit key from the platform-trusted connection address only.
 * Never trust client-controlled X-Forwarded-For / X-Real-IP — those are spoofable.
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

  return 'unknown'
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
