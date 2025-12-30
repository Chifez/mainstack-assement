'use client';

import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { Transaction, Balance } from '@/lib/types';
import { fetchTransactions, fetchBalance } from '@/lib/api';
import { BalanceChart } from './balance-chart';
import { useState } from 'react';
import { WithdrawModal } from './withdraw-modal';
import { CreditWalletModal } from './credit-wallet-modal';

export function BalanceCard() {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const { data: balance, isLoading } = useQuery<Balance>({
    queryKey: ['balance', selectedCurrency],
    queryFn: () => fetchBalance(selectedCurrency),
  });

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery<
    Transaction[]
  >({
    queryKey: ['transactions', selectedCurrency],
    queryFn: () => fetchTransactions({ currency: selectedCurrency }),
  });

  return (
    <div className="grid gap-6">
      <div className="flex flex-row items-center gap-12">
        <div>
          <div className="text-sm text-gray-500 mb-2">Available Balance</div>
          {isLoading ? (
            <Skeleton className="h-10 w-48" />
          ) : (
            <p className="text-4xl font-degular font-bold">
              {formatCurrency(
                balance?.available_balance || 0,
                balance?.currency || selectedCurrency
              )}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-full px-6"
            onClick={() => setIsCreditModalOpen(true)}
          >
            Credit
          </Button>
          <Button
            className="bg-black text-white hover:bg-black/90 rounded-full px-8"
            onClick={() => setIsWithdrawModalOpen(true)}
          >
            Withdraw
          </Button>
        </div>
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
        availableBalance={balance?.available_balance || 0}
        currency={selectedCurrency}
      />
      <CreditWalletModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
      />
    </div>
  );
}
