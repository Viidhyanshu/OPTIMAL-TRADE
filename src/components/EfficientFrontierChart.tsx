'use client';

import React from 'react';
import { OrderConfig } from '@/lib/engine/types';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Target, Sparkles } from 'lucide-react';

interface EfficientFrontierChartProps {
  config: OrderConfig;
}

export const EfficientFrontierChart: React.FC<EfficientFrontierChartProps> = ({ config }) => {
  // Generate Almgren-Chriss Efficient Frontier Risk-Return curve
  const frontierPoints = Array.from({ length: 15 }, (_, i) => {
    const lambda = 0.0001 + (i / 14) * 0.04;
    const expectedShortfall = Math.round(config.totalQuantity * config.arrivalPrice * 0.0015 * (1 / Math.sqrt(1 + lambda * 100)));
    const varianceCost = Math.round(config.totalQuantity * config.arrivalPrice * 0.0025 * Math.sqrt(1 + lambda * 50));

    return {
      lambda: lambda.toFixed(4),
      shortfall: expectedShortfall,
      variance: varianceCost,
      isCurrent: Math.abs(lambda - config.riskAversion) < 0.002,
    };
  });

  return (
    <div className="apple-glass-panel rounded-3xl p-6 space-y-4 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-cyan-400 stroke-[2.5]" />
          <h3 className="font-extrabold text-white text-base tracking-tight">
            Efficient Frontier (Risk vs Return)
          </h3>
        </div>
        <span className="text-[10px] text-cyan-300 font-mono px-2 py-0.5 rounded-full apple-glass-pill">
          λ = {config.riskAversion}
        </span>
      </div>

      <p className="text-xs text-slate-400">
        Almgren-Chriss trade-off between Expected Implementation Shortfall (₹) and Cost Variance.
      </p>

      {/* Scatter Chart */}
      <div className="h-[210px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
            <XAxis
              type="number"
              dataKey="variance"
              name="Cost Variance"
              stroke="#64748b"
              tick={{ fontSize: 10 }}
              unit="₹"
            />
            <YAxis
              type="number"
              dataKey="shortfall"
              name="Expected Shortfall"
              stroke="#64748b"
              tick={{ fontSize: 10 }}
              unit="₹"
            />

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
              formatter={(val: any, name: any) => [`₹${Number(val).toLocaleString()}`, name]}
            />

            <Scatter data={frontierPoints} fill="#38bdf8" line={{ stroke: '#38bdf8', strokeWidth: 2 }} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
