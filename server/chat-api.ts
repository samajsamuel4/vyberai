import { getIdentity } from '../cursor/identity'
import {
  generateChatReply,
  hasOpenAiKey,
  type ChatTurn,
  type LlmChatResult,
} from './llm'
import {
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

/**
 * Shared chat handler for Vite prod server and vite-dev middleware.
 * Paid OpenAI only when a verified Cursor identity is present.
 * Per-IP rate limit protects the open endpoint from abuse.
 */
export async function handleChatApi(
  requestLike: Parameters<typeof getIdentity>[0],
  body: ChatApiBody,
): Promise<ChatApiResponse | ChatApiError> {
  const ip = clientIpFromRequest(requestLike)
  const limited = checkRateLimit(`ip:${ip}`, CHAT_RATE_LIMIT)
  if (!limited.ok) {
    return {
      error:
        'Príliš veľa požiadaviek. Skús to znova o chvíľu (rate limit).',
      status: 429,
      headers: {
        'Retry-After': String(limited.retryAfterSec),
        'X-RateLimit-Limit': String(limited.limit),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.ceil(limited.resetMs / 1000)),
      },
    }
  }

  const messages = Array.isArray(body.messages) ? body.messages : null
  if (!messages || messages.length === 0) {
    return { error: 'Chýbajú správy.', status: 400 }
  }
  if (messages.length > 24) {
    return { error: 'Príliš veľa správ v histórii.', status: 400 }
  }

  let allowLlm = false
  if (hasOpenAiKey()) {
    const identity = await getIdentity(requestLike)
    allowLlm = identity.verified === true
  }

  const result = await generateChatReply(messages, { allowLlm })
  return {
    text: result.text,
    recommendations: result.recommendations,
    sampleNote: result.sampleNote,
    mode: result.mode,
  }
}
