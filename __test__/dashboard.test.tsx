import type React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BalanceCard } from '@/components/dashboard/balance-card';
import { WalletInfo } from '@/components/dashboard/wallet-info';
import { TransactionList } from '@/components/dashboard/transaction-list';
import * as api from '@/lib/api';

// Mocking the API calls
jest.mock('@/lib/api', () => ({
  fetchWallet: jest.fn(),
  fetchTransactions: jest.fn(),
}));

// To use react query here i would just create a wrapper with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Dashboard Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('BalanceCard', () => {
    it('renders loading state initially', () => {
      render(<BalanceCard />, { wrapper: createWrapper() });
      expect(screen.getByText('Available Balance')).toBeTruthy();
    });

    it('renders wallet data when loaded', async () => {
      const mockWallet = {
        balance: 120500.0,
        total_payout: 55080.0,
        total_revenue: 175580.0,
        pending_payout: 0.0,
        ledger_balance: 0.0,
      };

      // @ts-ignore
      api.fetchWallet.mockResolvedValue(mockWallet);

      render(<BalanceCard />, { wrapper: createWrapper() });
      await waitFor(() => {
        expect(screen.getByText('$120,500.00')).toBeTruthy();
      });
    });
  });

  describe('WalletInfo', () => {
    it('renders loading state initially', () => {
      render(<WalletInfo />, { wrapper: createWrapper() });

      expect(screen.getByText('Ledger Balance')).toBeTruthy();
      expect(screen.getByText('Total Payout')).toBeTruthy();
      expect(screen.getByText('Total Revenue')).toBeTruthy();
      expect(screen.getByText('Pending Payout')).toBeTruthy();
    });

    it('renders wallet info data when loaded', async () => {
      const mockWallet = {
        balance: 120500.0,
        total_payout: 55080.0,
        total_revenue: 175580.0,
        pending_payout: 0.0,
        ledger_balance: 0.0,
      };

      // @ts-ignore
      api.fetchWallet.mockResolvedValue(mockWallet);

      render(<WalletInfo />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('$0.00')).toBeTruthy(); // Ledger Balance
        expect(screen.getByText('$55,080.00')).toBeTruthy(); // Total Payout
        expect(screen.getByText('$175,580.00')).toBeTruthy(); // Total Revenue
      });
    });
  });

  describe('TransactionList', () => {
    it('renders loading state initially', () => {
      // @ts-ignore
      api.fetchTransactions.mockResolvedValue([]);

      render(<TransactionList />, { wrapper: createWrapper() });
      expect(screen.getByText('0 Transactions')).toBeTruthy();
    });

    it('renders transactions when loaded', async () => {
      const mockTransactions = [
        {
          amount: 1000,
          metadata: {
            name: 'Psychology of Money',
            type: 'book',
            email: 'morgan@example.com',
          },
          payment_reference: 'T12345',
          status: 'successful',
          type: 'deposit',
          date: '2022-03-03T10:00:00Z',
        },
      ];

      // @ts-ignore
      api.fetchTransactions.mockResolvedValue(mockTransactions);

      render(<TransactionList />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('1 Transactions')).toBeTruthy();
        expect(screen.getByText('Psychology of Money')).toBeTruthy();
      });
    });
  });
});
