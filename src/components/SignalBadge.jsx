const STYLES = {
  Attractive: { dot: '🟢', bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
  Neutral: { dot: '🟡', bg: 'rgba(234,179,8,0.15)', color: '#eab308' },
  Risky: { dot: '🔴', bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
};

export default function SignalBadge({ signal, size = 'sm' }) {
  const s = STYLES[signal] || STYLES.Risky;
  const pad = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap ${pad}`}
      style={{ background: s.bg, color: s.color }}
    >
      <span aria-hidden>{s.dot}</span>
      {signal}
    </span>
  );
}
