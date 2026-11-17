import type { ProductCategory } from './catalog'
import { CATEGORY_LABELS } from './catalog'

export type LandingFaq = {
  question: string
  answer: string
}

export type CategoryLanding = {
  slug: string
  category: ProductCategory
  title: string
  headline: string
  lede: string
  /** Unique meta description for crawlers / OG */
  metaDescription: string
  bullets: string[]
  /** Buyer-intent tips for SEO body copy */
  guideTips: string[]
  faq: LandingFaq[]
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
    metaDescription:
      'Ako vybrať notebook do školy, práce alebo hier. Slovenský AI chat VyberAI navrhne tipy podľa ceny a použitia s odkazom na Alza.sk.',
    bullets: [
      'Filtruj podľa ceny, značky a použitia',
      'Porovnanie tipov vedľa seba v chate',
      'Affiliate odkaz na Alza.sk bez zmeny ceny',
    ],
    guideTips: [
      'Do školy stačí 16 GB RAM a SSD; hľadaj výdrž batérie a Full HD displej.',
      'Na home office oceníš dobrú klávesnicu, webkameru a tichý chod.',
      'Herný notebook potrebuje dedikovanú grafiku a vyšší refresh displeja — počítaj s váhou a hlukom.',
    ],
    faq: [
      {
        question: 'Aký notebook do 800 € na školu?',
        answer:
          'V tejto triede hľadaj Ryzen 5 / Core i5, 16 GB RAM a aspoň 512 GB SSD. VyberAI ti podľa rozpočtu navrhne 1–3 konkrétne tipy.',
      },
      {
        question: 'Potrebujem herný notebook, alebo stačí bežný?',
        answer:
          'Na Word, prehliadač a Zoom stačí office model. Hry, 3D a strih videa chcú samostatnú grafiku — napíš to do chatu a porovnáme možnosti.',
      },
      {
        question: 'Je MacBook vhodný na školu?',
        answer:
          'Áno, ak ti vyhovuje macOS a dlhá podpora. Za podobnú sumu často dostaneš viac palcov a portov na Windows — spýtaj sa s rozpočtom.',
      },
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
    metaDescription:
      'Výber mobilu podľa foťáku, batérie a ceny. VyberAI odporučí Android alebo iPhone s affiliate odkazom na Alza.sk.',
    bullets: [
      'Tipy podľa foťáku, batérie alebo značky',
      'Jasný dôvod pri každom odporúčaní',
      'Priamy prechod na Alza.sk',
    ],
    guideTips: [
      'Do 300 € hľadaj spoľahlivý denný Android s dobrou batériou.',
      'Okolo 500 € už dostaneš výrazne lepší foťák a čistejší softvér.',
      'iPhone sa oplatí, ak chceš dlhú podporu a ekosystém Apple — napíš strop ceny.',
    ],
    faq: [
      {
        question: 'Aký telefón s dobrým foťákom do 500 €?',
        answer:
          'V mid-range triede často vyhrávajú Pixel a vyššie A-série Galaxy. Napíš „foťák do 500 €“ a VyberAI vyberie z katalógu.',
      },
      {
        question: 'Android alebo iPhone?',
        answer:
          'Android dáva viac za peniaze a flexibilitu. iPhone výdrž aktualizácií a jednoduchý predaj neskôr. Povedz preferenciu v chate.',
      },
      {
        question: 'Koľko úložiska potrebujem?',
        answer:
          'Na bežné fotky stačí 128 GB; ak točíš video alebo hráš veľa hier, zvoľ 256 GB. Spomeň to v požiadavke.',
      },
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
    metaDescription:
      'Slúchadlá s ANC, na cestovanie alebo šport. AI tipy VyberAI podľa rozpočtu s odkazom na Alza.sk.',
    bullets: [
      'ANC, budget aj prémiové tipy',
      'Porovnanie cien v chate',
      'Affiliate CTA na Alza.sk',
    ],
    guideTips: [
      'ANC oceníš vo vlaku, lietadle a open-space kancelárii.',
      'Štuple sú lepšie na beh a do tašky; over-ear pohodlnejšie na dlhé počúvanie.',
      'Do 150 € už vieš kúpiť slušné ANC — prémiové značky pridajú komfort a appku.',
    ],
    faq: [
      {
        question: 'Aký je rozdiel medzi ANC a bežnými slúchadlami?',
        answer:
          'ANC aktívne potláča hluk okolia. Ak denne cestuješ, oplatí sa; na tiché domáce počúvanie stačia aj lacnejšie.',
      },
      {
        question: 'AirPods alebo Android štuple?',
        answer:
          'AirPods najlepšie sedia v Apple ekosystéme. Na Androide zvoľ univerzálne ANC štuple — napíš značku telefónu do chatu.',
      },
      {
        question: 'Slúchadlá do 150 € s ANC — dajú sa?',
        answer:
          'Áno, mid-range ANC je dnes dostupné. Spýtaj sa „ANC do 150 €“ a porovnáme tipy.',
      },
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
    metaDescription:
      'Výber monitora na home office, 4K alebo hry. VyberAI poradí podľa rozlíšenia, USB-C a rozpočtu — Alza.sk.',
    bullets: [
      'Office aj herné monitory',
      'Tipy podľa rozlíšenia a rozpočtu',
      'Odkaz rovno na produkt na Alza.sk',
    ],
    guideTips: [
      'Na text a tabuľky stačí 27" QHD alebo 4K; USB-C zjednoduší napájanie notebooku.',
      'Herný monitor hľadaj od 144–165 Hz a nízku odozvu.',
      'Na dizajn over farebný gamut (sRGB/Adobe RGB) a továrenskú kalibráciu.',
    ],
    faq: [
      {
        question: 'Aký monitor na home office do 350 €?',
        answer:
          'Často vyhráva 27" s QHD/4K a USB-C. Napíš veľkosť stola a či chceš jeden kábel do notebooku.',
      },
      {
        question: '4K alebo Full HD?',
        answer:
          'Na 27" a viac dáva QHD/4K ostrejší text. Full HD stačí na menšie monitory alebo čistý gaming budget.',
      },
      {
        question: 'Čo je dôležitejšie pri hernom monitore?',
        answer:
          'Refresh (Hz), odozva a FreeSync/G-SYNC. Rozlíšenie rieš až podľa grafiky v PC.',
      },
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
    metaDescription:
      'Tablet na školu, poznámky s perom alebo streaming. Porovnanie iPad a Android tipov cez VyberAI na Alza.sk.',
    bullets: [
      'Škola, pero, streaming',
      'Porovnanie značiek v chate',
      'Affiliate partner Alza.sk',
    ],
    guideTips: [
      'Na poznámky over podporu pera a či je pero v balení.',
      'iPad má silný ekosystém appiek; Android tablety často pridajú DeX a nižšiu cenu.',
      'Na čistý streaming a YouTube stačí lacnejší model s dobrým displejom.',
    ],
    faq: [
      {
        question: 'iPad alebo Android tablet na školu?',
        answer:
          'iPad je istota pri poznámkach a dlhej podpore. Android s perom vie byť lacnejší — napíš rozpočet do chatu.',
      },
      {
        question: 'Potrebujem tablet s perom?',
        answer:
          'Áno, ak píšeš alebo kreslíš denne. Inak ušetríš a stačí bežný tablet na čítanie a video.',
      },
      {
        question: 'Aký tablet do 450 €?',
        answer:
          'V tejto triede už dostaneš solidný iPad alebo Galaxy Tab s perom. Spýtaj sa „tablet na poznámky do 450 €“.',
      },
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
    metaDescription:
      'Bezdrôtová alebo mechanická klávesnica na home office. VyberAI tipy podľa hluku, Mac/Win a ceny — Alza.sk.',
    bullets: [
      'Bezdrôtové aj mechanické tipy',
      'Rýchle porovnanie v chate',
      'Preklik na Alza.sk',
    ],
    guideTips: [
      'Do open-space zvoľ tiché membránové alebo low-profile klávesnice.',
      'Mechaniky dajú lepší feeling pri písaní, ale sú hlasnejšie.',
      'Ak striedaš Mac a Windows, hľadaj Easy-Switch / multi-device.',
    ],
    faq: [
      {
        question: 'Tichá klávesnica na home office?',
        answer:
          'MX Keys a podobné low-profile modely. Napíš „tichá bezdrôtová“ a dostaneš tipy.',
      },
      {
        question: 'Oplatí sa mechanická klávesnica?',
        answer:
          'Áno, ak píšeš veľa a chceš haptiku. Do 100 € už nájdeš solidný Keychron alebo podobné.',
      },
      {
        question: 'Klávesnica pre Mac?',
        answer:
          'Hľadaj layout s Command klávesmi alebo softvérové mapovanie. Spomeň Mac v chate.',
      },
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
    metaDescription:
      'Ergonomická office myš alebo herná myš. AI tipy VyberAI podľa rozpočtu a použitia s odkazom na Alza.sk.',
    bullets: [
      'Office classic aj herné myši',
      'Porovnanie cien a dôvodov',
      'Affiliate odkaz na Alza.sk',
    ],
    guideTips: [
      'Na celodennú prácu zvoľ ergonomický tvar a tiché kliky.',
      'Herná myš pridá tlačidlá a senzor — zváž váhu podľa FPS/MMO.',
      'Multi-device Bluetooth ušetrí prepínanie medzi notebookom a PC.',
    ],
    faq: [
      {
        question: 'Aká myš na home office do 100 €?',
        answer:
          'MX Master trieda je office classic. Ak chceš lacnejšie, napíš strop a preferenciu bezdrôt / kábel.',
      },
      {
        question: 'Herná alebo office myš?',
        answer:
          'Office na pohodlie a produktivitu; herná na rýchly senzor a extra tlačidlá. Povedz hlavné použitie.',
      },
      {
        question: 'Potrebujem vysoké DPI?',
        answer:
          'Na bežnú prácu nie. Herní hráči nastavia DPI podľa citlivosti — dôležitejší je spoľahlivý senzor.',
      },
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
    metaDescription:
      'NVMe upgrade alebo externý SSD na cestovanie. VyberAI poradí kapacitu a rýchlosť s odkazom na Alza.sk.',
    bullets: [
      'Interné aj externé SSD',
      'Tipy podľa rýchlosti a ceny',
      'Odkaz na Alza.sk',
    ],
    guideTips: [
      'Interný NVMe M.2 výrazne zrýchli starší notebook (boot, hry, súbory).',
      'Externý SSD je lepší na cestovanie než klasický HDD.',
      '1 TB je sweet spot pre väčšinu upgradeov; 2 TB ak striháš video.',
    ],
    faq: [
      {
        question: 'Aký SSD 1 TB do notebooku?',
        answer:
          'Hľadaj PCIe 4.0 NVMe M.2 2280, ak to notebook podporuje. Spýtaj sa „NVMe 1 TB“ v chate.',
      },
      {
        question: 'Externý alebo interný disk?',
        answer:
          'Interný na rýchlosť systému; externý na zálohy a prenos medzi zariadeniami.',
      },
      {
        question: 'Stačí 512 GB?',
        answer:
          'Na systém a office áno. Ak hráš alebo točíš video, zvoľ 1 TB a viac.',
      },
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
    metaDescription:
      'Ako vybrať TV 55": OLED, QLED alebo budget smart TV. Slovenský AI tip VyberAI s odkazom na Alza.sk.',
    bullets: [
      'OLED, QLED a budget tipy',
      'Porovnanie v chate',
      'Affiliate partner Alza.sk',
    ],
    guideTips: [
      'OLED vyhráva kontrast a filmy v tme; QLED jas v dennom svetle.',
      '55" je sweet spot do bežnej obývačky; pri väčšej vzdialenosti zváž 65".',
      'Na hry over HDMI 2.1, VRR a ALLM.',
    ],
    faq: [
      {
        question: 'OLED alebo QLED?',
        answer:
          'OLED = dokonalá čierna a filmy. QLED = vyšší jas a často nižšia cena. Napíš, či sleduješ viac večer alebo cez deň.',
      },
      {
        question: 'Aký televízor 55" do 800 €?',
        answer:
          'V tejto triede často QLED/smart TV. Spýtaj sa s rozpočtom a VyberAI navrhne tipy.',
      },
      {
        question: 'Potrebujem herný TV?',
        answer:
          'Ak máš PS5/PC, áno — hľadaj 120 Hz / VRR. Inak stačí bežný 4K smart TV.',
      },
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
    metaDescription:
      'PS5, Switch alebo prenosná konzola. VyberAI pomôže podľa knižnice hier a rozpočtu — affiliate Alza.sk.',
    bullets: [
      'PlayStation, Nintendo a ďalšie tipy',
      'Krátke porovnanie v chate',
      'Preklik na Alza.sk',
    ],
    guideTips: [
      'PS5 = 4K domáce hranie a Sony exkluzivity.',
      'Switch OLED = prenosnosť a rodinné / Nintendo hry.',
      'Over, či chceš diskovú verziu alebo digitál + kapacitu úložiska.',
    ],
    faq: [
      {
        question: 'PS5 alebo Nintendo Switch?',
        answer:
          'PS5 na veľký obraz a výkon; Switch na hranie na cestách a s rodinou. Napíš, kde hráš najviac.',
      },
      {
        question: 'Digital alebo Disc PS5?',
        answer:
          'Disc vie čítať fyzické hry a je flexibilnejší na bazár. Digital je lacnejší, ak kupuješ len digitálne.',
      },
      {
        question: 'Konzola do 350 € na cestovanie?',
        answer:
          'Switch OLED je typická voľba. Spýtaj sa „konzola na cestovanie“ v chate.',
      },
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

export function knownSpaPaths(): string[] {
  return ['/', '/pohyby', ...CATEGORY_LANDINGS.map((l) => `/${l.slug}`)]
}
