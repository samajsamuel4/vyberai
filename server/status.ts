import { isAffiliateConfigured } from './affiliate'
import { hasOpenAiKey } from './llm'

/** Public booleans only — never return secret values. */
export function getPublicStatus() {
  return {
    affiliateConfigured: isAffiliateConfigured(),
    openaiConfigured: hasOpenAiKey(),
  }
}
