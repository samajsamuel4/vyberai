import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CATEGORY_LABELS } from './data/catalog'
import {
  SUGGESTIONS,
  createGreeting,
  respondToUser,
  type ChatMessage,
} from './lib/chat'
import { ProductCompare } from './components/ProductCompare'
import { isAffiliateConfigured } from './lib/affiliate'
import { trackAffiliateClick } from './lib/tracking'
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
  const chatRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, chatOpen, busy])

  useEffect(() => {
    if (!chatOpen) return
    inputRef.current?.focus()
    chatRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
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

  function openChat() {
    setChatOpen(true)
    requestAnimationFrame(() => inputRef.current?.focus())
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
        <a className="brand-mark" href="#top" aria-label="VyberAI domov">
          <span className="brand-mark-icon" aria-hidden="true" />
          VyberAI
        </a>
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
            Slovenský asistent výberu elektroniky — 1 až 3 tipy, porovnanie
            vedľa seba a priamy odkaz na Alza.sk.
          </p>
          <div className="cta-row">
            <button type="button" className="cta-primary" onClick={openChat}>
              Spustiť chat
            </button>
            <a className="cta-ghost" href="#ako">
              Ako to funguje
            </a>
          </div>
        </div>

        <section
          ref={chatRef}
          className={`chat-panel ${chatOpen ? 'is-open' : ''}`}
          aria-label="Odporúčací chat"
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
        <h2>Tri kroky k tipu</h2>
        <p>
          Napíšeš, čo hľadáš. VyberAI vyberie 1–3 produkty, ukáže porovnanie
          vedľa seba a pošle ťa na Alza.sk cez affiliate odkaz — cena pre teba
          ostáva rovnaká.
        </p>
      </section>

      <footer className="footer">
        <p>
          VyberAI je affiliate partner Alza.sk. Za nákup cez naše odkazy môžeme
          dostať províziu — cena pre teba ostáva rovnaká.
        </p>
        <p className="footer-muted">
          Ukážkový katalóg · MVP
          {!isAffiliateConfigured() ? ' · affiliate ID ešte nie je nastavené' : ''}
        </p>
      </footer>
    </div>
  )
}
