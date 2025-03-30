'use client';

import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { Wallet } from '@/lib/types';
import { fetchWallet } from '@/lib/api';

export function BalanceCard() {
  const { data: wallet, isLoading } = useQuery<Wallet>({
    queryKey: ['wallet'],
    queryFn: fetchWallet,
  });

  return (
    <div className="grid gap-6">
      <div className="flex flex-col md:flex-row md:items-center gap-10">
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
        <Button className="bg-black text-white hover:bg-black/90 rounded-full px-7">
          Withdraw
        </Button>
      </div>

      <div className="h-[200px] relative">
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 500 200"
              preserveAspectRatio="none"
            >
              <path
                d="M0,100 C100,20 200,180 300,60 C400,140 500,60 500,100"
                fill="none"
                stroke="#FF5403"
                strokeWidth="1.5"
              />
            </svg>
            <div className="absolute bottom-0 left-0 text-xs text-gray-500">
              Apr 1, 2022
            </div>
            <div className="absolute bottom-0 right-0 text-xs text-gray-500">
              Apr 30, 2022
            </div>
          </>
        )}
      </div>
    </div>
  );
}
