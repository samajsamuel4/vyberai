# VyberAI

Slovenská MVP stránka s AI chatom, ktorý odporúča elektroniku a posiela návštevníka na Alza.sk cez affiliate odkaz.

## Funkcie

- Landing + chat (nie dashboard)
- `POST /api/chat` — LLM keď je `OPENAI_API_KEY` + Cursor identity; inak rule-based katalóg
- SEO kategórie, porovnanie tipov, lokálne pohyby (`/pohyby`)
- Affiliate odkazy (`AFFILIATE_ID`)
- Slovenčina, mobile + desktop

## Spustenie

```bash
npm install
npm run dev
```

Dev server: http://127.0.0.1:5173 (chat API cez Vite middleware).

Produkcia: `npm run build && npm start` (tsx static server + `/api/chat`).

## Secrets (publikovaná app)

V Cursor Apps nastav `OPENAI_API_KEY` a `AFFILIATE_ID`. Bez kľúčov ostáva ukážkový katalóg.

## Affiliate ID

`AFFILIATE_ID` sa číta **len na serveri** (`server/affiliate.ts`) pri skladaní odkazov v `/api/chat`. Do client bundle sa nevkladá. Bez hodnoty ostáva placeholder `idp=AFFILIATE_ID`.
