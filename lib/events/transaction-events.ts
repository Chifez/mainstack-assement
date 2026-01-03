/**
 * Transaction-specific event handlers and listeners
 * Registers event listeners for transaction lifecycle events
 */

import { eventEmitter } from './event-emitter';
import { TransactionRow } from '@/lib/db/types';

/**
 * Initialize transaction event listeners
 * Should be called once at application startup
 */
export function initializeTransactionEventListeners(): void {
  // Transaction created event
  eventEmitter.on('transaction.created', async (payload) => {
    // Future: Send notifications, update analytics, etc.
    console.log('Transaction created:', payload.transaction.id);
  });

  // Transaction updated event
  eventEmitter.on('transaction.updated', async (payload) => {
    // Future: Recalculate balances, send notifications, etc.
    console.log(
      `Transaction ${payload.transaction.id} updated: ${payload.previous_status} -> ${payload.transaction.status}`
    );
  });

  // Transaction reversed event
  eventEmitter.on('transaction.reversed', async (payload) => {
    // Future: Send reversal notifications, update analytics, etc.
    console.log(
      `Transaction ${payload.transaction.id} reversed by ${payload.reversal.id}`
    );
  });

  // Transaction failed event
  eventEmitter.on('transaction.failed', async (payload) => {
    // Future: Send failure notifications, log to monitoring system, etc.
    console.log(
      `Transaction ${payload.transaction.id} failed: ${payload.error || 'Unknown error'}`
    );
  });
}

/**
 * Emit transaction created event
 */
export async function emitTransactionCreated(
  transaction: TransactionRow,
  userId: string
): Promise<void> {
  await eventEmitter.emit('transaction.created', {
    transaction,
    user_id: userId,
  });
}

/**
 * Emit transaction updated event
 */
export async function emitTransactionUpdated(
  transaction: TransactionRow,
  previousStatus: string | undefined,
  userId: string
): Promise<void> {
  await eventEmitter.emit('transaction.updated', {
    transaction,
    previous_status: previousStatus,
    user_id: userId,
  });
}

/**
 * Emit transaction reversed event
 */
export async function emitTransactionReversed(
  transaction: TransactionRow,
  reversal: TransactionRow,
  userId: string
): Promise<void> {
  await eventEmitter.emit('transaction.reversed', {
    transaction,
    reversal,
    user_id: userId,
  });
}

/**
 * Emit transaction failed event
 */
export async function emitTransactionFailed(
  transaction: TransactionRow,
  error: string | undefined,
  userId: string
): Promise<void> {
  await eventEmitter.emit('transaction.failed', {
    transaction,
    error,
    user_id: userId,
  });
}

