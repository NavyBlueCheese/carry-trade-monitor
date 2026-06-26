// Approximate current central bank policy rates (annual %).
export const centralBankRates = {
  USD: 5.33,
  EUR: 4.0,
  JPY: 0.1,
  GBP: 5.25,
  AUD: 4.35,
  NZD: 5.5,
  CAD: 5.0,
  CHF: 1.75,
  NOK: 4.5,
  SEK: 4.0,
};

// Classic carry pairs to monitor: [base, quote].
export const pairs = [
  ['AUD', 'JPY'],
  ['NZD', 'JPY'],
  ['USD', 'JPY'],
  ['GBP', 'JPY'],
  ['CAD', 'JPY'],
  ['EUR', 'JPY'],
  ['AUD', 'CHF'],
  ['NZD', 'CHF'],
  ['GBP', 'CHF'],
  ['USD', 'CHF'],
  ['GBP', 'EUR'],
  ['USD', 'EUR'],
  ['AUD', 'USD'],
  ['NZD', 'USD'],
];

// Flag emoji per currency for a friendlier table.
export const flags = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  JPY: '🇯🇵',
  GBP: '🇬🇧',
  AUD: '🇦🇺',
  NZD: '🇳🇿',
  CAD: '🇨🇦',
  CHF: '🇨🇭',
  NOK: '🇳🇴',
  SEK: '🇸🇪',
};

// Fallback FX rates expressed as units of currency per 1 USD.
// Used when the frankfurter.app API cannot be reached.
export const fallbackRates = {
  EUR: 0.92,
  JPY: 157.0,
  GBP: 0.79,
  AUD: 1.52,
  NZD: 1.65,
  CAD: 1.37,
  CHF: 0.89,
  NOK: 10.7,
  SEK: 10.5,
};

// Rough fallback annualized volatility (%) per pair, used only when historical
// data is unavailable so signals still render with a sensible estimate.
export const fallbackVol = {
  'AUD/JPY': 11.5,
  'NZD/JPY': 12.0,
  'USD/JPY': 9.0,
  'GBP/JPY': 10.5,
  'CAD/JPY': 9.5,
  'EUR/JPY': 8.5,
  'AUD/CHF': 9.0,
  'NZD/CHF': 9.5,
  'GBP/CHF': 8.0,
  'USD/CHF': 7.5,
  'GBP/EUR': 6.0,
  'USD/EUR': 7.0,
  'AUD/USD': 9.0,
  'NZD/USD': 9.5,
};
