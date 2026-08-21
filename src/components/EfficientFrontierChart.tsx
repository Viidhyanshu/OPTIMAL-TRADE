'use client';

import React, { useMemo } from 'react';
import { OrderConfig } from '@/lib/engine/types';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceDot,
} from 'recharts';
import { Activity } from 'lucide-react';

interface EfficientFrontierChartProps {
  config: OrderConfig;
}

export const EfficientFrontierChart: React.FC<EfficientFrontierChartProps> = ({ config }) => {
  const points = useMemo(() => {
    const arr = [];
    const lambdas = [0.0001, 0.0005, 0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1];
    
    for (const l of lambdas) {
      const expCost = (config.arrivalPrice * config.totalQuantity * 0.002) / (1 + Math.sqrt(l) * 50);
      const variance = (config.arrivalPrice * config.totalQuantity * 0.008) * Math.sqrt(l);

      arr.push({
        lambda: l,
        expectedCost: Number(expCost.toFixed(2)),
        costVariance: Number(variance.toFixed(2)),
        isCurrent: Math.abs(l - config.riskAversion) < 0.001,
      });
    }
    return arr;
  }, [config]);

  const currentPoint = points.find((p) => p.isCurrent) || points[4];

  return (
    <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-4 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-white" />
          <h3 className="font-bold text-white text-base">
            Almgren-Chriss Efficient Frontier
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">E[x] vs Variance</span>
      </div>

      {/* Scatter Plot Area */}
      <div className="h-[260px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2230" />
            <XAxis
              type="number"
              dataKey="costVariance"
              name="Cost Variance"
              stroke="#64748b"
              tick={{ fontSize: 10 }}
              unit=" ₹"
            />
            <YAxis
              type="number"
              dataKey="expectedCost"
              name="Expected Impact"
              stroke="#64748b"
              tick={{ fontSize: 10 }}
              unit=" ₹"
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#181a24',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: '#ffffff',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
              }}
              itemStyle={{ color: '#ffffff', fontWeight: 600 }}
              labelStyle={{ color: '#ffffff', fontWeight: 600 }}
              formatter={(val: any, name: any) => [`₹${Number(val).toLocaleString()}`, name]}
            />

            <Scatter name="Frontier" data={points} fill="#94a3b8" line stroke="#64748b" />

            {currentPoint && (
              <ReferenceDot
                x={currentPoint.costVariance}
                y={currentPoint.expectedCost}
                r={6}
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth={2}
              />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Footer */}
      <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-white/5">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
          <span>Active Calibration (λ = {config.riskAversion})</span>
        </span>
        <span className="font-mono text-white font-bold">Optimal Risk-Cost Tradeoff</span>
      </div>
    </div>
  );
};
