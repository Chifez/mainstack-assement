import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { requirePermission } from '@/lib/auth/rbac';
import { RESOURCES, ACTIONS } from '@/lib/auth/permissions';
import { getWalletByUserId } from '@/lib/db/queries/wallets';
import { createTransaction } from '@/lib/db/queries/transactions';
import { createTransactionSchema } from '@/lib/utils/validation';
import { generateIdempotencyKey } from '@/lib/utils/idempotency';
import { createAuditLog } from '@/lib/db/queries/audit';
import { withTransaction } from '@/lib/db/index';
import { emitTransactionCreated } from '@/lib/events/transaction-events';
import '@/lib/events/init';

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    await requirePermission(user, RESOURCES.TRANSACTIONS, ACTIONS.CREATE);
    const body = await request.json();

    let walletId = body.wallet_id;
    if (!walletId) {
      const wallet = await getWalletByUserId(user.id);
      if (!wallet) {
        return NextResponse.json(
          { error: 'Wallet not found' },
          { status: 404 }
        );
      }
      walletId = wallet.id;
    }

    const validated = createTransactionSchema.parse({
      ...body,
      wallet_id: walletId,
      transaction_category:
        body.transaction_category ||
        (body.type === 'credit' ? 'manual_credit' : 'manual_debit'),
    });

    const idempotencyKey =
      validated.idempotency_key || generateIdempotencyKey();

    const transaction = await withTransaction(async (client) => {
      const tx = await createTransaction(
        {
          ...validated,
          status: 'successful',
          idempotency_key: idempotencyKey,
        },
        client
      );

      await createAuditLog(
        {
          action: 'CREATE',
          entity_type: 'TRANSACTION',
          entity_id: tx.id,
          user_id: user.id,
          changes: { manual_operation: true },
        },
        client
      );

      return tx;
    });

    await emitTransactionCreated(transaction, user.id);

    return NextResponse.json(
      {
        transaction: {
          ...transaction,
          amount: parseFloat(transaction.amount),
          metadata:
            typeof transaction.metadata === 'string'
              ? JSON.parse(transaction.metadata)
              : transaction.metadata,
        },
      },
      { status: 201 }
    );
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

    console.error('Manual transaction error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create manual transaction' },
      { status: 500 }
    );
  }
}
