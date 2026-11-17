import {
  recommendProducts,
  buildAssistantReply,
  greetingReply,
  type Recommendation,
} from './recommend'

export type ChatRole = 'user' | 'assistant'

export type ChatMessage = {
  id: string
  role: ChatRole
  text: string
  recommendations?: Recommendation[]
  /** User query that produced these recommendations (for share links) */
  shareQuery?: string
  /** Shown when using sample/rule-based engine */
  sampleNote?: string
  mode?: 'llm' | 'fallback'
}

export function createGreeting(): ChatMessage {
  return {
    id: 'greet',
    role: 'assistant',
    text: greetingReply(),
  }
}

function localFallback(userText: string): ChatMessage {
  const recommendations = recommendProducts(userText, 3)
  return {
    id: `a-${Date.now()}`,
    role: 'assistant',
    text: buildAssistantReply(userText, recommendations),
    recommendations,
    sampleNote: 'Odporúčania z ukážkového katalógu (nie živý Alza feed).',
    mode: 'fallback',
  }
}

/**
 * Prefer server `/api/chat` (LLM when OPENAI_API_KEY + identity).
 * Falls back to in-browser rule-based catalog if the API is unreachable.
 */
export async function respondToUser(
  userText: string,
  history: ChatMessage[] = [],
): Promise<ChatMessage> {
  const turns = [
    ...history
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, text: m.text })),
    { role: 'user' as const, text: userText },
  ]

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: turns }),
    })

    if (res.status === 429) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null
      return {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text:
          data?.error?.trim() ||
          'Príliš veľa požiadaviek. Skús to znova o chvíľu.',
        mode: 'fallback',
      }
    }

    if (!res.ok) {
      return localFallback(userText)
    }

    const data = (await res.json()) as {
      text?: string
      recommendations?: Recommendation[]
      sampleNote?: string
      mode?: 'llm' | 'fallback'
    }

    return {
      id: `a-${Date.now()}`,
      role: 'assistant',
      text: data.text?.trim() || 'Tu sú tipy z nášho katalógu.',
      recommendations: data.recommendations ?? [],
      sampleNote: data.sampleNote,
      mode: data.mode,
    }
  } catch {
    return localFallback(userText)
  }
}

export const SUGGESTIONS = [
  'Notebook do 800 € na školu',
  'Slúchadlá s ANC do 150 €',
  'Telefón s dobrým foťákom',
  'Monitor na home office',
  'Tablet na poznámky do 450 €',
]
