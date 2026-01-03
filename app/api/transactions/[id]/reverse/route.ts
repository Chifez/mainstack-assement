import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { requirePermission } from '@/lib/auth/rbac';
import { RESOURCES, ACTIONS } from '@/lib/auth/permissions';
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
import { withTransaction } from '@/lib/db/index';
import { emitTransactionReversed } from '@/lib/events/transaction-events';
import '@/lib/events/init';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    await requirePermission(user, RESOURCES.TRANSACTIONS, ACTIONS.REVERSE);
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

    const reversal = await withTransaction(async (client) => {
      const rev = await createReversal(
        transaction.id,
        validated.reason,
        client
      );

      if (!rev) {
        return null;
      }

      await createAuditLog(
        {
          action: 'REVERSE',
          entity_type: 'TRANSACTION',
          entity_id: transaction.id,
          user_id: user.id,
          changes: { reversed_by: rev.id },
        },
        client
      );

      return rev;
    });

    if (!reversal) {
      return NextResponse.json(
        { error: 'Failed to create reversal' },
        { status: 500 }
      );
    }

    await emitTransactionReversed(transaction, reversal, user.id);

    transactionProcessor.addToQueue(
      reversal.id,
      reversal.wallet_id,
      user.id,
      'credit',
      reversal.transaction_category,
      false,
      false,
      true
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
    if (error.message === 'Unauthorized' || error.name === 'UnauthorizedError') {
      return NextResponse.json(
        { error: error.message || 'Unauthorized' },
        { status: 401 }
      );
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
