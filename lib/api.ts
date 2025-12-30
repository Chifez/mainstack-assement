import { Transaction, User, Wallet, Balance } from './types';
import { useSimulationStore } from '@/store/simulation-store';

const API_BASE = '/api';

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth functions
export async function registerUser(data: {
  first_name: string;
  last_name: string;
  email: string;
}): Promise<{ user: User; wallet: Wallet }> {
  return fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function loginUser(email: string): Promise<{ user: User }> {
  return fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function logoutUser(): Promise<void> {
  await fetchAPI('/auth/logout', {
    method: 'POST',
  });
}

export async function getCurrentUser(): Promise<{ user: User }> {
  return fetchAPI('/auth/me');
}

// User functions
export async function fetchUser(): Promise<User> {
  const response = await getCurrentUser();
  return response.user;
}

// Wallet functions
export async function fetchWallet(): Promise<Wallet> {
  const response = await fetchAPI<{ wallet: Wallet }>('/wallets');
  return response.wallet;
}

export async function fetchBalance(currency: string = 'USD'): Promise<Balance> {
  const response = await fetchAPI<{ balance: Balance }>(
    `/wallets/balance?currency=${currency}`
  );
  return response.balance;
}

// Transaction functions
export interface TransactionFilters {
  type?: string;
  transaction_category?: string;
  status?: string;
  currency?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

export async function fetchTransactions(
  filters?: TransactionFilters
): Promise<Transaction[]> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }

  const queryString = params.toString();
  const response = await fetchAPI<{ transactions: Transaction[] }>(
    `/transactions${queryString ? `?${queryString}` : ''}`
  );
  return response.transactions;
}

export interface CreateTransactionRequest {
  type: 'credit' | 'debit' | 'reversal';
  transaction_category:
    | 'deposit'
    | 'withdrawal'
    | 'manual_credit'
    | 'manual_debit'
    | 'fee'
    | 'refund';
  amount: number;
  currency?: string;
  metadata?: Record<string, any>;
  idempotency_key?: string;
}

export async function createTransaction(
  data: CreateTransactionRequest
): Promise<Transaction> {
  // Get simulation state - handle both client and server side
  let simulationStore: any = null;
  if (typeof window !== 'undefined') {
    simulationStore = useSimulationStore.getState();
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add simulation headers
  if (simulationStore?.simulateNetworkFailure) {
    headers['x-simulate-network-failure'] = 'true';
  }
  if (simulationStore?.simulateInsufficientFunds) {
    headers['x-simulate-insufficient-funds'] = 'true';
  }
  if (simulationStore?.simulateDuplicateTransaction) {
    headers['x-simulate-duplicate'] = 'true';
  }

  const response = await fetchAPI<{ transaction: Transaction }>(
    '/transactions',
    {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    }
  );

  return response.transaction;
}

export async function createManualTransaction(
  data: CreateTransactionRequest
): Promise<Transaction> {
  const response = await fetchAPI<{ transaction: Transaction }>(
    '/transactions/manual',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
  return response.transaction;
}

export async function getTransactionById(id: string): Promise<Transaction> {
  const response = await fetchAPI<{ transaction: Transaction }>(
    `/transactions/${id}`
  );
  return response.transaction;
}

export async function reverseTransaction(
  id: string,
  reason?: string
): Promise<Transaction> {
  const response = await fetchAPI<{ reversal: Transaction }>(
    `/transactions/${id}/reverse`,
    {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }
  );
  return response.reversal;
}

// Withdrawal function (for backward compatibility)
export interface WithdrawalRequest {
  amount: number;
  vatAmount: number;
  totalAmount: number;
}

export async function handleWithdrawal({
  amount,
  vatAmount,
  totalAmount,
}: WithdrawalRequest): Promise<{
  transaction: Transaction;
  newBalance: number;
  newPendingPayout: number;
  newLedgerBalance: number;
  success: boolean;
}> {
  const transaction = await createTransaction({
    type: 'debit',
    transaction_category: 'withdrawal',
    amount: totalAmount,
    currency: 'USD',
    metadata: {
      withdrawal_amount: amount,
      vat_amount: vatAmount,
      total_amount: totalAmount,
    },
  });

  const balance = await fetchBalance('USD');

  return {
    transaction,
    newBalance: balance.available_balance,
    newPendingPayout: balance.pending_debits,
    newLedgerBalance: balance.ledger_balance,
    success: true,
  };
}
