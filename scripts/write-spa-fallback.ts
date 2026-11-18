/**
 * Materialize index.html under each SPA path so static hosts
 * (Cursor Apps CDN) serve deep links without a Node SPA fallback.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CATEGORY_LANDINGS } from '../src/data/landings.ts'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  injectHtmlMeta,
  type PageMeta,
} from '../src/lib/seo.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

function metaForPath(urlPath: string): PageMeta {
  if (urlPath === '/') {
    return {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      path: '/',
    }
  }
  if (urlPath === '/pohyby') {
    return {
      title: 'Pohyby — VyberAI',
      description:
        'Súhrn lokálnych pohybov na VyberAI (page views, chat, tipy) — len v tomto prehliadači.',
      path: '/pohyby',
      noindex: true,
    }
  }
  const slug = urlPath.replace(/^\//, '')
  const landing = CATEGORY_LANDINGS.find((l) => l.slug === slug)
  if (landing) {
    return {
      title: `${landing.title} — VyberAI tipy | Alza.sk`,
      description: landing.metaDescription,
      path: `/${landing.slug}`,
    }
  }
  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: '/',
  }
}

async function main() {
  const indexPath = path.join(dist, 'index.html')
  const baseHtml = await readFile(indexPath, 'utf8')

  // Homepage stays at dist/index.html with default meta (already in index.html).
  const paths = ['/pohyby', ...CATEGORY_LANDINGS.map((l) => `/${l.slug}`)]

  for (const urlPath of paths) {
    const dir = path.join(dist, urlPath.replace(/^\//, ''))
    await mkdir(dir, { recursive: true })
    const html = injectHtmlMeta(baseHtml, metaForPath(urlPath))
    await writeFile(path.join(dir, 'index.html'), html, 'utf8')
    console.log(`spa-fallback: ${urlPath}/index.html`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
