import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Transaction } from '@/lib/types';
import { ChartData, DailyTotal } from '@/lib/types';

export function useChartData(
  transactions: Transaction[],
  currency: string
): ChartData {
  return useMemo(() => {
    if (!transactions?.length) {
      return {
        path: 'M0,100 L700,100',
        fillPath: 'M0,100 L700,100 L700,180 L0,180 Z',
        points: [],
        firstDate: 'Apr 1, 2022',
        lastDate: 'Apr 30, 2022',
      };
    }

    // Filter by currency and successful status, then sort by date
    const sortedTransactions = [...transactions]
      .filter((t) => t.status === 'successful' && t.currency === currency)
      .sort(
        (a, b) =>
          new Date(a.date || a.created_at).getTime() -
          new Date(b.date || b.created_at).getTime()
      );

    // If no successful transactions, return empty chart
    if (!sortedTransactions.length) {
      return {
        path: 'M0,100 L700,100',
        fillPath: 'M0,100 L700,100 L700,180 L0,180 Z',
        points: [],
        firstDate: 'Apr 1, 2022',
        lastDate: 'Apr 30, 2022',
      };
    }

    // Process transactions
    const balanceMap = new Map<string, number>();
    let runningBalance = 0;

    sortedTransactions.forEach((transaction) => {
      const dateStr = format(
        new Date(transaction.date || transaction.created_at),
        'yyyy-MM-dd'
      );
      // Calculate balance change based on type
      const amount =
        typeof transaction.amount === 'string'
          ? parseFloat(transaction.amount)
          : transaction.amount;

      if (transaction.type === 'credit') {
        runningBalance += amount;
      } else if (transaction.type === 'debit') {
        runningBalance -= amount;
      } else if (transaction.type === 'reversal') {
        // Reversals adjust the balance back
        runningBalance -= amount;
      }
      balanceMap.set(dateStr, runningBalance);
    });

    const totals: DailyTotal[] = Array.from(balanceMap.entries()).map(
      ([date, total]) => ({
        date,
        formattedDate: format(parseISO(date), 'MMM d, yyyy'),
        total,
      })
    );

    // If no totals after processing, return empty chart
    if (!totals.length) {
      return {
        path: 'M0,100 L700,100',
        fillPath: 'M0,100 L700,100 L700,180 L0,180 Z',
        points: [],
        firstDate: 'Apr 1, 2022',
        lastDate: 'Apr 30, 2022',
      };
    }

    // Generate chart paths
    const width = 700;
    const height = 180;
    const padding = 20;
    const availableHeight = height - padding * 2;

    const { min, max } = totals.reduce(
      (acc, { total }) => ({
        min: Math.min(acc.min, total),
        max: Math.max(acc.max, total),
      }),
      { min: Infinity, max: -Infinity }
    );

    const range = max - min;
    // Handle case when there's only one point
    const pointDistance = totals.length > 1 ? width / (totals.length - 1) : 0;

    const points = totals.map(({ total, formattedDate }, index) => {
      const x = totals.length > 1 ? index * pointDistance : width / 2;
      const y =
        range === 0
          ? padding + availableHeight / 2
          : height - (((total - min) / range) * availableHeight + padding);
      return { x, y, total, date: formattedDate };
    });

    // Handle empty points array or single point
    if (!points.length) {
      return {
        path: 'M0,100 L700,100',
        fillPath: 'M0,100 L700,100 L700,180 L0,180 Z',
        points: [],
        firstDate: 'Apr 1, 2022',
        lastDate: 'Apr 30, 2022',
      };
    }

    // Handle single point case
    if (points.length === 1) {
      const point = points[0];
      return {
        path: `M${point.x},${point.y} L${point.x},${point.y}`,
        fillPath: `M${point.x},${height} L${point.x},${point.y} L${point.x},${height} Z`,
        points,
        firstDate: totals[0]?.formattedDate || 'Apr 1, 2022',
        lastDate: totals[0]?.formattedDate || 'Apr 30, 2022',
      };
    }

    let path = `M${points[0].x},${points[0].y}`;
    let fillPath = `M${points[0].x},${height} L${points[0].x},${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const { x: x1, y: y1 } = points[i];
      const { x: x2, y: y2 } = points[i + 1];
      const cpx1 = x1 + (x2 - x1) / 3;
      const cpy1 = y1;
      const cpx2 = x1 + (2 * (x2 - x1)) / 3;
      const cpy2 = y2;

      path += ` C${cpx1},${cpy1} ${cpx2},${cpy2} ${x2},${y2}`;
      fillPath += ` C${cpx1},${cpy1} ${cpx2},${cpy2} ${x2},${y2}`;
    }

    fillPath += ` L${points[points.length - 1].x},${height} Z`;

    return {
      path,
      fillPath,
      points,
      firstDate: totals[0]?.formattedDate || 'Apr 1, 2022',
      lastDate: totals[totals.length - 1]?.formattedDate || 'Apr 30, 2022',
    };
  }, [transactions, currency]);
}
