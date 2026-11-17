import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CATEGORY_LABELS } from '../data/catalog'
import { CATEGORY_LANDINGS } from '../data/landings'
import {
  SUGGESTIONS,
  createGreeting,
  respondToUser,
  type ChatMessage,
} from '../lib/chat'
import { ProductCompare } from '../components/ProductCompare'
import {
  trackAffiliateClick,
  trackChatStart,
  trackPageView,
  trackRecommendationsShown,
} from '../lib/tracking'

function formatPrice(eur: number): string {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(eur)
}

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [messages, setMessages] = useState<ChatMessage[]>([createGreeting()])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [affiliateConfigured, setAffiliateConfigured] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const chatRef = useRef<HTMLElement | null>(null)
  const bootstrapped = useRef(false)
  const chatStarted = useRef(false)

  useEffect(() => {
    document.title = 'VyberAI — AI výber produktov'
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
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, chatOpen, busy])

  useEffect(() => {
    if (!chatOpen) return
    inputRef.current?.focus()
    chatRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [chatOpen])

  function markChatStart(source: 'cta' | 'composer' | 'suggestion' | 'landing') {
    if (chatStarted.current) return
    chatStarted.current = true
    trackChatStart(source)
  }

  async function send(
    text: string,
    source: 'composer' | 'suggestion' | 'landing' = 'composer',
  ) {
    const trimmed = text.trim()
    if (!trimmed || busy) return

    markChatStart(source)
    setChatOpen(true)
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    }
    const prior = messages
    setMessages((m) => [...m, userMsg])
    setInput('')
    setBusy(true)
    try {
      const reply = await respondToUser(trimmed, prior)
      setMessages((m) => [...m, reply])
      if (reply.recommendations?.length) {
        trackRecommendationsShown(reply.recommendations.map((r) => r.product.id))
      }
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    if (bootstrapped.current) return
    const q = searchParams.get('q')?.trim()
    if (!q) return
    bootstrapped.current = true
    setSearchParams({}, { replace: true })
    void send(q, 'landing')
    // eslint-disable-next-line react-hooks/exhaustive-deps -- bootstrap once from landing deep-link
  }, [searchParams, setSearchParams])

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    void send(input, 'composer')
  }

  function openChat() {
    markChatStart('cta')
    setChatOpen(true)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  return (
    <div className="page">
      <div className="atmosphere atmosphere-mock" aria-hidden="true">
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

      <main id="top" className={`hero hero-landing ${chatOpen ? 'chat-active' : ''}`}>
        <div className="hero-copy">
          <p className="brand-hero">VyberAI</p>
          <h1 className="headline">Povedz, čo potrebuješ.</h1>
          <p className="lede">
            Presné odpovede. Z relevantných zdrojov. Na slovensky.
          </p>
          <div className="cta-row">
            <button type="button" className="cta-primary" onClick={openChat}>
              Spustiť chat
            </button>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <img
            className="hero-devices"
            src="/hero-devices.jpg"
            alt=""
            width={960}
            height={540}
            decoding="async"
          />
        </div>
      </main>

      <section
        ref={chatRef}
        id="chat"
        className={`chat-panel chat-panel-block ${chatOpen ? 'is-open' : ''}`}
        aria-label="Odporúčací chat"
        hidden={!chatOpen}
      >
          <div className="chat-head">
            <div>
              <p className="chat-title">Asistent výberu</p>
              <p className="chat-sub">Napíš rozpočet, použitie alebo značku</p>
            </div>
            <span className="status-pill" aria-hidden="true">
              <span className="live-dot" />
              Online
            </span>
          </div>

          <div className="chat-messages" ref={listRef} role="log" aria-live="polite">
            {messages.map((msg) => (
              <article key={msg.id} className={`bubble bubble-${msg.role}`}>
                <p>{msg.text}</p>
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <>
                    <ol className="rec-list">
                      {msg.recommendations.map((rec, index) => (
                        <li key={rec.product.id} className="rec-item">
                          <div className="rec-rank" aria-hidden="true">
                            {index + 1}
                          </div>
                          <div className="rec-body">
                            <div className="rec-meta">
                              <span className="rec-cat">
                                {CATEGORY_LABELS[rec.product.category]}
                                <span className="rec-brand"> · {rec.product.brand}</span>
                              </span>
                              <strong className="rec-name">{rec.product.name}</strong>
                              <span className="rec-price">
                                {formatPrice(rec.product.priceEur)}
                              </span>
                              <p className="rec-reason">{rec.reason}</p>
                              <p className="rec-desc">{rec.product.description}</p>
                              <ul className="rec-specs">
                                {rec.product.specs.slice(0, 4).map((s) => (
                                  <li key={s}>{s}</li>
                                ))}
                              </ul>
                            </div>
                            <a
                              className="rec-cta"
                              href={rec.affiliateUrl}
                              target="_blank"
                              rel="noopener noreferrer sponsored"
                              onClick={() =>
                                trackAffiliateClick({
                                  productId: rec.product.id,
                                  productName: rec.product.name,
                                  category: rec.product.category,
                                  priceEur: rec.product.priceEur,
                                  affiliateUrl: rec.affiliateUrl,
                                  rank: index + 1,
                                })
                              }
                            >
                              <span>Pozrieť na Alza.sk</span>
                              <span className="rec-aff">affiliate</span>
                            </a>
                          </div>
                        </li>
                      ))}
                    </ol>
                    <ProductCompare recommendations={msg.recommendations} />
                  </>
                )}
                {msg.sampleNote && <p className="sample-note">{msg.sampleNote}</p>}
              </article>
            ))}
            {busy && (
              <p className="typing" aria-label="Hľadám tipy">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </p>
            )}
          </div>

          <div className="suggestions" aria-label="Rýchle tipy">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={s}
                type="button"
                className="chip"
                style={{ animationDelay: `${0.05 * i}s` }}
                disabled={busy}
                onClick={() => void send(s, 'suggestion')}
              >
                {s}
              </button>
            ))}
          </div>

          <form className="composer" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="chat-input">
              Tvoja požiadavka
            </label>
            <textarea
              id="chat-input"
              ref={inputRef}
              rows={2}
              value={input}
              placeholder="Napr. notebook do 800 € na školu…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void send(input)
                }
              }}
            />
            <button type="submit" className="send" disabled={busy || !input.trim()}>
              Poslať
            </button>
          </form>
      </section>

      <section id="o-nas" className="how">
        <h2>O nás</h2>
        <p>
          VyberAI je slovenský asistent výberu elektroniky. Napíšeš, čo hľadáš —
          dostaneš 1–3 tipy podľa parametrov, porovnanie a odkaz na Alza.sk.
          Cena pre teba ostáva rovnaká.
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
          SEO landingy s predvyplneným chatom — klikni a hneď dostaneš tipy.
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
