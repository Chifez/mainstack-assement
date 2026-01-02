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
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/93e671da-f115-421f-965c-23cd29ed3bd5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'transaction-processor.ts:22',message:'addToQueue called',data:{transactionId,type,isReversal,shouldReverse,forceFailure,currentQueueLength:this.queue.length,processing:this.processing},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
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
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/93e671da-f115-421f-965c-23cd29ed3bd5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'transaction-processor.ts:45',message:'Starting processQueue',data:{queueLength:this.queue.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      this.processQueue();
    }
  }

  private async processQueue() {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/93e671da-f115-421f-965c-23cd29ed3bd5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'transaction-processor.ts:49',message:'processQueue entry',data:{queueLength:this.queue.length,processing:this.processing},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
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

    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/93e671da-f115-421f-965c-23cd29ed3bd5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'transaction-processor.ts:62',message:'Processing job',data:{transactionId:job.transactionId,type:job.type,shouldReverse:job.shouldReverse,isReversal:job.isReversal,forceFailure:job.forceFailure},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

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
      // #region agent log
      fetch('http://127.0.0.1:7245/ingest/93e671da-f115-421f-965c-23cd29ed3bd5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'transaction-processor.ts:99',message:'Checking shouldReverse',data:{shouldReverse:job.shouldReverse,transactionId:job.transactionId,finalStatus},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      if (job.shouldReverse) {
        try {
          // #region agent log
          fetch('http://127.0.0.1:7245/ingest/93e671da-f115-421f-965c-23cd29ed3bd5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'transaction-processor.ts:102',message:'Calling createReversal',data:{originalId:job.transactionId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          // #endregion
          const reversal = await createReversal(
            job.transactionId,
            'Simulated reversal after transaction completion'
          );
          // #region agent log
          fetch('http://127.0.0.1:7245/ingest/93e671da-f115-421f-965c-23cd29ed3bd5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'transaction-processor.ts:107',message:'createReversal result',data:{reversalId:reversal?.id,reversalStatus:reversal?.status,hasReversal:!!reversal},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          // #endregion
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
            // #region agent log
            fetch('http://127.0.0.1:7245/ingest/93e671da-f115-421f-965c-23cd29ed3bd5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'transaction-processor.ts:118',message:'Adding reversal to queue',data:{reversalId:reversal.id,isReversal:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
            // #endregion
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
            // #region agent log
            fetch('http://127.0.0.1:7245/ingest/93e671da-f115-421f-965c-23cd29ed3bd5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'transaction-processor.ts:128',message:'Reversal added to queue',data:{queueLength:this.queue.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
            // #endregion
          }
        } catch (reversalError) {
          // #region agent log
          fetch('http://127.0.0.1:7245/ingest/93e671da-f115-421f-965c-23cd29ed3bd5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'transaction-processor.ts:131',message:'Error creating reversal',data:{error:String(reversalError)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          // #endregion
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


