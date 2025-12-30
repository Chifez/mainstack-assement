import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { getWalletByUserId } from '@/lib/db/queries/wallets';

export async function GET() {
  try {
    const user = await requireAuth();
    const wallet = await getWalletByUserId(user.id);

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ wallet });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.error('Get wallet error:', error);
    return NextResponse.json(
      { error: 'Failed to get wallet' },
      { status: 500 }
    );
  }
}

