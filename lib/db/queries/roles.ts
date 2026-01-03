import { query, queryOne } from '../index';
import { PoolClient } from 'pg';
import { v4 as uuidv4 } from 'uuid';

export interface RoleRow {
  id: string;
  name: string;
  description: string | null;
  created_at: Date;
}

export interface PermissionRow {
  id: string;
  resource: string;
  action: string;
  description: string | null;
  created_at: Date;
}

export interface RolePermissionRow {
  role_id: string;
  permission_id: string;
}

/**
 * Get role by name
 */
export async function getRoleByName(
  name: string,
  client?: PoolClient
): Promise<RoleRow | null> {
  return queryOne<RoleRow>(
    'SELECT * FROM roles WHERE name = $1',
    [name],
    client
  );
}

/**
 * Get role by ID
 */
export async function getRoleById(
  id: string,
  client?: PoolClient
): Promise<RoleRow | null> {
  return queryOne<RoleRow>('SELECT * FROM roles WHERE id = $1', [id], client);
}

/**
 * Get all roles
 */
export async function getAllRoles(
  client?: PoolClient
): Promise<RoleRow[]> {
  return query<RoleRow>('SELECT * FROM roles ORDER BY name', [], client);
}

/**
 * Get permission by resource and action
 */
export async function getPermission(
  resource: string,
  action: string,
  client?: PoolClient
): Promise<PermissionRow | null> {
  return queryOne<PermissionRow>(
    'SELECT * FROM permissions WHERE resource = $1 AND action = $2',
    [resource, action],
    client
  );
}

/**
 * Get permission by ID
 */
export async function getPermissionById(
  id: string,
  client?: PoolClient
): Promise<PermissionRow | null> {
  return queryOne<PermissionRow>(
    'SELECT * FROM permissions WHERE id = $1',
    [id],
    client
  );
}

/**
 * Get all permissions for a role
 */
export async function getRolePermissions(
  roleId: string,
  client?: PoolClient
): Promise<PermissionRow[]> {
  return query<PermissionRow>(
    `SELECT p.* FROM permissions p
     INNER JOIN role_permissions rp ON p.id = rp.permission_id
     WHERE rp.role_id = $1
     ORDER BY p.resource, p.action`,
    [roleId],
    client
  );
}

/**
 * Get all roles for a user
 */
export async function getUserRoles(
  userId: string,
  client?: PoolClient
): Promise<RoleRow[]> {
  return query<RoleRow>(
    `SELECT r.* FROM roles r
     INNER JOIN user_roles ur ON r.id = ur.role_id
     WHERE ur.user_id = $1
     ORDER BY r.name`,
    [userId],
    client
  );
}

/**
 * Get all permissions for a user (through their roles)
 */
export async function getUserPermissions(
  userId: string,
  client?: PoolClient
): Promise<PermissionRow[]> {
  return query<PermissionRow>(
    `SELECT DISTINCT p.* FROM permissions p
     INNER JOIN role_permissions rp ON p.id = rp.permission_id
     INNER JOIN user_roles ur ON rp.role_id = ur.role_id
     WHERE ur.user_id = $1
     ORDER BY p.resource, p.action`,
    [userId],
    client
  );
}

/**
 * Check if user has a specific permission
 */
export async function userHasPermission(
  userId: string,
  resource: string,
  action: string,
  client?: PoolClient
): Promise<boolean> {
  const result = await queryOne<{ exists: boolean }>(
    `SELECT EXISTS(
       SELECT 1 FROM permissions p
       INNER JOIN role_permissions rp ON p.id = rp.permission_id
       INNER JOIN user_roles ur ON rp.role_id = ur.role_id
       WHERE ur.user_id = $1 AND p.resource = $2 AND p.action = $3
     ) as exists`,
    [userId, resource, action],
    client
  );
  return result?.exists || false;
}

/**
 * Assign role to user
 */
export async function assignRoleToUser(
  userId: string,
  roleId: string,
  client?: PoolClient
): Promise<void> {
  await query(
    `INSERT INTO user_roles (user_id, role_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, role_id) DO NOTHING`,
    [userId, roleId],
    client
  );
}

/**
 * Remove role from user
 */
export async function removeRoleFromUser(
  userId: string,
  roleId: string,
  client?: PoolClient
): Promise<void> {
  await query(
    'DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2',
    [userId, roleId],
    client
  );
}

/**
 * Add permission to role
 */
export async function addPermissionToRole(
  roleId: string,
  permissionId: string,
  client?: PoolClient
): Promise<void> {
  await query(
    `INSERT INTO role_permissions (role_id, permission_id)
     VALUES ($1, $2)
     ON CONFLICT (role_id, permission_id) DO NOTHING`,
    [roleId, permissionId],
    client
  );
}

/**
 * Remove permission from role
 */
export async function removePermissionFromRole(
  roleId: string,
  permissionId: string,
  client?: PoolClient
): Promise<void> {
  await query(
    'DELETE FROM role_permissions WHERE role_id = $1 AND permission_id = $2',
    [roleId, permissionId],
    client
  );
}

