import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { getCurrencyDecimals, parseAmountFromDB } from './utils/currency';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number | string,
  currency: string = 'USD'
): string {
  const numAmount = parseAmountFromDB(amount);
  const decimals = getCurrencyDecimals(currency);

  // Use Intl.NumberFormat for proper currency formatting
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(numAmount);
  } catch (error) {
    // Fallback for unsupported currencies
    return `${currency} ${numAmount.toFixed(decimals)}`;
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'MMM dd, yyyy');
}
