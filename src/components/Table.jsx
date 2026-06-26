import SignalBadge from './SignalBadge.jsx';
import { flags } from '../data/rates.js';

const COLUMNS = [
  { key: 'key', label: 'Pair', numeric: false, sortable: true },
  { key: 'baseRate', label: 'Base Rate', numeric: true, sortable: true },
  { key: 'quoteRate', label: 'Quote Rate', numeric: true, sortable: true },
  { key: 'differential', label: 'Rate Diff.', numeric: true, sortable: true },
  { key: 'fx', label: 'FX Rate', numeric: true, sortable: true },
  { key: 'vol', label: '30d Vol', numeric: true, sortable: true },
  { key: 'riskAdj', label: 'Risk-Adj. Carry', numeric: true, sortable: true },
  { key: 'signalRank', label: 'Signal', numeric: true, sortable: true },
  { key: 'direction', label: 'Direction', numeric: false, sortable: false },
];

function Arrow({ active, dir }) {
  return (
    <span className={`ml-1 text-[10px] ${active ? 'text-teal-600' : 'text-slate-400'}`}>
      {active ? (dir === 'asc' ? '▲' : '▼') : '↕'}
    </span>
  );
}

function pct(n, digits = 2) {
  return Number.isFinite(n) ? `${n.toFixed(digits)}%` : 'N/A';
}

function num(n, digits = 2) {
  return Number.isFinite(n) ? n.toFixed(digits) : 'N/A';
}

function fxDigits(v) {
  if (!Number.isFinite(v)) return 'N/A';
  return v >= 50 ? v.toFixed(2) : v.toFixed(4);
}

export default function Table({ rows, loading, sortKey, sortDir, onSort, onSelect, selectedKey, bestKey }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[820px] border-collapse text-sm">
        <thead>
          <tr className="bg-slate-100 text-slate-600">
            {COLUMNS.map((c) => (
              <th
                key={c.key}
                onClick={c.sortable ? () => onSort(c.key) : undefined}
                className={`px-3 py-3 text-left font-semibold whitespace-nowrap ${
                  c.sortable ? 'cursor-pointer select-none hover:text-slate-900' : ''
                } ${c.numeric ? 'text-right' : ''}`}
              >
                <span className={c.numeric ? 'inline-flex items-center justify-end' : 'inline-flex items-center'}>
                  {c.label}
                  {c.sortable && <Arrow active={sortKey === c.key} dir={sortDir} />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-t border-slate-100">
                  {COLUMNS.map((c) => (
                    <td key={c.key} className="px-3 py-3">
                      <div className="skeleton h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            : rows.map((r, i) => {
                const selected = r.key === selectedKey;
                const best = r.key === bestKey;
                return (
                  <tr
                    key={r.key}
                    onClick={() => onSelect(r.key)}
                    className={`cursor-pointer border-t border-slate-100 transition-colors ${
                      i % 2 ? 'bg-slate-50' : 'bg-white'
                    } hover:bg-teal-50 ${selected ? 'bg-teal-50' : ''}`}
                    style={best ? { boxShadow: 'inset 3px 0 0 0 #14b8a6' } : undefined}
                  >
                    <td className="px-3 py-3 font-semibold whitespace-nowrap text-slate-900">
                      <span className="mr-1">{flags[r.base]}</span>
                      {r.base}
                      <span className="text-slate-400">/</span>
                      <span className="mr-1">{flags[r.quote]}</span>
                      {r.quote}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-600">{pct(r.baseRate)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-600">{pct(r.quoteRate)}</td>
                    <td
                      className="px-3 py-3 text-right font-semibold tabular-nums"
                      style={{ color: r.differential >= 0 ? '#14b8a6' : '#ef4444' }}
                    >
                      {pct(r.differential)}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-600">{fxDigits(r.fx)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-600">{pct(r.vol, 1)}</td>
                    <td className="px-3 py-3 text-right font-semibold tabular-nums text-slate-900">{num(r.riskAdj)}</td>
                    <td className="px-3 py-3 text-right">
                      <SignalBadge signal={r.signal} />
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-xs text-slate-500">
                      Long {r.base} / Short {r.quote}
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
}
