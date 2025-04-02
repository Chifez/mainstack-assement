'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { ChevronDown, Download } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

import { formatDate } from '@/lib/utils';
import { fetchTransactions } from '@/lib/api';
import type { Transaction } from '@/lib/types';
import { useFilterStore } from '@/store/filter-store';
import { Badge } from '@/components/ui/badge';

export function TransactionList({ filters }: { filters?: any[] }) {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  const {
    setIsFilterOpen,
    dateRange,
    transactionType,
    transactionStatus,
    setDateRange,
    setTransactionType,
    setTransactionStatus,
  } = useFilterStore();

  const activeFiltersCount = [
    dateRange.from || dateRange.to ? 1 : 0,
    transactionType.length > 0 && !transactionType.includes('all') ? 1 : 0,
    transactionStatus.length > 0 && !transactionStatus.includes('all') ? 1 : 0,
  ].reduce((acc, curr) => acc + curr, 0);

  const filteredTransactions = transactions?.filter((transaction) => {
    // Date range filter
    if (dateRange.from && dateRange.to) {
      const transactionDate = new Date(transaction.date);
      if (transactionDate < dateRange.from || transactionDate > dateRange.to) {
        return false;
      }
    }

    // Transaction type filter
    if (transactionType.length > 0 && !transactionType.includes('all')) {
      if (!transactionType.includes(transaction?.type as any)) {
        return false;
      }
    }

    // Transaction status filter
    if (transactionStatus.length > 0 && !transactionStatus.includes('all')) {
      if (!transactionStatus.includes(transaction.status)) {
        return false;
      }
    }

    return true;
  });

  const handleClearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setTransactionType(['all']);
    setTransactionStatus(['all']);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-300 pb-4">
        <div>
          <h2 className="text-2xl font-bold">
            {filteredTransactions?.length || 0} Transactions
          </h2>
          <p className="text-sm text-muted-foreground">
            Your transactions for the last 7 days
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-full px-6 bg-[#EFF1F6]"
            onClick={() => setIsFilterOpen(true)}
          >
            <span className="font-semibold">Filter</span>
            {activeFiltersCount > 0 && (
              <span className="bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-full px-6 bg-[#EFF1F6]"
          >
            <span className="font-semibold">Export list</span>
            <Download className="size-3" strokeWidth={1} />
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
      ) : filteredTransactions && filteredTransactions.length > 0 ? (
        <div className="space-y-6">
          {filteredTransactions.map((transaction, index) => (
            <TransactionItem key={index} transaction={transaction} />
          ))}
        </div>
      ) : (
        <EmptyTransactions onClearFilter={handleClearFilters} />
      )}
    </div>
  );
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful':
        return 'text-emerald-600';
      case 'pending':
        return 'text-amber-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTransactionIcon = (type: string) => {
    if (type?.includes('withdrawal')) {
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <Image
            src="/call_made.svg"
            height={12}
            width={12}
            alt="withdrawal"
            priority
          />
        </div>
      );
    }
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
        <Image
          src="/call_received.svg"
          height={12}
          width={12}
          alt="deposit"
          priority
        />
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        {getTransactionIcon(transaction.type)}
        <div>
          <div className="font-medium">
            {transaction.type === 'withdrawal'
              ? 'Cash Withdrawal'
              : transaction.metadata?.product_name || 'Unnamed Transaction'}
          </div>
          <div
            className={`text-sm ${
              transaction.type === 'withdrawal' &&
              getStatusColor(transaction.status)
            }`}
          >
            {transaction.type === 'withdrawal'
              ? transaction.status
              : transaction.metadata?.name || 'No name provided'}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-base font-bold">USD {transaction.amount}</div>
        <div className="text-sm text-muted-foreground">
          {formatDate(transaction.date)}
        </div>
      </div>
    </div>
  );
}

function EmptyTransactions({ onClearFilter }: { onClearFilter: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="flex flex-col items-start">
        <div className="mb-4 rounded-full bg-muted w-fit p-3">
          <Image
            src="/receipt_long.svg"
            height={16}
            width={16}
            alt="receipt"
            priority
          />
        </div>
        <h3 className="text-lg font-bold text-start">
          No matching transaction found <br /> for the selected filter
        </h3>
        <p className="text-sm text-muted-foreground">
          Change your filters to see more results, or add a new transaction
        </p>
        <Button
          variant="outline"
          className="mt-4 w-fit rounded-full font-medium"
          onClick={onClearFilter}
        >
          Clear Filter
        </Button>
      </div>
    </div>
  );
}
