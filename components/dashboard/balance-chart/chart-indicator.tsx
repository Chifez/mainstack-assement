import { ChartPoint } from '@/lib/types';
import { ChartTooltip } from './chart-tooltip';
import { Transaction } from '@/lib/types';

interface ChartIndicatorProps {
  point: ChartPoint;
  transactions: Transaction[];
  onHover: (point: ChartPoint) => void;
}

export function ChartIndicator({
  point,
  transactions,
  onHover,
}: ChartIndicatorProps) {
  return (
    <ChartTooltip point={point} transactions={transactions}>
      <g>
        <rect
          x={point.x - 10}
          y={point.y}
          width={20}
          height={180 - point.y}
          fill="transparent"
          className="cursor-pointer"
          onMouseEnter={() => onHover(point)}
        />
        <line
          x1={point.x}
          y1={point.y}
          x2={point.x}
          y2={180}
          stroke="#FF5403"
          strokeWidth="1"
          strokeDasharray="4 4"
          className="transition-opacity duration-200"
        />
        <circle
          cx={point.x}
          cy={point.y}
          r="4"
          fill="#FF5403"
          className="transition-opacity duration-200"
        />
      </g>
    </ChartTooltip>
  );
}
