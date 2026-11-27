import type { IncomingMessage } from 'node:http'

/** Max JSON body for POST /api/chat — enough for normal history, not abuse. */
export const CHAT_BODY_MAX_BYTES = 64 * 1024

export class BodyTooLargeError extends Error {
  readonly status = 413 as const
  constructor() {
    super('Príliš veľké telo požiadavky.')
    this.name = 'BodyTooLargeError'
  }
}

export class InvalidJsonError extends Error {
  readonly status = 400 as const
  constructor() {
    super('Neplatný JSON.')
    this.name = 'InvalidJsonError'
  }
}

/**
 * Read a JSON request body with a hard byte cap.
 * Rejects early when Content-Length exceeds the limit; also caps while streaming.
 */
export async function readJsonBodyCapped(
  req: IncomingMessage,
  maxBytes = CHAT_BODY_MAX_BYTES,
): Promise<unknown> {
  const declared = req.headers['content-length']
  if (declared) {
    const n = Number(declared)
    if (Number.isFinite(n) && n > maxBytes) {
      req.resume()
      throw new BodyTooLargeError()
    }
  }

  const chunks: Buffer[] = []
  let total = 0

  for await (const chunk of req) {
    const buf = typeof chunk === 'string' ? Buffer.from(chunk) : chunk
    total += buf.length
    if (total > maxBytes) {
      req.resume()
      throw new BodyTooLargeError()
    }
    chunks.push(buf)
  }

  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw.trim()) return {}
  try {
    return JSON.parse(raw) as unknown
  } catch {
    throw new InvalidJsonError()
  }
}

/**
 * Read JSON from a Web Fetch API Request (Cursor Apps / Vercel functions).
 * Enforces the same byte cap as the Node path.
 */
export async function readJsonFromWebRequest(
  request: Request,
  maxBytes = CHAT_BODY_MAX_BYTES,
): Promise<unknown> {
  const declared = request.headers.get('content-length')
  if (declared) {
    const n = Number(declared)
    if (Number.isFinite(n) && n > maxBytes) {
      throw new BodyTooLargeError()
    }
  }

  const buf = new Uint8Array(await request.arrayBuffer())
  if (buf.byteLength > maxBytes) {
    throw new BodyTooLargeError()
  }

  const raw = new TextDecoder('utf-8').decode(buf)
  if (!raw.trim()) return {}
  try {
    return JSON.parse(raw) as unknown
  } catch {
    throw new InvalidJsonError()
  }
}
