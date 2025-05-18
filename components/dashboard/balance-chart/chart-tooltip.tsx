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
  const transaction = transactions.find(
    (t) => format(new Date(t.date), 'MMM d, yyyy') === point.date
  );

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
              {transaction?.type === 'withdrawal' ? 'Withdrawal' : 'Deposit'}:
            </p>
            <p className="text-sm text-gray-500">
              {formatCurrency(transaction?.amount || 0)}
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Balance: {formatCurrency(point.total)}
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
