import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Transaction } from '@/lib/types';
import { ChartData, DailyTotal } from '@/lib/types';

export function useChartData(transactions: Transaction[]): ChartData {
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

    // Sort transactions
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Process transactions
    const balanceMap = new Map<string, number>();
    let runningBalance = 0;

    sortedTransactions.forEach((transaction) => {
      const dateStr = format(new Date(transaction.date), 'yyyy-MM-dd');
      runningBalance +=
        transaction.type === 'withdrawal'
          ? -transaction.amount
          : transaction.amount;
      balanceMap.set(dateStr, runningBalance);
    });

    const totals: DailyTotal[] = Array.from(balanceMap.entries()).map(
      ([date, total]) => ({
        date,
        formattedDate: format(parseISO(date), 'MMM d, yyyy'),
        total,
      })
    );

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
    const pointDistance = width / (totals.length - 1);

    const points = totals.map(({ total, formattedDate }, index) => {
      const x = index * pointDistance;
      const y =
        range === 0
          ? padding + availableHeight / 2
          : height - (((total - min) / range) * availableHeight + padding);
      return { x, y, total, date: formattedDate };
    });

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
  }, [transactions]);
}
