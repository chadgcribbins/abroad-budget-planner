// Currency utilities for formatting and conversion

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
  CHF: 'CHF',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  PLN: 'zł',
  CZK: 'Kč',
  HUF: 'Ft',
  RON: 'lei',
  BGN: 'лв',
  HRK: 'kn',
  RUB: '₽',
  TRY: '₺',
  BRL: 'R$',
  CNY: '¥',
  IDR: 'Rp',
  INR: '₹',
  KRW: '₩',
  MXN: '$',
  MYR: 'RM',
  NZD: 'NZ$',
  PHP: '₱',
  SGD: 'S$',
  THB: '฿',
  ZAR: 'R',
};

export const CURRENCY_NAMES: Record<string, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar',
  JPY: 'Japanese Yen',
  CHF: 'Swiss Franc',
  SEK: 'Swedish Krona',
  NOK: 'Norwegian Krone',
  DKK: 'Danish Krone',
  PLN: 'Polish Złoty',
  CZK: 'Czech Koruna',
  HUF: 'Hungarian Forint',
  RON: 'Romanian Leu',
  BGN: 'Bulgarian Lev',
  HRK: 'Croatian Kuna',
  RUB: 'Russian Ruble',
  TRY: 'Turkish Lira',
  BRL: 'Brazilian Real',
  CNY: 'Chinese Yuan',
  IDR: 'Indonesian Rupiah',
  INR: 'Indian Rupee',
  KRW: 'South Korean Won',
  MXN: 'Mexican Peso',
  MYR: 'Malaysian Ringgit',
  NZD: 'New Zealand Dollar',
  PHP: 'Philippine Peso',
  SGD: 'Singapore Dollar',
  THB: 'Thai Baht',
  ZAR: 'South African Rand',
};

/**
 * Format a currency amount with proper symbol and decimal places
 */
export function formatCurrency(
  amount: number,
  currency: string,
  options?: {
    showSymbol?: boolean;
    showCode?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  const {
    showSymbol = true,
    showCode = false,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options || {};

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  const formattedAmount = formatter.format(amount);
  const symbol = CURRENCY_SYMBOLS[currency] || currency;

  if (showSymbol && showCode) {
    return `${symbol}${formattedAmount} ${currency}`;
  } else if (showSymbol) {
    return `${symbol}${formattedAmount}`;
  } else if (showCode) {
    return `${formattedAmount} ${currency}`;
  } else {
    return formattedAmount;
  }
}

/**
 * Format dual currency display (destination bold, origin regular)
 */
export function formatDualCurrency(
  amount: number,
  primaryCurrency: string,
  secondaryCurrency: string,
  exchangeRate: number
): {
  primary: string;
  secondary: string;
  formatted: string;
} {
  const primaryAmount = formatCurrency(amount, primaryCurrency);
  const secondaryAmount = formatCurrency(amount * exchangeRate, secondaryCurrency);

  return {
    primary: primaryAmount,
    secondary: secondaryAmount,
    formatted: `${primaryAmount} / ${secondaryAmount}`,
  };
}

/**
 * Get currency flag emoji
 */
export function getCurrencyFlag(currency: string): string {
  const flagMap: Record<string, string> = {
    USD: '🇺🇸',
    EUR: '🇪🇺',
    GBP: '🇬🇧',
    CAD: '🇨🇦',
    AUD: '🇦🇺',
    JPY: '🇯🇵',
    CHF: '🇨🇭',
    SEK: '🇸🇪',
    NOK: '🇳🇴',
    DKK: '🇩🇰',
    PLN: '🇵🇱',
    CZK: '🇨🇿',
    HUF: '🇭🇺',
    RON: '🇷🇴',
    BGN: '🇧🇬',
    HRK: '🇭🇷',
    RUB: '🇷🇺',
    TRY: '🇹🇷',
    BRL: '🇧🇷',
    CNY: '🇨🇳',
    IDR: '🇮🇩',
    INR: '🇮🇳',
    KRW: '🇰🇷',
    MXN: '🇲🇽',
    MYR: '🇲🇾',
    NZD: '🇳🇿',
    PHP: '🇵🇭',
    SGD: '🇸🇬',
    THB: '🇹🇭',
    ZAR: '🇿🇦',
  };

  return flagMap[currency] || '🏳️';
}

/**
 * Get common currencies for a country
 */
export function getCountryCurrencies(country: string): string[] {
  const countryMap: Record<string, string[]> = {
    'Portugal': ['EUR'],
    'Spain': ['EUR'],
    'France': ['EUR'],
    'Italy': ['EUR'],
    'Germany': ['EUR'],
    'Netherlands': ['EUR'],
    'UK': ['GBP'],
    'USA': ['USD'],
    'Canada': ['CAD'],
    'Australia': ['AUD'],
    'Japan': ['JPY'],
    'Switzerland': ['CHF'],
    'Sweden': ['SEK'],
    'Norway': ['NOK'],
    'Denmark': ['DKK'],
    'Poland': ['PLN'],
    'Czech Republic': ['CZK'],
    'Hungary': ['HUF'],
    'Romania': ['RON'],
    'Bulgaria': ['BGN'],
    'Croatia': ['HRK'],
    'Russia': ['RUB'],
    'Turkey': ['TRY'],
    'Brazil': ['BRL'],
    'China': ['CNY'],
    'Indonesia': ['IDR'],
    'India': ['INR'],
    'South Korea': ['KRW'],
    'Mexico': ['MXN'],
    'Malaysia': ['MYR'],
    'New Zealand': ['NZD'],
    'Philippines': ['PHP'],
    'Singapore': ['SGD'],
    'Thailand': ['THB'],
    'South Africa': ['ZAR'],
  };

  return countryMap[country] || ['USD'];
}

/**
 * Parse currency amount from string
 */
export function parseCurrencyAmount(input: string): number {
  // Remove currency symbols and whitespace
  const cleaned = input.replace(/[^0-9.,\-]/g, '');
  
  // Handle different decimal separators
  const normalized = cleaned.replace(/,/g, '.');
  
  return parseFloat(normalized) || 0;
}