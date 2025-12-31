import { query, queryOne } from '../index';
import {
  TransactionRow,
  TransactionType,
  TransactionCategory,
  TransactionStatus,
  IdempotencyKeyRow,
} from '../types';
import { v4 as uuidv4 } from 'uuid';
import { roundAmount, parseAmountFromDB } from '@/lib/utils/currency';

export interface CreateTransactionData {
  wallet_id: string;
  type: TransactionType;
  transaction_category: TransactionCategory;
  status: TransactionStatus;
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
  idempotency_key?: string;
  reversal_of?: string;
}

export async function createTransaction(
  data: CreateTransactionData
): Promise<TransactionRow> {
  const id = uuidv4();
  const transaction_id = `TXN-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  // Round amount to currency-specific precision before storing
  // This follows industry standards for monetary precision
  const roundedAmount = roundAmount(data.amount, data.currency);

  const result = await query<TransactionRow>(
    `INSERT INTO transactions (
      id, transaction_id, wallet_id, type, transaction_category,
      status, amount, currency, metadata, idempotency_key, reversal_of
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *`,
    [
      id,
      transaction_id,
      data.wallet_id,
      data.type,
      data.transaction_category,
      data.status,
      roundedAmount, // Store rounded amount
      data.currency,
      JSON.stringify(data.metadata || {}),
      data.idempotency_key || null,
      data.reversal_of || null,
    ]
  );

  return result[0];
}

export async function getTransactionById(
  id: string
): Promise<TransactionRow | null> {
  return queryOne<TransactionRow>('SELECT * FROM transactions WHERE id = $1', [
    id,
  ]);
}

export async function getTransactionByTransactionId(
  transactionId: string
): Promise<TransactionRow | null> {
  return queryOne<TransactionRow>(
    'SELECT * FROM transactions WHERE transaction_id = $1',
    [transactionId]
  );
}

export interface TransactionFilters {
  wallet_id?: string;
  type?: TransactionType;
  transaction_category?: TransactionCategory;
  status?: TransactionStatus;
  currency?: string;
  date_from?: Date;
  date_to?: Date;
  limit?: number;
  offset?: number;
}

export async function getTransactionsByWallet(
  walletId: string,
  filters?: TransactionFilters
): Promise<TransactionRow[]> {
  let sql = 'SELECT * FROM transactions WHERE wallet_id = $1';
  const params: any[] = [walletId];
  let paramIndex = 2;

  if (filters) {
    if (filters.type) {
      sql += ` AND type = $${paramIndex}`;
      params.push(filters.type);
      paramIndex++;
    }
    if (filters.transaction_category) {
      sql += ` AND transaction_category = $${paramIndex}`;
      params.push(filters.transaction_category);
      paramIndex++;
    }
    if (filters.status) {
      sql += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }
    if (filters.currency) {
      sql += ` AND currency = $${paramIndex}`;
      params.push(filters.currency);
      paramIndex++;
    }
    if (filters.date_from) {
      sql += ` AND created_at >= $${paramIndex}`;
      params.push(filters.date_from);
      paramIndex++;
    }
    if (filters.date_to) {
      sql += ` AND created_at <= $${paramIndex}`;
      params.push(filters.date_to);
      paramIndex++;
    }
  }

  sql += ' ORDER BY sequence DESC, created_at DESC';

  if (filters?.limit) {
    sql += ` LIMIT $${paramIndex}`;
    params.push(filters.limit);
    paramIndex++;
    if (filters.offset) {
      sql += ` OFFSET $${paramIndex}`;
      params.push(filters.offset);
    }
  }

  return query<TransactionRow>(sql, params);
}

export async function updateTransactionStatus(
  id: string,
  status: TransactionStatus
): Promise<TransactionRow | null> {
  const result = await query<TransactionRow>(
    `UPDATE transactions
     SET status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );
  return result[0] || null;
}

export async function createReversal(
  originalId: string,
  reason?: string
): Promise<TransactionRow | null> {
  const original = await getTransactionById(originalId);
  if (!original || original.type === 'reversal') {
    return null;
  }

  const reversalType: TransactionType = 'reversal';
  const reversalStatus: TransactionStatus = 'pending';

  // Parse amount from database string to number
  const originalAmount = parseAmountFromDB(original.amount);

  const reversal = await createTransaction({
    wallet_id: original.wallet_id,
    type: reversalType,
    transaction_category: original.transaction_category,
    status: reversalStatus,
    amount: originalAmount,
    currency: original.currency,
    metadata: {
      reason: reason || 'Transaction reversal',
      original_transaction_id: original.transaction_id,
    },
    reversal_of: original.id,
  });

  // Update original transaction
  await query(
    `UPDATE transactions
     SET reversed_by = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2`,
    [reversal.id, originalId]
  );

  return reversal;
}

export async function checkIdempotency(
  key: string
): Promise<TransactionRow | null> {
  const result = await query<TransactionRow>(
    `SELECT t.* FROM transactions t
     INNER JOIN idempotency_keys ik ON t.id = ik.transaction_id
     WHERE ik.key = $1`,
    [key]
  );

  if (result.length > 0) {
    return result[0];
  }

  return null;
}

export async function storeIdempotencyKey(
  key: string,
  transactionId: string
): Promise<void> {
  await query(
    `INSERT INTO idempotency_keys (key, transaction_id)
     VALUES ($1, $2)
     ON CONFLICT (key) DO NOTHING`,
    [key, transactionId]
  );
}
