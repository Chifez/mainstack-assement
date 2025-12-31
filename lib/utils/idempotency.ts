import {
  checkIdempotency,
  storeIdempotencyKey,
} from '@/lib/db/queries/transactions';
import { TransactionRow } from '@/lib/db/types';
import { v4 as uuidv4 } from 'uuid';

export function generateIdempotencyKey(): string {
  return `idempotency-${uuidv4()}-${Date.now()}`;
}

export async function ensureIdempotency<T>(
  key: string | undefined,
  operation: () => Promise<T>
): Promise<{
  result: T;
  isDuplicate: boolean;
  existingTransaction?: TransactionRow;
}> {
  if (!key) {
    const result = await operation();
    return { result, isDuplicate: false };
  }

  // Check if idempotency key already exists
  const existing = await checkIdempotency(key);
  if (existing) {
    return {
      result: existing as T,
      isDuplicate: true,
      existingTransaction: existing,
    };
  }

  // Execute operation
  const result = await operation();

  // Store idempotency key if result has an id (transaction)
  if (result && typeof result === 'object' && 'id' in result) {
    await storeIdempotencyKey(key, (result as any).id);
  }

  return { result, isDuplicate: false };
}
