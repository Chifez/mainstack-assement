import { updateTransactionStatus, createReversal, getTransactionById } from '@/lib/db/queries/transactions';
import { createAuditLog } from '@/lib/db/queries/audit';
import { TransactionStatus } from '@/lib/db/types';
import { withTransaction } from '@/lib/db/index';
import {
  emitTransactionUpdated,
  emitTransactionReversed,
  emitTransactionFailed,
} from '@/lib/events/transaction-events';
import '@/lib/events/init';

interface ProcessingJob {
  transactionId: string;
  walletId: string;
  userId: string;
  type: 'credit' | 'debit';
  category: string;
  startedAt: number;
  forceFailure?: boolean;
  shouldReverse?: boolean;
  isReversal?: boolean;
}

class TransactionProcessor {
  private queue: ProcessingJob[] = [];
  private processing = false;
  private failureRate = 0.08;

  async addToQueue(
    transactionId: string,
    walletId: string,
    userId: string,
    type: 'credit' | 'debit',
    category: string,
    forceFailure?: boolean,
    shouldReverse?: boolean,
    isReversal?: boolean
  ) {
    this.queue.push({
      transactionId,
      walletId,
      userId,
      type,
      category,
      startedAt: Date.now(),
      forceFailure,
      shouldReverse,
      isReversal,
    });

    if (!this.processing) {
      this.processQueue();
    }
  }

  private async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const job = this.queue.shift();

    if (!job) {
      this.processing = false;
      return;
    }

    try {
      const processingDelay = 1000 + Math.random() * 1000;
      await new Promise((resolve) => setTimeout(resolve, processingDelay));

      const currentTransaction = await getTransactionById(job.transactionId);
      const previousStatus = currentTransaction?.status;

      await withTransaction(async (client) => {
        await updateTransactionStatus(job.transactionId, 'processing', client);
        await createAuditLog(
          {
            action: 'UPDATE',
            entity_type: 'TRANSACTION',
            entity_id: job.transactionId,
            user_id: job.userId,
            changes: { status: 'processing' },
          },
          client
        );
      });

      if (currentTransaction) {
        await emitTransactionUpdated(
          { ...currentTransaction, status: 'processing' },
          previousStatus,
          job.userId
        );
      }

      const finalDelay = 2000 + Math.random() * 1000;
      await new Promise((resolve) => setTimeout(resolve, finalDelay));

      const transaction = await getTransactionById(job.transactionId);
      const isReversalTransaction = job.isReversal || transaction?.type === 'reversal';

      const shouldFail = isReversalTransaction ? false : (job.forceFailure || Math.random() < this.failureRate);
      const finalStatus: TransactionStatus = shouldFail ? 'failed' : 'successful';

      const updatedTransaction = await withTransaction(async (client) => {
        const updated = await updateTransactionStatus(
          job.transactionId,
          finalStatus,
          client
        );
        await createAuditLog(
          {
            action: 'UPDATE',
            entity_type: 'TRANSACTION',
            entity_id: job.transactionId,
            user_id: job.userId,
            changes: { status: finalStatus },
          },
          client
        );
        return updated;
      });

      if (updatedTransaction) {
        if (finalStatus === 'failed') {
          await emitTransactionFailed(
            updatedTransaction,
            'Transaction processing failed',
            job.userId
          );
        } else {
          await emitTransactionUpdated(
            updatedTransaction,
            'processing',
            job.userId
          );
        }
      }

      if (job.shouldReverse && updatedTransaction) {
        try {
          const reversal = await withTransaction(async (client) => {
            const rev = await createReversal(
              job.transactionId,
              'Simulated reversal after transaction completion',
              client
            );
            if (rev) {
              await createAuditLog(
                {
                  action: 'REVERSE',
                  entity_type: 'TRANSACTION',
                  entity_id: job.transactionId,
                  user_id: job.userId,
                  changes: { reversed_by: rev.id },
                },
                client
              );
            }
            return rev;
          });

          if (reversal && updatedTransaction) {
            await emitTransactionReversed(
              updatedTransaction,
              reversal,
              job.userId
            );

            await this.addToQueue(
              reversal.id,
              reversal.wallet_id,
              job.userId,
              'credit',
              reversal.transaction_category,
              false,
              false,
              true
            );
          }
        } catch (reversalError) {
          console.error('Error creating reversal:', reversalError);
        }
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
      try {
        const transaction = await getTransactionById(job.transactionId).catch(() => null);
        const isReversalTransaction = job.isReversal || transaction?.type === 'reversal';
        const errorStatus: TransactionStatus = isReversalTransaction ? 'successful' : 'failed';

        const updatedTransaction = await withTransaction(async (client) => {
          const updated = await updateTransactionStatus(
            job.transactionId,
            errorStatus,
            client
          );
          await createAuditLog(
            {
              action: 'UPDATE',
              entity_type: 'TRANSACTION',
              entity_id: job.transactionId,
              user_id: job.userId,
              changes: { status: errorStatus, error: String(error) },
            },
            client
          );
          return updated;
        });

        if (updatedTransaction && errorStatus === 'failed') {
          await emitTransactionFailed(
            updatedTransaction,
            String(error),
            job.userId
          );
        }
      } catch (updateError) {
        console.error('Error updating transaction status:', updateError);
      }
    }

    this.processQueue();
  }

  getQueueLength() {
    return this.queue.length;
  }
}

export const transactionProcessor = new TransactionProcessor();


