import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import {
  getTransactionById,
  createReversal,
} from '@/lib/db/queries/transactions';
import {
  validateTransactionCanBeReversed,
  reverseTransactionSchema,
} from '@/lib/utils/validation';
import { createAuditLog } from '@/lib/db/queries/audit';
import { NotFoundError } from '@/lib/utils/errors';
import { transactionProcessor } from '@/lib/services/transaction-processor';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const transaction = await getTransactionById(id);

    if (!transaction) {
      throw new NotFoundError('Transaction');
    }

    if (!validateTransactionCanBeReversed(transaction)) {
      return NextResponse.json(
        { error: 'Transaction cannot be reversed' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validated = reverseTransactionSchema.parse(body);

    const reversal = await createReversal(transaction.id, validated.reason);

    if (!reversal) {
      return NextResponse.json(
        { error: 'Failed to create reversal' },
        { status: 500 }
      );
    }

    // Create audit log
    await createAuditLog({
      action: 'REVERSE',
      entity_type: 'TRANSACTION',
      entity_id: transaction.id,
      user_id: user.id,
      changes: { reversed_by: reversal.id },
    });

    // Add reversal to processing queue
    // Reversals are credits (bring money back), so use 'credit' type for processing
    // Mark as isReversal so it never fails
    transactionProcessor.addToQueue(
      reversal.id,
      reversal.wallet_id,
      user.id,
      'credit',
      reversal.transaction_category,
      false, // forceFailure
      false, // shouldReverse
      true // isReversal
    );

    return NextResponse.json({
      reversal: {
        ...reversal,
        amount: parseFloat(reversal.amount),
        metadata:
          typeof reversal.metadata === 'string'
            ? JSON.parse(reversal.metadata)
            : reversal.metadata,
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Reverse transaction error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to reverse transaction' },
      { status: 500 }
    );
  }
}
