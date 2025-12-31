export interface UserRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export interface WalletRow {
  id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export type TransactionType = 'credit' | 'debit' | 'reversal';
export type TransactionCategory =
  | 'deposit'
  | 'withdrawal'
  | 'manual_credit'
  | 'manual_debit'
  | 'fee'
  | 'refund';
export type TransactionStatus =
  | 'pending'
  | 'processing'
  | 'successful'
  | 'failed'
  | 'reversed';

export interface TransactionRow {
  id: string;
  transaction_id: string;
  wallet_id: string;
  type: TransactionType;
  transaction_category: TransactionCategory;
  status: TransactionStatus;
  amount: string; // Decimal as string from PostgreSQL
  currency: string;
  metadata: Record<string, any>;
  reversal_of: string | null;
  reversed_by: string | null;
  idempotency_key: string | null;
  sequence: number;
  created_at: Date;
  updated_at: Date;
}

export interface AuditLogRow {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'REVERSE' | 'DELETE';
  entity_type: 'TRANSACTION' | 'WALLET' | 'USER';
  entity_id: string;
  user_id: string;
  changes: Record<string, any>;
  ip_address: string | null;
  created_at: Date;
}

export interface IdempotencyKeyRow {
  key: string;
  transaction_id: string;
  created_at: Date;
}

export interface BalanceResult {
  ledger_balance: string;
  available_balance: string;
  pending_debits: string;
  pending_credits: string;
}
