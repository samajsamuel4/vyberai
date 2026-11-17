import type { ProductCategory } from './catalog'
import { CATEGORY_LABELS } from './catalog'

export type CategoryLanding = {
  slug: string
  category: ProductCategory
  title: string
  headline: string
  lede: string
  bullets: string[]
  /** Prefills and sends in chat */
  chatPrompt: string
  suggestions: string[]
}

export const CATEGORY_LANDINGS: CategoryLanding[] = [
  {
    slug: 'notebooky',
    category: 'notebook',
    title: 'Notebooky',
    headline: 'Notebook podľa rozpočtu a použitia',
    lede:
      'Škola, home office alebo hry — povedz, čo potrebuješ, a VyberAI navrhne 1–3 tipy s odkazom na Alza.sk.',
    bullets: [
      'Filtruj podľa ceny, značky a použitia',
      'Porovnanie tipov vedľa seba v chate',
      'Affiliate odkaz na Alza.sk bez zmeny ceny',
    ],
    chatPrompt: 'Notebook do 800 € na školu',
    suggestions: [
      'Notebook do 800 € na školu',
      'Ľahký notebook na prácu do 1000 €',
      'Herný notebook do 1200 €',
    ],
  },
  {
    slug: 'telefony',
    category: 'telefon',
    title: 'Telefóny',
    headline: 'Mobil s foťákom, výdržou alebo výkonom',
    lede:
      'Android aj iPhone — napíš rozpočet a prioritu. Dostaneš konkrétne tipy z ukážkového katalógu.',
    bullets: [
      'Tipy podľa foťáku, batérie alebo značky',
      'Jasný dôvod pri každom odporúčaní',
      'Priamy prechod na Alza.sk',
    ],
    chatPrompt: 'Telefón s dobrým foťákom do 500 €',
    suggestions: [
      'Telefón s dobrým foťákom do 500 €',
      'Lacný Android do 300 €',
      'iPhone do 900 €',
    ],
  },
  {
    slug: 'sluchadla',
    category: 'sluchadla',
    title: 'Slúchadlá',
    headline: 'Slúchadlá s ANC, na šport alebo do rozpočtu',
    lede:
      'Over-ear aj štuple — VyberAI vyberie podľa potlačenia hluku, ceny a značky.',
    bullets: [
      'ANC, budget aj prémiové tipy',
      'Porovnanie cien v chate',
      'Affiliate CTA na Alza.sk',
    ],
    chatPrompt: 'Slúchadlá s ANC do 150 €',
    suggestions: [
      'Slúchadlá s ANC do 150 €',
      'AirPods alebo podobné štuple',
      'Slúchadlá na cestovanie do 350 €',
    ],
  },
  {
    slug: 'monitory',
    category: 'monitor',
    title: 'Monitory',
    headline: 'Monitor na home office alebo hry',
    lede:
      '4K, USB-C alebo vysoký refresh — napíš, na čo ho chceš, a dostaneš krátky výber.',
    bullets: [
      'Office aj herné monitory',
      'Tipy podľa rozlíšenia a rozpočtu',
      'Odkaz rovno na produkt na Alza.sk',
    ],
    chatPrompt: 'Monitor na home office do 350 €',
    suggestions: [
      'Monitor na home office do 350 €',
      'Herný monitor 165 Hz do 300 €',
      '4K monitor s USB-C',
    ],
  },
  {
    slug: 'tablety',
    category: 'tablet',
    title: 'Tablety',
    headline: 'Tablet na poznámky, streaming alebo kreslenie',
    lede:
      'iPad aj Android — povedz použitie a rozpočet, VyberAI doplní 1–3 tipy.',
    bullets: [
      'Škola, pero, streaming',
      'Porovnanie značiek v chate',
      'Affiliate partner Alza.sk',
    ],
    chatPrompt: 'Tablet na poznámky do 450 €',
    suggestions: [
      'Tablet na poznámky do 450 €',
      'iPad na školu',
      'Android tablet s perom',
    ],
  },
  {
    slug: 'klavesnice',
    category: 'klavesnica',
    title: 'Klávesnice',
    headline: 'Klávesnica na prácu alebo mechanický writing',
    lede:
      'Tiché office klávesnice aj mechaniky — napíš preferencie a rozpočet.',
    bullets: [
      'Bezdrôtové aj mechanické tipy',
      'Rýchle porovnanie v chate',
      'Preklik na Alza.sk',
    ],
    chatPrompt: 'Tichá bezdrôtová klávesnica na home office',
    suggestions: [
      'Tichá bezdrôtová klávesnica na home office',
      'Mechanická klávesnica do 100 €',
      'Klávesnica pre Mac',
    ],
  },
  {
    slug: 'mysi',
    category: 'mys',
    title: 'Myši',
    headline: 'Myš na office alebo gaming',
    lede:
      'Ergonómia, senzor, rozpočet — VyberAI navrhne krátky výber z katalógu.',
    bullets: [
      'Office classic aj herné myši',
      'Porovnanie cien a dôvodov',
      'Affiliate odkaz na Alza.sk',
    ],
    chatPrompt: 'Ergonomická myš na home office do 100 €',
    suggestions: [
      'Ergonomická myš na home office do 100 €',
      'Herná myš do 80 €',
      'Bezdrôtová myš Logitech',
    ],
  },
  {
    slug: 'ssd',
    category: 'ssd',
    title: 'SSD disky',
    headline: 'SSD upgrade notebooku alebo externý disk',
    lede:
      'NVMe aj prenosné SSD — napíš kapacitu a použitie, dostaneš tipy s dôvodom.',
    bullets: [
      'Interné aj externé SSD',
      'Tipy podľa rýchlosti a ceny',
      'Odkaz na Alza.sk',
    ],
    chatPrompt: 'Rýchly NVMe SSD 1 TB do 130 €',
    suggestions: [
      'Rýchly NVMe SSD 1 TB do 130 €',
      'Externý SSD na cestovanie',
      'SSD upgrade notebooku',
    ],
  },
  {
    slug: 'televizory',
    category: 'tv',
    title: 'Televízory',
    headline: 'TV podľa veľkosti, OLED alebo rozpočtu',
    lede:
      'Filmy, šport, smart TV — povedz, čo hľadáš, a VyberAI vyberie z katalógu.',
    bullets: [
      'OLED, QLED a budget tipy',
      'Porovnanie v chate',
      'Affiliate partner Alza.sk',
    ],
    chatPrompt: 'Televízor 55" do 800 €',
    suggestions: [
      'Televízor 55" do 800 €',
      'OLED TV na filmy',
      'Lacný smart TV do 500 €',
    ],
  },
  {
    slug: 'konzoly',
    category: 'herna-konzola',
    title: 'Herné konzoly',
    headline: 'PS5, Switch a konzoly podľa štýlu hrania',
    lede:
      'Domáca alebo prenosná konzola — napíš preferencie a rozpočet.',
    bullets: [
      'PlayStation, Nintendo a ďalšie tipy',
      'Krátke porovnanie v chate',
      'Preklik na Alza.sk',
    ],
    chatPrompt: 'PlayStation 5 alebo Switch do 450 €',
    suggestions: [
      'PlayStation 5 Slim',
      'Nintendo Switch OLED',
      'Konzola na cestovanie do 350 €',
    ],
  },
]

export function getLandingBySlug(slug: string): CategoryLanding | undefined {
  return CATEGORY_LANDINGS.find((l) => l.slug === slug)
}

export function landingPath(slug: string): string {
  return `/${slug}`
}

export function categoryLabel(category: ProductCategory): string {
  return CATEGORY_LABELS[category]
}
