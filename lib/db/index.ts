import { Pool, PoolClient } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function query<T = any>(
  text: string,
  params?: any[],
  client?: PoolClient
): Promise<T[]> {
  const executor = client || pool;
  const result = await executor.query(text, params);
  return result.rows as T[];
}

// Helper function for single row queries
export async function queryOne<T = any>(
  text: string,
  params?: any[],
  client?: PoolClient
): Promise<T | null> {
  const executor = client || pool;
  const result = await executor.query(text, params);
  return (result.rows[0] as T) || null;
}

export type IsolationLevel =
  | 'READ UNCOMMITTED'
  | 'READ COMMITTED'
  | 'REPEATABLE READ'
  | 'SERIALIZABLE';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 100;

/**
 * Execute a callback within a database transaction.
 * Provides ACID guarantees with automatic rollback on error.
 *
 * @param callback - Function that receives a PoolClient and returns a Promise
 * @param isolationLevel - Transaction isolation level (default: READ COMMITTED)
 * @returns The result of the callback function
 * @throws The original error if transaction fails
 */
export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
  isolationLevel: IsolationLevel = 'READ COMMITTED'
): Promise<T> {
  const client = await pool.connect();
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      await client.query(`SET TRANSACTION ISOLATION LEVEL ${isolationLevel}`);
      await client.query('BEGIN');

      try {
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error: any) {
      const isDeadlock =
        error.code === '40P01' ||
        error.message?.includes('deadlock') ||
        error.message?.includes('Deadlock');

      if (isDeadlock && retries < MAX_RETRIES - 1) {
        retries++;
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY_MS * retries)
        );
        continue;
      }

      client.release();
      throw error;
    }
  }

  throw new Error('Transaction failed after maximum retries');
}

export { pool };
