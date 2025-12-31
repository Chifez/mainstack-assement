import { NextResponse } from 'next/server';
import { registerUserSchema } from '@/lib/utils/validation';
import { createUser } from '@/lib/db/queries/users';
import { createWallet } from '@/lib/db/queries/wallets';
import { getUserByEmail } from '@/lib/db/queries/users';
import { setSession } from '@/lib/auth/session';
import { createAuditLog } from '@/lib/db/queries/audit';
import { ValidationError } from '@/lib/utils/errors';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = registerUserSchema.parse(body);

    // Check if user already exists
    const existingUser = await getUserByEmail(validated.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser(validated);

    // Create wallet for user
    const wallet = await createWallet(user.id);

    // Set session
    await setSession(user.id);

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
      entity_type: 'USER',
      entity_id: user.id,
      user_id: user.id,
      changes: { created: true },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
      wallet: {
        id: wallet.id,
      },
    });
  } catch (error: any) {
    if (error instanceof ValidationError || error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.message || 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
