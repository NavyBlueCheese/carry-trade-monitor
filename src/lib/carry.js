// Data fetching + carry-trade math. All FX data comes from frankfurter.app.
//
// frankfurter.app returns rates with a chosen base. With ?from=USD every rate
// r[X] is "units of X per 1 USD". For a pair BASE/QUOTE the quoted price is
// "units of QUOTE per 1 BASE", which equals r[QUOTE] / r[BASE] (USD itself = 1).

import { fallbackRates, fallbackVol } from '../data/rates.js';

// frankfurter.app now 301-redirects to frankfurter.dev; the redirect breaks
// browser CORS fetches, so we hit the canonical host directly.
const API = 'https://api.frankfurter.dev/v1';

// --- date helpers ---
function fmt(d) {
  return d.toISOString().slice(0, 10);
}

// --- fetching ---

// One call: latest USD-based rates for every currency.
export async function fetchLatest() {
  const res = await fetch(`${API}/latest?from=USD`);
  if (!res.ok) throw new Error(`latest ${res.status}`);
  const json = await res.json();
  return { rates: { USD: 1, ...json.rates }, date: json.date };
}

// One call: ~200 days of daily USD-based rates for every currency.
// Returns a date-sorted array of { date, rates } where rates includes USD: 1.
export async function fetchHistory() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 200);
  const res = await fetch(`${API}/${fmt(start)}..${fmt(end)}?from=USD`);
  if (!res.ok) throw new Error(`history ${res.status}`);
  const json = await res.json();
  return Object.keys(json.rates)
    .sort()
    .map((date) => ({ date, rates: { USD: 1, ...json.rates[date] } }));
}

// --- math ---

// Quoted price of BASE/QUOTE given a USD-based rate map.
export function crossRate(base, quote, rates) {
  const rb = base === 'USD' ? 1 : rates[base];
  const rq = quote === 'USD' ? 1 : rates[quote];
  if (!rb || !rq) return null;
  return rq / rb;
}

// Build the BASE/QUOTE price series from the historical USD-based data.
export function buildSeries(history, base, quote) {
  return history
    .map(({ date, rates }) => {
      const v = crossRate(base, quote, rates);
      return v == null ? null : { date, value: v };
    })
    .filter(Boolean);
}

function stdev(arr) {
  const n = arr.length;
  if (n < 2) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / n;
  const variance = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1);
  return Math.sqrt(variance);
}

// Annualized volatility (%) from a price series, using the most recent `window`
// observations. vol = stdev(daily log returns) * sqrt(252) * 100.
export function annualizedVol(series, window = 31) {
  const values = series.slice(-window).map((p) => p.value);
  if (values.length < 2) return null;
  const returns = [];
  for (let i = 1; i < values.length; i++) {
    returns.push(Math.log(values[i] / values[i - 1]));
  }
  return stdev(returns) * Math.sqrt(252) * 100;
}

// Map a risk-adjusted carry score to a signal bucket.
export function signalFor(differential, riskAdj) {
  if (differential <= 0 || riskAdj < 0.2) return 'Risky';
  if (riskAdj > 0.5) return 'Attractive';
  return 'Neutral';
}

// Fallback USD-based rate map (with USD: 1) when the API is unavailable.
export function fallbackRateMap() {
  return { USD: 1, ...fallbackRates };
}

export { fallbackVol };
