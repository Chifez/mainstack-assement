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
      case 'processing':
        return 'text-amber-600';
      case 'failed':
        return 'text-red-600';
      case 'reversed':
        return 'text-gray-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTransactionIcon = (type: string, category: string) => {
    if (type === 'debit' || category === 'withdrawal') {
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <Image
            src="/call_made.svg"
            height={12}
            width={12}
            alt="debit"
            priority
          />
        </div>
      );
    }
    if (type === 'reversal') {
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <Image
            src="/call_made.svg"
            height={12}
            width={12}
            alt="reversal"
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
          alt="credit"
          priority
        />
      </div>
    );
  };

  const getTransactionLabel = (transaction: Transaction) => {
    if (transaction.transaction_category === 'withdrawal') {
      return 'Cash Withdrawal';
    }
    if (transaction.transaction_category === 'deposit') {
      return 'Deposit';
    }
    if (transaction.transaction_category === 'manual_credit') {
      return 'Manual Credit';
    }
    if (transaction.transaction_category === 'manual_debit') {
      return 'Manual Debit';
    }
    if (transaction.transaction_category === 'fee') {
      return 'Fee';
    }
    if (transaction.transaction_category === 'refund') {
      return 'Refund';
    }
    return (
      transaction.metadata?.product_name ||
      transaction.metadata?.description ||
      'Transaction'
    );
  };

  return (
    <div
      className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 rounded-lg px-3 transition-colors"
      onClick={() => onClick(transaction)}
    >
      <div className="flex items-center gap-3">
        {getTransactionIcon(transaction.type, transaction.transaction_category)}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{getTransactionLabel(transaction)}</span>
            {transaction.isDuplicate && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                Duplicate
              </span>
            )}
          </div>
          <div className={`text-sm ${getStatusColor(transaction.status)}`}>
            {transaction.status.charAt(0).toUpperCase() +
              transaction.status.slice(1)}
            {transaction.metadata?.name && ` • ${transaction.metadata.name}`}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div
          className={`text-base font-bold ${
            transaction.type === 'debit' ? 'text-red-600' : 'text-emerald-600'
          }`}
        >
          {transaction.type === 'debit' ? '-' : '+'}
          {transaction.currency} {transaction.amount}
        </div>
        <div className="text-sm text-muted-foreground">
          {formatDate(transaction.date || transaction.created_at)}
        </div>
      </div>
    </div>
  );
}
