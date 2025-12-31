import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Transaction } from '@/lib/types';
import { ChartData, DailyTotal } from '@/lib/types';

export function useChartData(
  transactions: Transaction[],
  currency: string
): ChartData {
  return useMemo(() => {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/93e671da-f115-421f-965c-23cd29ed3bd5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'chart-points.tsx:10',
        message: 'useChartData entry',
        data: {
          transactionsCount: transactions?.length || 0,
          currency,
          transactionCurrencies: transactions?.map((t) => t.currency) || [],
          transactionStatuses: transactions?.map((t) => t.status) || [],
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'A,E',
      }),
    }).catch(() => {});
    // #endregion

    if (!transactions?.length) {
      // #region agent log
      fetch(
        'http://127.0.0.1:7245/ingest/93e671da-f115-421f-965c-23cd29ed3bd5',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'chart-points.tsx:12',
            message: 'No transactions - returning empty',
            data: { transactionsCount: 0 },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'E',
          }),
        }
      ).catch(() => {});
      // #endregion
      return {
        path: 'M0,100 L700,100',
        fillPath: 'M0,100 L700,100 L700,180 L0,180 Z',
        points: [],
        firstDate: 'Apr 1, 2022',
        lastDate: 'Apr 30, 2022',
      };
    }

    // Filter by currency and successful status, then sort by date
    const beforeFilter = transactions.length;
    const currencyMatches = transactions.filter((t) => {
      const match = t.currency === currency;
      // #region agent log
      if (!match) {
        fetch(
          'http://127.0.0.1:7245/ingest/93e671da-f115-421f-965c-23cd29ed3bd5',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              location: 'chart-points.tsx:25',
              message: 'Currency mismatch',
              data: {
                selectedCurrency: currency,
                transactionCurrency: t.currency,
                currencyMatch: false,
                currencyLengths: {
                  selected: currency?.length,
                  transaction: t.currency?.length,
                },
              },
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run1',
              hypothesisId: 'A',
            }),
          }
        ).catch(() => {});
      }
      // #endregion
      return match;
    });
    const statusMatches = currencyMatches.filter((t) => {
      const match = t.status === 'successful';
      // #region agent log
      if (!match) {
        fetch(
          'http://127.0.0.1:7245/ingest/93e671da-f115-421f-965c-23cd29ed3bd5',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              location: 'chart-points.tsx:32',
              message: 'Status mismatch',
              data: {
                status: t.status,
                expected: 'successful',
                currency: t.currency,
              },
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run1',
              hypothesisId: 'B',
            }),
          }
        ).catch(() => {});
      }
      // #endregion
      return match;
    });
    const sortedTransactions = statusMatches.sort((a, b) => {
      const dateA = a.date || a.created_at;
      const dateB = b.date || b.created_at;
      const parsedA = new Date(dateA);
      const parsedB = new Date(dateB);
      // #region agent log
      if (isNaN(parsedA.getTime()) || isNaN(parsedB.getTime())) {
        fetch(
          'http://127.0.0.1:7245/ingest/93e671da-f115-421f-965c-23cd29ed3bd5',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              location: 'chart-points.tsx:40',
              message: 'Date parsing issue',
              data: {
                dateA,
                dateB,
                parsedAValid: !isNaN(parsedA.getTime()),
                parsedBValid: !isNaN(parsedB.getTime()),
              },
              timestamp: Date.now(),
              sessionId: 'debug-session',
              runId: 'run1',
              hypothesisId: 'C',
            }),
          }
        ).catch(() => {});
      }
      // #endregion
      return parsedA.getTime() - parsedB.getTime();
    });

    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/93e671da-f115-421f-965c-23cd29ed3bd5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'chart-points.tsx:48',
        message: 'After filtering',
        data: {
          beforeFilter,
          afterCurrencyFilter: currencyMatches.length,
          afterStatusFilter: statusMatches.length,
          afterSort: sortedTransactions.length,
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'A,B',
      }),
    }).catch(() => {});
    // #endregion

    // If no successful transactions, return empty chart
    if (!sortedTransactions.length) {
      // #region agent log
      fetch(
        'http://127.0.0.1:7245/ingest/93e671da-f115-421f-965c-23cd29ed3bd5',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'chart-points.tsx:50',
            message: 'No sorted transactions - returning empty',
            data: {
              beforeFilter,
              afterCurrencyFilter: currencyMatches.length,
              afterStatusFilter: statusMatches.length,
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'A,B',
          }),
        }
      ).catch(() => {});
      // #endregion
      return {
        path: 'M0,100 L700,100',
        fillPath: 'M0,100 L700,100 L700,180 L0,180 Z',
        points: [],
        firstDate: 'Apr 1, 2022',
        lastDate: 'Apr 30, 2022',
      };
    }

    // Process transactions - create a point for each transaction to show fluctuations
    const balancePoints: Array<{
      timestamp: number;
      balance: number;
      date: string;
      transactionType: 'credit' | 'debit' | 'reversal';
      transactionId: string;
    }> = [];
    let runningBalance = 0;

    sortedTransactions.forEach((transaction) => {
      const transactionDate = new Date(
        transaction.date || transaction.created_at
      );
      const timestamp = transactionDate.getTime();

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

      // Create a point for each transaction
      balancePoints.push({
        timestamp,
        balance: runningBalance,
        date: format(transactionDate, 'MMM d, yyyy'),
        transactionType: transaction.type,
        transactionId: transaction.id,
      });
    });

    // Convert to DailyTotal format for compatibility
    const totals: DailyTotal[] = balancePoints.map((point) => ({
      date: format(new Date(point.timestamp), 'yyyy-MM-dd'),
      formattedDate: point.date,
      total: point.balance,
    }));

    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/93e671da-f115-421f-965c-23cd29ed3bd5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'chart-points.tsx:75',
        message: 'After balancePoints processing',
        data: {
          balancePointsCount: balancePoints.length,
          totalsCount: totals.length,
          totals: totals.map((t) => ({ date: t.date, total: t.total })),
          sortedTransactionsCount: sortedTransactions.length,
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'F',
      }),
    }).catch(() => {});
    // #endregion

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
      // Ensure y is within valid bounds [padding, height - padding]
      let y: number;
      if (range === 0) {
        y = padding + availableHeight / 2;
      } else {
        const normalizedY =
          height - (((total - min) / range) * availableHeight + padding);
        // Clamp y to valid bounds
        y = Math.max(padding, Math.min(height - padding, normalizedY));
      }
      // Get the corresponding balance point to include transaction metadata
      const balancePoint = balancePoints[index];
      return {
        x,
        y,
        total,
        date: formattedDate,
        transactionType: balancePoint?.transactionType,
        transactionId: balancePoint?.transactionId,
      };
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
      // Ensure valid coordinates
      const x = Math.max(0, Math.min(width, point.x));
      const y = Math.max(padding, Math.min(height - padding, point.y));
      // #region agent log
      fetch(
        'http://127.0.0.1:7245/ingest/93e671da-f115-421f-965c-23cd29ed3bd5',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'chart-points.tsx:131',
            message: 'Single point case',
            data: {
              point,
              x,
              y,
              totalsCount: totals.length,
              sortedTransactionsCount: sortedTransactions.length,
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'F',
          }),
        }
      ).catch(() => {});
      // #endregion
      // For single point, draw a horizontal line across the chart to make it visible
      return {
        path: `M0,${y} L${width},${y}`,
        fillPath: `M0,${height} L0,${y} L${width},${y} L${width},${height} Z`,
        points: [{ ...point, x, y }],
        firstDate: totals[0]?.formattedDate || 'Apr 1, 2022',
        lastDate: totals[0]?.formattedDate || 'Apr 30, 2022',
      };
    }

    // Ensure first point has valid coordinates
    const firstPoint = points[0];
    const firstX = Math.max(0, Math.min(width, firstPoint.x));
    const firstY = Math.max(padding, Math.min(height - padding, firstPoint.y));

    let path = `M${firstX},${firstY}`;
    let fillPath = `M${firstX},${height} L${firstX},${firstY}`;

    for (let i = 0; i < points.length - 1; i++) {
      const { x: x1, y: y1 } = points[i];
      const { x: x2, y: y2 } = points[i + 1];

      // Ensure coordinates are within bounds
      const validX1 = Math.max(0, Math.min(width, x1));
      const validY1 = Math.max(padding, Math.min(height - padding, y1));
      const validX2 = Math.max(0, Math.min(width, x2));
      const validY2 = Math.max(padding, Math.min(height - padding, y2));

      const cpx1 = validX1 + (validX2 - validX1) / 3;
      const cpy1 = validY1;
      const cpx2 = validX1 + (2 * (validX2 - validX1)) / 3;
      const cpy2 = validY2;

      path += ` C${cpx1},${cpy1} ${cpx2},${cpy2} ${validX2},${validY2}`;
      fillPath += ` C${cpx1},${cpy1} ${cpx2},${cpy2} ${validX2},${validY2}`;
    }

    const lastPoint = points[points.length - 1];
    const lastX = Math.max(0, Math.min(width, lastPoint.x));
    fillPath += ` L${lastX},${height} Z`;

    // #region agent log
    const hasInvalidCoords = points.some(
      (p) => isNaN(p.x) || isNaN(p.y) || !isFinite(p.x) || !isFinite(p.y)
    );
    fetch('http://127.0.0.1:7245/ingest/93e671da-f115-421f-965c-23cd29ed3bd5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'chart-points.tsx:175',
        message: 'Final chart data',
        data: {
          pointsCount: points.length,
          pathLength: path.length,
          fillPathLength: fillPath.length,
          hasInvalidCoords,
          firstPoint: points[0],
          lastPoint: points[points.length - 1],
          min,
          max,
          range,
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'D',
      }),
    }).catch(() => {});
    // #endregion

    return {
      path,
      fillPath,
      points,
      firstDate: totals[0]?.formattedDate || 'Apr 1, 2022',
      lastDate: totals[totals.length - 1]?.formattedDate || 'Apr 30, 2022',
    };
  }, [transactions, currency]);
}
