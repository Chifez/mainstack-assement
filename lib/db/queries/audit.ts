import { query, queryOne } from '../index';
import { PoolClient } from 'pg';
import { AuditLogRow } from '../types';
import { v4 as uuidv4 } from 'uuid';

export interface CreateAuditLogData {
  action: 'CREATE' | 'UPDATE' | 'REVERSE' | 'DELETE';
  entity_type: 'TRANSACTION' | 'WALLET' | 'USER';
  entity_id: string;
  user_id: string;
  changes?: Record<string, any>;
  ip_address?: string;
}

export async function createAuditLog(
  data: CreateAuditLogData,
  client?: PoolClient
): Promise<AuditLogRow> {
  const id = uuidv4();
  const result = await query<AuditLogRow>(
    `INSERT INTO audit_logs (
      id, action, entity_type, entity_id, user_id, changes, ip_address
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      id,
      data.action,
      data.entity_type,
      data.entity_id,
      data.user_id,
      JSON.stringify(data.changes || {}),
      data.ip_address || null,
    ],
    client
  );
  return result[0];
}

export interface AuditLogFilters {
  entity_type?: 'TRANSACTION' | 'WALLET' | 'USER';
  entity_id?: string;
  user_id?: string;
  date_from?: Date;
  date_to?: Date;
  limit?: number;
  offset?: number;
}

export async function getAuditLogs(
  filters?: AuditLogFilters,
  client?: PoolClient
): Promise<AuditLogRow[]> {
  let sql = 'SELECT * FROM audit_logs WHERE 1=1';
  const params: any[] = [];
  let paramIndex = 1;

  if (filters) {
    if (filters.entity_type) {
      sql += ` AND entity_type = $${paramIndex}`;
      params.push(filters.entity_type);
      paramIndex++;
    }
    if (filters.entity_id) {
      sql += ` AND entity_id = $${paramIndex}`;
      params.push(filters.entity_id);
      paramIndex++;
    }
    if (filters.user_id) {
      sql += ` AND user_id = $${paramIndex}`;
      params.push(filters.user_id);
      paramIndex++;
    }
    if (filters.date_from) {
      sql += ` AND created_at >= $${paramIndex}`;
      params.push(filters.date_from);
      paramIndex++;
    }
    if (filters.date_to) {
      sql += ` AND created_at <= $${paramIndex}`;
      params.push(filters.date_to);
      paramIndex++;
    }
  }

  sql += ' ORDER BY created_at DESC';

  if (filters?.limit) {
    sql += ` LIMIT $${paramIndex}`;
    params.push(filters.limit);
    paramIndex++;
    if (filters.offset) {
      sql += ` OFFSET $${paramIndex}`;
      params.push(filters.offset);
    }
  }

  return query<AuditLogRow>(sql, params, client);
}


