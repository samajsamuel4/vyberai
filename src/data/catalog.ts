export type ProductCategory =
  | 'notebook'
  | 'telefon'
  | 'sluchadla'
  | 'monitor'
  | 'tablet'
  | 'klavesnica'
  | 'mys'
  | 'ssd'
  | 'tv'
  | 'herna-konzola'

export type Product = {
  id: string
  name: string
  brand: string
  category: ProductCategory
  priceEur: number
  /** Short Slovak blurb used in matching and display */
  summary: string
  /** Use-case tags for rule matching */
  tags: string[]
  /** Path segment after alza.sk/ for the affiliate URL */
  alzaPath: string
}

/** Mock electronics catalog — typical Alza-style categories. Sample data only. */
export const CATALOG: Product[] = [
  {
    id: 'nb-acer-aspire5',
    name: 'Acer Aspire 5 15"',
    brand: 'Acer',
    category: 'notebook',
    priceEur: 549,
    summary: 'Spoľahlivý notebook na školu a kanceláriu, SSD a Full HD displej.',
    tags: ['skola', 'office', 'student', 'lehky', 'wifi', 'budget'],
    alzaPath: 'acer-aspire-5-15',
  },
  {
    id: 'nb-lenovo-ideapad',
    name: 'Lenovo IdeaPad Slim 3',
    brand: 'Lenovo',
    category: 'notebook',
    priceEur: 699,
    summary: 'Tenký notebook s dobrou výdržou batérie — ideálny na prednášky.',
    tags: ['skola', 'student', 'baterie', 'lehky', 'office'],
    alzaPath: 'lenovo-ideapad-slim-3',
  },
  {
    id: 'nb-asus-vivobook',
    name: 'ASUS Vivobook 16',
    brand: 'ASUS',
    category: 'notebook',
    priceEur: 789,
    summary: 'Väčší 16" displej, pohodlné písanie, dostatok výkonu na školu aj prácu.',
    tags: ['skola', 'office', 'velky-displej', 'student'],
    alzaPath: 'asus-vivobook-16',
  },
  {
    id: 'nb-hp-pavilion-gaming',
    name: 'HP Pavilion Gaming 15',
    brand: 'HP',
    category: 'notebook',
    priceEur: 999,
    summary: 'Herný notebook so samostatnou grafikou — hry aj strih videa.',
    tags: ['gaming', 'hry', 'grafika', 'vykon', 'rtx'],
    alzaPath: 'hp-pavilion-gaming-15',
  },
  {
    id: 'nb-macbook-air-m2',
    name: 'Apple MacBook Air 13" M2',
    brand: 'Apple',
    category: 'notebook',
    priceEur: 1149,
    summary: 'Tichý, rýchly a s výbornou batériou — prémiová voľba na štúdium.',
    tags: ['premium', 'apple', 'baterie', 'student', 'office', 'tichy'],
    alzaPath: 'apple-macbook-air-13-m2',
  },
  {
    id: 'ph-samsung-a55',
    name: 'Samsung Galaxy A55 5G',
    brand: 'Samsung',
    category: 'telefon',
    priceEur: 429,
    summary: 'Vyvážený midrange telefón s dobrým foťákom a dlhou podporou.',
    tags: ['fotenie', 'android', 'midrange', 'baterie', '5g'],
    alzaPath: 'samsung-galaxy-a55-5g',
  },
  {
    id: 'ph-xiaomi-14t',
    name: 'Xiaomi 14T',
    brand: 'Xiaomi',
    category: 'telefon',
    priceEur: 499,
    summary: 'Výkonný telefón s Leica foťákom za férové peniaze.',
    tags: ['fotenie', 'android', 'vykon', 'kamera', '5g'],
    alzaPath: 'xiaomi-14t',
  },
  {
    id: 'ph-iphone-15',
    name: 'Apple iPhone 15 128 GB',
    brand: 'Apple',
    category: 'telefon',
    priceEur: 849,
    summary: 'Dynamický ostrov, USB-C a spoľahlivý iOS ekosystém.',
    tags: ['apple', 'ios', 'premium', 'fotenie', '5g'],
    alzaPath: 'apple-iphone-15-128gb',
  },
  {
    id: 'ph-google-pixel8a',
    name: 'Google Pixel 8a',
    brand: 'Google',
    category: 'telefon',
    priceEur: 479,
    summary: 'Najlepšia AI foto skúsenosť v strednej triede, čistý Android.',
    tags: ['fotenie', 'android', 'ai', 'kamera', 'budget'],
    alzaPath: 'google-pixel-8a',
  },
  {
    id: 'hp-sony-wh1000xm5',
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    category: 'sluchadla',
    priceEur: 349,
    summary: 'Špičkové ANC slúchadlá na cestovanie a sústredenú prácu.',
    tags: ['anc', 'cestovanie', 'hudba', 'bezdratove', 'premium'],
    alzaPath: 'sony-wh-1000xm5',
  },
  {
    id: 'hp-apple-airpods-pro2',
    name: 'Apple AirPods Pro 2',
    brand: 'Apple',
    category: 'sluchadla',
    priceEur: 279,
    summary: 'Pohodlné štuple s ANC — ideálne k iPhonu.',
    tags: ['anc', 'apple', 'sport', 'bezdratove', 'ipad'],
    alzaPath: 'apple-airpods-pro-2',
  },
  {
    id: 'hp-jbl-tune770',
    name: 'JBL Tune 770NC',
    brand: 'JBL',
    category: 'sluchadla',
    priceEur: 99,
    summary: 'Dostupné Bluetooth slúchadlá s potlačením hluku.',
    tags: ['anc', 'budget', 'hudba', 'bezdratove', 'student'],
    alzaPath: 'jbl-tune-770nc',
  },
  {
    id: 'mon-dell-s2722qc',
    name: 'Dell S2722QC 27" 4K',
    brand: 'Dell',
    category: 'monitor',
    priceEur: 329,
    summary: '27" 4K USB-C monitor — home office a dizajn.',
    tags: ['office', '4k', 'usb-c', 'home-office', 'dizajn'],
    alzaPath: 'dell-s2722qc-27',
  },
  {
    id: 'mon-lg-ultragear',
    name: 'LG UltraGear 27" 165 Hz',
    brand: 'LG',
    category: 'monitor',
    priceEur: 249,
    summary: 'Rýchly herný monitor s nízkym oneskorením.',
    tags: ['gaming', 'hry', '165hz', 'ips'],
    alzaPath: 'lg-ultragear-27-165hz',
  },
  {
    id: 'tab-ipad-a16',
    name: 'Apple iPad 11" (A16)',
    brand: 'Apple',
    category: 'tablet',
    priceEur: 429,
    summary: 'Tablet na poznámky, streaming a ľahkú prácu.',
    tags: ['skola', 'poznamky', 'apple', 'streaming', 'student'],
    alzaPath: 'apple-ipad-11-a16',
  },
  {
    id: 'tab-samsung-s9fe',
    name: 'Samsung Galaxy Tab S9 FE',
    brand: 'Samsung',
    category: 'tablet',
    priceEur: 399,
    summary: 'Android tablet s perom — kreslenie a študijné poznámky.',
    tags: ['skola', 'poznamky', 'pero', 'android', 'kreslenie'],
    alzaPath: 'samsung-galaxy-tab-s9-fe',
  },
  {
    id: 'kb-logitech-mx-keys',
    name: 'Logitech MX Keys S',
    brand: 'Logitech',
    category: 'klavesnica',
    priceEur: 119,
    summary: 'Tichá bezdrôtová klávesnica pre produktívnu prácu.',
    tags: ['office', 'bezdratove', 'ticha', 'home-office'],
    alzaPath: 'logitech-mx-keys-s',
  },
  {
    id: 'ms-logitech-mx-master3s',
    name: 'Logitech MX Master 3S',
    brand: 'Logitech',
    category: 'mys',
    priceEur: 99,
    summary: 'Ergonomická myš s presným scrollom — home office classic.',
    tags: ['office', 'ergonomia', 'bezdratove', 'home-office'],
    alzaPath: 'logitech-mx-master-3s',
  },
  {
    id: 'ssd-samsung-990',
    name: 'Samsung 990 PRO 1 TB',
    brand: 'Samsung',
    category: 'ssd',
    priceEur: 119,
    summary: 'Rýchly NVMe SSD — upgrade notebooku alebo PC.',
    tags: ['upgrade', 'ulozisko', 'rychly', 'pc'],
    alzaPath: 'samsung-990-pro-1tb',
  },
  {
    id: 'tv-lg-oled55',
    name: 'LG OLED55 C4',
    brand: 'LG',
    category: 'tv',
    priceEur: 1299,
    summary: 'OLED televízor s výborným kontrastom na filmy a šport.',
    tags: ['filmy', 'oled', '4k', 'smart-tv', 'sport'],
    alzaPath: 'lg-oled55-c4',
  },
  {
    id: 'tv-samsung-qled55',
    name: 'Samsung QLED 55" Q60D',
    brand: 'Samsung',
    category: 'tv',
    priceEur: 699,
    summary: 'Jasný QLED za rozumnú cenu — bežné sledovanie TV.',
    tags: ['filmy', 'qled', '4k', 'smart-tv', 'budget'],
    alzaPath: 'samsung-qled-55-q60d',
  },
  {
    id: 'gc-ps5-slim',
    name: 'PlayStation 5 Slim',
    brand: 'Sony',
    category: 'herna-konzola',
    priceEur: 449,
    summary: 'Najnovšia generácia konzoly s bohatou knižnicou hier.',
    tags: ['gaming', 'hry', 'konzola', 'ps5'],
    alzaPath: 'playstation-5-slim',
  },
  {
    id: 'gc-switch-oled',
    name: 'Nintendo Switch OLED',
    brand: 'Nintendo',
    category: 'herna-konzola',
    priceEur: 329,
    summary: 'Prenosná konzola s OLED displejom — hry kdekoľvek.',
    tags: ['gaming', 'hry', 'prenosna', 'rodina', 'cestovanie'],
    alzaPath: 'nintendo-switch-oled',
  },
]

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  notebook: 'Notebooky',
  telefon: 'Telefóny',
  sluchadla: 'Slúchadlá',
  monitor: 'Monitory',
  tablet: 'Tablety',
  klavesnica: 'Klávesnice',
  mys: 'Myši',
  ssd: 'SSD disky',
  tv: 'Televízory',
  'herna-konzola': 'Herné konzoly',
}
