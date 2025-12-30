import { cookies } from 'next/headers';
import { getUserById } from '@/lib/db/queries/users';
import { UserRow } from '@/lib/db/types';

const SESSION_COOKIE_NAME = 'session_user_id';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function getSession(): Promise<UserRow | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!userId) {
    return null;
  }

  return getUserById(userId);
}

export async function setSession(userId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAuth(): Promise<UserRow> {
  const user = await getSession();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

