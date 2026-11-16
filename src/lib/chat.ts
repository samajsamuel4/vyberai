import { recommendProducts, buildAssistantReply, greetingReply, type Recommendation } from './recommend'

export type ChatRole = 'user' | 'assistant'

export type ChatMessage = {
  id: string
  role: ChatRole
  text: string
  recommendations?: Recommendation[]
  /** Shown when using sample/rule-based engine */
  sampleNote?: string
}

export function createGreeting(): ChatMessage {
  return {
    id: 'greet',
    role: 'assistant',
    text: greetingReply(),
  }
}

/**
 * Process a user turn. Always rule-based in the browser MVP (no API key needed).
 * Optional later: bind OPENAI_API_KEY on a server route to polish copy —
 * recommendations still come from the mock catalog. Secrets never ship to the client.
 */
export async function respondToUser(userText: string): Promise<ChatMessage> {
  const recommendations = recommendProducts(userText, 3)
  const text = buildAssistantReply(userText, recommendations)

  return {
    id: `a-${Date.now()}`,
    role: 'assistant',
    text,
    recommendations,
    sampleNote: 'Odporúčania z ukážkového katalógu (nie živý Alza feed).',
  }
}

export const SUGGESTIONS = [
  'Notebook do 800 € na školu',
  'Slúchadlá s ANC do 150 €',
  'Telefón s dobrým foťákom',
  'Monitor na home office',
]
