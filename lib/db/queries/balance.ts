import { queryOne } from '../index';
import { PoolClient } from 'pg';
import { BalanceResult } from '../types';

export async function calculateBalance(
  walletId: string,
  currency: string = 'USD',
  client?: PoolClient
): Promise<BalanceResult> {
  const result = await queryOne<BalanceResult>(
    `SELECT 
      -- Ledger balance: add credits and reversals, subtract withdrawals (voided or successful)
      COALESCE(SUM(CASE 
        WHEN type = 'credit' AND status = 'successful' THEN amount 
        WHEN type = 'reversal' AND status = 'successful' THEN amount
        WHEN type = 'debit' AND status IN ('successful', 'void') THEN -amount
        ELSE 0 
      END), 0) as ledger_balance,
      -- Available balance: ledger balance minus pending debits
      COALESCE(SUM(CASE 
        WHEN type = 'credit' AND status = 'successful' THEN amount 
        WHEN type = 'reversal' AND status = 'successful' THEN amount
        WHEN type = 'debit' AND status IN ('successful', 'void') THEN -amount
        WHEN type = 'debit' AND status = 'pending' THEN -amount
        ELSE 0 
      END), 0) as available_balance,
      -- Pending debits
      COALESCE(SUM(CASE 
        WHEN type = 'debit' AND status IN ('pending', 'processing') THEN amount 
        ELSE 0 
      END), 0) as pending_debits,
      -- Pending credits
      COALESCE(SUM(CASE 
        WHEN type = 'credit' AND status IN ('pending', 'processing') THEN amount 
        ELSE 0 
      END), 0) as pending_credits
    FROM transactions
    WHERE wallet_id = $1 AND currency = $2`,
    [walletId, currency],
    client
  );

  return (
    result || {
      ledger_balance: '0',
      available_balance: '0',
      pending_debits: '0',
      pending_credits: '0',
    }
  );
}

export async function calculatePendingBalance(
  walletId: string,
  currency: string = 'USD',
  client?: PoolClient
): Promise<{ pending_debits: string; pending_credits: string }> {
  const result = await queryOne<{
    pending_debits: string;
    pending_credits: string;
  }>(
    `SELECT 
      COALESCE(SUM(CASE 
        WHEN type = 'debit' AND status = 'pending' THEN amount 
        ELSE 0 
      END), 0) as pending_debits,
      COALESCE(SUM(CASE 
        WHEN type = 'credit' AND status = 'pending' THEN amount 
        ELSE 0 
      END), 0) as pending_credits
    FROM transactions
    WHERE wallet_id = $1 AND currency = $2`,
    [walletId, currency],
    client
  );

  return (
    result || {
      pending_debits: '0',
      pending_credits: '0',
    }
  );
}
