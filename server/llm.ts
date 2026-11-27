import { getProductFeed, type Product } from '../src/data/catalog'
import { buildAffiliateUrl } from './affiliate'
import {
  adviseUser,
  filterRecommendationsToIntent,
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
/** Local/rule history (user turns for adviseUser). */
const MAX_HISTORY = 12
/** OpenAI: only recent *user* turns — never full assistant transcripts. */
const MAX_OPENAI_USER_TURNS = 4
const MAX_OPENAI_CHARS = 500
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const MODEL = 'gpt-4o-mini'

/** Strip obvious PII-ish tokens before any third-party LLM call. */
function redactForLlm(text: string): string {
  return text
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[email]')
    .replace(/\b(?:\+?\d[\d\s\-()]{7,}\d)\b/g, '[phone]')
    .slice(0, MAX_OPENAI_CHARS)
}

/**
 * Minimize data sent to OpenAI: user-only turns, short, redacted.
 * Assistant replies (product tips, names) stay on-server.
 */
function historyForOpenAi(turns: ChatTurn[]): ChatTurn[] {
  return turns
    .filter((t) => t.role === 'user')
    .slice(-MAX_OPENAI_USER_TURNS)
    .map((t) => ({
      role: 'user' as const,
      text: redactForLlm(t.text),
    }))
    .filter((t) => t.text.length > 0)
}

function catalogForPrompt(): string {
  return getProductFeed()
    .map(
      (p: Product) =>
        `- id=${p.id} | ${p.brand} ${p.name} | ${p.category} | ${p.priceEur} € | ${p.reviews.rating}★/${p.reviews.count} | themes=${p.reviews.themes.join('; ')} | ${p.summary} | specs=${p.specs.join('; ')} | tags=${p.tags.join(',')}`,
    )
    .join('\n')
}

function systemPrompt(): string {
  return `Si VyberAI — slovenský asistent výberu elektroniky. Odpovedáš vždy po slovensky, stručne a vecne.

Pravidlá:
1. Ak chýba kategória ALEBO je požiadavka vágna („niečo lacné“, „ahoj“), polož 1–2 krátke upresňujúce otázky a NEODPORÚČAJ produkty (clarifying=true, productIds=[]).
2. Keď poznáš kategóriu (a ideálne rozpočet/použitie), odporuč 1–3 produkty VÝHRADNE z katalógu (ich id). Každý tip MUSÍ sedieť na kategóriu a rozpočet; žiadne náhodné produkty z inej kategórie.
3. V text začni v duchu „Na základe recenzií…“ a uveď rating/počet. V reasons spomeň rating aj tému z themes.
4. Text bez markdown tabuliek. Nikdy nevymýšľaj produkty mimo katalógu. Affiliate doplní server.
5. Ak rozpočet je príliš nízky pre kategóriu, povedz to a spýtaj sa na vyšší rozpočet namiesto náhodných tipov.
6. Bez OpenAI kľúča beží rovnaký rule-based matching — LLM je voliteľný.

Katalóg:
${catalogForPrompt()}

Vráť IBA JSON:
{"text":"...","clarifying":true|false,"productIds":["id1"],"reasons":{"id1":"dôvod"}}`
}

function fallbackFromHistory(turns: ChatTurn[]): LlmChatResult {
  const userTexts = turns.filter((t) => t.role === 'user').map((t) => t.text)
  const latest = userTexts[userTexts.length - 1] ?? ''
  const prior = userTexts.slice(0, -1)
  const advice = adviseUser(latest, prior)
  return {
    text: advice.text,
    recommendations: advice.recommendations,
    sampleNote:
      advice.kind === 'recommend'
        ? 'Odporúčania z ukážkového katalógu podľa recenzií a parametrov (nie živý Alza feed).'
        : undefined,
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
    return fallbackFromHistory(history)
  }

  try {
    const openAiTurns = historyForOpenAi(history)
    if (openAiTurns.length === 0) {
      return fallbackFromHistory(history)
    }

    const messages = [
      { role: 'system' as const, content: systemPrompt() },
      ...openAiTurns.map((t) => ({
        role: 'user' as const,
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
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages,
        max_tokens: 700,
      }),
    })

    if (!res.ok) {
      return {
        ...fallbackFromHistory(history),
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
        ...fallbackFromHistory(history),
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

    const priorUsers = history
      .filter((t) => t.role === 'user' && t.text !== latestUser.text)
      .map((t) => t.text)
    const recommendations = filterRecommendationsToIntent(
      mapIdsToRecommendations(ids, parsed.reasons),
      latestUser.text,
      priorUsers,
    )

    if (recommendations.length === 0) {
      return {
        ...fallbackFromHistory(history),
        sampleNote: 'LLM tipy nesedeli na požiadavku — fallback na katalóg.',
      }
    }

    return {
      text,
      recommendations,
      mode: 'llm',
    }
  } catch {
    return {
      ...fallbackFromHistory(history),
      sampleNote: 'Chyba LLM volania — použil som ukážkový katalóg.',
    }
  }
}
