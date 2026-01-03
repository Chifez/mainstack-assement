import { query, queryOne } from '../index';
import { PoolClient } from 'pg';
import { UserRow } from '../types';
import { v4 as uuidv4 } from 'uuid';

export async function getUserById(
  id: string,
  client?: PoolClient
): Promise<UserRow | null> {
  return queryOne<UserRow>(
    'SELECT * FROM users WHERE id = $1',
    [id],
    client
  );
}

export async function getUserByEmail(
  email: string,
  client?: PoolClient
): Promise<UserRow | null> {
  return queryOne<UserRow>(
    'SELECT * FROM users WHERE email = $1',
    [email],
    client
  );
}

export interface CreateUserData {
  first_name: string;
  last_name: string;
  email: string;
}

export async function createUser(
  data: CreateUserData,
  client?: PoolClient
): Promise<UserRow> {
  const id = uuidv4();
  const result = await query<UserRow>(
    `INSERT INTO users (id, first_name, last_name, email)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [id, data.first_name, data.last_name, data.email],
    client
  );
  return result[0];
}


