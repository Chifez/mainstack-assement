import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import {
  getTransactionById,
  createReversal,
  updateTransactionStatus,
} from '@/lib/db/queries/transactions';
import {
  validateTransactionCanBeReversed,
  reverseTransactionSchema,
} from '@/lib/utils/validation';
import { createAuditLog } from '@/lib/db/queries/audit';
import { NotFoundError } from '@/lib/utils/errors';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const transaction = await getTransactionById(id);

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      transaction: {
        ...transaction,
        amount: parseFloat(transaction.amount),
        metadata:
          typeof transaction.metadata === 'string'
            ? JSON.parse(transaction.metadata)
            : transaction.metadata,
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error('Get transaction error:', error);
    return NextResponse.json(
      { error: 'Failed to get transaction' },
      { status: 500 }
    );
  }
}

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

    // Check if this is a reverse request
    const url = new URL(request.url);
    if (url.pathname.endsWith('/reverse')) {
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
    }

    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
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

    console.error('Transaction operation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process transaction' },
      { status: 500 }
    );
  }
}
