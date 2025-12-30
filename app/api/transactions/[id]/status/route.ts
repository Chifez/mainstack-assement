import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { updateTransactionStatus } from '@/lib/db/queries/transactions';
import { getTransactionById } from '@/lib/db/queries/transactions';
import { createAuditLog } from '@/lib/db/queries/audit';
import { TransactionStatus } from '@/lib/db/types';
import { z } from 'zod';

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'successful', 'failed', 'reversed']),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { id } = params;

    // Validate request body
    const validated = updateStatusSchema.parse(body);

    // Get existing transaction
    const existing = await getTransactionById(id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Validate status transition
    const validTransitions: Record<TransactionStatus, TransactionStatus[]> = {
      pending: ['processing', 'failed'],
      processing: ['successful', 'failed'],
      successful: ['reversed'],
      failed: [],
      reversed: [],
    };

    const currentStatus = existing.status as TransactionStatus;
    const newStatus = validated.status as TransactionStatus;

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      return NextResponse.json(
        {
          error: `Invalid status transition from ${currentStatus} to ${newStatus}`,
        },
        { status: 400 }
      );
    }

    // Update status
    const updated = await updateTransactionStatus(id, newStatus);

    // Create audit log
    await createAuditLog({
      action: 'UPDATE',
      entity_type: 'TRANSACTION',
      entity_id: id,
      user_id: user.id,
      changes: {
        status: {
          from: currentStatus,
          to: newStatus,
        },
      },
    });

    return NextResponse.json({
      transaction: {
        ...updated,
        amount: parseFloat(updated.amount),
        metadata:
          typeof updated.metadata === 'string'
            ? JSON.parse(updated.metadata)
            : updated.metadata,
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Status update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update transaction status' },
      { status: 500 }
    );
  }
}

