'use client';

import { useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BalanceChartProps, ChartPoint } from '@/lib/types';
import { ChartLine } from './balance-chart/chart-line';
import { ChartIndicator } from './balance-chart/chart-indicator';
import { useChartData } from './balance-chart/chart-points';
import { ChartTooltip } from './balance-chart/chart-tooltip';
import { useCurrencyStore } from '@/store/currency-store';

export function BalanceChart({ transactions }: BalanceChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);
  const { selectedCurrency } = useCurrencyStore();
  const { path, fillPath, points, firstDate, lastDate } =
    useChartData(transactions, selectedCurrency);

  // #region agent log
  fetch('http://127.0.0.1:7245/ingest/93e671da-f115-421f-965c-23cd29ed3bd5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'balance-chart.tsx:14',message:'BalanceChart render',data:{transactionsCount:transactions?.length||0,selectedCurrency,path:path?.substring(0,50),fillPath:fillPath?.substring(0,50),pointsCount:points?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  // #endregion

  // Ensure we always have valid paths
  const validPath = path || 'M0,100 L700,100';
  const validFillPath = fillPath || 'M0,100 L700,100 L700,180 L0,180 Z';

  return (
    <div className="h-[200px] relative mt-6">
      <TooltipProvider>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 700 200"
          preserveAspectRatio="none"
          className="cursor-pointer"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <ChartLine path={validPath} fillPath={validFillPath} />

          {/* Hover detection for the fill area */}
          <path
            d={validFillPath}
            fill="transparent"
            stroke="none"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - rect.left) * (700 / rect.width);
              const threshold = 20;
              const closestPoint = points.reduce(
                (closest: ChartPoint | null, point: ChartPoint) => {
                  const distance = Math.abs(point.x - x);
                  if (
                    distance < threshold &&
                    (!closest || distance < Math.abs(closest.x - x))
                  ) {
                    return point;
                  }
                  return closest;
                },
                null
              );
              if (closestPoint) {
                setHoveredPoint(closestPoint);
              }
            }}
          />

          {/* Dashed line indicator */}
          {hoveredPoint && (
            <ChartIndicator
              point={hoveredPoint}
              transactions={transactions}
              onHover={setHoveredPoint}
            />
          )}

          {/* Interactive points */}
          {points.map((point: any, index: any) => (
            <ChartTooltip key={index} point={point} transactions={transactions}>
              <g>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="10"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(point)}
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="#FF5403"
                  className="opacity-0 hover:opacity-100"
                  onMouseEnter={() => setHoveredPoint(point)}
                />
              </g>
            </ChartTooltip>
          ))}
        </svg>
      </TooltipProvider>

      {/* X-axis line */}
      <div className="relative">
        <div className="h-[0.8px] absolute bottom-5 bg-gray-300 w-full before:absolute after:absolute before:size-1.5 after:size-1.5 before:rounded-full after:rounded-full before:-top-[3px] after:-top-[3px] before:left-0 after:right-0 before:bg-gray-300 after:bg-gray-300" />
      </div>

      {/* Date labels */}
      <div className="absolute bottom-0 left-0 text-xs text-gray-500">
        {firstDate}
      </div>
      <div className="absolute bottom-0 right-0 text-xs text-gray-500">
        {lastDate}
      </div>
    </div>
  );
}
