import { useEffect, useMemo, useState, useCallback } from 'react';
import { centralBankRates, pairs, fallbackVol } from './data/rates.js';
import {
  fetchLatest,
  fetchHistory,
  crossRate,
  buildSeries,
  annualizedVol,
  signalFor,
  fallbackRateMap,
} from './lib/carry.js';
import SummaryBar from './components/SummaryBar.jsx';
import Table from './components/Table.jsx';
import DetailPanel from './components/DetailPanel.jsx';
import Educational from './components/Educational.jsx';

const SIGNAL_RANK = { Attractive: 3, Neutral: 2, Risky: 1 };

function InfoModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-bold text-slate-900">What is a carry trade?</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900">
            ✕
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          A carry trade involves borrowing in a low-interest-rate currency and investing in a
          high-interest-rate currency to profit from the interest rate differential. The risk is that
          exchange rate movements can wipe out the carry gain.
        </p>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-lg bg-teal-500 py-2 font-semibold text-slate-900 hover:bg-teal-400"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [rateMap, setRateMap] = useState(null);
  const [history, setHistory] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const [sortKey, setSortKey] = useState('riskAdj');
  const [sortDir, setSortDir] = useState('desc');
  const [selectedKey, setSelectedKey] = useState(null);
  const [notional, setNotional] = useState(10000);
  const [showInfo, setShowInfo] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [latest, hist] = await Promise.all([fetchLatest(), fetchHistory()]);
      setRateMap(latest.rates);
      setHistory(hist);
      setLastUpdated(new Date());
      setUsingFallback(false);
    } catch (e) {
      // Fall back to hardcoded rates so the table still renders.
      setRateMap(fallbackRateMap());
      setHistory(null);
      setLastUpdated(new Date());
      setUsingFallback(true);
      setError('Live FX data is unavailable, showing estimated rates.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Build a metrics row for each pair.
  const rows = useMemo(() => {
    if (!rateMap) return [];
    return pairs.map(([base, quote]) => {
      const key = `${base}/${quote}`;
      const baseRate = centralBankRates[base];
      const quoteRate = centralBankRates[quote];
      const differential = baseRate - quoteRate;
      const fx = crossRate(base, quote, rateMap);

      let series = [];
      let vol;
      if (history) {
        series = buildSeries(history, base, quote);
        vol = annualizedVol(series);
      }
      if (!Number.isFinite(vol)) vol = fallbackVol[key];

      const riskAdj = Number.isFinite(vol) && vol > 0 ? differential / vol : NaN;
      const signal = signalFor(differential, riskAdj);

      return {
        key,
        base,
        quote,
        baseRate,
        quoteRate,
        differential,
        fx,
        vol,
        riskAdj,
        signal,
        signalRank: SIGNAL_RANK[signal],
        series,
      };
    });
  }, [rateMap, history]);

  const sortedRows = useMemo(() => {
    const sorted = [...rows].sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      if (typeof av === 'string') {
        const cmp = av.localeCompare(bv);
        return sortDir === 'asc' ? cmp : -cmp;
      }
      // Push non-finite numbers to the bottom regardless of direction.
      const aFin = Number.isFinite(av);
      const bFin = Number.isFinite(bv);
      if (!aFin && !bFin) return 0;
      if (!aFin) return 1;
      if (!bFin) return -1;
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return sorted;
  }, [rows, sortKey, sortDir]);

  const bestKey = useMemo(() => {
    const valid = rows.filter((r) => Number.isFinite(r.riskAdj));
    if (!valid.length) return null;
    return valid.reduce((best, r) => (r.riskAdj > best.riskAdj ? r : best)).key;
  }, [rows]);

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      // Strings default ascending; numbers default descending (best first).
      setSortDir(key === 'key' || key === 'direction' ? 'asc' : 'desc');
    }
  };

  const selectedRow = rows.find((r) => r.key === selectedKey) || null;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* HEADER */}
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Carry Trade Monitor</h1>
              <button
                onClick={() => setShowInfo(true)}
                aria-label="What is a carry trade?"
                className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-sm text-slate-500 hover:border-teal-500 hover:text-teal-600"
              >
                ?
              </button>
            </div>
            <p className="mt-1 text-slate-500">
              Track G10 currency carry trade opportunities in real time
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {lastUpdated
                ? `Last updated ${lastUpdated.toLocaleString()}`
                : 'Loading FX data…'}
              {usingFallback && ' · estimated rates'}
            </p>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 font-semibold text-slate-900 hover:bg-teal-400 disabled:opacity-50"
          >
            {loading && (
              <span className="spinner h-4 w-4 rounded-full border-2 border-slate-900 border-t-transparent" />
            )}
            Refresh Rates
          </button>
        </header>

        {error && (
          <div className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
            ⚠ {error}
          </div>
        )}

        {/* SUMMARY STATS */}
        <section className="mt-6">
          {loading ? (
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-24 flex-1 min-w-[150px] rounded-xl" />
              ))}
            </div>
          ) : (
            <SummaryBar rows={rows} />
          )}
        </section>

        {/* MAIN TABLE */}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Carry Trade Opportunities</h2>
          <Table
            rows={sortedRows}
            loading={loading}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            onSelect={(k) => setSelectedKey((cur) => (cur === k ? null : k))}
            selectedKey={selectedKey}
            bestKey={bestKey}
          />
          {!loading && !selectedRow && (
            <p className="mt-3 text-center text-sm text-slate-500">
              Click any row to open a detailed breakdown.
            </p>
          )}
        </section>

        {/* DETAIL PANEL */}
        {selectedRow && (
          <section className="mt-6">
            <DetailPanel row={selectedRow} notional={notional} onNotional={setNotional} />
          </section>
        )}

        {/* EDUCATIONAL */}
        <section className="mt-8">
          <Educational />
        </section>

        <footer className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          <p>
            FX data from frankfurter.dev · Interest rates are approximate policy rates · Educational use only.
          </p>
          <p className="mt-2 font-medium text-slate-500">
            © {new Date().getFullYear()} · Made by NavyBlueCheese 🧀
          </p>
        </footer>
      </div>

      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
    </div>
  );
}
