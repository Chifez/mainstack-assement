'use client';

import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronDown, Download } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { fetchTransactions } from '@/lib/api';
import { Transaction } from '@/lib/types';
import { useFilterStore } from '@/store/filter-store';
import Image from 'next/image';

export function TransactionList({ filters }: any) {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  const { setIsFilterOpen } = useFilterStore();

  console.log('transactions', transactions);

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
            className="h-10 gap-2 rounded-full border border-gray-200 bg-[#EFF1F6] px-12"
            onClick={() => setIsFilterOpen(true)}
          >
            <span className="font-semibold flex items-center justify-center">
              Filter{' '}
              {filters && (
                <span className="text-[8px] text-white size-2 flex items-center justify-center">
                  {filters?.length}
                </span>
              )}
            </span>
            <ChevronDown className="size-3" />
          </Button>
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-full border border-gray-200 w-fit px-12 bg-[#EFF1F6]"
          >
            <span className="font-semibold">Export list</span>
            <Download className="size-3" />
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
          <div className="flex flex-col item-start">
            <div className="mb-4 rounded-full bg-gray-100 w-fit p-3">
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
            <p className="text-sm text-gray-500">
              Change your filters to see more results, or add a new transaction
            </p>
            <Button
              variant="outline"
              className="mt-4 w-fit rounded-full bg-[#EFF1F6] font-semibold"
              onClick={() => setIsFilterOpen(false)}
            >
              Clear Filter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful':
        return 'text-[#0EA163]';
      case 'pending':
        return 'text-[#A77A07]';
      default:
        return 'text-gray-500';
    }
  };

  const getTransactionIcon = (type: string) => {
    if (type?.includes('withdrawal')) {
      return (
        <div className="flex size-12 items-center justify-center rounded-full bg-[#F9E3E0] ">
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
      <div className="flex size-12 items-center justify-center rounded-full bg-[#E3FCF2]">
        <Image
          src="/call_received.svg"
          height={12}
          width={12}
          alt="withdrawal"
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
            {transaction.type == 'withdrawal'
              ? 'Cash Withdrawal'
              : transaction.metadata?.product_name || 'Unnamed Transaction'}
          </div>
          <div
            className={`text-sm ${
              transaction.type == 'withdrawal' &&
              getStatusColor(transaction.status)
            }`}
          >
            {transaction.type == 'withdrawal'
              ? transaction.status
              : transaction.metadata?.name || 'No name Provided'}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium">USD {transaction.amount}</div>
        <div className="text-sm text-gray-500">
          {formatDate(transaction.date)}
        </div>
      </div>
    </div>
  );
}
