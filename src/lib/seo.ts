/** Shared site meta for client SPA updates and server HTML injection. */

export const SITE_ORIGIN = 'https://vyberai.apps.grok.bot'

export const DEFAULT_TITLE = 'VyberAI — AI výber produktov'

export const DEFAULT_DESCRIPTION =
  'VyberAI — slovenský AI chat na výber elektroniky s affiliate odkazmi na Alza.sk. Napíš rozpočet a použitie, dostaneš 1–3 tipy.'

export const OG_IMAGE_PATH = '/og.svg'

export type PageMeta = {
  title: string
  description: string
  path: string
  noindex?: boolean
}

function ensureMeta(
  attr: 'name' | 'property',
  key: string,
  content: string,
): void {
  const selector = `meta[${attr}="${key}"]`
  let el = document.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function ensureCanonical(url: string): void {
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', url)
}

function ensureJsonLd(id: string, data: Record<string, unknown>): void {
  let script = document.getElementById(id)
  if (!script) {
    script = document.createElement('script')
    script.id = id
    script.setAttribute('type', 'application/ld+json')
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

export function applyPageMeta(meta: PageMeta): void {
  const url = `${SITE_ORIGIN}${meta.path === '/' ? '/' : meta.path}`
  const image = `${SITE_ORIGIN}${OG_IMAGE_PATH}`

  document.title = meta.title
  ensureMeta('name', 'description', meta.description)
  ensureMeta(
    'name',
    'robots',
    meta.noindex ? 'noindex, nofollow' : 'index, follow',
  )
  ensureCanonical(url)

  ensureMeta('property', 'og:type', 'website')
  ensureMeta('property', 'og:locale', 'sk_SK')
  ensureMeta('property', 'og:site_name', 'VyberAI')
  ensureMeta('property', 'og:title', meta.title)
  ensureMeta('property', 'og:description', meta.description)
  ensureMeta('property', 'og:url', url)
  ensureMeta('property', 'og:image', image)

  ensureMeta('name', 'twitter:card', 'summary_large_image')
  ensureMeta('name', 'twitter:title', meta.title)
  ensureMeta('name', 'twitter:description', meta.description)
  ensureMeta('name', 'twitter:image', image)
}

export function applyHomeJsonLd(): void {
  ensureJsonLd('vyberai-jsonld-website', {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VyberAI',
    url: SITE_ORIGIN,
    inLanguage: 'sk-SK',
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_ORIGIN}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  })
}

export function applyFaqJsonLd(
  path: string,
  faq: { question: string; answer: string }[],
): void {
  if (!faq.length) return
  ensureJsonLd('vyberai-jsonld-faq', {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
    url: `${SITE_ORIGIN}${path}`,
  })
}

export function clearFaqJsonLd(): void {
  document.getElementById('vyberai-jsonld-faq')?.remove()
}

/** Escape text for safe HTML attribute / text node injection on the server. */
export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function buildInjectedHead(meta: PageMeta): string {
  const url = `${SITE_ORIGIN}${meta.path === '/' ? '/' : meta.path}`
  const image = `${SITE_ORIGIN}${OG_IMAGE_PATH}`
  const title = escapeHtml(meta.title)
  const description = escapeHtml(meta.description)
  const robots = meta.noindex ? 'noindex, nofollow' : 'index, follow'
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="sk_SK" />`,
    `<meta property="og:site_name" content="VyberAI" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ].join('\n    ')
}

export function injectHtmlMeta(html: string, meta: PageMeta): string {
  const block = buildInjectedHead(meta)
  let out = html
  out = out.replace(/<title>[^<]*<\/title>/i, '')
  out = out.replace(/<meta\s+name="description"[^>]*>/i, '')
  out = out.replace(/<meta\s+name="robots"[^>]*>/i, '')
  out = out.replace(/<link\s+rel="canonical"[^>]*>/i, '')
  // Drop any prior OG/Twitter stubs so injection is authoritative.
  out = out.replace(/<meta\s+property="og:[^"]+"[^>]*>/gi, '')
  out = out.replace(/<meta\s+name="twitter:[^"]+"[^>]*>/gi, '')
  out = out.replace(
    /<head([^>]*)>/i,
    `<head$1>\n    ${block}`,
  )
  return out
}
