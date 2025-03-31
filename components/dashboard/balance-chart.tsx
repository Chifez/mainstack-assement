'use client';

import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Transaction } from '@/lib/types';

interface DailyTotal {
  date: string;
  formattedDate: string;
  total: number;
}

interface BalanceChartProps {
  transactions: Transaction[];
}

export function BalanceChart({ transactions }: BalanceChartProps) {
  const [dailyTotals, setDailyTotals] = useState<DailyTotal[]>([]);
  const [chartPoints, setChartPoints] = useState<string>('');

  useEffect(() => {
    if (!transactions || transactions.length === 0) return;

    // Sort transactions by date
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Get the earliest and latest dates
    const startDate = new Date(sortedTransactions[0].date);
    const endDate = new Date(
      sortedTransactions[sortedTransactions.length - 1].date
    );

    // Create a map of daily totals
    const dailyMap = new Map<string, number>();

    // Initialize all dates in the range with 0
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      dailyMap.set(dateStr, 0);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Add transaction amounts to daily totals
    sortedTransactions.forEach((transaction) => {
      const dateStr = transaction.date;
      const currentTotal = dailyMap.get(dateStr) || 0;

      // Add deposits, subtract withdrawals
      const amountChange =
        transaction.type === 'withdrawal'
          ? -transaction.amount
          : transaction.amount;

      dailyMap.set(dateStr, currentTotal + amountChange);
    });

    // Convert map to array and calculate running total
    let runningTotal = 0;
    const totals: DailyTotal[] = [];

    dailyMap.forEach((amount, dateStr) => {
      runningTotal += amount;
      totals.push({
        date: dateStr,
        formattedDate: format(parseISO(dateStr), 'MMM d, yyyy'),
        total: runningTotal,
      });
    });

    setDailyTotals(totals);

    // Generate SVG path for the chart
    if (totals.length > 0) {
      const maxTotal = Math.max(...totals.map((t) => t.total));
      const minTotal = Math.min(...totals.map((t) => t.total));
      const range = maxTotal - minTotal;

      // Normalize values to fit in the chart height (180px)
      const normalizeY = (value: number) => {
        // Leave some padding at top and bottom
        const chartHeight = 180;
        const padding = 20;
        const availableHeight = chartHeight - padding * 2;

        // If there's only one value or all values are the same
        if (range === 0) return padding + availableHeight / 2;

        return (
          chartHeight -
          (((value - minTotal) / range) * availableHeight + padding)
        );
      };

      // Generate path
      const width = 700; // Chart width
      const pointDistance = width / (totals.length - 1);

      const points = totals.map((total, index) => {
        const x = index * pointDistance;
        const y = normalizeY(total.total);
        return `${x},${y}`;
      });

      // Create a smooth curve through the points
      let path = `M${points[0]}`;

      for (let i = 0; i < points.length - 1; i++) {
        const [x1, y1] = points[i].split(',').map(Number);
        const [x2, y2] = points[i + 1].split(',').map(Number);

        // Control points for the curve
        const cpx1 = x1 + (x2 - x1) / 3;
        const cpy1 = y1;
        const cpx2 = x1 + (2 * (x2 - x1)) / 3;
        const cpy2 = y2;

        path += ` C${cpx1},${cpy1} ${cpx2},${cpy2} ${x2},${y2}`;
      }

      setChartPoints(path);
    }
  }, [transactions]);

  // Get the first and last date for display
  const firstDate =
    dailyTotals.length > 0 ? dailyTotals[0].formattedDate : 'Apr 1, 2022';
  const lastDate =
    dailyTotals.length > 0
      ? dailyTotals[dailyTotals.length - 1].formattedDate
      : 'Apr 30, 2022';

  return (
    <div className="h-[200px] relative mt-6">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 700 200"
        preserveAspectRatio="none"
      >
        <path
          d={
            chartPoints ||
            'M0,100 C100,20 200,180 300,60 C400,140 500,60 700,100'
          }
          fill="none"
          stroke="#FF5403"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
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
