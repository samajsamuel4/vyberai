import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { CATEGORY_LANDINGS, getLandingBySlug } from '../data/landings'
import { trackPageView } from '../lib/tracking'

export function CategoryPage() {
  const { slug = '' } = useParams()
  const landing = getLandingBySlug(slug)

  useEffect(() => {
    if (!landing) return
    document.title = `${landing.title} — VyberAI tipy | Alza.sk`
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', landing.lede)
    trackPageView(`/${landing.slug}`)
  }, [landing])

  if (!landing) return <Navigate to="/" replace />

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
          <Link
            className="cta-primary"
            to={`/?q=${encodeURIComponent(landing.chatPrompt)}`}
          >
            Spýtať sa VyberAI
          </Link>
          <Link className="cta-ghost" to="/">
            Späť na domov
          </Link>
        </div>

        <ul className="landing-bullets">
          {landing.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>

        <div className="landing-prompts">
          <p className="landing-prompts-title">Rýchle štarty</p>
          <div className="suggestions landing-chips">
            {landing.suggestions.map((s) => (
              <Link
                key={s}
                className="chip chip-link"
                to={`/?q=${encodeURIComponent(s)}`}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </main>

      <nav className="landing-nav" aria-label="Ďalšie kategórie">
        <p className="landing-nav-title">Ďalšie kategórie</p>
        <ul className="category-grid">
          {CATEGORY_LANDINGS.filter((l) => l.slug !== landing.slug).map((l) => (
            <li key={l.slug}>
              <Link className="category-link" to={`/${l.slug}`}>
                {l.title}
              </Link>
            </li>
          ))}
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
