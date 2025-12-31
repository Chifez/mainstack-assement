import { query, queryOne } from '../index';
import { UserRow } from '../types';
import { v4 as uuidv4 } from 'uuid';

export async function getUserById(id: string): Promise<UserRow | null> {
  return queryOne<UserRow>('SELECT * FROM users WHERE id = $1', [id]);
}

export async function getUserByEmail(email: string): Promise<UserRow | null> {
  return queryOne<UserRow>('SELECT * FROM users WHERE email = $1', [email]);
}

export interface CreateUserData {
  first_name: string;
  last_name: string;
  email: string;
}

export async function createUser(data: CreateUserData): Promise<UserRow> {
  const id = uuidv4();
  const result = await query<UserRow>(
    `INSERT INTO users (id, first_name, last_name, email)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [id, data.first_name, data.last_name, data.email]
  );
  return result[0];
}
