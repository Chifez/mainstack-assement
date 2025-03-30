'use client';

import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Info } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { fetchWallet } from '@/lib/api';
import { Wallet } from '@/lib/types';

export function WalletInfo() {
  const { data: wallet, isLoading } = useQuery<Wallet>({
    queryKey: ['wallet'],
    queryFn: fetchWallet,
  });

  const items = [
    {
      label: 'Ledger Balance',
      value: wallet?.ledger_balance || 0,
      hasInfo: true,
    },
    { label: 'Total Payout', value: wallet?.total_payout || 0, hasInfo: true },
    {
      label: 'Total Revenue',
      value: wallet?.total_revenue || 0,
      hasInfo: true,
    },
    {
      label: 'Pending Payout',
      value: wallet?.pending_payout || 0,
      hasInfo: true,
    },
  ];

  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-500">{item.label}</span>
            {item.hasInfo && <Info className="h-3.5 w-3.5 text-gray-300" />}
          </div>
          {isLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <div className="font-bold">{formatCurrency(item.value)}</div>
          )}
        </div>
      ))}
    </div>
  );
}
