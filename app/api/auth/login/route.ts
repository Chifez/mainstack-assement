import { NextResponse } from 'next/server';
import { loginUserSchema } from '@/lib/utils/validation';
import { getUserByEmail } from '@/lib/db/queries/users';
import { setSession } from '@/lib/auth/session';
import { ValidationError } from '@/lib/utils/errors';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = loginUserSchema.parse(body);

    // Find user by email
    const user = await getUserByEmail(validated.email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or user not found' },
        { status: 401 }
      );
    }

    // Set session (simple demo - no password check)
    await setSession(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
    });
  } catch (error: any) {
    if (error instanceof ValidationError || error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.message || 'Validation error' },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}


