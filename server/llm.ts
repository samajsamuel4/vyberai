import { getProductFeed, type Product } from '../src/data/catalog'
import { buildAffiliateUrl } from './affiliate'
import {
  buildAssistantReply,
  recommendProducts,
  type Recommendation,
} from '../src/lib/recommend'

export type ChatTurn = {
  role: 'user' | 'assistant'
  text: string
}

export type LlmChatResult = {
  text: string
  recommendations: Recommendation[]
  sampleNote?: string
  mode: 'llm' | 'fallback'
}

type LlmJson = {
  text?: string
  clarifying?: boolean
  productIds?: string[]
  reasons?: Record<string, string>
}

const MAX_MESSAGE_CHARS = 2000
const MAX_HISTORY = 12
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const MODEL = 'gpt-4o-mini'

function catalogForPrompt(): string {
  return getProductFeed()
    .map(
      (p: Product) =>
        `- id=${p.id} | ${p.brand} ${p.name} | ${p.category} | ${p.priceEur} € | ${p.summary} | specs=${p.specs.join('; ')} | tags=${p.tags.join(',')}`,
    )
    .join('\n')
}

function systemPrompt(): string {
  return `Si VyberAI — slovenský asistent výberu elektroniky. Odpovedáš vždy po slovensky, stručne a priateľsky.

Pravidlá:
1. Ak chýba kategória, rozpočet alebo použitie, polož 1–2 krátke upresňujúce otázky a NEODPORÚČAJ produkty (productIds = []).
2. Keď máš dosť info, odporuč 1 až 3 produkty VÝHRADNE z katalógu nižšie (použi ich id).
3. Ku každému id doplň krátky dôvod v slovenčine (reasons).
4. Text musí byť prirodzená odpoveď pre chat (bez markdown tabuliek).
5. Nikdy nevymýšľaj produkty mimo katalógu. Affiliate odkazy doplní server.

Katalóg:
${catalogForPrompt()}

Vráť IBA JSON objekt tvaru:
{"text":"...","clarifying":true|false,"productIds":["id1"],"reasons":{"id1":"dôvod"}}`
}

function fallbackFromLatest(userText: string): LlmChatResult {
  const recommendations = recommendProducts(userText, 3)
  return {
    text: buildAssistantReply(userText, recommendations),
    recommendations,
    sampleNote: 'Odporúčania z ukážkového katalógu (nie živý Alza feed).',
    mode: 'fallback',
  }
}

function sanitizeTurns(turns: ChatTurn[]): ChatTurn[] {
  return turns
    .filter(
      (t) =>
        t &&
        (t.role === 'user' || t.role === 'assistant') &&
        typeof t.text === 'string',
    )
    .map((t) => ({
      role: t.role,
      text: t.text.trim().slice(0, MAX_MESSAGE_CHARS),
    }))
    .filter((t) => t.text.length > 0)
    .slice(-MAX_HISTORY)
}

function mapIdsToRecommendations(
  productIds: string[],
  reasons: Record<string, string> | undefined,
): Recommendation[] {
  const byId = new Map<string, Product>(
    getProductFeed().map((p: Product) => [p.id, p]),
  )
  const picks: Recommendation[] = []
  for (const id of productIds) {
    const product = byId.get(id)
    if (!product) continue
    picks.push({
      product,
      reason: reasons?.[id]?.trim() || product.summary,
      affiliateUrl: buildAffiliateUrl(product.alzaPath),
      score: 100 - picks.length,
    })
    if (picks.length >= 3) break
  }
  return picks
}

export function hasOpenAiKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim())
}

/**
 * Call OpenAI when OPENAI_API_KEY is set; otherwise rule-based mock catalog.
 * Never logs or returns the API key.
 */
export async function generateChatReply(
  turns: ChatTurn[],
  options: { allowLlm?: boolean } = {},
): Promise<LlmChatResult> {
  const history = sanitizeTurns(turns)
  const latestUser = [...history].reverse().find((t) => t.role === 'user')
  if (!latestUser) {
    return {
      text: 'Napíš, čo hľadáš — napríklad notebook do 800 € na školu.',
      recommendations: [],
      mode: 'fallback',
    }
  }

  const allowLlm = options.allowLlm !== false
  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!allowLlm || !apiKey) {
    return fallbackFromLatest(latestUser.text)
  }

  try {
    const messages = [
      { role: 'system' as const, content: systemPrompt() },
      ...history.map((t) => ({
        role: t.role as 'user' | 'assistant',
        content: t.text,
      })),
    ]

    const res = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.4,
        response_format: { type: 'json_object' },
        messages,
        max_tokens: 700,
      }),
    })

    if (!res.ok) {
      return {
        ...fallbackFromLatest(latestUser.text),
        sampleNote:
          'LLM dočasne nedostupné — použil som ukážkový katalóg (rule-based).',
      }
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const raw = data.choices?.[0]?.message?.content ?? ''
    let parsed: LlmJson
    try {
      parsed = JSON.parse(raw) as LlmJson
    } catch {
      return {
        ...fallbackFromLatest(latestUser.text),
        sampleNote: 'LLM odpoveď nebola JSON — fallback na ukážkový katalóg.',
      }
    }

    const text =
      typeof parsed.text === 'string' && parsed.text.trim()
        ? parsed.text.trim()
        : 'Tu sú tipy z nášho katalógu.'

    const ids = Array.isArray(parsed.productIds)
      ? parsed.productIds.filter((id): id is string => typeof id === 'string')
      : []

    if (parsed.clarifying || ids.length === 0) {
      return {
        text,
        recommendations: [],
        mode: 'llm',
      }
    }

    const recommendations = mapIdsToRecommendations(ids, parsed.reasons)
    if (recommendations.length === 0) {
      return {
        ...fallbackFromLatest(latestUser.text),
        sampleNote: 'LLM vrátilo neznáme id — fallback na ukážkový katalóg.',
      }
    }

    return {
      text,
      recommendations,
      mode: 'llm',
    }
  } catch {
    return {
      ...fallbackFromLatest(latestUser.text),
      sampleNote: 'Chyba LLM volania — použil som ukážkový katalóg.',
    }
  }
}
