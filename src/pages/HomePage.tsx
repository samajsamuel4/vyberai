import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChatPanel } from '../components/ChatPanel'
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
      <div className="atmosphere" aria-hidden="true">
        <div className="glow glow-a" />
        <div className="glow glow-b" />
        <div className="mesh" />
        <div className="grain" />
      </div>

      <header className="topbar">
        <Link className="brand-mark" to="/" aria-label="VyberAI domov">
          <span className="brand-mark-icon" aria-hidden="true" />
          VyberAI
        </Link>
        <p className="affiliate-note">Affiliate partner Alza.sk</p>
      </header>

      <main id="top" className="hero">
        <div className="hero-copy">
          <p className="brand-hero">VyberAI</p>
          <h1 className="headline">
            Povedz, čo potrebuješ.
            <span className="headline-soft"> Dostaneš jasný tip.</span>
          </h1>
          <p className="lede">
            Slovenský asistent výberu elektroniky — 1 až 3 tipy podľa reálnych
            parametrov, porovnanie vedľa seba a odkaz na Alza.sk.
          </p>
          <div className="cta-row">
            <button
              type="button"
              className="cta-primary"
              onClick={() => setFocusToken((n) => n + 1)}
            >
              Spustiť chat
            </button>
            <a className="cta-ghost" href="#ako">
              Ako to funguje
            </a>
          </div>
        </div>

        <ChatPanel
          shareBasePath="/"
          autoSend={autoSend}
          onAutoSendConsumed={() => setAutoSend(null)}
          focusToken={focusToken}
        />
      </main>

      <section id="ako" className="how">
        <h2>Tri kroky k tipu</h2>
        <p>
          Napíšeš, čo hľadáš. VyberAI vyberie 1–3 produkty podľa parametrov a
          opisu, ukáže porovnanie a pošle ťa na Alza.sk — cena pre teba ostáva
          rovnaká. Tip vieš aj zdieľať odkazom kamarátovi.
        </p>
      </section>

      <section className="categories" aria-label="Kategórie">
        <h2>Kategórie</h2>
        <p className="categories-lede">
          Landing stránky s chatom priamo v kategórii — klikni a hneď dostaneš
          tipy.
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
