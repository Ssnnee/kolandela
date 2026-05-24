export type Currency = (typeof CURRENCIES)[number];

export const CURRENCIES = [
  { code: 'XAF', symbol: 'FCFA', locale: 'fr-CG' },
  { code: 'EUR', symbol: '€', locale: 'de-DE' },
  { code: 'USD', symbol: '$', locale: 'en-US' },
  { code: 'GBP', symbol: '£', locale: 'en-GB' },
  { code: 'NGN', symbol: '₦', locale: 'en-NG' },
] as const;

export const DEFAULT_CURRENCY = CURRENCIES[0];
