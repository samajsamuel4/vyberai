# VyberAI

Slovenská MVP stránka s AI chatom, ktorý odporúča elektroniku a posiela návštevníka na Alza.sk cez affiliate odkaz.

## Funkcie

- Landing + chat (nie dashboard)
- LLM chat cez `/api/chat`, keď je nastavený `OPENAI_API_KEY` (server-only secret)
- Bez kľúča: rule-based odporúčania z mock katalógu (1–3 produkty)
- Affiliate odkazy s placeholder `AFFILIATE_ID` (`src/lib/affiliate.ts`)
- Slovenčina, mobile + desktop

## Spustenie

```bash
npm install
npm run dev
```

Dev server: http://127.0.0.1:5173

## Secrets (publikovaná app)

V Cursor Apps dashboard / cez `bind-app-secrets` nastav `OPENAI_API_KEY`. Hodnotu do chatu ani do `.env` na VM nedávaj — secret ide len do publikovanej appky. Bez kľúča ostáva mock katalóg.

## Affiliate ID

V `src/lib/affiliate.ts` zmeň konštantu `AFFILIATE_ID` na reálne Alza Partner ID.
