import {
  checkIdempotency,
  storeIdempotencyKey,
} from '@/lib/db/queries/transactions';
import { TransactionRow } from '@/lib/db/types';
import { withTransaction } from '@/lib/db/index';
import { PoolClient } from 'pg';
import { v4 as uuidv4 } from 'uuid';

export function generateIdempotencyKey(): string {
  return `idempotency-${uuidv4()}-${Date.now()}`;
}

/**
 * Ensure idempotency for an operation
 * If a client is provided, uses that client (for use within existing transactions)
 * If no client is provided, creates its own transaction
 */
export async function ensureIdempotency<T>(
  key: string | undefined,
  operation: (client?: PoolClient) => Promise<T>,
  client?: PoolClient
): Promise<{
  result: T;
  isDuplicate: boolean;
  existingTransaction?: TransactionRow;
}> {
  if (!key) {
    const result = await operation(client);
    return { result, isDuplicate: false };
  }

  if (client) {
    const existing = await checkIdempotency(key, client);
    if (existing) {
      return {
        result: existing as T,
        isDuplicate: true,
        existingTransaction: existing,
      };
    }

    const result = await operation(client);

    if (result && typeof result === 'object' && 'id' in result) {
      await storeIdempotencyKey(key, (result as any).id, client);
    }

    return { result, isDuplicate: false };
  }

  return withTransaction(async (txClient) => {
    const existing = await checkIdempotency(key, txClient);
    if (existing) {
      return {
        result: existing as T,
        isDuplicate: true,
        existingTransaction: existing,
      };
    }

    const result = await operation(txClient);

    if (result && typeof result === 'object' && 'id' in result) {
      await storeIdempotencyKey(key, (result as any).id, txClient);
    }

    return { result, isDuplicate: false };
  });
}


