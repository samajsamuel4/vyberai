import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { ChatPanel } from '../components/ChatPanel'
import { CATALOG, CATEGORY_LABELS } from '../data/catalog'
import { CATEGORY_LANDINGS, getLandingBySlug } from '../data/landings'
import { applyFaqJsonLd, applyPageMeta, clearFaqJsonLd } from '../lib/seo'
import { trackPageView } from '../lib/tracking'

function formatPrice(eur: number): string {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(eur)
}

export function CategoryPage() {
  const { slug = '' } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const landing = getLandingBySlug(slug)
  const [focusToken, setFocusToken] = useState(0)
  const [autoSend, setAutoSend] = useState<{
    key: number
    text: string
  } | null>(null)

  const samples = useMemo(() => {
    if (!landing) return []
    return CATALOG.filter((p) => p.category === landing.category)
      .slice()
      .sort((a, b) => a.priceEur - b.priceEur)
      .slice(0, 3)
  }, [landing])

  useEffect(() => {
    if (!landing) return
    const path = `/${landing.slug}`
    applyPageMeta({
      title: `${landing.title} — VyberAI tipy | Alza.sk`,
      description: landing.metaDescription,
      path,
    })
    applyFaqJsonLd(path, landing.faq)
    trackPageView(path)
    return () => clearFaqJsonLd()
  }, [landing])

  useEffect(() => {
    if (!landing) return
    const q = searchParams.get('q')?.trim()
    if (!q) return
    setAutoSend({ key: Date.now(), text: q })
    setSearchParams({}, { replace: true })
  }, [landing, searchParams, setSearchParams])

  if (!landing) return <Navigate to="/" replace />

  function startWithPrompt(prompt: string) {
    setAutoSend({ key: Date.now(), text: prompt })
    setFocusToken((n) => n + 1)
  }

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

      <main className="landing">
        <p className="landing-brand">VyberAI</p>
        <p className="landing-kicker">{landing.title}</p>
        <h1 className="landing-headline">{landing.headline}</h1>
        <p className="landing-lede">{landing.lede}</p>

        <div className="cta-row">
          <button
            type="button"
            className="cta-primary"
            onClick={() => startWithPrompt(landing.chatPrompt)}
          >
            Spýtať sa VyberAI
          </button>
          <Link className="cta-ghost" to="/">
            Späť na domov
          </Link>
        </div>

        <ul className="landing-bullets">
          {landing.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>

        <section className="landing-guide" aria-labelledby="guide-title">
          <h2 id="guide-title" className="landing-section-title">
            Na čo sa pozrieť
          </h2>
          <ul className="landing-guide-list">
            {landing.guideTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>

        {samples.length > 0 && (
          <section className="landing-samples" aria-labelledby="samples-title">
            <h2 id="samples-title" className="landing-section-title">
              Ukážky z katalógu
            </h2>
            <ul className="sample-list">
              {samples.map((p) => (
                <li key={p.id} className="sample-item">
                  <div className="sample-meta">
                    <span className="sample-cat">
                      {CATEGORY_LABELS[p.category]} · {p.brand}
                    </span>
                    <strong className="sample-name">{p.name}</strong>
                    <span className="sample-price">
                      {formatPrice(p.priceEur)}
                    </span>
                    <p className="sample-summary">{p.summary}</p>
                  </div>
                  <button
                    type="button"
                    className="sample-ask"
                    onClick={() =>
                      startWithPrompt(
                        `${p.name} alebo podobné do ${p.priceEur + 50} €`,
                      )
                    }
                  >
                    Spýtať sa na podobné
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="landing-prompts">
          <p className="landing-prompts-title">Rýchle štarty</p>
          <div className="suggestions landing-chips">
            {landing.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                className="chip"
                onClick={() => startWithPrompt(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <ChatPanel
          className="landing-chat"
          suggestions={landing.suggestions}
          shareBasePath={`/${landing.slug}`}
          autoSend={autoSend}
          onAutoSendConsumed={() => setAutoSend(null)}
          focusToken={focusToken}
          initiallyOpen={Boolean(autoSend)}
        />

        <section className="landing-faq" aria-labelledby="faq-title">
          <h2 id="faq-title" className="landing-section-title">
            Časté otázky
          </h2>
          <dl className="faq-list">
            {landing.faq.map((item) => (
              <div key={item.question} className="faq-item">
                <dt>{item.question}</dt>
                <dd>{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      <nav className="landing-nav" aria-label="Ďalšie kategórie">
        <p className="landing-nav-title">Ďalšie kategórie</p>
        <ul className="category-grid">
          {CATEGORY_LANDINGS.filter((l) => l.slug !== landing.slug).map(
            (l) => (
              <li key={l.slug}>
                <Link className="category-link" to={`/${l.slug}`}>
                  {l.title}
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>

      <footer className="footer">
        <p>
          VyberAI je affiliate partner Alza.sk. Odporúčania vychádzajú z
          ukážkového katalógu s parametrami a opismi v štýle Alza produktov.
        </p>
        <p className="footer-muted">
          <Link to="/pohyby">Pohyby</Link>
        </p>
      </footer>
    </div>
  )
}
