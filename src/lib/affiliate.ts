/**
 * Client-safe Alza link helpers.
 * Real AFFILIATE_ID lives only on the server (`server/affiliate.ts`).
 * Browser fallback uses a public placeholder so sample data still works.
 */

const PLACEHOLDER = 'AFFILIATE_ID'

/** Always false in the browser — real config is server-only. */
export function isAffiliateConfigured(): boolean {
  return false
}

/**
 * Placeholder outbound Alza URL for offline / local fallback tips.
 * Server responses replace this with a real `idp` when AFFILIATE_ID is bound.
 */
export function buildAffiliateUrl(alzaPath: string): string {
  const path = alzaPath.replace(/^\/+/, '')
  const url = new URL(`https://www.alza.sk/${path}`)
  url.searchParams.set('idp', PLACEHOLDER)
  return url.toString()
}

export function affiliatePlaceholderId(): string {
  return PLACEHOLDER
}
