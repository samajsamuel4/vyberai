/**
 * Server-only Alza Partner ID + URL builder.
 * Reads AFFILIATE_ID from the process env (Cursor Apps secret).
 * Never import this module from client/browser code.
 */

const PLACEHOLDER = 'AFFILIATE_ID'

export function getAffiliateId(): string {
  const fromEnv = process.env.AFFILIATE_ID?.trim()
  if (fromEnv) return fromEnv
  return PLACEHOLDER
}

export function isAffiliateConfigured(): boolean {
  const id = getAffiliateId()
  return id !== PLACEHOLDER && id.length > 0
}

/**
 * Build an outbound Alza.sk affiliate URL.
 * Query param `idp` mirrors typical Alza Partner tracking.
 */
export function buildAffiliateUrl(alzaPath: string): string {
  const path = alzaPath.replace(/^\/+/, '')
  const url = new URL(`https://www.alza.sk/${path}`)
  url.searchParams.set('idp', getAffiliateId())
  return url.toString()
}
