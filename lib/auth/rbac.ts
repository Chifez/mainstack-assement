import { UserRow } from '@/lib/db/types';
import { userHasPermission } from '@/lib/db/queries/roles';
import { UnauthorizedError } from '@/lib/utils/errors';
import { Resource, Action } from './permissions';

/**
 * Check if user has permission to perform an action on a resource
 * Throws UnauthorizedError if permission is denied
 */
export async function requirePermission(
  user: UserRow,
  resource: Resource,
  action: Action
): Promise<void> {
  const hasPermission = await userHasPermission(user.id, resource, action);
  if (!hasPermission) {
    throw new UnauthorizedError(
      `Permission denied: ${resource}:${action}`
    );
  }
}

/**
 * Check if user has permission (returns boolean, doesn't throw)
 */
export async function checkPermission(
  user: UserRow,
  resource: Resource,
  action: Action
): Promise<boolean> {
  return userHasPermission(user.id, resource, action);
}

/**
 * Check if user can access a specific wallet
 * Users can only access their own wallet unless they have admin permissions
 */
export async function canAccessWallet(
  user: UserRow,
  walletUserId: string
): Promise<boolean> {
  // Admin can access any wallet
  const isAdmin = await userHasPermission(user.id, 'roles', 'read');
  if (isAdmin) {
    return true;
  }

  // Users can only access their own wallet
  return user.id === walletUserId;
}

/**
 * Check if user can access a specific transaction
 * Users can only access transactions from their own wallet unless they have admin permissions
 */
export async function canAccessTransaction(
  user: UserRow,
  transactionWalletUserId: string
): Promise<boolean> {
  return canAccessWallet(user, transactionWalletUserId);
}

