import { updateTransactionStatus, createReversal, getTransactionById } from '@/lib/db/queries/transactions';
import { createAuditLog } from '@/lib/db/queries/audit';
import { TransactionStatus } from '@/lib/db/types';

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
  private failureRate = 0.08; // 8% failure rate

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
      // Step 1: Update to processing (after 1-2 seconds)
      const processingDelay = 1000 + Math.random() * 1000; // 1-2 seconds
      await new Promise((resolve) => setTimeout(resolve, processingDelay));

      await updateTransactionStatus(job.transactionId, 'processing');
      await createAuditLog({
        action: 'UPDATE',
        entity_type: 'TRANSACTION',
        entity_id: job.transactionId,
        user_id: job.userId,
        changes: { status: 'processing' },
      });

      // Step 2: Update to final status (after 2-3 more seconds)
      const finalDelay = 2000 + Math.random() * 1000; // 2-3 seconds
      await new Promise((resolve) => setTimeout(resolve, finalDelay));

      // Check if this is a reversal transaction (either from flag or by checking transaction type)
      const transaction = await getTransactionById(job.transactionId);
      const isReversalTransaction = job.isReversal || transaction?.type === 'reversal';

      // Reversals should never fail - always succeed
      // Simulate occasional failures or force failure for network simulation (but not for reversals)
      const shouldFail = isReversalTransaction ? false : (job.forceFailure || Math.random() < this.failureRate);
      const finalStatus: TransactionStatus = shouldFail ? 'failed' : 'successful';

      await updateTransactionStatus(job.transactionId, finalStatus);
      await createAuditLog({
        action: 'UPDATE',
        entity_type: 'TRANSACTION',
        entity_id: job.transactionId,
        user_id: job.userId,
        changes: { status: finalStatus },
      });

      // Handle reversal simulation - create reversal after transaction completes
      if (job.shouldReverse) {
        try {
          const reversal = await createReversal(
            job.transactionId,
            'Simulated reversal after transaction completion'
          );
          if (reversal) {
            await createAuditLog({
              action: 'REVERSE',
              entity_type: 'TRANSACTION',
              entity_id: job.transactionId,
              user_id: job.userId,
              changes: { reversed_by: reversal.id },
            });
            
            // Process the reversal transaction through the queue
            // Reversals are credits (bring money back), so use 'credit' type
            // Mark as isReversal so it never fails
            await this.addToQueue(
              reversal.id,
              reversal.wallet_id,
              job.userId,
              'credit',
              reversal.transaction_category,
              false, // forceFailure
              false, // shouldReverse
              true // isReversal
            );
          }
        } catch (reversalError) {
          console.error('Error creating reversal:', reversalError);
        }
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
      // Reversals should never fail, even on error - mark as successful
      // Regular transactions mark as failed on error
      try {
        // Check if this is a reversal transaction (either from flag or by checking transaction type)
        const transaction = await getTransactionById(job.transactionId).catch(() => null);
        const isReversalTransaction = job.isReversal || transaction?.type === 'reversal';
        const errorStatus: TransactionStatus = isReversalTransaction ? 'successful' : 'failed';
        await updateTransactionStatus(job.transactionId, errorStatus);
        await createAuditLog({
          action: 'UPDATE',
          entity_type: 'TRANSACTION',
          entity_id: job.transactionId,
          user_id: job.userId,
          changes: { status: errorStatus, error: String(error) },
        });
      } catch (updateError) {
        console.error('Error updating transaction status:', updateError);
      }
    }

    // Process next job
    this.processQueue();
  }

  getQueueLength() {
    return this.queue.length;
  }
}

// Singleton instance
export const transactionProcessor = new TransactionProcessor();


