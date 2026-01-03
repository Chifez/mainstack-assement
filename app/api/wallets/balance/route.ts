import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { getWalletByUserId } from '@/lib/db/queries/wallets';
import { calculateBalance } from '@/lib/db/queries/balance';

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const wallet = await getWalletByUserId(user.id);

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const currency = searchParams.get('currency') || 'USD';

    const balance = await calculateBalance(wallet.id, currency);

    return NextResponse.json({
      balance: {
        ledger_balance: parseFloat(balance.ledger_balance),
        available_balance: parseFloat(balance.available_balance),
        pending_debits: parseFloat(balance.pending_debits),
        pending_credits: parseFloat(balance.pending_credits),
        currency,
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error('Get balance error:', error);
    return NextResponse.json(
      { error: 'Failed to get balance' },
      { status: 500 }
    );
  }
}


