/**
 * Alza Partner tracking ID.
 * Build injects process.env.AFFILIATE_ID when present (Cursor app secret / CI).
 * Falls back to placeholder so the MVP works on sample data.
 */
declare const __VYBER_AFFILIATE_ID__: string | undefined

const PLACEHOLDER = 'AFFILIATE_ID'

export const AFFILIATE_ID =
  (typeof __VYBER_AFFILIATE_ID__ !== 'undefined' && __VYBER_AFFILIATE_ID__) ||
  PLACEHOLDER

export function isAffiliateConfigured(): boolean {
  return AFFILIATE_ID !== PLACEHOLDER && AFFILIATE_ID.trim().length > 0
}

/**
 * Build an outbound Alza.sk affiliate URL.
 * Query param `idp` mirrors typical Alza Partner tracking.
 */
export function buildAffiliateUrl(alzaPath: string): string {
  const path = alzaPath.replace(/^\/+/, '')
  const url = new URL(`https://www.alza.sk/${path}`)
  url.searchParams.set('idp', AFFILIATE_ID)
  return url.toString()
}
