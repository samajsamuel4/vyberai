import { adviseUser } from '../src/lib/recommend'

const cases = [
  'ahoj',
  'nieco lacne',
  'notebook do 800 na skolu',
  'Slúchadlá s ANC do 150 €',
  'Telefón s dobrým foťákom',
  'Monitor na home office',
  'Tablet na poznámky do 450 €',
  'apple',
  'herný notebook do 1000',
]

for (const t of cases) {
  const a = adviseUser(t)
  const ids = a.recommendations
    .map((r) => `${r.product.id}(${r.product.category},${r.product.priceEur}€,s=${r.score})`)
    .join(' | ')
  console.log(`\nQ: ${t}`)
  console.log(`  kind=${a.kind}  recs=${a.recommendations.length}`)
  console.log(`  text: ${a.text}`)
  if (ids) console.log(`  picks: ${ids}`)
}
