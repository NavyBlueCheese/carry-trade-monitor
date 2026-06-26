function StatCard({ label, value, sub, accent }) {
  return (
    <div className="flex-1 min-w-[150px] rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold" style={{ color: accent || '#0f172a' }}>
        {value}
      </div>
      {sub && <div className="mt-0.5 text-sm text-slate-500">{sub}</div>}
    </div>
  );
}

export default function SummaryBar({ rows }) {
  if (!rows.length) return null;

  const byDiff = [...rows].sort((a, b) => b.differential - a.differential)[0];
  const valid = rows.filter((r) => Number.isFinite(r.riskAdj));
  const byRisk = [...valid].sort((a, b) => b.riskAdj - a.riskAdj)[0];
  const byVol = [...rows].sort((a, b) => b.vol - a.vol)[0];
  const attractive = rows.filter((r) => r.signal === 'Attractive').length;

  return (
    <div className="flex flex-wrap gap-3">
      <StatCard
        label="Highest Carry Differential"
        value={`${byDiff.differential.toFixed(2)}%`}
        sub={byDiff.key}
        accent="#14b8a6"
      />
      <StatCard
        label="Best Risk-Adjusted Carry"
        value={byRisk ? byRisk.riskAdj.toFixed(2) : 'N/A'}
        sub={byRisk ? byRisk.key : 'No data'}
        accent="#14b8a6"
      />
      <StatCard
        label="Most Volatile Pair"
        value={`${byVol.vol.toFixed(1)}%`}
        sub={byVol.key}
        accent="#ef4444"
      />
      <StatCard
        label="Attractive Signals"
        value={attractive}
        sub={`of ${rows.length} pairs`}
        accent="#22c55e"
      />
    </div>
  );
}
