export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Balance {
  ledger_balance: number;
  available_balance: number;
  pending_debits: number;
  pending_credits: number;
  currency: string;
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
  | 'reversed'
  | 'void';

export interface Transaction {
  id: string;
  transaction_id: string;
  wallet_id: string;
  type: TransactionType;
  transaction_category: TransactionCategory;
  status: TransactionStatus;
  amount: number;
  currency: string;
  metadata: Record<string, any>;
  reversal_of?: string | null;
  reversed_by?: string | null;
  idempotency_key?: string | null;
  sequence: number;
  created_at: string;
  updated_at: string;
  // Legacy fields for backward compatibility
  payment_reference?: string;
  date?: string;
  isDuplicate?: boolean;
}

export interface NavItem {
  icon: string;
  label: string;
  description: string;
  href: string;
}

export interface NavDropdownProps {
  label: string;
  icon: string;
  activeIcon: string;
  isActive: boolean;
  items: NavItem[];
  isMobile?: boolean;
}

export interface DailyTotal {
  date: string;
  formattedDate: string;
  total: number;
}

export interface ChartPoint {
  x: number;
  y: number;
  total: number;
  date: string;
  transactionType?: 'credit' | 'debit' | 'reversal';
  transactionId?: string;
}

export interface ChartData {
  path: string;
  fillPath: string;
  points: ChartPoint[];
  firstDate: string;
  lastDate: string;
}

export interface BalanceChartProps {
  transactions: Transaction[];
}
