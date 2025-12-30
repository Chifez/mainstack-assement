import { updateTransactionStatus } from '@/lib/db/queries/transactions';
import { createAuditLog } from '@/lib/db/queries/audit';
import { TransactionStatus } from '@/lib/db/types';

interface ProcessingJob {
  transactionId: string;
  walletId: string;
  userId: string;
  type: 'credit' | 'debit';
  category: string;
  startedAt: number;
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
    category: string
  ) {
    this.queue.push({
      transactionId,
      walletId,
      userId,
      type,
      category,
      startedAt: Date.now(),
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

      // Simulate occasional failures
      const shouldFail = Math.random() < this.failureRate;
      const finalStatus: TransactionStatus = shouldFail ? 'failed' : 'successful';

      await updateTransactionStatus(job.transactionId, finalStatus);
      await createAuditLog({
        action: 'UPDATE',
        entity_type: 'TRANSACTION',
        entity_id: job.transactionId,
        user_id: job.userId,
        changes: { status: finalStatus },
      });
    } catch (error) {
      console.error('Error processing transaction:', error);
      // Mark as failed on error
      try {
        await updateTransactionStatus(job.transactionId, 'failed');
        await createAuditLog({
          action: 'UPDATE',
          entity_type: 'TRANSACTION',
          entity_id: job.transactionId,
          user_id: job.userId,
          changes: { status: 'failed', error: String(error) },
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

