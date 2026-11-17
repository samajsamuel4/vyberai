import {
  CATEGORY_LABELS,
  getProductFeed,
  type Product,
  type ProductCategory,
} from '../data/catalog'
import { buildAffiliateUrl } from './affiliate'

export type Recommendation = {
  product: Product
  reason: string
  affiliateUrl: string
  score: number
}

type ParsedIntent = {
  categories: ProductCategory[]
  maxBudget: number | null
  minBudget: number | null
  tags: string[]
  brands: string[]
  tokens: string[]
}

const CATEGORY_KEYWORDS: { category: ProductCategory; words: string[] }[] = [
  {
    category: 'notebook',
    words: [
      'notebook',
      'laptop',
      'notebooky',
      'laptopy',
      'pc na skol',
      'počítač',
      'pocitac',
      'ultrabook',
      'chromebook',
    ],
  },
  {
    category: 'telefon',
    words: ['telefon', 'telefón', 'mobil', 'smartphone', 'iphone', 'android', 'galaxy'],
  },
  {
    category: 'sluchadla',
    words: [
      'sluchadla',
      'slúchadlá',
      'headphones',
      'airpods',
      'anc',
      'hudba',
      'hudbu',
      'hudby',
      'earbud',
      'sluchatka',
    ],
  },
  {
    category: 'monitor',
    words: ['monitor', 'displej', 'obrazovka', 'ultrawide'],
  },
  {
    category: 'tablet',
    words: ['tablet', 'ipad', 'poznámky', 'poznamky'],
  },
  {
    category: 'klavesnica',
    words: ['klavesnica', 'klávesnica', 'keyboard', 'mechanicka', 'mechanická'],
  },
  {
    category: 'mys',
    words: ['mys', 'myš', 'mouse', 'trackball'],
  },
  {
    category: 'ssd',
    words: ['ssd', 'disk', 'úložisko', 'ulozisko', 'nvme', 'externy disk', 'externý disk'],
  },
  {
    category: 'tv',
    words: ['tv', 'televizor', 'televízor', 'oled', 'qled', 'televizia', 'televízia'],
  },
  {
    category: 'herna-konzola',
    words: ['konzola', 'playstation', 'ps5', 'ps4', 'switch', 'nintendo', 'xbox'],
  },
]

const TAG_KEYWORDS: { tag: string; words: string[] }[] = [
  {
    tag: 'skola',
    words: ['skola', 'škola', 'skolu', 'školu', 'štúdium', 'studium', 'prednášk', 'prednask'],
  },
  { tag: 'student', words: ['student', 'študent', 'studentka', 'študentka'] },
  {
    tag: 'office',
    words: ['praca', 'práca', 'kancel', 'office', 'home office', 'home-office', 'produkiv'],
  },
  { tag: 'gaming', words: ['gaming', 'herny', 'herný', 'hry', 'hrať', 'hrat', 'esport'] },
  { tag: 'fotenie', words: ['foto', 'foťák', 'fotak', 'kamera', 'fotenie', 'leica'] },
  { tag: 'anc', words: ['anc', 'hluk', 'potlačen', 'potlacen', 'cestovan', 'noise'] },
  {
    tag: 'budget',
    words: ['lacny', 'lacný', 'lacne', 'lacné', 'lacno', 'lacnú', 'najlacnej', 'rozumn'],
  },
  {
    tag: 'premium',
    words: ['premium', 'prémium', 'najlepsi', 'najlepší', 'top', 'kvalitn', 'flagship'],
  },
  { tag: 'baterie', words: ['bater', 'výdrž', 'vydrz', 'batéri', 'vydrzat'] },
  { tag: 'lehky', words: ['lahky', 'ľahký', 'tenky', 'tenký', 'prenosn', 'kompakt'] },
  { tag: 'apple', words: ['apple', 'mac', 'iphone', 'ipad', 'airpods', 'macos', 'ios'] },
  { tag: 'android', words: ['android', 'samsung', 'xiaomi', 'pixel'] },
  { tag: 'sport', words: ['sport', 'beh', 'posil', 'fitness', 'tren'] },
  { tag: 'cestovanie', words: ['cestov', 'vlak', 'lietadl', 'commute'] },
]

const BRAND_WORDS = [
  'apple',
  'samsung',
  'xiaomi',
  'lenovo',
  'acer',
  'asus',
  'hp',
  'dell',
  'lg',
  'sony',
  'logitech',
  'google',
  'jbl',
  'nintendo',
  'microsoft',
  'huawei',
  'nothing',
  'keychron',
  'sandisk',
]

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

function extractBudgets(raw: string): { maxBudget: number | null; minBudget: number | null } {
  const n = normalize(raw)
  let maxBudget: number | null = null
  let minBudget: number | null = null

  const maxPatterns = [
    /(?:do|max|pod|budget|rozpocet|za)\s*(\d{2,5})\s*(?:€|eur|e)?/,
    /(\d{2,5})\s*(?:€|eur)/,
  ]
  for (const re of maxPatterns) {
    const m = n.match(re)
    if (m) {
      const value = Number(m[1])
      if (value >= 20 && value <= 10000) {
        maxBudget = value
        break
      }
    }
  }

  const minMatch = n.match(/(?:od|min|aspon|aspoň)\s*(\d{2,5})\s*(?:€|eur|e)?/)
  if (minMatch) {
    const value = Number(minMatch[1])
    if (value >= 20 && value <= 10000) minBudget = value
  }

  return { maxBudget, minBudget }
}

function tokenize(n: string): string[] {
  return n
    .split(/[^a-z0-9]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3)
}

function parseIntent(message: string): ParsedIntent {
  const n = normalize(message)
  const categories: ProductCategory[] = []
  for (const row of CATEGORY_KEYWORDS) {
    if (row.words.some((w) => n.includes(normalize(w)))) {
      categories.push(row.category)
    }
  }

  const tags: string[] = []
  for (const row of TAG_KEYWORDS) {
    if (row.words.some((w) => n.includes(normalize(w)))) {
      tags.push(row.tag)
    }
  }

  const brands = BRAND_WORDS.filter((b) => n.includes(b))
  const { maxBudget, minBudget } = extractBudgets(message)

  return {
    categories,
    maxBudget,
    minBudget,
    tags,
    brands,
    tokens: tokenize(n),
  }
}

function reasonFor(product: Product, intent: ParsedIntent): string {
  const parts: string[] = []
  if (intent.maxBudget != null && product.priceEur <= intent.maxBudget) {
    parts.push(`zmestí sa do rozpočtu ${intent.maxBudget} €`)
  }
  if (intent.minBudget != null && product.priceEur >= intent.minBudget) {
    parts.push(`od ${intent.minBudget} € podľa zadania`)
  }
  if (intent.tags.includes('skola') || intent.tags.includes('student')) {
    parts.push('hodí sa na školu a bežnú prácu')
  }
  if (intent.tags.includes('gaming') && product.tags.includes('gaming')) {
    parts.push('zvládne hry bez kompromisov')
  }
  if (intent.tags.includes('fotenie') && product.tags.includes('fotenie')) {
    parts.push('silný vo fotení')
  }
  if (intent.tags.includes('anc') && product.tags.includes('anc')) {
    parts.push('výborné potlačenie hluku')
  }
  if (intent.tags.includes('lehky') && product.tags.includes('lehky')) {
    parts.push('ľahký na nosenie')
  }
  if (intent.brands.some((b) => product.brand.toLowerCase() === b)) {
    parts.push(`presne značka ${product.brand}, ktorú hľadáš`)
  }
  const specHit = product.specs.find((s) =>
    intent.tokens.some((t) => normalize(s).includes(t)),
  )
  if (specHit) parts.push(`sedí parameter „${specHit}“`)
  if (parts.length === 0) {
    parts.push(product.summary)
  } else {
    parts.push(product.summary.charAt(0).toLowerCase() + product.summary.slice(1))
  }
  return parts.join(' — ')
}

function textOverlapScore(product: Product, tokens: string[]): number {
  if (tokens.length === 0) return 0
  const hay = normalize(
    [
      product.name,
      product.brand,
      product.summary,
      product.description,
      product.specs.join(' '),
      product.tags.join(' '),
    ].join(' '),
  )
  let hits = 0
  for (const token of tokens) {
    if (hay.includes(token)) hits += 1
  }
  return hits * 5
}

function scoreProduct(product: Product, intent: ParsedIntent): number {
  let score = 0

  if (intent.categories.length > 0) {
    if (intent.categories.includes(product.category)) score += 45
    else return -100
  }

  if (intent.maxBudget != null) {
    if (product.priceEur <= intent.maxBudget) {
      score += 25
      const ratio = product.priceEur / intent.maxBudget
      score += Math.round(ratio * 10)
    } else if (product.priceEur <= intent.maxBudget * 1.08) {
      score += 2
    } else {
      // Far over budget — drop from results
      return -100
    }
  }

  if (intent.minBudget != null) {
    if (product.priceEur >= intent.minBudget) score += 10
    else score -= 20
  }

  for (const tag of intent.tags) {
    if (product.tags.includes(tag)) score += 14
  }

  for (const brand of intent.brands) {
    if (product.brand.toLowerCase() === brand) score += 22
  }

  score += textOverlapScore(product, intent.tokens)

  if (
    intent.categories.length === 0 &&
    intent.tags.length === 0 &&
    intent.brands.length === 0
  ) {
    score += product.tags.includes('student') || product.tags.includes('office') ? 6 : 0
  }

  return score
}

function diversify(picks: Recommendation[], limit: number): Recommendation[] {
  const out: Recommendation[] = []
  const brands = new Set<string>()

  for (const pick of picks) {
    if (out.length >= limit) break
    const brand = pick.product.brand.toLowerCase()
    if (brands.has(brand)) continue
    out.push(pick)
    brands.add(brand)
  }

  for (const pick of picks) {
    if (out.length >= limit) break
    if (!out.some((p) => p.product.id === pick.product.id)) out.push(pick)
  }

  return out
}

/**
 * Rule-based matching over the Alza-like product feed. Returns 1–3 tips.
 * Uses name, specs and full description — works without an LLM API key.
 */
export function recommendProducts(userMessage: string, limit = 3): Recommendation[] {
  const feed = getProductFeed()
  const intent = parseIntent(userMessage)
  const scored = feed.map((product) => ({
    product,
    score: scoreProduct(product, intent),
    reason: reasonFor(product, intent),
    affiliateUrl: buildAffiliateUrl(product.alzaPath),
  }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.product.priceEur - b.product.priceEur)

  let picks = diversify(scored, limit)

  if (picks.length === 0) {
    picks = feed
      .filter((p) => p.priceEur >= 80 && p.priceEur <= 900)
      .slice()
      .sort((a, b) => a.priceEur - b.priceEur)
      .slice(0, limit)
      .map((product) => ({
        product,
        score: 1,
        reason: `Univerzálny tip z katalógu: ${product.summary}`,
        affiliateUrl: buildAffiliateUrl(product.alzaPath),
      }))
  }

  return picks.slice(0, Math.min(3, Math.max(1, picks.length)))
}

export function greetingReply(): string {
  return 'Ahoj! Som VyberAI — pomôžem ti vybrať elektroniku. Napíš napríklad „notebook do 800 € na školu“ alebo „slúchadlá s ANC“.'
}

export function buildAssistantReply(userMessage: string, recs: Recommendation[]): string {
  if (recs.length === 0) {
    return 'Nenašiel som vhodný produkt. Skús upresniť kategóriu alebo rozpočet.'
  }
  const intent = parseIntent(userMessage)
  const budgetBit =
    intent.maxBudget != null ? ` do ${intent.maxBudget} €` : ''
  const catBit =
    intent.categories.length > 0
      ? ` (${intent.categories.map((c) => CATEGORY_LABELS[c]).join(', ')})`
      : ''

  return `Tu ${recs.length === 1 ? 'je môj tip' : `sú moje tipy (${recs.length})`}${catBit}${budgetBit}. Každý odkaz vedie na Alza.sk (affiliate partner).`
}
