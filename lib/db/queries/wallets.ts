import { query, queryOne } from '../index';
import { WalletRow } from '../types';
import { v4 as uuidv4 } from 'uuid';

export async function getWalletByUserId(userId: string): Promise<WalletRow | null> {
  return queryOne<WalletRow>('SELECT * FROM wallets WHERE user_id = $1', [userId]);
}

export async function getWalletById(id: string): Promise<WalletRow | null> {
  return queryOne<WalletRow>('SELECT * FROM wallets WHERE id = $1', [id]);
}

export async function createWallet(userId: string): Promise<WalletRow> {
  const id = uuidv4();
  const result = await query<WalletRow>(
    `INSERT INTO wallets (id, user_id)
     VALUES ($1, $2)
     RETURNING *`,
    [id, userId]
  );
  return result[0];
}

