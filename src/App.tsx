import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CATEGORY_LABELS } from './data/catalog'
import {
  SUGGESTIONS,
  createGreeting,
  respondToUser,
  type ChatMessage,
} from './lib/chat'
import './App.css'

function formatPrice(eur: number): string {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(eur)
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([createGreeting()])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, chatOpen])

  useEffect(() => {
    if (chatOpen) inputRef.current?.focus()
  }, [chatOpen])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || busy) return

    setChatOpen(true)
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setBusy(true)
    try {
      const reply = await respondToUser(trimmed)
      setMessages((m) => [...m, reply])
    } finally {
      setBusy(false)
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    void send(input)
  }

  return (
    <div className="page">
      <div className="atmosphere" aria-hidden="true">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="grain" />
      </div>

      <header className="topbar">
        <a className="brand-mark" href="#top" aria-label="VyberAI domov">
          <span className="brand-dot" />
          VyberAI
        </a>
        <p className="affiliate-pill" title="Affiliate partner Alza.sk">
          Affiliate partner Alza.sk
        </p>
      </header>

      <main id="top" className="hero">
        <div className="hero-copy">
          <p className="brand-hero">VyberAI</p>
          <h1 className="headline">
            Povedz, čo potrebuješ.
            <span className="headline-soft"> My nájdeme tip.</span>
          </h1>
          <p className="lede">
            Slovenský chat, ktorý ti odporučí 1–3 produkty a pošle ťa priamo na Alza.sk.
          </p>
          <div className="cta-row">
            <button
              type="button"
              className="cta-primary"
              onClick={() => {
                setChatOpen(true)
                inputRef.current?.focus()
              }}
            >
              Spustiť chat
            </button>
            <a className="cta-ghost" href="#ako">
              Ako to funguje
            </a>
          </div>
        </div>

        <section
          className={`chat-panel ${chatOpen ? 'is-open' : ''}`}
          aria-label="Odporúčací chat"
        >
          <div className="chat-head">
            <div>
              <p className="chat-title">Asistent výberu</p>
              <p className="chat-sub">Mock katalóg · funguje bez API kľúča</p>
            </div>
            <span className="live-dot" aria-hidden="true" />
          </div>

          <div className="chat-messages" ref={listRef} role="log" aria-live="polite">
            {messages.map((msg) => (
              <article
                key={msg.id}
                className={`bubble bubble-${msg.role}`}
              >
                <p>{msg.text}</p>
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <ul className="rec-list">
                    {msg.recommendations.map((rec) => (
                      <li key={rec.product.id} className="rec-item">
                        <div className="rec-meta">
                          <span className="rec-cat">
                            {CATEGORY_LABELS[rec.product.category]}
                          </span>
                          <strong className="rec-name">{rec.product.name}</strong>
                          <span className="rec-price">
                            {formatPrice(rec.product.priceEur)}
                          </span>
                          <p className="rec-reason">{rec.reason}</p>
                        </div>
                        <a
                          className="rec-cta"
                          href={rec.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                        >
                          Pozrieť na Alza.sk
                          <span className="rec-aff">affiliate</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                {msg.sampleNote && (
                  <p className="sample-note">{msg.sampleNote}</p>
                )}
              </article>
            ))}
            {busy && (
              <p className="typing" aria-hidden="true">
                Hľadám tipy…
              </p>
            )}
          </div>

          <div className="suggestions">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                className="chip"
                disabled={busy}
                onClick={() => void send(s)}
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
      </main>

      <section id="ako" className="how">
        <h2>Jeden cieľ: rýchly tip, férový odkaz</h2>
        <p>
          Napíšeš, čo hľadáš. Rule-based matching vyberie z ukážkového katalógu.
          Klik ide von na Alza.sk cez affiliate odkaz s placeholder ID
          <code> AFFILIATE_ID</code> — neskôr ho len vymeníš.
        </p>
      </section>

      <footer className="footer">
        <p>
          VyberAI je affiliate partner Alza.sk. Za nákup cez naše odkazy môžeme
          dostať províziu — cena pre teba ostáva rovnaká.
        </p>
        <p className="footer-muted">Ukážkové dáta · MVP</p>
      </footer>
    </div>
  )
}
