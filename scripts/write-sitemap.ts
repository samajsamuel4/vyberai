/**
 * Keep public/sitemap.xml in sync with CATEGORY_LANDINGS (+ home).
 * Run from npm run build so crawlers never see a stale slug list.
 */
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CATEGORY_LANDINGS } from '../src/data/landings.ts'
import { SITE_ORIGIN } from '../src/lib/seo.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outPath = path.join(root, 'public', 'sitemap.xml')

/** Calendar date in Europe/Bratislava for lastmod. */
function bratislavaDate(d = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Bratislava',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(d)
  const y = parts.find((p) => p.type === 'year')?.value
  const m = parts.find((p) => p.type === 'month')?.value
  const day = parts.find((p) => p.type === 'day')?.value
  return `${y}-${m}-${day}`
}

function urlEntry(loc: string, priority: string, lastmod: string): string {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    '    <changefreq>weekly</changefreq>',
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n')
}

async function main() {
  const lastmod = bratislavaDate()
  const entries = [
    urlEntry(`${SITE_ORIGIN}/`, '1.0', lastmod),
    ...CATEGORY_LANDINGS.map((l) =>
      urlEntry(`${SITE_ORIGIN}/${l.slug}`, '0.8', lastmod),
    ),
  ]
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n')
  await writeFile(outPath, xml, 'utf8')
  console.log(`sitemap: ${entries.length} URLs → ${outPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
