import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  clearAnalytics,
  getAnalyticsSummary,
  trackPageView,
  type AnalyticsEvent,
  type AnalyticsSummary,
} from '../lib/tracking'

function labelFor(e: AnalyticsEvent): string {
  switch (e.type) {
    case 'page_view':
      return `Zobrazenie ${e.path}`
    case 'chat_start':
      return `Štart chatu (${e.source})`
    case 'recommendations_shown':
      return `Tipy zobrazené (${e.count})`
    case 'outbound_click':
      return `Odchod na Alza · ${e.productId}`
  }
}

function formatWhen(iso: string): string {
  try {
    return new Intl.DateTimeFormat('sk-SK', {
      dateStyle: 'short',
      timeStyle: 'medium',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function MovementsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary>(() => getAnalyticsSummary())

  useEffect(() => {
    document.title = 'Pohyby — VyberAI'
    trackPageView('/pohyby')
  }, [])

  useEffect(() => {
    const refresh = () => setSummary(getAnalyticsSummary())
    window.addEventListener('vyberai:analytics', refresh)
    window.addEventListener('vyberai:analytics-cleared', refresh)
    return () => {
      window.removeEventListener('vyberai:analytics', refresh)
      window.removeEventListener('vyberai:analytics-cleared', refresh)
    }
  }, [])

  function onClear() {
    clearAnalytics()
    setSummary(getAnalyticsSummary())
  }

  const paths = Object.entries(summary.byPath).sort((a, b) => b[1] - a[1])

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
        <p className="affiliate-note">Lokálne pohyby</p>
      </header>

      <main className="movements">
        <p className="landing-brand">VyberAI</p>
        <h1 className="landing-headline">Pohyby na stránke</h1>
        <p className="landing-lede">
          Jednoduchá analytika v tomto prehliadači — bez cookies tretích strán,
          bez textu chatu a bez osobných údajov. Len ty vidíš tieto čísla.
        </p>

        <ul className="movements-stats" aria-label="Súhrn">
          <li>
            <strong>{summary.pageViews}</strong>
            <span>zobrazenia</span>
          </li>
          <li>
            <strong>{summary.chatStarts}</strong>
            <span>štarty chatu</span>
          </li>
          <li>
            <strong>{summary.recommendationsShown}</strong>
            <span>zobrazené tipy</span>
          </li>
          <li>
            <strong>{summary.outboundClicks}</strong>
            <span>odchody na Alza</span>
          </li>
        </ul>

        {paths.length > 0 && (
          <section className="movements-section" aria-label="Cesty">
            <h2>Podľa cesty</h2>
            <ul className="movements-paths">
              {paths.map(([path, count]) => (
                <li key={path}>
                  <code>{path}</code>
                  <span>{count}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="movements-section" aria-label="Nedávne">
          <div className="movements-section-head">
            <h2>Nedávne udalosti</h2>
            <button type="button" className="cta-ghost movements-clear" onClick={onClear}>
              Vymazať
            </button>
          </div>
          {summary.recent.length === 0 ? (
            <p className="movements-empty">Zatiaľ žiadne pohyby. Prejdi domov alebo do kategórie.</p>
          ) : (
            <ol className="movements-list">
              {summary.recent.map((e, i) => (
                <li key={`${e.at}-${e.type}-${i}`}>
                  <span className="movements-when">{formatWhen(e.at)}</span>
                  <span className="movements-label">{labelFor(e)}</span>
                </li>
              ))}
            </ol>
          )}
        </section>

        <div className="cta-row">
          <Link className="cta-primary" to="/">
            Späť na domov
          </Link>
        </div>
      </main>
    </div>
  )
}
