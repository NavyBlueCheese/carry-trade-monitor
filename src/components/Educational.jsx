import { useState } from 'react';

export default function Educational() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-lg font-semibold text-slate-900">How to read this table</span>
        <span className="text-teal-600">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="space-y-4 border-t border-slate-200 px-5 py-4 text-sm leading-relaxed text-slate-700">
          <p>
            <strong className="text-slate-900">What is a carry trade?</strong> A carry trade involves
            borrowing money in a currency with a low interest rate and investing it in a currency with a
            higher interest rate. You keep the difference between the two rates as income, for as long as
            exchange rates stay roughly stable.
          </p>
          <p>
            <strong className="text-slate-900">What does rate differential mean?</strong> It's simply the base
            currency's interest rate minus the quote currency's interest rate. A positive differential means
            you earn interest by holding the pair; a larger differential means more potential carry income,
            but often more risk too.
          </p>
          <p>
            <strong className="text-slate-900">What is risk-adjusted carry, and why does volatility matter?</strong>{' '}
            Exchange rates move, and those moves can wipe out your interest gains. We measure how much a pair
            typically moves using 30-day annualized volatility. Risk-adjusted carry divides the rate
            differential by that volatility (a Sharpe-ratio style proxy). A higher score means you're getting
            more carry for each unit of currency risk you take on.
          </p>
          <p className="text-xs text-slate-500">
            This tool is for educational purposes only and does not constitute financial advice.
          </p>
        </div>
      )}
    </div>
  );
}
