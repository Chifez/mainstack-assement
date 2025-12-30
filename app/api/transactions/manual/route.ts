import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { getWalletByUserId } from '@/lib/db/queries/wallets';
import { createTransaction } from '@/lib/db/queries/transactions';
import { createTransactionSchema } from '@/lib/utils/validation';
import { generateIdempotencyKey } from '@/lib/utils/idempotency';
import { createAuditLog } from '@/lib/db/queries/audit';

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    // For manual operations, wallet_id should be provided or use current user's wallet
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
      // Manual operations should use manual_credit or manual_debit category
      transaction_category:
        body.transaction_category ||
        (body.type === 'credit' ? 'manual_credit' : 'manual_debit'),
    });

    const idempotencyKey =
      validated.idempotency_key || generateIdempotencyKey();

    const transaction = await createTransaction({
      ...validated,
      status: 'successful', // Manual transactions are immediately successful
      idempotency_key: idempotencyKey,
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
      entity_type: 'TRANSACTION',
      entity_id: transaction.id,
      user_id: user.id,
      changes: { manual_operation: true },
    });

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
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
