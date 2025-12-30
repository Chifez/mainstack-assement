import { z } from 'zod';
import { calculateBalance } from '@/lib/db/queries/balance';
import {
  roundAmount,
  getCurrencyDecimals,
  validateAmountDecimals,
} from './currency';

export const registerUserSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
});

export const loginUserSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const createTransactionSchema = z
  .object({
    wallet_id: z.string().uuid('Invalid wallet ID'),
    type: z.enum(['credit', 'debit', 'reversal']),
    transaction_category: z.enum([
      'deposit',
      'withdrawal',
      'manual_credit',
      'manual_debit',
      'fee',
      'refund',
    ]),
    amount: z.number().positive('Amount must be positive'),
    currency: z.string().min(3).max(10).default('USD'),
    metadata: z.record(z.string(), z.any()).optional(),
    idempotency_key: z.string().optional(),
  })
  .refine(
    (data) => {
      // Validate amount has correct decimal places for currency
      return validateAmountDecimals(data.amount, data.currency);
    },
    {
      message: 'Amount has too many decimal places for this currency',
      path: ['amount'],
    }
  );

export const reverseTransactionSchema = z.object({
  reason: z.string().optional(),
});

export async function validateSufficientFunds(
  walletId: string,
  amount: number,
  currency: string = 'USD'
): Promise<{
  valid: boolean;
  availableBalance: number;
  requiredAmount: number;
}> {
  const balance = await calculateBalance(walletId, currency);
  const availableBalance = parseFloat(balance.available_balance);
  const requiredAmount = amount;

  return {
    valid: availableBalance >= requiredAmount,
    availableBalance,
    requiredAmount,
  };
}

export function validateTransactionCanBeReversed(transaction: {
  type: string;
  status: string;
  reversal_of?: string | null;
}): boolean {
  // Can't reverse a reversal
  if (transaction.type === 'reversal') {
    return false;
  }

  // Can't reverse if already reversed
  if (transaction.reversal_of) {
    return false;
  }

  // Can only reverse successful transactions
  if (transaction.status !== 'successful') {
    return false;
  }

  return true;
}
