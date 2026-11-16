# VyberAI

Slovenská MVP stránka s AI chatom, ktorý odporúča elektroniku a posiela návštevníka na Alza.sk cez affiliate odkaz.

## Funkcie

- Landing + chat (nie dashboard)
- Rule-based odporúčania z mock katalógu (1–3 produkty)
- Affiliate odkazy s placeholder `AFFILIATE_ID` (`src/lib/affiliate.ts`)
- Funguje bez LLM API kľúča
- Slovenčina, mobile + desktop

## Spustenie

```bash
npm install
npm run dev
```

## Affiliate ID

V `src/lib/affiliate.ts` zmeň konštantu `AFFILIATE_ID` na reálne Alza Partner ID.
