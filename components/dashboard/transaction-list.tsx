'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Download } from 'lucide-react';
import { useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { fetchTransactions } from '@/lib/api';
import type { Transaction } from '@/lib/types';

import { TransactionItem } from './transaction-item';
import { EmptyTransactions } from './empty-transaction';
import { TransactionDetailModal } from './transaction-detail-modal';
import useTransaction from '../hooks/useTransaction';
import { useIsMobile } from '../hooks/useIsMobile';

export function TransactionList({ filters }: { filters?: any[] }) {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useIsMobile();

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });

  const {
    filteredTransactions,
    getFilterText,
    activeFiltersCount,
    handleExportList,
    handleClearFilters,
    setIsFilterOpen,
  } = useTransaction({ transactions: transactions || [] });

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between gap-4 border-b border-gray-300 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">
            {filteredTransactions?.length || 0} Transactions
          </h2>
          <p className="text-sm text-muted-foreground">{getFilterText()}</p>
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
            onClick={handleExportList}
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
            <TransactionItem
              key={index}
              transaction={transaction}
              onClick={handleTransactionClick}
            />
          ))}
        </div>
      ) : (
        <EmptyTransactions onClearFilter={handleClearFilters} />
      )}

      <TransactionDetailModal
        transaction={selectedTransaction}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isMobile={isMobile}
      />
    </div>
  );
}
