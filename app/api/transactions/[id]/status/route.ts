import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { requirePermission } from '@/lib/auth/rbac';
import { RESOURCES, ACTIONS } from '@/lib/auth/permissions';
import { updateTransactionStatus } from '@/lib/db/queries/transactions';
import { getTransactionById } from '@/lib/db/queries/transactions';
import { createAuditLog } from '@/lib/db/queries/audit';
import { TransactionStatus } from '@/lib/db/types';
import { withTransaction } from '@/lib/db/index';
import { emitTransactionUpdated } from '@/lib/events/transaction-events';
import '@/lib/events/init';
import { z } from 'zod';

const updateStatusSchema = z.object({
  status: z.enum([
    'pending',
    'processing',
    'successful',
    'failed',
    'reversed',
    'void',
  ]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    await requirePermission(user, RESOURCES.TRANSACTIONS, ACTIONS.UPDATE);
    const body = await request.json();
    const { id } = await params;

    const validated = updateStatusSchema.parse(body);

    const existing = await getTransactionById(id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    const validTransitions: Record<TransactionStatus, TransactionStatus[]> = {
      pending: ['processing', 'failed'],
      processing: ['successful', 'failed'],
      successful: ['reversed', 'void'],
      failed: [],
      reversed: [],
      void: [],
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

    const updated = await withTransaction(async (client) => {
      const upd = await updateTransactionStatus(id, newStatus, client);

      if (!upd) {
        return null;
      }

      await createAuditLog(
        {
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
        },
        client
      );

      return upd;
    });

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to update transaction status' },
        { status: 500 }
      );
    }

    await emitTransactionUpdated(updated, currentStatus, user.id);

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
    if (error.message === 'Unauthorized' || error.name === 'UnauthorizedError') {
      return NextResponse.json(
        { error: error.message || 'Unauthorized' },
        { status: 401 }
      );
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
