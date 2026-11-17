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
  /** Short Slovak blurb for lists */
  summary: string
  /** Longer Alza-style product description for matching + advice */
  description: string
  /** Key specs shown in compare / reasons */
  specs: string[]
  tags: string[]
  /** Path segment after alza.sk/ */
  alzaPath: string
}

/**
 * Structured Alza-like product feed (sample data).
 * Later swapable for a live Partner XML/API feed without changing recommend UI.
 */
export const CATALOG: Product[] = [
  {
    id: 'nb-acer-aspire5',
    name: 'Acer Aspire 5 15" (Ryzen 5 / 16 GB / 512 GB)',
    brand: 'Acer',
    category: 'notebook',
    priceEur: 549,
    summary: 'Spoľahlivý 15" notebook na školu a kanceláriu so SSD a Full HD.',
    description:
      'Acer Aspire 5 je klasická voľba na štúdium a bežnú prácu. 15,6" Full HD IPS displej, AMD Ryzen 5, 16 GB RAM a 512 GB SSD zvládnu Word, prehliadač aj online výučbu. Výdrž batérie približne celý školský deň, Wi‑Fi 6 a numerická klávesnica.',
    specs: ['15,6" FHD IPS', 'Ryzen 5', '16 GB RAM', '512 GB SSD', 'Wi‑Fi 6'],
    tags: ['skola', 'office', 'student', 'wifi', 'budget'],
    alzaPath: 'acer-aspire-5-15-ryzen5',
  },
  {
    id: 'nb-lenovo-ideapad',
    name: 'Lenovo IdeaPad Slim 3 15"',
    brand: 'Lenovo',
    category: 'notebook',
    priceEur: 699,
    summary: 'Tenký notebook s dobrou batériou — ideálny na prednášky.',
    description:
      'IdeaPad Slim 3 spája tenký profil s Intel Core i5, 16 GB RAM a 512 GB SSD. Displej 15,6" Full HD je vhodný na poznámky aj streaming. Tichý chod a výdrž batérie okolo 8–10 hodín ho robia vhodným na školu aj home office.',
    specs: ['15,6" FHD', 'Core i5', '16 GB RAM', '512 GB SSD', '~9 h batéria'],
    tags: ['skola', 'student', 'baterie', 'lehky', 'office'],
    alzaPath: 'lenovo-ideapad-slim-3-15',
  },
  {
    id: 'nb-asus-vivobook',
    name: 'ASUS Vivobook 16"',
    brand: 'ASUS',
    category: 'notebook',
    priceEur: 789,
    summary: 'Väčší 16" displej a pohodlné písanie na školu aj prácu.',
    description:
      'Vivobook 16 ponúka priestranný 16" displej, plnohodnotnú klávesnicu a výkon na multitasking (office + video + prehliadač). SSD a 16 GB RAM stačia na štúdium aj ľahšiu tvorbu obsahu. Vhodný, ak preferuješ väčšiu pracovnú plochu.',
    specs: ['16" FHD', '16 GB RAM', '512 GB SSD', 'full-size klávesnica'],
    tags: ['skola', 'office', 'velky-displej', 'student'],
    alzaPath: 'asus-vivobook-16',
  },
  {
    id: 'nb-dell-inspiron14',
    name: 'Dell Inspiron 14',
    brand: 'Dell',
    category: 'notebook',
    priceEur: 649,
    summary: 'Solídny notebook na home office s dobrou klávesnicou.',
    description:
      'Dell Inspiron 14 je zameraný na prácu z domu: kvalitná klávesnica, 14" displej, spoľahlivý chladiaci profil. 16 GB RAM a SSD zabezpečia rýchle spustenie Windows a beh Teams/Zoom bez zbytočného lagovania.',
    specs: ['14" FHD', '16 GB RAM', '512 GB SSD', 'Wi‑Fi 6'],
    tags: ['office', 'home-office', 'student', 'wifi'],
    alzaPath: 'dell-inspiron-14',
  },
  {
    id: 'nb-hp-pavilion-gaming',
    name: 'HP Pavilion Gaming 15',
    brand: 'HP',
    category: 'notebook',
    priceEur: 999,
    summary: 'Herný notebook so samostatnou grafikou — hry aj strih.',
    description:
      'Pavilion Gaming 15 prináša dedikovanú NVIDIA grafiku, 144 Hz displej a chladenie pripravené na dlhšie herné session. Vhodný aj na strih videa a 3D školské projekty. Hlučnejší a ťažší než ultrabooky — za to dostaneš výkon.',
    specs: ['15,6" 144 Hz', 'RTX grafika', '16 GB RAM', '512 GB SSD'],
    tags: ['gaming', 'hry', 'grafika', 'vykon', 'rtx'],
    alzaPath: 'hp-pavilion-gaming-15',
  },
  {
    id: 'nb-macbook-air-m2',
    name: 'Apple MacBook Air 13" M2',
    brand: 'Apple',
    category: 'notebook',
    priceEur: 1149,
    summary: 'Tichý, rýchly, výborná batéria — prémiová voľba na štúdium.',
    description:
      'MacBook Air M2 je bezventilátorový, veľmi tichý a s výdržou batérie často cez 15 hodín. Displej Liquid Retina, čip M2 a 256/512 GB SSD. Ideálny do ekosystému iPhone/iPad. Vyššia cena, ale špičková prenosnosť a softvérová podpora.',
    specs: ['13,6" Liquid Retina', 'Apple M2', '8+ GB RAM', 'bez ventilátora', 'dlhá batéria'],
    tags: ['premium', 'apple', 'baterie', 'student', 'office', 'tichy', 'lehky'],
    alzaPath: 'apple-macbook-air-13-m2',
  },
  {
    id: 'ph-samsung-a55',
    name: 'Samsung Galaxy A55 5G 128 GB',
    brand: 'Samsung',
    category: 'telefon',
    priceEur: 429,
    summary: 'Vyvážený midrange s dobrým foťákom a dlhou podporou.',
    description:
      'Galaxy A55 ponúka AMOLED 120 Hz, trojitý foťák s OIS, IP67 a prísľub dlhých aktualizácií. 5G, 8 GB RAM a 128 GB úložiska stačia na bežné používanie. Silná voľba, ak chceš Samsung bez flagship ceny.',
    specs: ['6,6" AMOLED 120 Hz', '50 Mpx OIS', 'IP67', '5G', '8/128 GB'],
    tags: ['fotenie', 'android', 'midrange', 'baterie', '5g'],
    alzaPath: 'samsung-galaxy-a55-5g-128gb',
  },
  {
    id: 'ph-xiaomi-14t',
    name: 'Xiaomi 14T 256 GB',
    brand: 'Xiaomi',
    category: 'telefon',
    priceEur: 499,
    summary: 'Výkonný telefón s Leica foťákom za férové peniaze.',
    description:
      'Xiaomi 14T s Leica optikou cieľi na foto nadšencov v mid-premium triede. Silný čipset, rýchle nabíjanie, AMOLED a 256 GB úložiska. Dobrá voľba, ak chceš foto výkon blízko vyššej triedy bez 800+ €.',
    specs: ['Leica foťák', 'AMOLED', 'rýchle nabíjanie', '256 GB', '5G'],
    tags: ['fotenie', 'android', 'vykon', 'kamera', '5g'],
    alzaPath: 'xiaomi-14t-256gb',
  },
  {
    id: 'ph-google-pixel8a',
    name: 'Google Pixel 8a 128 GB',
    brand: 'Google',
    category: 'telefon',
    priceEur: 479,
    summary: 'Najlepšia AI foto skúsenosť v strednej triede, čistý Android.',
    description:
      'Pixel 8a exceluje vo fotkách (najmä v noci) a AI funkciách Google. Čistý Android, dlhé aktualizácie, Tensor čip. Kompaktnejší telefón vhodný, ak preferuješ softvér a kameru pred herným výkonom.',
    specs: ['OLED 120 Hz', 'Google Tensor', 'výborný nočný foto režim', '7 rokov updatov'],
    tags: ['fotenie', 'android', 'ai', 'kamera', 'budget'],
    alzaPath: 'google-pixel-8a-128gb',
  },
  {
    id: 'ph-iphone-15',
    name: 'Apple iPhone 15 128 GB',
    brand: 'Apple',
    category: 'telefon',
    priceEur: 849,
    summary: 'Dynamický ostrov, USB-C a spoľahlivý iOS ekosystém.',
    description:
      'iPhone 15 prináša USB-C, Dynamický ostrov a čip A16. Foťák zvládne bežné aj slabšie svetlo, iOS drží hodnotu a podporu dlhé roky. Prémiová voľba do Apple ekosystému (AirPods, Mac, Watch).',
    specs: ['6,1" OLED', 'A16 Bionic', 'USB-C', '48 Mpx', '128 GB'],
    tags: ['apple', 'ios', 'premium', 'fotenie', '5g'],
    alzaPath: 'apple-iphone-15-128gb',
  },
  {
    id: 'hp-sony-wh1000xm5',
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    category: 'sluchadla',
    priceEur: 349,
    summary: 'Špičkové ANC na cestovanie a sústredenú prácu.',
    description:
      'WH-1000XM5 sú referenčné ANC slúchadlá: výborné potlačenie hluku v lietadle/vlaku, komfort na dlhé nosenie, LDAC a appka Headphones Connect. Cena je vyššia — za to dostaneš top ANC a zvuk.',
    specs: ['ANC', 'Bluetooth', 'až 30 h', 'multipoint', 'USB-C'],
    tags: ['anc', 'cestovanie', 'hudba', 'bezdratove', 'premium'],
    alzaPath: 'sony-wh-1000xm5',
  },
  {
    id: 'hp-apple-airpods-pro2',
    name: 'Apple AirPods Pro 2 (USB-C)',
    brand: 'Apple',
    category: 'sluchadla',
    priceEur: 279,
    summary: 'Pohodlné štuple s ANC — ideálne k iPhonu.',
    description:
      'AirPods Pro 2 majú silné ANC, Adaptive Audio a bezproblémové párovanie v Apple ekosystéme. USB-C puzdro, priestorový zvuk. Najlepší zážitok s iPhonom; na Androide fungujú, ale bez plnej funkčnosti.',
    specs: ['ANC', 'Adaptive Audio', 'USB-C puzdro', 'IP54', '~6 h na nabitie'],
    tags: ['anc', 'apple', 'sport', 'bezdratove', 'ipad'],
    alzaPath: 'apple-airpods-pro-2-usb-c',
  },
  {
    id: 'hp-jbl-tune770',
    name: 'JBL Tune 770NC',
    brand: 'JBL',
    category: 'sluchadla',
    priceEur: 99,
    summary: 'Dostupné Bluetooth slúchadlá s potlačením hluku.',
    description:
      'Tune 770NC dávajú JBL zvuk a aktívne ANC za priateľskú cenu. Dlhá výdrž, folding dizajn do tašky. Nie sú na úrovni Sony XM5, ale na školu, MHD a denné používanie stačia s prehľadom.',
    specs: ['ANC', 'Bluetooth 5.3', 'až 70 h', 'sklápacie'],
    tags: ['anc', 'budget', 'hudba', 'bezdratove', 'student', 'cestovanie'],
    alzaPath: 'jbl-tune-770nc',
  },
  {
    id: 'hp-nothing-ear',
    name: 'Nothing Ear (a)',
    brand: 'Nothing',
    category: 'sluchadla',
    priceEur: 99,
    summary: 'Štýlové štuple s čistým zvukom a ANC.',
    description:
      'Nothing Ear (a) kombinujú priesvitný dizajn, slušné ANC a čistý zvuk za ~100 €. Appka na EQ, dobrá výdrž. Alternatíva k drahším štupľom, ak nepotrebuješ Apple ekosystém.',
    specs: ['ANC', 'Bluetooth', 'EQ v appke', 'USB-C', 'ľahké'],
    tags: ['anc', 'budget', 'hudba', 'bezdratove', 'android', 'sport'],
    alzaPath: 'nothing-ear-a',
  },
  {
    id: 'mon-dell-s2722qc',
    name: 'Dell S2722QC 27" 4K USB-C',
    brand: 'Dell',
    category: 'monitor',
    priceEur: 329,
    summary: '27" 4K USB-C monitor — home office a dizajn.',
    description:
      'S2722QC je 27" 4K IPS s USB-C (napájanie notebooku + obraz). Vhodný na home office, tabuľky, dizajn a čítanie textu. Tenké rámy, dobré továrenské farby pre bežnú prácu.',
    specs: ['27" 4K IPS', 'USB-C 65 W', '99% sRGB', 'HDMI'],
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
    description:
      'UltraGear 27" s 165 Hz a 1 ms odozvou je stavaný na FPS/esport. IPS panel, G-SYNC Compatible / FreeSync. Ak hľadáš herný monitor do 250–300 €, je to silný kandidát.',
    specs: ['27" IPS', '165 Hz', '1 ms', 'FreeSync / G-SYNC Comp.'],
    tags: ['gaming', 'hry', '165hz', 'ips'],
    alzaPath: 'lg-ultragear-27-165hz',
  },
  {
    id: 'mon-samsung-odyssey-g5',
    name: 'Samsung Odyssey G5 32" QHD 165 Hz',
    brand: 'Samsung',
    category: 'monitor',
    priceEur: 279,
    summary: 'Veľký zakrivený herný monitor QHD.',
    description:
      'Odyssey G5 32" ponúka QHD, 165 Hz a 1000R zakrivenie pre pohlcujúce hranie. Dobrá voľba, ak chceš väčšiu plochu než 27" bez skoku na OLED ceny.',
    specs: ['32" QHD', '165 Hz', '1000R curve', 'FreeSync'],
    tags: ['gaming', 'hry', 'qhd', '165hz'],
    alzaPath: 'samsung-odyssey-g5-32',
  },
  {
    id: 'mon-benq-gw2785tc',
    name: 'BenQ GW2785TC 27" USB-C',
    brand: 'BenQ',
    category: 'monitor',
    priceEur: 299,
    summary: 'Office monitor s USB-C a starostlivosťou o oči.',
    description:
      'GW2785TC je stavaný na home office: USB-C, vstavaný noise-reducing mikrofón, Eye-Care technológie a Full HD/QHD podľa konfigurácie. Ideálny na Zoom a dlhé čítanie dokumentov.',
    specs: ['27"', 'USB-C', 'Eye-Care', 'repro + mic'],
    tags: ['office', 'usb-c', 'home-office', 'zoom'],
    alzaPath: 'benq-gw2785tc-27',
  },
  {
    id: 'tab-ipad-a16',
    name: 'Apple iPad 11" (A16) 128 GB',
    brand: 'Apple',
    category: 'tablet',
    priceEur: 429,
    summary: 'Tablet na poznámky, streaming a ľahkú prácu.',
    description:
      'Základný iPad s čipom A16 zvládne poznámky (Apple Pencil), streaming, prehliadanie a školské appky. Displej 11", USB-C, dlhá podpora iPadOS. Najlepší pomer cena/výkon v Apple tabletoch.',
    specs: ['11" Liquid Retina', 'A16', 'USB-C', 'Apple Pencil podpora'],
    tags: ['skola', 'poznamky', 'apple', 'streaming', 'student'],
    alzaPath: 'apple-ipad-11-a16-128gb',
  },
  {
    id: 'tab-samsung-s9fe',
    name: 'Samsung Galaxy Tab S9 FE',
    brand: 'Samsung',
    category: 'tablet',
    priceEur: 399,
    summary: 'Android tablet s perom — kreslenie a študijné poznámky.',
    description:
      'Tab S9 FE prichádza s S Pen v balení, IP68 a AMOLED/LCD podľa konfigurácie. Vhodný na poznámky, kreslenie a multitasking v DeX. Dobrá Android alternatíva k iPadu.',
    specs: ['S Pen v balení', 'IP68', 'DeX', 'dlhá podpora One UI'],
    tags: ['skola', 'poznamky', 'pero', 'android', 'kreslenie'],
    alzaPath: 'samsung-galaxy-tab-s9-fe',
  },
  {
    id: 'tab-lenovo-p11',
    name: 'Lenovo Tab P11 Pro Gen 2',
    brand: 'Lenovo',
    category: 'tablet',
    priceEur: 349,
    summary: 'Android tablet na streaming a ľahkú prácu.',
    description:
      'Tab P11 Pro ponúka OLED displej, štyri reproduktory a slušnú výdrž. Vhodný na Netflix, poznámky a študentské PDF. Lacnejšia cesta než iPad, ak nepotrebuješ Apple appky.',
    specs: ['OLED', '4 repro', 'USB-C', 'Android'],
    tags: ['streaming', 'skola', 'android', 'budget'],
    alzaPath: 'lenovo-tab-p11-pro-gen2',
  },
  {
    id: 'tab-xiaomi-pad6',
    name: 'Xiaomi Pad 6 128 GB',
    brand: 'Xiaomi',
    category: 'tablet',
    priceEur: 299,
    summary: 'Výkonný budget tablet na školu a média.',
    description:
      'Pad 6 dáva plynulý 144 Hz displej a silný pomer cena/výkon. Dobrá voľba na školu, prehliadanie a streaming, ak chceš ušetriť oproti iPadu.',
    specs: ['11" 144 Hz', '128 GB', 'Dolby Vision', 'USB-C'],
    tags: ['skola', 'student', 'streaming', 'budget', 'android'],
    alzaPath: 'xiaomi-pad-6-128gb',
  },
  {
    id: 'kb-logitech-mx-keys',
    name: 'Logitech MX Keys S',
    brand: 'Logitech',
    category: 'klavesnica',
    priceEur: 119,
    summary: 'Tichá bezdrôtová klávesnica pre produktívnu prácu.',
    description:
      'MX Keys S je tichá, podsvietená klávesnica s Logi Bolt/Bluetooth a Easy-Switch medzi 3 zariadeniami. Výborná na home office a písanie celý deň. Funguje s Windows aj macOS.',
    specs: ['bezdrôtová', 'podsvietenie', 'Easy-Switch', 'USB-C nabíjanie'],
    tags: ['office', 'bezdratove', 'ticha', 'home-office'],
    alzaPath: 'logitech-mx-keys-s',
  },
  {
    id: 'kb-keychron-k2',
    name: 'Keychron K2 Wireless',
    brand: 'Keychron',
    category: 'klavesnica',
    priceEur: 89,
    summary: 'Mechanická klávesnica s Mac/Windows layoutom.',
    description:
      'Keychron K2 je 75% mechanická klávesnica s Bluetooth + káblom, výmennými switchmi a layoutom vhodným pre Mac aj Windows. Spokojnosť pri písaní s haptickým feedbackom; hlasnejšia než membránové klávesnice.',
    specs: ['75% layout', 'Bluetooth + kabel', 'hot-swap (verzie)', 'Mac/Win'],
    tags: ['office', 'bezdratove', 'mechanicka', 'budget'],
    alzaPath: 'keychron-k2-wireless',
  },
  {
    id: 'kb-apple-magic',
    name: 'Apple Magic Keyboard',
    brand: 'Apple',
    category: 'klavesnica',
    priceEur: 109,
    summary: 'Nízky profil pre Mac — tiché písanie.',
    description:
      'Magic Keyboard je tenká, tichá klávesnica s nabíjaním Lightning/USB-C podľa generácie. Najlepší feeling v macOS ekosystéme; menej vhodná, ak často striedaš Windows PC.',
    specs: ['scissor mechanizmus', 'nabíjanie', 'macOS optimalizácia'],
    tags: ['office', 'apple', 'mac', 'ticha', 'bezdratove'],
    alzaPath: 'apple-magic-keyboard',
  },
  {
    id: 'kb-logitech-pebble',
    name: 'Logitech Pebble Keys 2 K380s',
    brand: 'Logitech',
    category: 'klavesnica',
    priceEur: 39,
    summary: 'Kompaktná tichá klávesnica do tašky.',
    description:
      'Pebble Keys 2 je lacná, tichá a multi-device klávesnica na cestovanie a kaviarenské písanie. Nie je to MX Keys, ale do 40 € výborný pomer.',
    specs: ['Bluetooth', 'Easy-Switch', 'tiché klávesy', 'kompakt'],
    tags: ['office', 'budget', 'bezdratove', 'ticha', 'cestovanie'],
    alzaPath: 'logitech-pebble-keys-2-k380s',
  },
  {
    id: 'ms-logitech-mx-master3s',
    name: 'Logitech MX Master 3S',
    brand: 'Logitech',
    category: 'mys',
    priceEur: 99,
    summary: 'Ergonomická myš s MagSpeed scrollom — office classic.',
    description:
      'MX Master 3S je ergonomická myš pre produktivitu: MagSpeed koliesko, tiché kliky, 8K senzor na skle. Ideal home-office companion k MX Keys. Nabíjanie USB-C, multi-device.',
    specs: ['MagSpeed', 'tiché kliky', '8000 DPI', 'USB-C', 'multi-device'],
    tags: ['office', 'ergonomia', 'bezdratove', 'home-office'],
    alzaPath: 'logitech-mx-master-3s',
  },
  {
    id: 'ms-logitech-g502',
    name: 'Logitech G502 X',
    brand: 'Logitech',
    category: 'mys',
    priceEur: 79,
    summary: 'Herná myš s nastaviteľnými tlačidlami a HERO senzorom.',
    description:
      'G502 X je evolúcia legendárnej hernej myši: ľahší chassis, HERO senzor, programovateľné tlačidlá. Vhodná na FPS/MMO aj bežnú prácu, ak chceš viac tlačidiel.',
    specs: ['HERO senzor', 'programovateľné tlačidlá', 'ľahší dizajn'],
    tags: ['gaming', 'hry', 'office', 'budget'],
    alzaPath: 'logitech-g502-x',
  },
  {
    id: 'ms-razer-deathadder',
    name: 'Razer DeathAdder V3',
    brand: 'Razer',
    category: 'mys',
    priceEur: 69,
    summary: 'Ergonomická herná myš s Focus Pro senzorom.',
    description:
      'DeathAdder V3 je ľahká ergonomická herná myš s vysokým senzorom a spoľahlivými spínačmi. Oblúbená na FPS; pohodlná aj na dlhšie session.',
    specs: ['Focus Pro 30K', 'ľahký chassis', 'optické spínače'],
    tags: ['gaming', 'hry', 'ergonomia', 'budget'],
    alzaPath: 'razer-deathadder-v3',
  },
  {
    id: 'ms-microsoft-sculpt',
    name: 'Microsoft Sculpt Ergonomic Mouse',
    brand: 'Microsoft',
    category: 'mys',
    priceEur: 49,
    summary: 'Thumb-groove ergonomická myš na office.',
    description:
      'Sculpt Ergonomic je stavaná na celodennú prácu: prirodzený úchop, Windows gesture tlačidlo a spoľahlivé 2.4 GHz. Dobrá lacnejšia ergonomická voľba než MX Master.',
    specs: ['ergonomický tvar', 'Windows gestá', '2.4 GHz'],
    tags: ['office', 'ergonomia', 'home-office', 'budget'],
    alzaPath: 'microsoft-sculpt-ergonomic-mouse',
  },
  {
    id: 'ssd-samsung-990',
    name: 'Samsung 990 PRO 1 TB NVMe',
    brand: 'Samsung',
    category: 'ssd',
    priceEur: 119,
    summary: 'Rýchly NVMe SSD — upgrade notebooku alebo PC.',
    description:
      '990 PRO je high-end PCIe 4.0 NVMe disk s vysokými sekvenčnými rýchlosťami a spoľahlivosťou Samsung. Ideálny upgrade staršieho notebooku/PC: rýchlejší boot, hry a práca so súbormi.',
    specs: ['PCIe 4.0 NVMe', '1 TB', 'až ~7450 MB/s čítanie', 'M.2 2280'],
    tags: ['upgrade', 'ulozisko', 'rychly', 'pc'],
    alzaPath: 'samsung-990-pro-1tb',
  },
  {
    id: 'ssd-sandisk-extreme1',
    name: 'SanDisk Extreme Portable SSD 1 TB',
    brand: 'SanDisk',
    category: 'ssd',
    priceEur: 109,
    summary: 'Externý SSD do tašky — zálohy a rýchly prenos.',
    description:
      'Prenosný Extreme SSD je odolný, kompaktný a rýchly cez USB-C. Vhodný na cestovanie, školské projekty a video zálohy. Rýchlejší a odolnejší než klasický HDD.',
    specs: ['1 TB', 'USB-C', 'odolný', 'prenosný'],
    tags: ['ulozisko', 'prenosn', 'student', 'cestovanie', 'budget'],
    alzaPath: 'sandisk-extreme-portable-ssd-1tb',
  },
  {
    id: 'ssd-wd-sn850x',
    name: 'WD Black SN850X 1 TB',
    brand: 'WD',
    category: 'ssd',
    priceEur: 109,
    summary: 'Herný NVMe SSD s vysokým výkonom.',
    description:
      'SN850X je PCIe 4.0 disk obľúbený medzi hráčmi: rýchle načítanie hier a nižšie stutter. Solidná alternativa k Samsung 990 PRO pri podobnej cene.',
    specs: ['PCIe 4.0', '1 TB', 'až ~7300 MB/s', 'M.2 2280'],
    tags: ['upgrade', 'ulozisko', 'rychly', 'gaming', 'hry'],
    alzaPath: 'wd-black-sn850x-1tb',
  },
  {
    id: 'ssd-crucial-t500',
    name: 'Crucial T500 2 TB NVMe',
    brand: 'Crucial',
    category: 'ssd',
    priceEur: 169,
    summary: 'Veľkokapacitný NVMe na video a archív.',
    description:
      'T500 2 TB dáva priestor na projekty, hry aj 4K materiál. PCIe 4.0 rýchlosti a férová cena za TB — vhodný upgrade, ak 1 TB už nestačí.',
    specs: ['2 TB', 'PCIe 4.0', 'M.2 2280', 'DRAM'],
    tags: ['upgrade', 'ulozisko', 'rychly', 'video'],
    alzaPath: 'crucial-t500-2tb',
  },
  {
    id: 'tv-lg-oled55',
    name: 'LG OLED55 C4',
    brand: 'LG',
    category: 'tv',
    priceEur: 1299,
    summary: 'OLED s výborným kontrastom na filmy a šport.',
    description:
      'LG C4 OLED prináša dokonalú čiernu, webOS a herné funkcie (VRR, ALLM). 55" je sweet spot do obývačky. Prémiová cena za špičkový obraz — ak sleduješ veľa filmov v tme, OLED vyhráva.',
    specs: ['55" OLED 4K', 'webOS', 'HDMI 2.1', 'VRR / ALLM'],
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
    description:
      'Q60D QLED je jasný televízor vhodný do denného svetla, Tizen smart TV a solid 4K upscaling. Nie OLED kontrast, ale lepšia cena a vysoký jas. Dobrá voľba do 700 € triedy.',
    specs: ['55" QLED 4K', 'Tizen', 'HDR', 'smart TV'],
    tags: ['filmy', 'qled', '4k', 'smart-tv', 'budget'],
    alzaPath: 'samsung-qled-55-q60d',
  },
  {
    id: 'tv-tcl-55c655',
    name: 'TCL 55C655 QLED',
    brand: 'TCL',
    category: 'tv',
    priceEur: 449,
    summary: 'Budget QLED smart TV s Google TV.',
    description:
      'C655 prináša QLED jas, Google TV a slušný zvuk za cenu pod prémiové značky. Ideálny lacný smart TV do 500 €, ak nepotrebuješ OLED kontrast.',
    specs: ['55" QLED 4K', 'Google TV', 'HDR10+', 'Dolby Audio'],
    tags: ['filmy', 'qled', '4k', 'smart-tv', 'budget'],
    alzaPath: 'tcl-55c655-qled',
  },
  {
    id: 'tv-sony-bravia55',
    name: 'Sony BRAVIA 55" XR55X90L',
    brand: 'Sony',
    category: 'tv',
    priceEur: 999,
    summary: 'LCD/Mini LED s výborným pohybom na šport.',
    description:
      'Sony X90L je silný na šport a jasné miestnosti: dobrý motion processing, Google TV a solidný zvuk. Alternatíva k OLED, ak sleduješ veľa cez deň.',
    specs: ['55" 4K', 'Cognitive Processor XR', 'Google TV', 'HDMI 2.1'],
    tags: ['filmy', 'sport', '4k', 'smart-tv'],
    alzaPath: 'sony-bravia-xr55x90l',
  },
  {
    id: 'gc-ps5-slim',
    name: 'PlayStation 5 Slim',
    brand: 'Sony',
    category: 'herna-konzola',
    priceEur: 449,
    summary: 'Aktuálna generácia konzoly s bohatou knižnicou hier.',
    description:
      'PS5 Slim je menšia verzia PlayStation 5 s podporou 4K/60+ hier, DualSense ovládačom a rýchlym SSD. Najlepšia voľba, ak chceš exkluzivity Sony a veľký katalóg. Over dostupnosť disku (Digital vs Disc).',
    specs: ['4K gaming', 'SSD', 'DualSense', 'slim chassis'],
    tags: ['gaming', 'hry', 'konzola', 'ps5'],
    alzaPath: 'playstation-5-slim',
  },
  {
    id: 'gc-switch-oled',
    name: 'Nintendo Switch OLED',
    brand: 'Nintendo',
    category: 'herna-konzola',
    priceEur: 329,
    summary: 'Prenosná konzola s OLED — hry kdekoľvek.',
    description:
      'Switch OLED má farebnejší 7" OLED displej, vylepšený stojan a rovnakú knižnicu Nintendo hier (Mario, Zelda, Animal Crossing). Ideálny na cestovanie a rodinné hranie; nie je to 4K výkon PS5.',
    specs: ['7" OLED', 'handheld + dock', 'Joy-Con', 'rodinné hry'],
    tags: ['gaming', 'hry', 'prenosna', 'rodina', 'cestovanie'],
    alzaPath: 'nintendo-switch-oled',
  },
  {
    id: 'gc-xbox-series-s',
    name: 'Xbox Series S 512 GB',
    brand: 'Microsoft',
    category: 'herna-konzola',
    priceEur: 299,
    summary: 'Kompaktná next-gen konzola za nižšiu cenu.',
    description:
      'Series S je digitálna, menšia a lacnejšia cesta do current-gen Xbox knižnice a Game Pass. Nižšie rozlíšenie než Series X/PS5, ale výborná hodnota na 1080p/1440p TV.',
    specs: ['512 GB SSD', 'digitálna', 'Game Pass', '1440p cieľ'],
    tags: ['gaming', 'hry', 'konzola', 'budget'],
    alzaPath: 'xbox-series-s-512gb',
  },
  {
    id: 'gc-steam-deck-oled',
    name: 'Steam Deck OLED 512 GB',
    brand: 'Valve',
    category: 'herna-konzola',
    priceEur: 549,
    summary: 'PC handheld na Steam knižnicu.',
    description:
      'Steam Deck OLED je prenosný PC handheld s farebnejším OLED panelom a prístupom k Steam hrám. Ideálny, ak už máš PC knižnicu a chceš hrať na cestách.',
    specs: ['OLED', '512 GB', 'SteamOS', 'handheld'],
    tags: ['gaming', 'hry', 'prenosna', 'cestovanie', 'pc'],
    alzaPath: 'steam-deck-oled-512gb',
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

/** Feed accessor — later replace body with live Alza Partner feed parser. */
export function getProductFeed(): Product[] {
  return CATALOG
}
