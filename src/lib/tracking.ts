export type AffiliateClickEvent = {
  productId: string
  productName: string
  category: string
  priceEur: number
  affiliateUrl: string
  rank: number
  at: string
}

const STORAGE_KEY = 'vyberai.affiliate.clicks'
const MAX_EVENTS = 100

function readEvents(): AffiliateClickEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as AffiliateClickEvent[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeEvents(events: AffiliateClickEvent[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)))
  } catch {
    // private mode / quota — ignore
  }
}

/** Record an outbound affiliate click for later analytics wiring. */
export function trackAffiliateClick(
  event: Omit<AffiliateClickEvent, 'at'>,
): void {
  const full: AffiliateClickEvent = {
    ...event,
    at: new Date().toISOString(),
  }
  const next = [...readEvents(), full]
  writeEvents(next)

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('vyberai:affiliate-click', { detail: full }))
  }
}

export function getAffiliateClickCount(): number {
  return readEvents().length
}
