import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { requirePermission } from '@/lib/auth/rbac';
import { RESOURCES, ACTIONS } from '@/lib/auth/permissions';
import { getWalletByUserId } from '@/lib/db/queries/wallets';

export async function GET() {
  try {
    const user = await requireAuth();
    await requirePermission(user, RESOURCES.WALLETS, ACTIONS.READ);
    const wallet = await getWalletByUserId(user.id);

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    return NextResponse.json({ wallet });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.name === 'UnauthorizedError') {
      return NextResponse.json(
        { error: error.message || 'Unauthorized' },
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


