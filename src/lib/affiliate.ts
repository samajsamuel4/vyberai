/**
 * Alza Partner tracking ID.
 * Build injects process.env.AFFILIATE_ID when present (Cursor app secret / CI).
 * Falls back to placeholder so the MVP works on sample data.
 */
declare const __VYBER_AFFILIATE_ID__: string | undefined

const PLACEHOLDER = 'AFFILIATE_ID'

function resolveAffiliateId(): string {
  const fromDefine =
    typeof __VYBER_AFFILIATE_ID__ !== 'undefined' ? __VYBER_AFFILIATE_ID__ : ''
  if (fromDefine && fromDefine !== PLACEHOLDER) return fromDefine
  // Server runtime (tsx serve) — Cursor Apps binds AFFILIATE_ID as env.
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env
  const fromEnv = env?.AFFILIATE_ID?.trim()
  if (fromEnv) return fromEnv
  return fromDefine || PLACEHOLDER
}

export const AFFILIATE_ID = resolveAffiliateId()

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
