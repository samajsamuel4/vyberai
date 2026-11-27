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
  /** Extra SEO body paragraph (unique per category) */
  body: string
  bullets: string[]
  /** Buyer-intent tips for SEO body copy */
  guideTips: string[]
  faq: LandingFaq[]
  /** Prefills and sends in chat */
  chatPrompt: string
  suggestions: string[]
  /** Contextual internal links to related category slugs */
  relatedSlugs: string[]
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
      'Ako vybrať notebook do školy, práce alebo hier v roku 2026. Slovenský AI chat VyberAI navrhne tipy podľa RAM, SSD, batérie a ceny — Alza.sk.',
    body: 'Pri výbere notebooku rozhoduje použitie viac než značka: študent potrebuje výdrž a SSD, home office tichý chod a dobrú klávesnicu, hráč dedikovanú grafiku. VyberAI z ukážkového katalógu vyfiltruje 1–3 konkrétne tipy podľa tvojho rozpočtu — bez náhodného dumpovania celej ponuky.',
    bullets: [
      'Tipy podľa školy, práce alebo hier — nie podľa marketingových nálepiek',
      'Porovnanie RAM, SSD a ceny vedľa seba v chate',
      'Affiliate odkaz na Alza.sk; cena pre teba ostáva rovnaká',
    ],
    guideTips: [
      'Do školy stačí 16 GB RAM a SSD; hľadaj výdrž batérie a Full HD displej.',
      'Na home office oceníš dobrú klávesnicu, webkameru a tichý chod.',
      'Herný notebook potrebuje dedikovanú grafiku a vyšší refresh — počítaj s váhou a hlukom.',
      'Ak denne nosíš notebook, zváž váhu pod ~1,5 kg a USB-C nabíjanie.',
    ],
    faq: [
      {
        question: 'Aký notebook do 800 € na školu?',
        answer:
          'V tejto triede hľadaj Ryzen 5 / Core i5, 16 GB RAM a aspoň 512 GB SSD. VyberAI ti podľa rozpočtu navrhne 1–3 konkrétne tipy z katalógu.',
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
      {
        question: 'Koľko RAM a SSD má mať notebook v roku 2026?',
        answer:
          '16 GB RAM je nové minimum na multitasking; 512 GB SSD na systém a súbory, 1 TB ak striháš video alebo hráš. Spomeň to v požiadavke.',
      },
      {
        question: 'Ľahký notebook na cestovanie do 1000 €?',
        answer:
          'Hľadaj ultrabook okolo 1,2–1,5 kg s dobrou batériou. Napíš „ľahký notebook do 1000 €“ a VyberAI vyberie z katalógu.',
      },
    ],
    chatPrompt: 'Notebook do 800 € na školu',
    suggestions: [
      'Notebook do 800 € na školu',
      'Ľahký notebook na prácu do 1000 €',
      'Herný notebook do 1200 €',
    ],
    relatedSlugs: ['monitory', 'klavesnice', 'mysi', 'ssd'],
  },
  {
    slug: 'telefony',
    category: 'telefon',
    title: 'Telefóny',
    headline: 'Mobil s foťákom, výdržou alebo výkonom',
    lede:
      'Android aj iPhone — napíš rozpočet a prioritu. Dostaneš konkrétne tipy z ukážkového katalógu.',
    metaDescription:
      'Ako vybrať mobil: foťák, batéria, Android alebo iPhone. VyberAI odporučí 1–3 tipy podľa ceny s affiliate odkazom na Alza.sk.',
    body: 'Pri mobile rozhoduje, čo fotíš a ako dlho má vydržať. Do 300 € hľadaj spoľahlivý denný Android; okolo 500 € už výrazne rastie foťák; iPhone sa oplatí pre dlhú podporu. VyberAI tipy viaže na kategóriu a rozpočet — nie na náhodný rebríček.',
    bullets: [
      'Filtre: foťák, batéria, značka, strop ceny',
      'Jasný dôvod pri každom tipe — prečo sedí na tvoju požiadavku',
      'Priamy prechod na produkt na Alza.sk',
    ],
    guideTips: [
      'Do 300 € hľadaj spoľahlivý denný Android s dobrou batériou.',
      'Okolo 500 € už dostaneš výrazne lepší foťák a čistejší softvér.',
      'iPhone sa oplatí, ak chceš dlhú podporu a ekosystém Apple — napíš strop ceny.',
      '128 GB stačí na fotky; 256 GB, ak točíš 4K video alebo sťahuješ veľa hier.',
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
      {
        question: 'Lacný Android do 300 € — dá sa slušne fotiť?',
        answer:
          'Áno, na denné fotky a sociálne siete. Nečakaj flagship zoom; hľadaj čistý softvér a nočný režim. Spýtaj sa „Android do 300 €“.',
      },
      {
        question: 'Ako dlho vydržia aktualizácie?',
        answer:
          'Pixel a vyššie Galaxy majú dlhú podporu; iPhone ešte dlhšiu. Budget Android kratšie — ak ti záleží na bezpečnosti, spomeň to v chate.',
      },
    ],
    chatPrompt: 'Telefón s dobrým foťákom do 500 €',
    suggestions: [
      'Telefón s dobrým foťákom do 500 €',
      'Lacný Android do 300 €',
      'iPhone do 900 €',
    ],
    relatedSlugs: ['sluchadla', 'tablety', 'ssd'],
  },
  {
    slug: 'sluchadla',
    category: 'sluchadla',
    title: 'Slúchadlá',
    headline: 'Slúchadlá s ANC, na šport alebo do rozpočtu',
    lede:
      'Over-ear aj štuple — VyberAI vyberie podľa potlačenia hluku, ceny a značky.',
    metaDescription:
      'Slúchadlá s ANC do 150 €, na cestovanie alebo šport. AI tipy VyberAI podľa rozpočtu a použitia — affiliate Alza.sk.',
    body: 'ANC oceníš vo vlaku a open-space; štuple na beh; over-ear na dlhé počúvanie. Do 150 € už vieš kúpiť slušné potlačenie hluku — prémiové značky pridajú komfort a appku. VyberAI zo katalogu vyberie tipy, ktoré sedajú na tvoj scenár, nie len najdrahší model.',
    bullets: [
      'ANC, šport aj budget tipy z jednej požiadavky',
      'Porovnanie výdrže, ceny a typu (štuple / over-ear)',
      'Affiliate CTA na Alza.sk bez zmeny ceny',
    ],
    guideTips: [
      'ANC oceníš vo vlaku, lietadle a open-space kancelárii.',
      'Štuple sú lepšie na beh a do tašky; over-ear pohodlnejšie na dlhé počúvanie.',
      'Do 150 € už vieš kúpiť slušné ANC — prémiové značky pridajú komfort a appku.',
      'S Apple telefónom majú AirPods najlepšiu integráciu; na Androide zvoľ univerzálne ANC.',
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
      {
        question: 'Over-ear alebo štuple na home office?',
        answer:
          'Over-ear sú pohodlnejšie na dlhé hovory; štuple menej zaberajú miesto. Napíš, či potrebuješ mikrofón na Zoom.',
      },
      {
        question: 'Slúchadlá na beh — čo je dôležité?',
        answer:
          'Stabilný fit, pot / IP rating a výdrž. Štuple s ANC alebo ambient módom; spýtaj sa „na šport“ v chate.',
      },
    ],
    chatPrompt: 'Slúchadlá s ANC do 150 €',
    suggestions: [
      'Slúchadlá s ANC do 150 €',
      'AirPods alebo podobné štuple',
      'Slúchadlá na cestovanie do 350 €',
    ],
    relatedSlugs: ['telefony', 'notebooky', 'konzoly'],
  },
  {
    slug: 'monitory',
    category: 'monitor',
    title: 'Monitory',
    headline: 'Monitor na home office alebo hry',
    lede:
      '4K, USB-C alebo vysoký refresh — napíš, na čo ho chceš, a dostaneš krátky výber.',
    metaDescription:
      'Výber monitora: home office 27", 4K USB-C alebo herný 165 Hz. VyberAI poradí podľa rozlíšenia a rozpočtu — Alza.sk.',
    body: 'Office monitor potrebuje ostrý text a ideálne USB-C; herný vyšší Hz a nízku odozvu. 27" QHD/4K je sweet spot na prácu; 165 Hz na FPS. VyberAI tipuje podľa tvojho scenára a stropu ceny z ukážkového katalógu.',
    bullets: [
      'Office USB-C aj herné 165 Hz v jednom chate',
      'Tipy podľa veľkosti, rozlíšenia a rozpočtu',
      'Odkaz rovno na produkt na Alza.sk',
    ],
    guideTips: [
      'Na text a tabuľky stačí 27" QHD alebo 4K; USB-C zjednoduší napájanie notebooku.',
      'Herný monitor hľadaj od 144–165 Hz a nízku odozvu.',
      'Na dizajn over farebný gamut (sRGB/Adobe RGB) a továrenskú kalibráciu.',
      'Pri duálnom setupе zváž rovnakú výšku a IPS, aby farby sedeli.',
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
      {
        question: 'Oplatí sa USB-C monitor k notebooku?',
        answer:
          'Áno, ak notebook vie video + napájanie cez USB-C — jeden kábel namiesto nabíjačky a HDMI. Spomeň značku notebooku v chate.',
      },
      {
        question: '27" alebo 32" na prácu?',
        answer:
          '27" je univerzálnejší na text; 32" QHD/4K na veľké tabuľky a dizajn. Závisí od vzdialenosti očí od stola.',
      },
    ],
    chatPrompt: 'Monitor na home office do 350 €',
    suggestions: [
      'Monitor na home office do 350 €',
      'Herný monitor 165 Hz do 300 €',
      '4K monitor s USB-C',
    ],
    relatedSlugs: ['notebooky', 'klavesnice', 'mysi'],
  },
  {
    slug: 'tablety',
    category: 'tablet',
    title: 'Tablety',
    headline: 'Tablet na poznámky, streaming alebo kreslenie',
    lede:
      'iPad aj Android — povedz použitie a rozpočet, VyberAI doplní 1–3 tipy.',
    metaDescription:
      'Tablet na školu, poznámky s perom alebo streaming. Porovnanie iPad a Android tipov cez VyberAI — affiliate Alza.sk.',
    body: 'Na poznámky rozhoduje pero (či je v balení), na streaming displej a výdrž, na školu dlhá podpora softvéru. iPad je istota v appkách; Android často lacnejší a s DeX. VyberAI vyberie tipy podľa použitia a stropu ceny.',
    bullets: [
      'Škola, pero, streaming — podľa toho, čo reálne robíš',
      'Porovnanie iPad vs Android v chate',
      'Affiliate partner Alza.sk',
    ],
    guideTips: [
      'Na poznámky over podporu pera a či je pero v balení.',
      'iPad má silný ekosystém appiek; Android tablety často pridajú DeX a nižšiu cenu.',
      'Na čistý streaming a YouTube stačí lacnejší model s dobrým displejom.',
      'Do 450 € už vieš kúpiť tablet s perom vhodný na prednášky.',
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
      {
        question: 'Stačí tablet namiesto notebooku?',
        answer:
          'Na poznámky a čítanie áno; na Word + veľa kariet v prehliadači je notebook pohodlnejší. Pozri aj kategóriu Notebooky.',
      },
      {
        question: 'Android tablet s perom do 400 €?',
        answer:
          'Galaxy Tab FE a podobné často majú S Pen v balení. Napíš „Android s perom do 400 €“ do chatu.',
      },
    ],
    chatPrompt: 'Tablet na poznámky do 450 €',
    suggestions: [
      'Tablet na poznámky do 450 €',
      'iPad na školu',
      'Android tablet s perom',
    ],
    relatedSlugs: ['notebooky', 'telefony', 'klavesnice'],
  },
  {
    slug: 'klavesnice',
    category: 'klavesnica',
    title: 'Klávesnice',
    headline: 'Klávesnica na prácu alebo mechanický writing',
    lede:
      'Tiché office klávesnice aj mechaniky — napíš preferencie a rozpočet.',
    metaDescription:
      'Bezdrôtová alebo mechanická klávesnica na home office. Tipy podľa hluku, Mac/Win a ceny — VyberAI + Alza.sk.',
    body: 'Do open-space zvoľ tiché low-profile; mechanika dá lepší feeling, ale je hlasnejšia. Ak striedaš Mac a Windows, hľadaj multi-device. VyberAI tipuje podľa hluku, layoutu a rozpočtu — nie podľa najkrajšej RGB fotky.',
    bullets: [
      'Tiché office vs mechanika — podľa miesta, kde píšeš',
      'Mac/Win a multi-device v požiadavke',
      'Preklik na Alza.sk',
    ],
    guideTips: [
      'Do open-space zvoľ tiché membránové alebo low-profile klávesnice.',
      'Mechaniky dajú lepší feeling pri písaní, ale sú hlasnejšie.',
      'Ak striedaš Mac a Windows, hľadaj Easy-Switch / multi-device.',
      'Do 100 € už nájdeš solidnú mechaniku; office classics často okolo tej istej sumy.',
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
      {
        question: 'Bezdrôtová alebo káblová?',
        answer:
          'Bezdrôtová na čistý stôl a notebook; káblová na gaming bez latencie a nabíjania. Povedz preferenciu.',
      },
      {
        question: 'Akú klávesnicu k notebooku na home office?',
        answer:
          'Externá tichá klávesnica + monitor výrazne zvýši komfort. Pozri aj Monitory a Myši.',
      },
    ],
    chatPrompt: 'Tichá bezdrôtová klávesnica na home office',
    suggestions: [
      'Tichá bezdrôtová klávesnica na home office',
      'Mechanická klávesnica do 100 €',
      'Klávesnica pre Mac',
    ],
    relatedSlugs: ['mysi', 'monitory', 'notebooky'],
  },
  {
    slug: 'mysi',
    category: 'mys',
    title: 'Myši',
    headline: 'Myš na office alebo gaming',
    lede:
      'Ergonómia, senzor, rozpočet — VyberAI navrhne krátky výber z katalógu.',
    metaDescription:
      'Ergonomická office myš do 100 € alebo herná myš. AI tipy VyberAI podľa rozpočtu a použitia — Alza.sk.',
    body: 'Na celodennú prácu rozhoduje tvar a tiché kliky; herná myš senzor a tlačidlá. Multi-device Bluetooth ušetrí prepínanie medzi notebookom a PC. VyberAI vyberie 1–3 tipy podľa office/gaming a stropu ceny.',
    bullets: [
      'Office classic aj herné myši podľa použitia',
      'Porovnanie ceny, váhy a dôvodov v chate',
      'Affiliate odkaz na Alza.sk',
    ],
    guideTips: [
      'Na celodennú prácu zvoľ ergonomický tvar a tiché kliky.',
      'Herná myš pridá tlačidlá a senzor — zváž váhu podľa FPS/MMO.',
      'Multi-device Bluetooth ušetrí prepínanie medzi notebookom a PC.',
      'Vysoké DPI na bežnú prácu nepotrebuješ — dôležitejší je spoľahlivý senzor.',
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
      {
        question: 'Vertikálna myš — oplatí sa?',
        answer:
          'Ak ťa bolí zápästie pri klasickej myši, áno. Napíš „ergonomická / vertikálna“ do chatu.',
      },
      {
        question: 'Myš k notebooku a PC naraz?',
        answer:
          'Hľadaj Easy-Switch / multi-device. Spáruješ dve–tri zariadenia bez prehadzovania donglu.',
      },
    ],
    chatPrompt: 'Ergonomická myš na home office do 100 €',
    suggestions: [
      'Ergonomická myš na home office do 100 €',
      'Herná myš do 80 €',
      'Bezdrôtová myš Logitech',
    ],
    relatedSlugs: ['klavesnice', 'notebooky', 'monitory'],
  },
  {
    slug: 'ssd',
    category: 'ssd',
    title: 'SSD disky',
    headline: 'SSD upgrade notebooku alebo externý disk',
    lede:
      'NVMe aj prenosné SSD — napíš kapacitu a použitie, dostaneš tipy s dôvodom.',
    metaDescription:
      'NVMe 1 TB upgrade notebooku alebo externý SSD na cestovanie. VyberAI poradí kapacitu a rýchlosť — Alza.sk.',
    body: 'Interný NVMe M.2 zrýchli boot a hry; externý SSD je lepší na cestovanie než HDD. 1 TB je sweet spot pre väčšinu upgradeov. VyberAI tipuje podľa kapacity, PCIe generácie a rozpočtu z ukážkového katalógu.',
    bullets: [
      'Interné NVMe aj externé SSD podľa scenára',
      'Tipy podľa kapacity, rýchlosti a ceny',
      'Odkaz na Alza.sk',
    ],
    guideTips: [
      'Interný NVMe M.2 výrazne zrýchli starší notebook (boot, hry, súbory).',
      'Externý SSD je lepší na cestovanie než klasický HDD.',
      '1 TB je sweet spot pre väčšinu upgradeov; 2 TB ak striháš video.',
      'Pred kúpou over, či notebook má voľný M.2 slot a podporuje PCIe 4.0.',
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
      {
        question: 'SSD do PlayStation 5 — čo overiť?',
        answer:
          'Kompatibilný NVMe s dostatočnou rýchlosťou podľa špecifikácie Sony. Spomeň PS5 v požiadavke.',
      },
      {
        question: 'Externý SSD na cestovanie do 150 €?',
        answer:
          '1 TB USB-C disky v tejto triede sú bežné. Napíš kapacitu a strop ceny do chatu.',
      },
    ],
    chatPrompt: 'Rýchly NVMe SSD 1 TB do 130 €',
    suggestions: [
      'Rýchly NVMe SSD 1 TB do 130 €',
      'Externý SSD na cestovanie',
      'SSD upgrade notebooku',
    ],
    relatedSlugs: ['notebooky', 'konzoly', 'televizory'],
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
    body: 'OLED vyhráva kontrast v tme; QLED jas cez deň; budget smart TV cenu. 55" je sweet spot do bežnej obývačky; na hry over HDMI 2.1 a VRR. VyberAI navrhne 1–3 tipy podľa veľkosti, technológie a rozpočtu.',
    bullets: [
      'OLED, QLED a budget tipy podľa miestnosti',
      'Porovnanie veľkosti a herných vstupov v chate',
      'Affiliate partner Alza.sk',
    ],
    guideTips: [
      'OLED vyhráva kontrast a filmy v tme; QLED jas v dennom svetle.',
      '55" je sweet spot do bežnej obývačky; pri väčšej vzdialenosti zváž 65".',
      'Na hry over HDMI 2.1, VRR a ALLM.',
      'Smart platforma (webOS, Tizen, Google TV) rozhoduje o appkách a ovládaní.',
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
      {
        question: 'Lacný smart TV do 500 € — na čo stačí?',
        answer:
          'Na Netflix, YouTube a bežné vysielanie áno. Na filmy v tme a hry je lepší vyšší model — napíš priority.',
      },
      {
        question: 'Akú uhlopriečku do 3 m vzdialenosti?',
        answer:
          'Okolo 55–65". Pri menšej vzdialenosti stačí 43–50". Spomeň vzdialenosť v chate.',
      },
    ],
    chatPrompt: 'Televízor 55" do 800 €',
    suggestions: [
      'Televízor 55" do 800 €',
      'OLED TV na filmy',
      'Lacný smart TV do 500 €',
    ],
    relatedSlugs: ['konzoly', 'sluchadla', 'ssd'],
  },
  {
    slug: 'konzoly',
    category: 'herna-konzola',
    title: 'Herné konzoly',
    headline: 'PS5, Switch a konzoly podľa štýlu hrania',
    lede:
      'Domáca alebo prenosná konzola — napíš preferencie a rozpočet.',
    metaDescription:
      'PS5, Switch OLED alebo prenosná konzola. VyberAI pomôže podľa knižnice hier a rozpočtu — affiliate Alza.sk.',
    body: 'PS5 je 4K domáce hranie a Sony exkluzivity; Switch OLED prenosnosť a rodinné hry. Disc verzia je flexibilnejšia na bazár; digital lacnejšia pri čisto digitálnych nákupoch. VyberAI tipuje podľa toho, kde hráš a koľko chceš minúť.',
    bullets: [
      'PlayStation, Nintendo a prenosné tipy',
      'Krátke porovnanie knižnice a ceny v chate',
      'Preklik na Alza.sk',
    ],
    guideTips: [
      'PS5 = 4K domáce hranie a Sony exkluzivity.',
      'Switch OLED = prenosnosť a rodinné / Nintendo hry.',
      'Over, či chceš diskovú verziu alebo digitál + kapacitu úložiska.',
      'K TV s HDMI 2.1 / VRR využiješ herný výkon PS5 naplno — pozri Televízory.',
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
      {
        question: 'Potrebujem extra SSD ku PS5?',
        answer:
          'Ak inštaluješ veľa hier, áno — kompatibilný NVMe. Pozri aj kategóriu SSD.',
      },
      {
        question: 'Stačí Switch na dospelé AAA hry?',
        answer:
          'Na Nintendo knižnicu áno; na najnovšie multiplatformové AAA je PS5 / PC silnejší. Povedz, aké hry ťahajú.',
      },
    ],
    chatPrompt: 'PlayStation 5 alebo Switch do 450 €',
    suggestions: [
      'PlayStation 5 Slim',
      'Nintendo Switch OLED',
      'Konzola na cestovanie do 350 €',
    ],
    relatedSlugs: ['televizory', 'sluchadla', 'ssd'],
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

export function relatedLandings(
  landing: CategoryLanding,
): CategoryLanding[] {
  return landing.relatedSlugs
    .map((slug) => getLandingBySlug(slug))
    .filter((l): l is CategoryLanding => Boolean(l))
}
