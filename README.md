# Carry Trade Monitor

A clean, single-page React app for understanding and monitoring G10 currency carry trades.
It shows live FX rates, computes interest-rate differentials against approximate central-bank
policy rates, estimates 30-day historical volatility, and ranks pairs by a risk-adjusted carry
score so the best opportunities surface first.

Website URL: https://navybluecheese.github.io/carry-trade-monitor/

## Features

- **Live FX rates** from [frankfurter.dev](https://frankfurter.dev) (no API key, runs fully in the browser)
- **Sortable opportunities table** across 14 classic carry pairs (AUD/JPY, NZD/JPY, USD/JPY, etc.)
- **Signal badges**: Attractive / Neutral / Risky based on risk-adjusted carry
- **Summary stats**: highest differential, best risk-adjusted carry, most volatile pair, attractive count
- **Detail panel** per pair: 90-day price chart (Recharts), key metrics, a carry-return simulator, and a plain-English explanation
- **Educational section** explaining how to read everything
- Loading skeletons, an error state with fallback rates, and a fully responsive layout

## Tech stack

- React 18 (hooks)
- Vite
- Tailwind CSS v4
- Recharts

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (defaults to `http://localhost:5290`).

```bash
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## How the numbers work

- **Cross rates** are derived from a single USD-based API response: `BASE/QUOTE = rate[QUOTE] / rate[BASE]`.
- **30-day volatility** is the standard deviation of daily log returns, annualized by `sqrt(252)`.
- **Risk-adjusted carry** is the rate differential divided by that volatility (a Sharpe-ratio style proxy).

Only two API calls are made on load (latest rates, plus one historical range covering every currency).

## Disclaimer

This tool is for educational purposes only and does not constitute financial advice.

---

© 2026 · Made by NavyBlueCheese
