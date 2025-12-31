import { format } from 'date-fns';
import { Transaction } from '@/lib/types';
import { ChartPoint } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ChartTooltipProps {
  point: ChartPoint;
  transactions: Transaction[];
  children: React.ReactNode;
}

export function ChartTooltip({
  point,
  transactions,
  children,
}: ChartTooltipProps) {
  // Find transaction by ID if available, otherwise fallback to date matching
  const transaction = point.transactionId
    ? transactions.find((t) => t.id === point.transactionId)
    : transactions.find((t) => {
        const tDate = format(new Date(t.date || t.created_at), 'MMM d, yyyy');
        return tDate === point.date;
      });

  // Determine transaction label based on type
  const getTransactionLabel = () => {
    // Use transaction type from point if available, otherwise from transaction object
    const type = point.transactionType || transaction?.type;
    if (type === 'credit') return 'Deposit';
    if (type === 'debit') return 'Withdrawal';
    if (type === 'reversal') return 'Reversal';
    return 'Transaction';
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side="top"
        className="z-50 bg-white shadow-md rounded-md p-2"
      >
        <div className="space-y-1">
          <p className="font-medium text-gray-500">{point.date}</p>
          <div className="inline-flex gap-1">
            <p className="text-sm text-gray-500">
              {getTransactionLabel()}:
            </p>
            <p className="text-sm text-gray-500">
              {formatCurrency(transaction?.amount || 0, transaction?.currency || 'USD')}
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Balance: {formatCurrency(point.total, transaction?.currency || 'USD')}
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
