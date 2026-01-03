/**
 * Permission definitions and constants
 * Defines all resources and actions available in the system
 */

export const RESOURCES = {
  TRANSACTIONS: 'transactions',
  WALLETS: 'wallets',
  AUDIT: 'audit',
  USERS: 'users',
  ROLES: 'roles',
} as const;

export const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  REVERSE: 'reverse',
  EXPORT: 'export',
  ASSIGN: 'assign',
} as const;

export type Resource = typeof RESOURCES[keyof typeof RESOURCES];
export type Action = typeof ACTIONS[keyof typeof ACTIONS];

/**
 * Permission string format: "resource:action"
 * Example: "transactions:create"
 */
export function formatPermission(resource: Resource, action: Action): string {
  return `${resource}:${action}`;
}

/**
 * Parse permission string into resource and action
 */
export function parsePermission(
  permission: string
): { resource: Resource; action: Action } | null {
  const [resource, action] = permission.split(':');
  if (!resource || !action) {
    return null;
  }
  if (
    !Object.values(RESOURCES).includes(resource as Resource) ||
    !Object.values(ACTIONS).includes(action as Action)
  ) {
    return null;
  }
  return { resource: resource as Resource, action: action as Action };
}

/**
 * Common permission combinations
 */
export const PERMISSIONS = {
  // Transaction permissions
  TRANSACTIONS_CREATE: formatPermission(RESOURCES.TRANSACTIONS, ACTIONS.CREATE),
  TRANSACTIONS_READ: formatPermission(RESOURCES.TRANSACTIONS, ACTIONS.READ),
  TRANSACTIONS_UPDATE: formatPermission(RESOURCES.TRANSACTIONS, ACTIONS.UPDATE),
  TRANSACTIONS_REVERSE: formatPermission(
    RESOURCES.TRANSACTIONS,
    ACTIONS.REVERSE
  ),
  TRANSACTIONS_DELETE: formatPermission(RESOURCES.TRANSACTIONS, ACTIONS.DELETE),

  // Wallet permissions
  WALLETS_CREATE: formatPermission(RESOURCES.WALLETS, ACTIONS.CREATE),
  WALLETS_READ: formatPermission(RESOURCES.WALLETS, ACTIONS.READ),
  WALLETS_UPDATE: formatPermission(RESOURCES.WALLETS, ACTIONS.UPDATE),
  WALLETS_DELETE: formatPermission(RESOURCES.WALLETS, ACTIONS.DELETE),

  // Audit permissions
  AUDIT_READ: formatPermission(RESOURCES.AUDIT, ACTIONS.READ),
  AUDIT_EXPORT: formatPermission(RESOURCES.AUDIT, ACTIONS.EXPORT),

  // User permissions
  USERS_CREATE: formatPermission(RESOURCES.USERS, ACTIONS.CREATE),
  USERS_READ: formatPermission(RESOURCES.USERS, ACTIONS.READ),
  USERS_UPDATE: formatPermission(RESOURCES.USERS, ACTIONS.UPDATE),
  USERS_DELETE: formatPermission(RESOURCES.USERS, ACTIONS.DELETE),

  // Role permissions
  ROLES_CREATE: formatPermission(RESOURCES.ROLES, ACTIONS.CREATE),
  ROLES_READ: formatPermission(RESOURCES.ROLES, ACTIONS.READ),
  ROLES_UPDATE: formatPermission(RESOURCES.ROLES, ACTIONS.UPDATE),
  ROLES_DELETE: formatPermission(RESOURCES.ROLES, ACTIONS.DELETE),
  ROLES_ASSIGN: formatPermission(RESOURCES.ROLES, ACTIONS.ASSIGN),
} as const;

