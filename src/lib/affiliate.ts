/**
 * Alza Partner tracking ID — replace with your real partner ID later.
 * Single source of truth so it is easy to swap.
 */
export const AFFILIATE_ID = 'AFFILIATE_ID'

/**
 * Build an outbound Alza.sk affiliate URL.
 * Placeholder query params mirror typical partner tracking; update when you have real Alza Partner docs.
 */
export function buildAffiliateUrl(alzaPath: string): string {
  const base = `https://www.alza.sk/${alzaPath}`
  const url = new URL(base)
  url.searchParams.set('idp', AFFILIATE_ID)
  return url.toString()
}
