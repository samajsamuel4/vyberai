import { getIdentity } from '../cursor/identity'
import {
  generateChatReply,
  hasOpenAiKey,
  type ChatTurn,
  type LlmChatResult,
} from './llm'

export type ChatApiBody = {
  messages?: ChatTurn[]
}

export type ChatApiResponse = {
  text: string
  recommendations: LlmChatResult['recommendations']
  sampleNote?: string
  mode: 'llm' | 'fallback'
}

export type ChatApiError = { error: string; status: number }

/**
 * Shared chat handler for Vite prod server and vite-dev middleware.
 * Paid OpenAI only when a verified Cursor identity is present.
 */
export async function handleChatApi(
  requestLike: Parameters<typeof getIdentity>[0],
  body: ChatApiBody,
): Promise<ChatApiResponse | ChatApiError> {
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
