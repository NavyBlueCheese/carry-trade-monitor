import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import SignalBadge from './SignalBadge.jsx';
import { flags } from '../data/rates.js';

function Metric({ label, value, accent }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-bold" style={{ color: accent || '#0f172a' }}>
        {value}
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <div className="text-slate-500">{label}</div>
      <div className="font-semibold text-teal-600">{payload[0].value.toFixed(4)}</div>
    </div>
  );
}

export default function DetailPanel({ row, notional, onNotional }) {
  if (!row) return null;

  const chartData = row.series.slice(-90).map((p) => ({ date: p.date, value: p.value }));
  const amount = Number(notional) || 0;
  const annualIncome = (amount * row.differential) / 100;
  const monthlyIncome = annualIncome / 12;
  const money = (n) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      {/* a) Title + signal */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-2xl font-bold text-slate-900">
          {flags[row.base]} {row.base}
          <span className="mx-1 text-slate-400">/</span>
          {flags[row.quote]} {row.quote}
        </h3>
        <SignalBadge signal={row.signal} size="lg" />
      </div>

      {/* b) Key metrics */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric label="Annualized Carry" value={`${row.differential.toFixed(2)}%`} accent="#14b8a6" />
        <Metric label="30d Volatility" value={`${row.vol.toFixed(1)}%`} accent="#ef4444" />
        <Metric label="Risk-Adj. Carry" value={Number.isFinite(row.riskAdj) ? row.riskAdj.toFixed(2) : 'N/A'} />
        <Metric label="Current FX Rate" value={row.fx >= 50 ? row.fx.toFixed(2) : row.fx.toFixed(4)} />
      </div>

      {/* c) 90-day chart */}
      <div className="mt-6">
        <div className="mb-2 text-sm font-semibold text-slate-700">90-Day FX Rate History</div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                minTickGap={40}
                tickFormatter={(d) => d.slice(5)}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={56}
                domain={['auto', 'auto']}
                tickFormatter={(v) => (v >= 50 ? v.toFixed(0) : v.toFixed(3))}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* d) Carry return simulation */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm font-semibold text-slate-800">Carry Return Simulation</div>
          <label className="mt-3 block text-xs text-slate-500">Notional amount (USD)</label>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-slate-400">$</span>
            <input
              type="number"
              min="0"
              step="1000"
              value={notional}
              onChange={(e) => onNotional(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-teal-500"
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-slate-500">Est. annual carry</div>
              <div className="text-xl font-bold text-teal-600">{money(annualIncome)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Per month</div>
              <div className="text-xl font-bold text-teal-600">{money(monthlyIncome)}</div>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            This does not account for exchange rate movements or transaction costs.
          </p>
        </div>

        {/* e) Plain-English explanation */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm font-semibold text-slate-800">What this trade means</div>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            You would borrow <strong>{row.quote}</strong> at {row.quoteRate.toFixed(2)}% and invest in{' '}
            <strong>{row.base}</strong> at {row.baseRate.toFixed(2)}%, earning a rate differential of{' '}
            <strong style={{ color: '#14b8a6' }}>{row.differential.toFixed(2)}%</strong> per year, before
            any exchange rate moves.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            With a 30-day annualized volatility of {row.vol.toFixed(1)}%, the risk-adjusted carry is{' '}
            {Number.isFinite(row.riskAdj) ? row.riskAdj.toFixed(2) : 'N/A'}. Higher is better: it tells you how
            much carry you earn per unit of currency risk.
          </p>
        </div>
      </div>
    </div>
  );
}
