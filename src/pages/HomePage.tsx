import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChatPanel } from '../components/ChatPanel'
import { HeroStage } from '../components/HeroStage'
import { CATEGORY_LANDINGS } from '../data/landings'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  applyHomeJsonLd,
  applyPageMeta,
  clearFaqJsonLd,
} from '../lib/seo'
import { trackPageView } from '../lib/tracking'

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [affiliateConfigured, setAffiliateConfigured] = useState(false)
  const [focusToken, setFocusToken] = useState(0)
  const [autoSend, setAutoSend] = useState<{
    key: number
    text: string
  } | null>(null)

  useEffect(() => {
    applyPageMeta({
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      path: '/',
    })
    applyHomeJsonLd()
    clearFaqJsonLd()
    trackPageView('/')
    void fetch('/api/status')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { affiliateConfigured?: boolean } | null) => {
        if (data?.affiliateConfigured) setAffiliateConfigured(true)
      })
      .catch(() => {
        /* offline / no API */
      })
  }, [])

  useEffect(() => {
    const q = searchParams.get('q')?.trim()
    if (!q) return
    setAutoSend({ key: Date.now(), text: q })
    setSearchParams({}, { replace: true })
  }, [searchParams, setSearchParams])

  return (
    <div className="page">
      <div className="atmosphere atmosphere-mock" aria-hidden="true">
        <div className="atmosphere-orb atmosphere-orb-a" />
        <div className="atmosphere-orb atmosphere-orb-b" />
        <div className="grain" />
      </div>

      <header className="topbar">
        <Link className="brand-mark brand-mark-logo" to="/" aria-label="VyberAI domov">
          <svg className="brand-v" viewBox="0 0 32 28" aria-hidden="true">
            <path
              d="M2 2 L16 26 L30 2 L22.5 2 L16 14.5 L9.5 2 Z"
              fill="currentColor"
            />
          </svg>
        </Link>
        <nav className="topnav" aria-label="Hlavná navigácia">
          <a href="#o-nas">O nás</a>
          <a href="#technologie">Technológie</a>
          <a href="#bezpecnost">Bezpečnosť</a>
          <span className="lang-pill" title="Slovenčina">
            SK
            <span aria-hidden="true"> ▾</span>
          </span>
        </nav>
      </header>

      <main id="top" className="hero hero-landing">
        <div className="hero-copy">
          <p className="brand-hero">VyberAI</p>
          <h1 className="headline">Povedz, čo potrebuješ.</h1>
          <p className="lede">
            Presné odpovede. Z relevantných zdrojov. Na slovensky.
          </p>
          <div className="cta-row">
            <button
              type="button"
              className="cta-primary"
              onClick={() => setFocusToken((n) => n + 1)}
            >
              Spustiť chat
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <HeroStage />
        </div>
      </main>

      <ChatPanel
        shareBasePath="/"
        autoSend={autoSend}
        onAutoSendConsumed={() => setAutoSend(null)}
        focusToken={focusToken}
        hideWhenClosed
        className="chat-panel-block"
      />

      <section id="o-nas" className="how">
        <h2>O nás</h2>
        <p>
          VyberAI je slovenský asistent výberu elektroniky. Napíšeš, čo hľadáš —
          dostaneš 1–3 tipy podľa parametrov, porovnanie a odkaz na Alza.sk.
          Cena pre teba ostáva rovnaká. Tip vieš aj zdieľať odkazom kamarátovi.
        </p>
      </section>

      <section id="technologie" className="how how-tight">
        <h2>Technológie</h2>
        <p>
          Matching cez katalóg parametrov a špecifikácií; pri dostupnom kľúči
          aj LLM. Odporúčania sú viazané na ukážkový Alza-štýl feed — nie náhodný
          výber.
        </p>
      </section>

      <section id="bezpecnost" className="how how-tight">
        <h2>Bezpečnosť</h2>
        <p>
          Bez Google Fonts CDN, affiliate ID len na serveri, rate-limit a limit
          veľkosti požiadavky na chat API. Lokálne pohyby bez PII.
        </p>
      </section>

      <section className="categories" aria-label="Kategórie">
        <h2>Kategórie</h2>
        <p className="categories-lede">
          SEO landings s návodom, FAQ a chatom — notebooky, telefóny, slúchadlá
          a ďalšie. Klikni na kategóriu a hneď dostaneš tipy podľa rozpočtu.
        </p>
        <ul className="category-grid">
          {CATEGORY_LANDINGS.map((l) => (
            <li key={l.slug}>
              <Link className="category-link" to={`/${l.slug}`}>
                {l.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <footer className="footer">
        <p>
          VyberAI je affiliate partner Alza.sk. Za nákup cez naše odkazy môžeme
          dostať províziu — cena pre teba ostáva rovnaká.
        </p>
        <p className="footer-muted">
          Ukážkový Alza-štýl katalóg · MVP
          {!affiliateConfigured ? ' · affiliate ID neskôr' : ''}
          {' · '}
          <Link to="/pohyby">Pohyby</Link>
        </p>
      </footer>
    </div>
  )
}
