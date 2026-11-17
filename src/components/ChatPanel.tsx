import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CATEGORY_LABELS } from '../data/catalog'
import {
  SUGGESTIONS,
  createGreeting,
  respondToUser,
  type ChatMessage,
} from '../lib/chat'
import type { Recommendation } from '../lib/recommend'
import {
  trackAffiliateClick,
  trackChatStart,
  trackRecommendationsShown,
  trackShareClick,
} from '../lib/tracking'
import { SITE_ORIGIN } from '../lib/seo'
import { ProductCompare } from './ProductCompare'

function formatPrice(eur: number): string {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(eur)
}

function buildShareUrl(basePath: string, query: string): string {
  const path = basePath.startsWith('/') ? basePath : `/${basePath}`
  const url = new URL(path || '/', SITE_ORIGIN)
  url.searchParams.set('q', query)
  return url.toString()
}

function followUpChips(
  lastQuery: string,
  recs: Recommendation[],
): string[] {
  if (!recs.length) return []
  const max = Math.max(...recs.map((r) => r.product.priceEur))
  const brand = recs[0]?.product.brand
  const chips = [
    `Lacnejšie než ${max} €`,
    brand ? `Iná značka než ${brand}` : 'Iná značka',
  ]
  if (/notebook|herný|gaming/i.test(lastQuery)) {
    chips.push('Skôr na školu / office')
  } else if (/slúchad|anc/i.test(lastQuery)) {
    chips.push('Bez ANC, lacnejšie')
  } else {
    chips.push('Podobné s iným rozpočtom')
  }
  return chips.slice(0, 3)
}

export type ChatPanelProps = {
  suggestions?: string[]
  /** Path used in share links, e.g. "/" or "/notebooky" */
  shareBasePath?: string
  /** External send request (landing deep-link / CTA / chips) */
  autoSend?: { key: number; text: string } | null
  onAutoSendConsumed?: () => void
  className?: string
  /** Start with panel accent open */
  initiallyOpen?: boolean
  /** Increment to focus/open the panel from a parent CTA */
  focusToken?: number
}

export function ChatPanel({
  suggestions = SUGGESTIONS,
  shareBasePath = '/',
  autoSend = null,
  onAutoSendConsumed,
  className = '',
  initiallyOpen = false,
  focusToken = 0,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([createGreeting()])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [chatOpen, setChatOpen] = useState(initiallyOpen)
  const [shareStatus, setShareStatus] = useState<string | null>(null)
  const [lastUserQuery, setLastUserQuery] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const panelRef = useRef<HTMLElement | null>(null)
  const chatStarted = useRef(false)
  const lastAutoKey = useRef(0)

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, chatOpen, busy])

  useEffect(() => {
    if (!chatOpen) return
    inputRef.current?.focus()
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [chatOpen])

  useEffect(() => {
    if (!focusToken) return
    markChatStart('cta')
    setChatOpen(true)
    requestAnimationFrame(() => inputRef.current?.focus())
    // eslint-disable-next-line react-hooks/exhaustive-deps -- token-driven open only
  }, [focusToken])

  function markChatStart(
    source: 'cta' | 'composer' | 'suggestion' | 'landing',
  ) {
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
    setShareStatus(null)
    setLastUserQuery(trimmed)
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
        trackRecommendationsShown(
          reply.recommendations.map((r) => r.product.id),
        )
      }
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    if (!autoSend) return
    const q = autoSend.text.trim()
    if (!q || autoSend.key === lastAutoKey.current) return
    lastAutoKey.current = autoSend.key
    onAutoSendConsumed?.()
    void send(q, 'landing')
    // eslint-disable-next-line react-hooks/exhaustive-deps -- key-driven bootstrap
  }, [autoSend])

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    void send(input, 'composer')
  }

  function openChat() {
    markChatStart('cta')
    setChatOpen(true)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  async function shareRecommendations(query: string) {
    const url = buildShareUrl(shareBasePath, query)
    trackShareClick(shareBasePath)
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: 'VyberAI tipy',
          text: `Pozri tipy na: ${query}`,
          url,
        })
        setShareStatus('Odkaz odoslaný')
        return
      }
    } catch {
      /* user cancelled or share failed — fall through to clipboard */
    }
    try {
      await navigator.clipboard.writeText(url)
      setShareStatus('Odkaz skopírovaný')
    } catch {
      setShareStatus(url)
    }
  }

  const lastRecs = [...messages]
    .reverse()
    .find((m) => m.recommendations && m.recommendations.length > 0)
  const followUps =
    lastRecs?.recommendations && lastUserQuery
      ? followUpChips(lastUserQuery, lastRecs.recommendations)
      : []

  return (
    <section
      ref={panelRef}
      className={`chat-panel ${chatOpen ? 'is-open' : ''} ${className}`.trim()}
      aria-label="Odporúčací chat"
      data-chat-panel
    >
      <div className="chat-head">
        <div>
          <p className="chat-title">Asistent výberu</p>
          <p className="chat-sub">Napíš rozpočet, použitie alebo značku</p>
        </div>
        <div className="chat-head-actions">
          {!chatOpen && (
            <button type="button" className="chat-open-btn" onClick={openChat}>
              Spustiť
            </button>
          )}
          <span className="status-pill" aria-hidden="true">
            <span className="live-dot" />
            Online
          </span>
        </div>
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
                            <span className="rec-brand">
                              {' '}
                              · {rec.product.brand}
                            </span>
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
                {msg === lastRecs && lastUserQuery && (
                  <div className="share-row">
                    <button
                      type="button"
                      className="share-btn"
                      onClick={() => void shareRecommendations(lastUserQuery)}
                    >
                      Zdieľať tipy
                    </button>
                    {shareStatus && (
                      <span className="share-status" role="status">
                        {shareStatus}
                      </span>
                    )}
                  </div>
                )}
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

      {followUps.length > 0 && !busy && (
        <div className="suggestions follow-ups" aria-label="Upraviť tipy">
          {followUps.map((s, i) => (
            <button
              key={s}
              type="button"
              className="chip chip-follow"
              style={{ animationDelay: `${0.05 * i}s` }}
              disabled={busy}
              onClick={() => void send(s, 'suggestion')}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="suggestions" aria-label="Rýchle tipy">
        {suggestions.map((s, i) => (
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
  )
}
