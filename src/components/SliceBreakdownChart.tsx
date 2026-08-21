'use client';

import React from 'react';
import { SimulationResult } from '@/lib/engine/types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface SliceBreakdownChartProps {
  result: SimulationResult;
}

export const SliceBreakdownChart: React.FC<SliceBreakdownChartProps> = ({ result }) => {
  const { marketData, strategyResults } = result;

  const chartData = marketData.map((m, idx) => ({
    timeLabel: m.timeLabel,
    TWAP: strategyResults.TWAP.steps[idx]?.executedQuantity || 0,
    VWAP: strategyResults.VWAP.steps[idx]?.executedQuantity || 0,
    'Almgren-Chriss': strategyResults.ALMGREN_CHRISS.steps[idx]?.executedQuantity || 0,
    'Dynamic Adaptive': strategyResults.DYNAMIC_ADAPTIVE.steps[idx]?.executedQuantity || 0,
  }));

  return (
    <div className="apple-glass-panel rounded-3xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 backdrop-blur-md">
            <BarChart3 className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base tracking-tight">
              Interval Order Slicing Distribution
            </h3>
            <p className="text-xs text-slate-400">
              Shares executed per interval across all optimal trading strategies.
            </p>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-[220px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
            <XAxis dataKey="timeLabel" stroke="#64748b" tick={{ fontSize: 10 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />

            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(20px)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '1rem',
                fontSize: '12px',
                color: '#ffffff',
              }}
              itemStyle={{ color: '#ffffff', fontWeight: 600 }}
              labelStyle={{ color: '#ffffff', fontWeight: 600 }}
              formatter={(val: any, name: any) => [`${Number(val).toLocaleString()} shares`, name]}
            />

            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />

            <Bar dataKey="TWAP" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            <Bar dataKey="VWAP" fill="#a78bfa" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Almgren-Chriss" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Dynamic Adaptive" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
