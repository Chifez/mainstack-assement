import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { requirePermission } from '@/lib/auth/rbac';
import { RESOURCES, ACTIONS } from '@/lib/auth/permissions';
import { getWalletByUserId } from '@/lib/db/queries/wallets';
import {
  getTransactionsByWallet,
  createTransaction,
} from '@/lib/db/queries/transactions';
import {
  createTransactionSchema,
  validateSufficientFunds,
} from '@/lib/utils/validation';
import {
  ensureIdempotency,
  generateIdempotencyKey,
} from '@/lib/utils/idempotency';
import {
  simulateNetworkFailure,
  shouldForceInsufficientFunds,
  shouldUseDuplicateIdempotencyKey,
} from '@/lib/utils/simulations';
import { createAuditLog } from '@/lib/db/queries/audit';
import { InsufficientFundsError } from '@/lib/utils/errors';
import { transactionProcessor } from '@/lib/services/transaction-processor';
import { withTransaction } from '@/lib/db/index';
import { emitTransactionCreated } from '@/lib/events/transaction-events';
import '@/lib/events/init';

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    await requirePermission(user, RESOURCES.TRANSACTIONS, ACTIONS.READ);
    const wallet = await getWalletByUserId(user.id);

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as any;
    const transaction_category = searchParams.get(
      'transaction_category'
    ) as any;
    const status = searchParams.get('status') as any;
    const currency = searchParams.get('currency');
    const date_from = searchParams.get('date_from');
    const date_to = searchParams.get('date_to');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const transactions = await getTransactionsByWallet(wallet.id, {
      type,
      transaction_category,
      status,
      currency: currency || undefined,
      date_from: date_from ? new Date(date_from) : undefined,
      date_to: date_to ? new Date(date_to) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });

    return NextResponse.json({
      transactions: transactions.map((t) => ({
        ...t,
        amount: parseFloat(t.amount),
        metadata:
          typeof t.metadata === 'string' ? JSON.parse(t.metadata) : t.metadata,
      })),
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error('Get transactions error:', error);
    return NextResponse.json(
      { error: 'Failed to get transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    await requirePermission(user, RESOURCES.TRANSACTIONS, ACTIONS.CREATE);
    const wallet = await getWalletByUserId(user.id);

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    const simulateNetwork =
      request.headers.get('x-simulate-network-failure') === 'true';
    const simulateInsufficient =
      request.headers.get('x-simulate-insufficient-funds') === 'true';
    const simulateDuplicate =
      request.headers.get('x-simulate-duplicate') === 'true';
    const simulateReversal =
      request.headers.get('x-simulate-reversal') === 'true';

    const body = await request.json();
    const validated = createTransactionSchema.parse({
      ...body,
      wallet_id: wallet.id,
    });

    let idempotencyKey = validated.idempotency_key || generateIdempotencyKey();

    if (simulateDuplicate) {
      idempotencyKey = shouldUseDuplicateIdempotencyKey(true) || idempotencyKey;
    }

    if (validated.type === 'debit') {
      const fundsCheck = await validateSufficientFunds(
        wallet.id,
        validated.amount,
        validated.currency
      );

      if (
        simulateInsufficient ||
        shouldForceInsufficientFunds(simulateInsufficient)
      ) {
        return NextResponse.json(
          {
            error: 'Insufficient funds',
            available_balance: fundsCheck.availableBalance,
            required_amount: validated.amount,
          },
          { status: 400 }
        );
      }

      if (!fundsCheck.valid) {
        throw new InsufficientFundsError(
          fundsCheck.availableBalance,
          fundsCheck.requiredAmount
        );
      }
    }

    const { transaction, isDuplicate, existingTransaction } =
      await withTransaction(async (client) => {
        const idempotencyResult = await ensureIdempotency(
          idempotencyKey,
          (txClient) =>
            createTransaction(
              {
                ...validated,
                status: 'pending',
                idempotency_key: idempotencyKey,
              },
              txClient
            ),
          client
        );

        if (idempotencyResult.isDuplicate && idempotencyResult.existingTransaction) {
          return {
            transaction: null,
            isDuplicate: true,
            existingTransaction: idempotencyResult.existingTransaction,
          };
        }

        const tx = idempotencyResult.result;

        await createAuditLog(
          {
            action: 'CREATE',
            entity_type: 'TRANSACTION',
            entity_id: tx.id,
            user_id: user.id,
            changes: { created: true },
          },
          client
        );

        return {
          transaction: tx,
          isDuplicate: false,
          existingTransaction: undefined,
        };
      });

    if (isDuplicate && existingTransaction) {
      return NextResponse.json(
        {
          isDuplicate: true,
          message:
            'This transaction has already been processed. Duplicate transaction detected.',
          transaction: {
            ...existingTransaction,
            amount: parseFloat(existingTransaction.amount),
            metadata:
              typeof existingTransaction.metadata === 'string'
                ? JSON.parse(existingTransaction.metadata)
                : existingTransaction.metadata,
            isDuplicate: true,
          },
        },
        { status: 200 }
      );
    }

    if (transaction) {
      await emitTransactionCreated(transaction, user.id);
    }

    if (
      transaction.transaction_category !== 'manual_credit' &&
      transaction.transaction_category !== 'manual_debit'
    ) {
      transactionProcessor.addToQueue(
        transaction.id,
        transaction.wallet_id,
        user.id,
        transaction.type as 'credit' | 'debit',
      transaction.transaction_category,
      simulateNetwork,
      simulateReversal
    );
    }

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

    if (error instanceof InsufficientFundsError) {
      return NextResponse.json(
        {
          error: error.message,
          available_balance: error.availableBalance,
          required_amount: error.requiredAmount,
        },
        { status: 400 }
      );
    }

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create transaction error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
