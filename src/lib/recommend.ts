import { CATALOG, type Product, type ProductCategory } from '../data/catalog'
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
  tags: string[]
  brands: string[]
}

const CATEGORY_KEYWORDS: { category: ProductCategory; words: string[] }[] = [
  {
    category: 'notebook',
    words: ['notebook', 'laptop', 'notebooky', 'laptopy', 'pc na skol', 'počítač', 'pocitac'],
  },
  {
    category: 'telefon',
    words: ['telefon', 'telefón', 'mobil', 'smartphone', 'iphone', 'android'],
  },
  {
    category: 'sluchadla',
    words: ['sluchadla', 'slúchadlá', 'headphones', 'airpods', 'anc', 'hudba'],
  },
  {
    category: 'monitor',
    words: ['monitor', 'displej', 'obrazovka'],
  },
  {
    category: 'tablet',
    words: ['tablet', 'ipad', 'poznámky', 'poznamky'],
  },
  {
    category: 'klavesnica',
    words: ['klavesnica', 'klávesnica', 'keyboard'],
  },
  {
    category: 'mys',
    words: ['mys', 'myš', 'mouse'],
  },
  {
    category: 'ssd',
    words: ['ssd', 'disk', 'úložisko', 'ulozisko', 'nvme'],
  },
  {
    category: 'tv',
    words: ['tv', 'televizor', 'televízor', 'oled', 'qled'],
  },
  {
    category: 'herna-konzola',
    words: ['konzola', 'playstation', 'ps5', 'switch', 'nintendo', 'xbox'],
  },
]

const TAG_KEYWORDS: { tag: string; words: string[] }[] = [
  { tag: 'skola', words: ['skola', 'škola', 'skolu', 'školu', 'štúdium', 'studium', 'prednášk', 'prednask'] },
  { tag: 'student', words: ['student', 'študent', 'studentka', 'študentka'] },
  { tag: 'office', words: ['praca', 'práca', 'kancel', 'office', 'home office', 'home-office'] },
  { tag: 'gaming', words: ['gaming', 'herny', 'herný', 'hry', 'hrať', 'hrat'] },
  { tag: 'fotenie', words: ['foto', 'foťák', 'fotak', 'kamera', 'fotenie'] },
  { tag: 'anc', words: ['anc', 'hluk', 'potlačen', 'potlacen', 'cestovan'] },
  { tag: 'budget', words: ['lacny', 'lacný', 'lacne', 'lacné', 'lacno', 'lacnú', 'najlacnej'] },
  { tag: 'premium', words: ['premium', 'prémium', 'najlepsi', 'najlepší', 'top', 'kvalitn'] },
  { tag: 'baterie', words: ['bater', 'výdrž', 'vydrz', 'batéri'] },
  { tag: 'lehky', words: ['lahky', 'ľahký', 'tenky', 'tenký', 'prenosn'] },
  { tag: 'apple', words: ['apple', 'mac', 'iphone', 'ipad', 'airpods'] },
  { tag: 'android', words: ['android', 'samsung', 'xiaomi', 'pixel'] },
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
]

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

function extractBudget(raw: string): number | null {
  const n = normalize(raw)
  // "do 800", "max 500 €", "pod 1000 eur", "budget 600"
  const patterns = [
    /(?:do|max|pod|budget|rozpocet|rozpočet|za)\s*(\d{2,5})\s*(?:€|eur|e)?/,
    /(\d{2,5})\s*(?:€|eur)/,
  ]
  for (const re of patterns) {
    const m = n.match(re)
    if (m) {
      const value = Number(m[1])
      if (value >= 20 && value <= 10000) return value
    }
  }
  return null
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

  return {
    categories,
    maxBudget: extractBudget(message),
    tags,
    brands,
  }
}

function reasonFor(product: Product, intent: ParsedIntent): string {
  const parts: string[] = []
  if (intent.maxBudget != null && product.priceEur <= intent.maxBudget) {
    parts.push(`zmestí sa do rozpočtu ${intent.maxBudget} €`)
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
  if (intent.brands.some((b) => product.brand.toLowerCase() === b)) {
    parts.push(`presne značka ${product.brand}, ktorú hľadáte`)
  }
  if (parts.length === 0) {
    parts.push(product.summary)
  } else {
    parts.push(product.summary.charAt(0).toLowerCase() + product.summary.slice(1))
  }
  return parts.join(' — ')
}

function scoreProduct(product: Product, intent: ParsedIntent): number {
  let score = 0

  if (intent.categories.length > 0) {
    if (intent.categories.includes(product.category)) score += 40
    else score -= 20
  }

  if (intent.maxBudget != null) {
    if (product.priceEur <= intent.maxBudget) {
      score += 25
      // Prefer closer to budget (better value perception)
      const ratio = product.priceEur / intent.maxBudget
      score += Math.round(ratio * 10)
    } else if (product.priceEur <= intent.maxBudget * 1.1) {
      score += 5 // slightly over
    } else {
      score -= 30
    }
  }

  for (const tag of intent.tags) {
    if (product.tags.includes(tag)) score += 12
  }

  for (const brand of intent.brands) {
    if (product.brand.toLowerCase() === brand) score += 20
  }

  // Mild popularity bias for well-rounded picks when query is vague
  if (intent.categories.length === 0 && intent.tags.length === 0) {
    score += product.tags.includes('student') || product.tags.includes('office') ? 5 : 0
  }

  return score
}

/**
 * Rule-based matching over the mock catalog. Returns 1–3 recommendations.
 * Works without any LLM API key.
 */
export function recommendProducts(userMessage: string, limit = 3): Recommendation[] {
  const intent = parseIntent(userMessage)
  const scored = CATALOG.map((product) => ({
    product,
    score: scoreProduct(product, intent),
    reason: reasonFor(product, intent),
    affiliateUrl: buildAffiliateUrl(product.alzaPath),
  }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)

  let picks = scored.slice(0, limit)

  // Fallback: if nothing matched well, suggest popular mid-range items
  if (picks.length === 0) {
    picks = CATALOG.filter((p) => p.priceEur >= 100 && p.priceEur <= 800)
      .slice(0, limit)
      .map((product) => ({
        product,
        score: 1,
        reason: `Univerzálny tip z nášho katalógu: ${product.summary}`,
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
      ? ` v kategórii ${intent.categories.map((c) => c).join(', ')}`
      : ''

  return `Tu sú ${recs.length === 1 ? 'môj tip' : `moje tipy (${recs.length})`}${catBit}${budgetBit}. Každý odkaz vedie na Alza.sk (affiliate partner).`
}
