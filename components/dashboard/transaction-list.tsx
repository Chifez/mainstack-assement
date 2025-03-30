'use client';

import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronDown, Download } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { fetchTransactions } from '@/lib/api';
import { Transaction } from '@/lib/types';
import { useFilterStore } from '@/store/filter-store';

export function TransactionList() {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  const { setIsFilterOpen } = useFilterStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {transactions?.length || 0} Transactions
          </h2>
          <p className="text-sm text-gray-500">
            Your transactions for the last 7 days
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-full border border-gray-200 px-4"
            onClick={() => setIsFilterOpen(true)}
          >
            <span className="font-semibold">Filter</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-full border border-gray-200 px-4"
          >
            <span className="font-semibold">Export list</span>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
        </div>
      ) : transactions && transactions.length > 0 ? (
        <div className="space-y-6">
          {transactions.map((transaction, index) => (
            <TransactionItem key={index} transaction={transaction} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-gray-100 p-3">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.5 3.75H13.5C13.6989 3.75 13.8897 3.82902 14.0303 3.96967C14.171 4.11032 14.25 4.30109 14.25 4.5V6.75H9.75V4.5C9.75 4.30109 9.82902 4.11032 9.96967 3.96967C10.1103 3.82902 10.3011 3.75 10.5 3.75Z"
                stroke="#888888"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.75 6.75H14.25H17.25C17.4489 6.75 17.6397 6.82902 17.7803 6.96967C17.921 7.11032 18 7.30109 18 7.5V19.5C18 19.6989 17.921 19.8897 17.7803 20.0303C17.6397 20.171 17.4489 20.25 17.25 20.25H6.75C6.55109 20.25 6.36032 20.171 6.21967 20.0303C6.07902 19.8897 6 19.6989 6 19.5V7.5C6 7.30109 6.07902 7.11032 6.21967 6.96967C6.36032 6.82902 6.55109 6.75 6.75 6.75H9.75Z"
                stroke="#888888"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium">No matching transaction found</h3>
          <p className="text-sm text-gray-500">
            Change your filters to see more results, or add a new transaction
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setIsFilterOpen(false)}
          >
            Clear Filter
          </Button>
        </div>
      )}
    </div>
  );
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful':
        return 'status-successful';
      case 'pending':
        return 'status-pending';
      default:
        return 'text-gray-500';
    }
  };

  const getTransactionIcon = (type: string) => {
    if (type?.includes('withdrawal')) {
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full transaction-icon-withdrawal">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.0001 2.5V17.5M10.0001 17.5L16.6667 10.8333M10.0001 17.5L3.33341 10.8333"
              stroke="#EB5757"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    }
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full transaction-icon-success">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.6667 5L7.5 14.1667L3.33333 10"
            stroke="#0EA163"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        {getTransactionIcon(transaction.type)}
        <div>
          <div className="font-medium">
            {transaction.metadata?.name || 'Unnamed Transaction'}
          </div>
          <div className="text-sm text-gray-500">
            {transaction.metadata?.email || 'No email provided'}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium">{formatCurrency(transaction.amount)}</div>
        <div className="text-sm text-gray-500">
          {formatDate(transaction.date)}
        </div>
      </div>
    </div>
  );
}
