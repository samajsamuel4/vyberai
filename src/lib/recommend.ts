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

export type AdviceResult = {
  kind: 'clarify' | 'recommend'
  text: string
  recommendations: Recommendation[]
}

type ParsedIntent = {
  categories: ProductCategory[]
  maxBudget: number | null
  minBudget: number | null
  tags: string[]
  brands: string[]
  tokens: string[]
  raw: string
}

const CATEGORY_KEYWORDS: { category: ProductCategory; words: string[] }[] = [
  {
    category: 'notebook',
    words: [
      'notebook',
      'laptop',
      'notebooky',
      'laptopy',
      'ultrabook',
      'chromebook',
      'macbook',
      'pocitac',
      'počítač',
      'pc na skol',
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
      'earbud',
      'sluchatka',
      'slúchadla',
    ],
  },
  {
    category: 'monitor',
    words: ['monitor', 'displej', 'obrazovka', 'ultrawide'],
  },
  {
    category: 'tablet',
    words: ['tablet', 'ipad'],
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
    words: ['ssd', 'nvme', 'externy disk', 'externý disk', 'ulozisko', 'úložisko'],
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
  { tag: 'anc', words: ['anc', 'hluk', 'potlačen', 'potlacen', 'noise cancell', 'noise-canc'] },
  {
    tag: 'budget',
    words: ['lacny', 'lacný', 'lacne', 'lacné', 'lacno', 'lacnú', 'najlacnej', 'rozumn', 'lacnej'],
  },
  {
    tag: 'premium',
    words: ['premium', 'prémium', 'najlepsi', 'najlepší', 'flagship', 'kvalitn'],
  },
  { tag: 'baterie', words: ['bater', 'výdrž', 'vydrz', 'batéri'] },
  { tag: 'lehky', words: ['lahky', 'ľahký', 'tenky', 'tenký', 'prenosn', 'kompakt'] },
  { tag: 'apple', words: ['apple', 'mac', 'iphone', 'ipad', 'airpods', 'macos', 'ios'] },
  { tag: 'android', words: ['android', 'samsung', 'xiaomi', 'pixel'] },
  { tag: 'sport', words: ['sport', 'beh', 'posil', 'fitness', 'tren'] },
  { tag: 'cestovanie', words: ['cestov', 'vlak', 'lietadl', 'commute'] },
  { tag: 'poznamky', words: ['poznamk', 'poznámk', 'pisanie', 'písanie', 'stylus', 'pero'] },
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

/** Tokens that must not drive catalog overlap scoring */
const STOP_TOKENS = new Set([
  'ahoj',
  'cau',
  'prosim',
  'dakujem',
  'chcem',
  'potrebujem',
  'hladam',
  'hladam',
  'nieco',
  'nejaky',
  'nejaku',
  'nejake',
  'dobre',
  'dobry',
  'dobru',
  'prosim',
  'alebo',
  'podla',
  'podľa',
  'taky',
  'taky',
  'takú',
  'taku',
  'naj',
  'velmi',
  'moc',
  'asi',
  'este',
  'ešte',
  'len',
  'iba',
  'pre',
  'na',
  'do',
  'od',
  'za',
  'ako',
  'co',
  'čo',
  'aby',
  'mam',
  'mám',
  'budem',
  'chcela',
  'chcel',
  'prosimta',
  'hello',
  'hi',
  'please',
  'want',
  'need',
  'looking',
  'something',
  'any',
  'good',
])

const MIN_RECOMMEND_SCORE = 40

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
    /(?:lacnejsi[ea]?|lacnejsie|cheaper)\s*(?:nez|než|than)?\s*(\d{2,5})\s*(?:€|eur|e)?/,
    /(?:do|max|pod|budget|rozpocet|za|nez|než)\s*(\d{2,5})\s*(?:€|eur|e)?/,
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

  const minMatch = n.match(/(?:od|min|aspon)\s*(\d{2,5})\s*(?:€|eur|e)?/)
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
    .filter((t) => t.length >= 3 && !STOP_TOKENS.has(t) && !/^\d+$/.test(t))
}

type ParsedTurn = ParsedIntent & {
  /** Explicit product-type keywords only (no soft use-case hints) */
  hardCategories: ProductCategory[]
}

function hardCategoriesFrom(n: string): ProductCategory[] {
  const categories: ProductCategory[] = []
  for (const row of CATEGORY_KEYWORDS) {
    if (row.words.some((w) => n.includes(normalize(w)))) {
      categories.push(row.category)
    }
  }
  return categories
}

function softCategoriesFrom(n: string): ProductCategory[] {
  const categories: ProductCategory[] = []
  if (/\b(anc|hluk|airpods)\b/.test(n) || n.includes('potlacen')) {
    categories.push('sluchadla')
  }
  if (n.includes('poznamk') || n.includes('stylus')) {
    categories.push('tablet')
  }
  return categories
}

function parseTurn(message: string): ParsedTurn {
  const n = normalize(message)
  const hardCategories = hardCategoriesFrom(n)
  const soft = softCategoriesFrom(n)
  const categories =
    hardCategories.length > 0
      ? hardCategories
      : soft.length > 0
        ? soft
        : []

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
    hardCategories,
    maxBudget,
    minBudget,
    tags,
    brands,
    tokens: tokenize(n),
    raw: message.trim(),
  }
}

function parseIntent(message: string): ParsedIntent {
  const { hardCategories: _hard, ...intent } = parseTurn(message)
  void _hard
  return intent
}

function intentIsActionable(intent: ParsedIntent): boolean {
  // Need an explicit product category — brand/tags alone still clarify
  return intent.categories.length > 0
}

const USE_CASE_FOCUS_TAGS = [
  'gaming',
  'fotenie',
  'anc',
  'skola',
  'student',
  'office',
] as const

/**
 * Merge conversation turns with latest-wins for budget.
 * Category only changes on an explicit hard category keyword in a later turn.
 * Soft hints never overwrite an established category from history.
 */
function resolveIntentFromHistory(
  userMessage: string,
  priorUserTexts: string[] = [],
): ParsedIntent {
  const turns = [...priorUserTexts, userMessage]
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => parseTurn(t))

  const empty: ParsedIntent = {
    categories: [],
    maxBudget: null,
    minBudget: null,
    tags: [],
    brands: [],
    tokens: [],
    raw: userMessage.trim(),
  }
  if (turns.length === 0) return empty

  let categories: ProductCategory[] = []
  let maxBudget: number | null = null
  let minBudget: number | null = null
  let brands: string[] = []
  let tags: string[] = []
  const tokens: string[] = []

  for (const turn of turns) {
    if (turn.hardCategories.length > 0) {
      categories = turn.hardCategories
    } else if (categories.length === 0 && turn.categories.length > 0) {
      // Soft hint only seeds category when none established yet
      categories = turn.categories
    }
    if (turn.maxBudget != null) maxBudget = turn.maxBudget
    if (turn.minBudget != null) minBudget = turn.minBudget
    if (turn.brands.length > 0) brands = turn.brands
    for (const tag of turn.tags) {
      if (!tags.includes(tag)) tags.push(tag)
    }
    for (const token of turn.tokens) {
      if (!tokens.includes(token)) tokens.push(token)
    }
  }

  const latest = turns[turns.length - 1]
  // Price-only follow-ups (budget/premium) must NOT wipe prior use-case tags
  const latestUseCase = latest.tags.filter((t) =>
    (USE_CASE_FOCUS_TAGS as readonly string[]).includes(t),
  )
  if (latestUseCase.length > 0) {
    tags = tags.filter(
      (t) =>
        !(USE_CASE_FOCUS_TAGS as readonly string[]).includes(t) ||
        latestUseCase.includes(t),
    )
    for (const t of latest.tags) {
      if (!tags.includes(t)) tags.push(t)
    }
  }

  // budget vs premium are mutually exclusive — latest price tier wins
  const PRICE_TIERS = ['budget', 'premium'] as const
  const latestTier = latest.tags.filter((t) =>
    (PRICE_TIERS as readonly string[]).includes(t),
  )
  if (latestTier.length > 0) {
    tags = tags.filter((t) => !(PRICE_TIERS as readonly string[]).includes(t))
    for (const t of latestTier) {
      if (!tags.includes(t)) tags.push(t)
    }
  } else if (tags.includes('budget') && tags.includes('premium')) {
    // Keep only the most recent of the two from history
    for (let i = turns.length - 1; i >= 0; i -= 1) {
      const tier = turns[i].tags.find((t) =>
        (PRICE_TIERS as readonly string[]).includes(t),
      )
      if (tier) {
        tags = tags.filter((t) => !(PRICE_TIERS as readonly string[]).includes(t))
        tags.push(tier)
        break
      }
    }
  }

  return {
    categories,
    maxBudget,
    minBudget,
    tags,
    brands,
    tokens,
    raw: latest.raw,
  }
}

function clarifyingReply(intent: ParsedIntent): string {
  if (intent.brands.length > 0 && intent.categories.length === 0) {
    const brand = intent.brands[0]
    return `Jasné, značka ${brand.charAt(0).toUpperCase() + brand.slice(1)}. Čo konkrétne hľadáš — notebook, telefón, slúchadlá, tablet…? Pridaj aj rozpočet, ak ho máš.`
  }
  if (intent.maxBudget != null && intent.categories.length === 0) {
    return `Mám rozpočet do ${intent.maxBudget} € — do akej kategórie? Napr. notebook, telefón, slúchadlá alebo monitor.`
  }
  if (intent.tags.length > 0 && intent.categories.length === 0) {
    return 'Aby som tipoval zmysluplne: akú kategóriu chceš (notebook / telefón / slúchadlá / …) a približný rozpočet?'
  }
  return 'Povedz mi kategóriu a rozpočet — napr. „notebook do 800 € na školu“ alebo „slúchadlá s ANC do 150 €“. Bez toho by som tipoval naslepo.'
}

function reasonFor(product: Product, intent: ParsedIntent): string {
  const parts: string[] = []
  if (intent.categories.includes(product.category)) {
    parts.push(`sedí kategória ${CATEGORY_LABELS[product.category]}`)
  }
  if (intent.maxBudget != null && product.priceEur <= intent.maxBudget) {
    parts.push(`zmestí sa do ${intent.maxBudget} € (${product.priceEur} €)`)
  }
  if (intent.minBudget != null && product.priceEur >= intent.minBudget) {
    parts.push(`od ${intent.minBudget} € podľa zadania`)
  }
  if (
    (intent.tags.includes('skola') || intent.tags.includes('student')) &&
    (product.tags.includes('skola') ||
      product.tags.includes('student') ||
      product.tags.includes('office'))
  ) {
    parts.push('hodí sa na školu / štúdium')
  }
  if (intent.tags.includes('office') && product.tags.includes('office')) {
    parts.push('vhodný na prácu / home office')
  }
  if (intent.tags.includes('gaming') && product.tags.includes('gaming')) {
    parts.push('zvládne hry')
  }
  if (intent.tags.includes('fotenie') && product.tags.includes('fotenie')) {
    parts.push('silný vo fotení')
  }
  if (intent.tags.includes('anc') && product.tags.includes('anc')) {
    parts.push('má ANC / potlačenie hluku')
  }
  if (intent.tags.includes('lehky') && product.tags.includes('lehky')) {
    parts.push('ľahký na nosenie')
  }
  if (intent.tags.includes('poznamky') && product.tags.includes('poznamky')) {
    parts.push('vhodný na poznámky')
  }
  if (intent.tags.includes('budget') && product.tags.includes('budget')) {
    parts.push('rozumná cena za výkon')
  }
  if (intent.tags.includes('premium') && product.tags.includes('premium')) {
    parts.push('vyššia trieda')
  }
  if (intent.brands.some((b) => product.brand.toLowerCase() === b)) {
    parts.push(`značka ${product.brand}`)
  }
  const specHit = product.specs.find((s) =>
    intent.tokens.some((t) => normalize(s).includes(t) && t.length >= 3),
  )
  if (specHit) parts.push(`parameter „${specHit}“`)
  if (parts.length === 0) {
    return product.summary
  }
  parts.push(product.summary.charAt(0).toLowerCase() + product.summary.slice(1))
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
  return hits * 4
}

function scoreProduct(product: Product, intent: ParsedIntent): number {
  let score = 0

  if (intent.categories.length > 0) {
    if (intent.categories.includes(product.category)) score += 50
    else return -100
  } else if (intent.brands.length > 0) {
    // Brand-only: allow matching brand products across categories
    if (!intent.brands.some((b) => product.brand.toLowerCase() === b)) {
      return -100
    }
    score += 20
  } else {
    return -100
  }

  if (intent.maxBudget != null) {
    if (product.priceEur <= intent.maxBudget) {
      score += 28
      // Prefer using most of the budget without overshooting
      const ratio = product.priceEur / intent.maxBudget
      if (ratio >= 0.45 && ratio <= 1) score += Math.round(ratio * 12)
      else if (ratio < 0.45) score += 2
    } else if (product.priceEur <= intent.maxBudget * 1.05) {
      score += 4
    } else {
      return -100
    }
  }

  if (intent.minBudget != null) {
    if (product.priceEur >= intent.minBudget) score += 10
    else score -= 25
  }

  for (const tag of intent.tags) {
    if (product.tags.includes(tag)) score += 16
    else if (tag === 'skola' && product.tags.includes('student')) score += 12
    else if (tag === 'student' && product.tags.includes('skola')) score += 12
  }

  // Soft penalty when user asked gaming but product is not gaming
  if (intent.tags.includes('gaming') && !product.tags.includes('gaming')) {
    score -= 8
  }
  if (intent.tags.includes('fotenie') && !product.tags.includes('fotenie')) {
    score -= 6
  }
  if (intent.tags.includes('anc') && !product.tags.includes('anc')) {
    score -= 10
  }

  for (const brand of intent.brands) {
    if (product.brand.toLowerCase() === brand) score += 24
  }

  score += textOverlapScore(product, intent.tokens)

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

function buildRecommendText(intent: ParsedIntent, recs: Recommendation[]): string {
  if (recs.length === 0) {
    if (intent.maxBudget != null && intent.categories.length > 0) {
      const cats = intent.categories.map((c) => CATEGORY_LABELS[c]).join(', ')
      return `V kategórii ${cats} som do ${intent.maxBudget} € nenašiel vhodný tip v ukážkovom katalógu. Skús vyšší rozpočet alebo inú značku.`
    }
    return 'Nenašiel som vhodný produkt podľa zadania. Skús upresniť kategóriu, rozpočet alebo použitie.'
  }

  const catBit =
    intent.categories.length > 0
      ? intent.categories.map((c) => CATEGORY_LABELS[c]).join(', ')
      : 'tvojej požiadavke'
  const budgetBit =
    intent.maxBudget != null ? ` do ${intent.maxBudget} €` : ''
  const useBits: string[] = []
  if (intent.tags.includes('skola') || intent.tags.includes('student')) {
    useBits.push('školu')
  }
  if (intent.tags.includes('office')) useBits.push('prácu')
  if (intent.tags.includes('gaming')) useBits.push('hry')
  if (intent.tags.includes('fotenie')) useBits.push('fotenie')
  if (intent.tags.includes('anc')) useBits.push('ANC')
  const useBit = useBits.length ? ` (${useBits.join(', ')})` : ''

  const top = recs[0]
  const compare =
    recs.length > 1
      ? ` Porovnaj najmä #1 ${top.product.brand} (${top.product.priceEur} €) s ostatnými podľa ceny a parametrov.`
      : ''

  return `Podľa ${catBit}${budgetBit}${useBit} odporúčam ${
    recs.length === 1 ? 'tento tip' : `tieto tipy (${recs.length})`
  }. U každého je dôvod, prečo sedí.${compare} Odkazy vedú na Alza.sk (affiliate).`
}

/**
 * Rule-based matching over the Alza-like product feed.
 * Clarifies when the query is too vague — never dumps random products.
 */
export function adviseUser(
  userMessage: string,
  priorUserTexts: string[] = [],
): AdviceResult {
  const intent = resolveIntentFromHistory(userMessage, priorUserTexts)

  if (!intentIsActionable(intent)) {
    return {
      kind: 'clarify',
      text: clarifyingReply(intent),
      recommendations: [],
    }
  }

  const feed = getProductFeed()
  const scored = feed
    .map((product) => ({
      product,
      score: scoreProduct(product, intent),
      reason: reasonFor(product, intent),
      affiliateUrl: buildAffiliateUrl(product.alzaPath),
    }))
    .filter((r) => r.score >= MIN_RECOMMEND_SCORE)
    .sort((a, b) => b.score - a.score || a.product.priceEur - b.product.priceEur)

  let picks = diversify(scored, 3)

  // If user asked for gaming and we have gaming hits, prefer those first
  if (intent.tags.includes('gaming')) {
    const gaming = diversify(
      scored.filter((r) => r.product.tags.includes('gaming')),
      3,
    )
    if (gaming.length > 0) {
      picks = gaming
    }
  }

  // If category+budget yielded nothing, explain — optionally show nearest in-category over budget
  if (picks.length === 0 && intent.categories.length > 0) {
    const inCat = feed
      .filter((p) => intent.categories.includes(p.category))
      .sort((a, b) => a.priceEur - b.priceEur)
    if (intent.maxBudget != null && inCat.length > 0) {
      const nearest = inCat.filter((p) => p.priceEur <= intent.maxBudget! * 1.25).slice(0, 2)
      if (nearest.length > 0) {
        picks = nearest.map((product, i) => ({
          product,
          score: 35 - i,
          reason:
            product.priceEur <= intent.maxBudget!
              ? reasonFor(product, intent)
              : `najbližší tip v kategórii — ${product.priceEur} € (nad ${intent.maxBudget} €)`,
          affiliateUrl: buildAffiliateUrl(product.alzaPath),
        }))
        return {
          kind: 'recommend',
          text: `Do ${intent.maxBudget} € je výber úzky — tu sú najbližšie tipy v ${intent.categories
            .map((c) => CATEGORY_LABELS[c])
            .join(', ')}. Ak môžeš pridať rozpočet, tipy budú lepšie.`,
          recommendations: picks,
        }
      }
      const cheapest = inCat[0]
      return {
        kind: 'clarify',
        text: `V ${CATEGORY_LABELS[intent.categories[0]]} začínajú tipy okolo ${cheapest.priceEur} € (najlacnejší v ukážkovom katalógu). Vieš ísť vyššie s rozpočtom, alebo zmeniť požiadavky?`,
        recommendations: [],
      }
    }
    return {
      kind: 'clarify',
      text: buildRecommendText(intent, []),
      recommendations: [],
    }
  }

  if (picks.length === 0) {
    return {
      kind: 'clarify',
      text: clarifyingReply(intent),
      recommendations: [],
    }
  }

  return {
    kind: 'recommend',
    text: buildRecommendText(intent, picks),
    recommendations: picks,
  }
}

/**
 * Drop picks that miss hard constraints (category / budget) from the user text.
 * Used as a guardrail after LLM selection.
 */
export function filterRecommendationsToIntent(
  picks: Recommendation[],
  userMessage: string,
  priorUserTexts: string[] = [],
): Recommendation[] {
  const intent = resolveIntentFromHistory(userMessage, priorUserTexts)
  if (intent.categories.length === 0) return []
  return picks.filter((r) => {
    if (!intent.categories.includes(r.product.category)) return false
    if (intent.maxBudget != null && r.product.priceEur > intent.maxBudget * 1.08) {
      return false
    }
    return true
  })
}

/**
 * Rule-based matching over the Alza-like product feed. Returns 0–3 tips.
 * Prefer `adviseUser` when you also need clarifying copy.
 */
export function recommendProducts(userMessage: string, limit = 3): Recommendation[] {
  const advice = adviseUser(userMessage)
  return advice.recommendations.slice(0, Math.min(3, Math.max(0, limit)))
}

export function greetingReply(): string {
  return 'Ahoj! Som VyberAI — pomôžem ti vybrať elektroniku. Napíš napríklad „notebook do 800 € na školu“ alebo „slúchadlá s ANC“.'
}

export function buildAssistantReply(userMessage: string, recs: Recommendation[]): string {
  const advice = adviseUser(userMessage)
  if (recs.length === 0) return advice.text
  return buildRecommendText(parseIntent(userMessage), recs)
}
