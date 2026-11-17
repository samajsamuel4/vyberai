import { requireIdentity } from '../../../cursor/identity'
import {
  generateChatReply,
  hasOpenAiKey,
  type ChatTurn,
} from '../../../src/lib/llm'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const jsonHeaders = {
  'content-type': 'application/json',
  'cache-control': 'private, no-store',
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders })
}

type Body = {
  messages?: ChatTurn[]
}

/**
 * Chat endpoint: LLM when OPENAI_API_KEY is bound; otherwise mock catalog fallback.
 * Paid OpenAI calls require a verified Cursor identity (private/team apps).
 */
export async function POST(request: Request): Promise<Response> {
  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return json({ error: 'Neplatný JSON.' }, 400)
  }

  const messages = Array.isArray(body.messages) ? body.messages : null
  if (!messages || messages.length === 0) {
    return json({ error: 'Chýbajú správy.' }, 400)
  }
  if (messages.length > 24) {
    return json({ error: 'Príliš veľa správ v histórii.' }, 400)
  }

  const usingLlm = hasOpenAiKey()
  if (usingLlm) {
    const identity = await requireIdentity(request)
    if (identity instanceof Response) {
      return new Response(identity.body, {
        status: identity.status,
        headers: jsonHeaders,
      })
    }
  }

  const result = await generateChatReply(messages)

  return json({
    text: result.text,
    recommendations: result.recommendations.map((r) => ({
      product: r.product,
      reason: r.reason,
      affiliateUrl: r.affiliateUrl,
      score: r.score,
    })),
    sampleNote: result.sampleNote,
    mode: result.mode,
  })
}
