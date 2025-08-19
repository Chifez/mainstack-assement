import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import type { Transaction } from '@/lib/types';

interface TransactionItemProps {
  transaction: Transaction;
  onClick: (transaction: Transaction) => void;
}

export function TransactionItem({
  transaction,
  onClick,
}: TransactionItemProps) {
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
    <div
      className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 rounded-lg px-3 transition-colors"
      onClick={() => onClick(transaction)}
    >
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
