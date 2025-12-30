'use client';

import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Info } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { fetchBalance } from '@/lib/api';
import { Balance } from '@/lib/types';
import { useState } from 'react';

export function WalletInfo() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const { data: balance, isLoading } = useQuery<Balance>({
    queryKey: ['balance', selectedCurrency],
    queryFn: () => fetchBalance(selectedCurrency),
  });

  const items = [
    {
      label: 'Ledger Balance',
      value: balance?.ledger_balance || 0,
      hasInfo: true,
    },
    {
      label: 'Pending Credits',
      value: balance?.pending_credits || 0,
      hasInfo: true,
    },
    {
      label: 'Pending Debits',
      value: balance?.pending_debits || 0,
      hasInfo: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm text-gray-500 whitespace-nowrap">
          Currency
        </label>
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="flex h-10 w-fit rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="NGN">NGN</option>
          <option value="GBP">GBP</option>
        </select>
      </div>
      {items.map((item, index) => (
        <div key={index} className="flex items-start justify-between">
          <div className="flex flex-col items-start gap-1">
            <span className="text-sm mb-2 text-gray-500">{item.label}</span>
            {isLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <div className="font-bold text-2xl">
                {formatCurrency(item.value, selectedCurrency)}
              </div>
            )}
          </div>
          {item.hasInfo && <Info className="h-3.5 w-3.5 text-gray-300" />}
        </div>
      ))}
    </div>
  );
}
