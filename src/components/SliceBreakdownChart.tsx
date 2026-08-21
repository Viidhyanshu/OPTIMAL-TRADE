'use client';

import React from 'react';
import { SimulationResult } from '@/lib/engine/types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

interface SliceBreakdownChartProps {
  result: SimulationResult;
}

export const SliceBreakdownChart: React.FC<SliceBreakdownChartProps> = ({ result }) => {
  const { marketData, strategyResults } = result;

  const chartData = marketData.map((m, idx) => ({
    timeLabel: m.timeLabel,
    TWAP: strategyResults.TWAP.steps[idx]?.executedQuantity,
    VWAP: strategyResults.VWAP.steps[idx]?.executedQuantity,
    'Almgren-Chriss': strategyResults.ALMGREN_CHRISS.steps[idx]?.executedQuantity,
    'Dynamic Adaptive': strategyResults.DYNAMIC_ADAPTIVE.steps[idx]?.executedQuantity,
  }));

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-base">
            Trade Slicing Breakdown (Shares Traded Per Interval)
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          Order Distribution Trajectory
        </span>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="timeLabel" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: '#f8fafc',
              }}
              formatter={(val: any) => [`${Number(val).toLocaleString()} shares`, 'Qty']}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

            <Bar dataKey="TWAP" fill="#f59e0b" radius={[3, 3, 0, 0]} />
            <Bar dataKey="VWAP" fill="#a855f7" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Almgren-Chriss" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Dynamic Adaptive" fill="#10b981" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
