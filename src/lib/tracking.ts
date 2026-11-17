/**
 * Privacy-friendly local analytics.
 * Events stay in this browser only — no PII, no chat text, no third-party pixels.
 */

export type PageViewEvent = {
  type: 'page_view'
  path: string
  at: string
}

export type ChatStartEvent = {
  type: 'chat_start'
  source: 'cta' | 'composer' | 'suggestion' | 'landing'
  at: string
}

export type RecommendationsShownEvent = {
  type: 'recommendations_shown'
  count: number
  productIds: string[]
  at: string
}

export type OutboundClickEvent = {
  type: 'outbound_click'
  productId: string
  category: string
  rank: number
  at: string
}

export type ShareClickEvent = {
  type: 'share_click'
  path: string
  at: string
}

export type AnalyticsEvent =
  | PageViewEvent
  | ChatStartEvent
  | RecommendationsShownEvent
  | OutboundClickEvent
  | ShareClickEvent

export type AnalyticsSummary = {
  pageViews: number
  chatStarts: number
  recommendationsShown: number
  outboundClicks: number
  shareClicks: number
  byPath: Record<string, number>
  recent: AnalyticsEvent[]
}

/** @deprecated prefer OutboundClickEvent via trackOutboundClick */
export type AffiliateClickEvent = {
  productId: string
  productName: string
  category: string
  priceEur: number
  affiliateUrl: string
  rank: number
  at: string
}

const STORAGE_KEY = 'vyberai.analytics.v1'
const LEGACY_CLICKS_KEY = 'vyberai.affiliate.clicks'
const MAX_EVENTS = 200

function readEvents(): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return migrateLegacyClicks()
    const parsed = JSON.parse(raw) as AnalyticsEvent[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function migrateLegacyClicks(): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(LEGACY_CLICKS_KEY)
    if (!raw) return []
    const legacy = JSON.parse(raw) as AffiliateClickEvent[]
    if (!Array.isArray(legacy) || legacy.length === 0) return []
    const migrated: AnalyticsEvent[] = legacy.map((e) => ({
      type: 'outbound_click' as const,
      productId: e.productId,
      category: e.category,
      rank: e.rank,
      at: e.at,
    }))
    writeEvents(migrated)
    localStorage.removeItem(LEGACY_CLICKS_KEY)
    return migrated
  } catch {
    return []
  }
}

function writeEvents(events: AnalyticsEvent[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)))
  } catch {
    // private mode / quota — ignore
  }
}

function push(event: AnalyticsEvent): void {
  const next = [...readEvents(), event]
  writeEvents(next)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('vyberai:analytics', { detail: event }))
  }
}

export function trackPageView(path: string): void {
  const clean = path.split('?')[0] || '/'
  push({ type: 'page_view', path: clean, at: new Date().toISOString() })
}

export function trackChatStart(
  source: ChatStartEvent['source'],
): void {
  push({ type: 'chat_start', source, at: new Date().toISOString() })
}

export function trackRecommendationsShown(productIds: string[]): void {
  push({
    type: 'recommendations_shown',
    count: productIds.length,
    productIds: productIds.slice(0, 3),
    at: new Date().toISOString(),
  })
}

export function trackOutboundClick(input: {
  productId: string
  category: string
  rank: number
}): void {
  push({
    type: 'outbound_click',
    productId: input.productId,
    category: input.category,
    rank: input.rank,
    at: new Date().toISOString(),
  })
}

export function trackShareClick(path: string): void {
  push({
    type: 'share_click',
    path: path.split('?')[0] || '/',
    at: new Date().toISOString(),
  })
}

/** Back-compat wrapper used by existing CTA buttons. */
export function trackAffiliateClick(
  event: Omit<AffiliateClickEvent, 'at'>,
): void {
  trackOutboundClick({
    productId: event.productId,
    category: event.category,
    rank: event.rank,
  })
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('vyberai:affiliate-click', {
        detail: { ...event, at: new Date().toISOString() },
      }),
    )
  }
}

export function getAnalyticsEvents(): AnalyticsEvent[] {
  return readEvents()
}

export function getAnalyticsSummary(): AnalyticsSummary {
  const events = readEvents()
  const byPath: Record<string, number> = {}
  let pageViews = 0
  let chatStarts = 0
  let recommendationsShown = 0
  let outboundClicks = 0
  let shareClicks = 0

  for (const e of events) {
    switch (e.type) {
      case 'page_view':
        pageViews += 1
        byPath[e.path] = (byPath[e.path] || 0) + 1
        break
      case 'chat_start':
        chatStarts += 1
        break
      case 'recommendations_shown':
        recommendationsShown += 1
        break
      case 'outbound_click':
        outboundClicks += 1
        break
      case 'share_click':
        shareClicks += 1
        break
    }
  }

  return {
    pageViews,
    chatStarts,
    recommendationsShown,
    outboundClicks,
    shareClicks,
    byPath,
    recent: events.slice(-40).reverse(),
  }
}

export function clearAnalytics(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(LEGACY_CLICKS_KEY)
  } catch {
    // ignore
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('vyberai:analytics-cleared'))
  }
}

export function getAffiliateClickCount(): number {
  return getAnalyticsSummary().outboundClicks
}
