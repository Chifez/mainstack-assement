/**
 * Currency decimal places mapping
 * Industry standard: ISO 4217 currency codes with their decimal places
 */
const CURRENCY_DECIMALS: Record<string, number> = {
  // Standard fiat (2 decimals)
  USD: 2,
  EUR: 2,
  GBP: 2,
  NGN: 2,
  CAD: 2,
  AUD: 2,
  CHF: 2,
  // No decimal currencies
  JPY: 0,
  KRW: 0,
  VND: 0,
  // Cryptocurrencies (8 decimals for flexibility)
  BTC: 8,
  ETH: 8, // Capped at 8 for database compatibility
};

/**
 * Get decimal places for a currency
 * Defaults to 2 for unknown currencies (industry standard)
 */
export function getCurrencyDecimals(currency: string): number {
  return CURRENCY_DECIMALS[currency.toUpperCase()] ?? 2;
}

/**
 * Round amount to currency-specific precision
 * Uses proper rounding to avoid floating-point precision issues
 */
export function roundAmount(amount: number, currency: string): number {
  const decimals = getCurrencyDecimals(currency);

  // For zero decimals (JPY, etc.), round to nearest integer
  if (decimals === 0) {
    return Math.round(amount);
  }

  // For decimal currencies, use multiplier method for precise rounding
  // This ensures proper rounding without floating-point errors
  const multiplier = Math.pow(10, decimals);
  return Math.round(amount * multiplier) / multiplier;
}

/**
 * Format amount as string with proper decimal places
 * Used when storing in database (PostgreSQL DECIMAL handles it, but good for consistency)
 */
export function formatAmountForStorage(amount: number, currency: string): string {
  const rounded = roundAmount(amount, currency);
  const decimals = getCurrencyDecimals(currency);
  return rounded.toFixed(decimals);
}

/**
 * Parse amount from database string to number
 * PostgreSQL returns DECIMAL as string, so we parse it
 */
export function parseAmountFromDB(amount: string | number): number {
  if (typeof amount === 'number') return amount;
  return parseFloat(amount);
}

/**
 * Validate amount has correct decimal places for currency
 */
export function validateAmountDecimals(
  amount: number,
  currency: string
): boolean {
  const decimals = getCurrencyDecimals(currency);
  const rounded = roundAmount(amount, currency);
  // Allow tiny floating-point differences (epsilon check)
  return Math.abs(amount - rounded) < Math.pow(10, -(decimals + 2));
}

