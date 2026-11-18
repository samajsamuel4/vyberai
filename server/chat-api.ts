import { getIdentity } from '../cursor/identity'
import { buildAffiliateUrl } from './affiliate'
import { assertChatCsrf } from './csrf'
import {
  generateChatReply,
  hasOpenAiKey,
  type ChatTurn,
  type LlmChatResult,
} from './llm'
import {
  CHAT_LLM_RATE_LIMIT,
  CHAT_RATE_LIMIT,
  checkRateLimit,
  clientIpFromRequest,
} from './rate-limit'

export type ChatApiBody = {
  messages?: ChatTurn[]
}

export type ChatApiResponse = {
  text: string
  recommendations: LlmChatResult['recommendations']
  sampleNote?: string
  mode: 'llm' | 'fallback'
}

export type ChatApiError = {
  error: string
  status: number
  headers?: Record<string, string>
}

function rateLimitError(
  limited: Extract<ReturnType<typeof checkRateLimit>, { ok: false }>,
): ChatApiError {
  return {
    error: 'Príliš veľa požiadaviek. Skús to znova o chvíľu (rate limit).',
    status: 429,
    headers: {
      'Retry-After': String(limited.retryAfterSec),
      'X-RateLimit-Limit': String(limited.limit),
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': String(Math.ceil(limited.resetMs / 1000)),
    },
  }
}

/**
 * Shared chat handler for Vite prod server and vite-dev middleware.
 * Paid OpenAI only when a verified Cursor identity is present.
 * CSRF Origin check + per-IP rate limits protect the public endpoint.
 */
export async function handleChatApi(
  requestLike: Parameters<typeof getIdentity>[0],
  body: ChatApiBody,
): Promise<ChatApiResponse | ChatApiError> {
  const csrf = assertChatCsrf(requestLike)
  if (!csrf.ok) {
    return { error: csrf.error, status: csrf.status }
  }

  const ip = clientIpFromRequest(requestLike)
  const limited = checkRateLimit(`ip:${ip}`, CHAT_RATE_LIMIT)
  if (!limited.ok) return rateLimitError(limited)

  const rawMessages = Array.isArray(body.messages) ? body.messages : null
  if (!rawMessages || rawMessages.length === 0) {
    return { error: 'Chýbajú správy.', status: 400 }
  }
  // Hard abuse cap only — do not 400 normal long chats (client sends greeting + turns).
  if (rawMessages.length > 48) {
    return { error: 'Príliš veľa správ v histórii.', status: 400 }
  }
  // Keep recent window; llm.sanitizeTurns also slices. Avoid silent client fallback.
  const messages = rawMessages.slice(-24)

  let allowLlm = false
  if (hasOpenAiKey()) {
    const identity = await getIdentity(requestLike)
    allowLlm = identity.verified === true
  }

  // Extra bucket when a request may hit paid OpenAI
  if (allowLlm) {
    const llmLimited = checkRateLimit(`llm:${ip}`, CHAT_LLM_RATE_LIMIT)
    if (!llmLimited.ok) return rateLimitError(llmLimited)
  }

  const result = await generateChatReply(messages, { allowLlm })
  // Stamp affiliate URLs server-side so the partner ID never ships in the client bundle.
  const recommendations = result.recommendations.map((r) => ({
    ...r,
    affiliateUrl: buildAffiliateUrl(r.product.alzaPath),
  }))
  return {
    text: result.text,
    recommendations,
    sampleNote: result.sampleNote,
    mode: result.mode,
  }
}
