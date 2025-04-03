import type React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BalanceCard } from '@/components/dashboard/balance-card';
import { WalletInfo } from '@/components/dashboard/wallet-info';
import { TransactionList } from '@/components/dashboard/transaction-list';
import * as api from '@/lib/api';

// Mock the API functions
jest.mock('@/lib/api', () => ({
  fetchWallet: jest.fn(),
  fetchTransactions: jest.fn(),
}));

// Create a wrapper component that provides the QueryClient
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
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('BalanceCard', () => {
    it('renders loading state initially', () => {
      // @ts-ignore
      api.fetchWallet.mockResolvedValue(undefined);
      // @ts-ignore
      api.fetchTransactions.mockResolvedValue(undefined);

      render(<BalanceCard />, { wrapper: createWrapper() });
      expect(screen.getByText('Available Balance')).toBeTruthy();
    });

    it('renders wallet data when loaded', async () => {
      const mockWallet = {
        balance: 120500,
        total_payout: 55080,
        total_revenue: 175580,
        pending_payout: 0,
        ledger_balance: 0,
      };

      // @ts-ignore
      api.fetchWallet.mockResolvedValue(mockWallet);
      // @ts-ignore
      api.fetchTransactions.mockResolvedValue([]);

      render(<BalanceCard />, { wrapper: createWrapper() });

      await waitFor(() => {
        // Look for the text content that's split across elements
        const balanceElement = screen.getByText((content, element) => {
          return element?.textContent === 'USD 120500';
        });
        expect(balanceElement).toBeTruthy();
      });
    });
  });

  describe('WalletInfo', () => {
    it('renders loading state initially', () => {
      // @ts-ignore
      api.fetchWallet.mockResolvedValue(undefined);

      render(<WalletInfo />, { wrapper: createWrapper() });
      expect(screen.getByText('Ledger Balance')).toBeTruthy();
    });

    it('renders wallet info data when loaded', async () => {
      const mockWallet = {
        balance: 120500,
        total_payout: 55080,
        total_revenue: 175580,
        pending_payout: 0,
        ledger_balance: 0,
      };

      // @ts-ignore
      api.fetchWallet.mockResolvedValue(mockWallet);

      render(<WalletInfo />, { wrapper: createWrapper() });

      await waitFor(() => {
        // Look for the text content that's split across elements
        const ledgerBalance = screen.getAllByText((content, element) => {
          return element?.textContent === 'USD 0';
        });
        const totalPayout = screen.getByText((content, element) => {
          return element?.textContent === 'USD 55080';
        });
        const totalRevenue = screen.getByText((content, element) => {
          return element?.textContent === 'USD 175580';
        });

        expect(ledgerBalance).toBeTruthy();
        expect(totalPayout).toBeTruthy();
        expect(totalRevenue).toBeTruthy();
      });
    });
  });

  describe('TransactionList', () => {
    it('renders loading state initially', () => {
      // @ts-ignore
      api.fetchTransactions.mockResolvedValue(undefined);

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
