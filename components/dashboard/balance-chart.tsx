'use client';

import { useEffect, useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Transaction } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatCurrency } from '@/lib/utils';

interface DailyTotal {
  date: string;
  formattedDate: string;
  total: number;
}

interface BalanceChartProps {
  transactions: Transaction[];
}

export function BalanceChart({ transactions }: BalanceChartProps) {
  const [chartPoints, setChartPoints] = useState<string>('');

  // Memoize the processed data to avoid unnecessary recalculations
  const { dailyTotals, firstDate, lastDate } = useMemo(() => {
    if (!transactions?.length) {
      return {
        dailyTotals: [],
        firstDate: 'Apr 1, 2022',
        lastDate: 'Apr 30, 2022',
      };
    }

    // Sort transactions once
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Process transactions in a single pass
    const balanceMap = new Map<string, number>();
    let runningBalance = 0;

    // Process each transaction and update running balance
    sortedTransactions.forEach((transaction) => {
      const dateStr = format(new Date(transaction.date), 'yyyy-MM-dd');
      runningBalance +=
        transaction.type === 'withdrawal'
          ? -transaction.amount
          : transaction.amount;

      // Only store the last balance for each day
      balanceMap.set(dateStr, runningBalance);
    });

    // Convert to array format needed for the chart
    const totals: DailyTotal[] = Array.from(balanceMap.entries()).map(
      ([date, total]) => ({
        date,
        formattedDate: format(parseISO(date), 'MMM d, yyyy'),
        total,
      })
    );

    return {
      dailyTotals: totals,
      firstDate: totals[0]?.formattedDate || 'Apr 1, 2022',
      lastDate: totals[totals.length - 1]?.formattedDate || 'Apr 30, 2022',
    };
  }, [transactions]);

  // Generate chart path and gradient fill
  useEffect(() => {
    if (!dailyTotals.length) {
      setChartPoints('M0,100 L700,100');
      return;
    }

    const width = 700;
    const height = 180;
    const padding = 20;
    const availableHeight = height - padding * 2;

    // Find min and max values in a single pass
    const { min, max } = dailyTotals.reduce(
      (acc, { total }) => ({
        min: Math.min(acc.min, total),
        max: Math.max(acc.max, total),
      }),
      { min: Infinity, max: -Infinity }
    );

    const range = max - min;
    const pointDistance = width / (dailyTotals.length - 1);

    // Generate points with optimized calculations
    const points = dailyTotals.map(({ total }, index) => {
      const x = index * pointDistance;
      const y =
        range === 0
          ? padding + availableHeight / 2
          : height - (((total - min) / range) * availableHeight + padding);
      return { x, y, total, date: dailyTotals[index].formattedDate };
    });

    // Generate smooth path with fill
    let path = `M${points[0].x},${points[0].y}`;
    let fillPath = `M${points[0].x},${height} L${points[0].x},${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const { x: x1, y: y1 } = points[i];
      const { x: x2, y: y2 } = points[i + 1];

      // Calculate control points for smooth curve
      const cpx1 = x1 + (x2 - x1) / 3;
      const cpy1 = y1;
      const cpx2 = x1 + (2 * (x2 - x1)) / 3;
      const cpy2 = y2;

      path += ` C${cpx1},${cpy1} ${cpx2},${cpy2} ${x2},${y2}`;
      fillPath += ` C${cpx1},${cpy1} ${cpx2},${cpy2} ${x2},${y2}`;
    }

    // Complete the fill path
    fillPath += ` L${points[points.length - 1].x},${height} Z`;

    setChartPoints(JSON.stringify({ path, fillPath, points }));
  }, [dailyTotals]);

  const { path, fillPath, points } = JSON.parse(
    chartPoints ||
      '{"path":"M0,100 L700,100","fillPath":"M0,100 L700,100 L700,180 L0,180 Z","points":[]}'
  );

  return (
    <div className="h-[200px] relative mt-6">
      <TooltipProvider>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 700 200"
          preserveAspectRatio="none"
          className="cursor-pointer"
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF5403" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#FF5403" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Fill area */}
          <path d={fillPath} fill="url(#chartGradient)" stroke="none" />

          {/* Chart line */}
          <path
            d={path}
            fill="none"
            stroke="#FF5403"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Interactive points */}
          {points.map((point: any, index: any) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <g>
                  {/* Invisible larger hit area */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="10"
                    fill="transparent"
                    className="cursor-pointer"
                  />
                  {/* Visible dot */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="#FF5403"
                    className="opacity-0 hover:opacity-100"
                  />
                </g>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="z-50 bg-white shadow-md rounded-md p-2"
              >
                <div className="space-y-1">
                  <p className="font-medium text-gray-500">{point.date}</p>
                  {dailyTotals[index] && (
                    <div className="inline-flex gap-1">
                      <p className="text-sm text-gray-500">
                        {transactions.find(
                          (t) =>
                            format(new Date(t.date), 'MMM d, yyyy') ===
                            point.date
                        )?.type === 'withdrawal'
                          ? 'Withdrawal'
                          : 'Deposit'}
                        :
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(
                          transactions.find(
                            (t) =>
                              format(new Date(t.date), 'MMM d, yyyy') ===
                              point.date
                          )?.amount || 0
                        )}
                      </p>
                    </div>
                  )}
                  <p className="text-sm text-gray-500">
                    Balance: {formatCurrency(point.total)}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </svg>
      </TooltipProvider>
      <div className="relative">
        <div className="h-[0.8px] absolute bottom-5 bg-gray-300 w-full before:absolute after:absolute before:size-1.5 after:size-1.5 before:rounded-full after:rounded-full before:-top-[3px] after:-top-[3px] before:left-0 after:right-0 before:bg-gray-300 after:bg-gray-300" />
      </div>
      <div className="absolute bottom-0 left-0 text-xs text-gray-500">
        {firstDate}
      </div>
      <div className="absolute bottom-0 right-0 text-xs text-gray-500">
        {lastDate}
      </div>
    </div>
  );
}
