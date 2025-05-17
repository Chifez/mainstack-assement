'use client';

import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { Transaction, Wallet } from '@/lib/types';
import { fetchTransactions, fetchWallet } from '@/lib/api';
import { BalanceChart } from './balance-chart';
import { useState } from 'react';
import { WithdrawModal } from './withdraw-modal';

export function BalanceCard() {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const { data: wallet, isLoading } = useQuery<Wallet>({
    queryKey: ['wallet'],
    queryFn: fetchWallet,
  });
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery<
    Transaction[]
  >({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });
  console.log('wallet', wallet);

  return (
    <div className="grid gap-6">
      <div className="flex flex-row items-center gap-12">
        <div>
          <div className="text-sm text-gray-500 mb-2">Available Balance</div>
          {isLoading ? (
            <Skeleton className="h-10 w-48" />
          ) : (
            <p className="text-4xl font-degular font-bold">
              {/* {formatCurrency(wallet?.balance || 0)} */}
              USD {wallet?.balance || 0}
            </p>
          )}
        </div>
        <Button
          className="bg-black text-white hover:bg-black/90 rounded-full px-8"
          onClick={() => setIsWithdrawModalOpen(true)}
        >
          Withdraw
        </Button>
      </div>

      <div className="h-[200px] relative">
        {isLoadingTransactions ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <BalanceChart transactions={transactions || []} />
        )}
      </div>

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        availableBalance={wallet?.balance || 0}
      />
    </div>
  );
}
