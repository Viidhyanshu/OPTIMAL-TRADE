'use client';

import React from 'react';
import { OrderConfig } from '@/lib/engine/types';
import { runAlmgrenChriss } from '@/lib/engine/strategies';
import { generateMarketData } from '@/lib/engine/marketData';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Target } from 'lucide-react';

interface EfficientFrontierChartProps {
  config: OrderConfig;
}

export const EfficientFrontierChart: React.FC<EfficientFrontierChartProps> = ({ config }) => {
  const marketData = generateMarketData(config, 42);

  // Generate curve data varying risk aversion parameter lambda from 0.0001 to 0.05
  const frontierPoints: { lambda: number; expectedCost: number; variance: number }[] = [];
  const lambdas = [0.0001, 0.0005, 0.001, 0.002, 0.005, 0.01, 0.02, 0.04, 0.08];

  lambdas.forEach((lam) => {
    const testConfig: OrderConfig = { ...config, riskAversion: lam };
    const res = runAlmgrenChriss(testConfig, marketData);
    frontierPoints.push({
      lambda: lam,
      expectedCost: res.implementationShortfall,
      variance: Math.sqrt(res.costVariance),
    });
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-base">
            Almgren-Chriss Efficient Frontier (Cost vs Risk Tradeoff)
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          E[x] vs &sigma;(Cost)
        </span>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              type="number"
              dataKey="variance"
              name="Cost Risk (Std Dev)"
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `$${Math.round(v)}`}
            />
            <YAxis
              type="number"
              dataKey="expectedCost"
              name="Expected Cost ($)"
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `$${Math.round(v)}`}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: '#f8fafc',
              }}
              formatter={(val: any, name: any) => [`$${Number(val).toFixed(2)}`, name]}
            />
            <Scatter name="Efficient Frontier" data={frontierPoints} fill="#38bdf8" line stroke="#38bdf8" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[11px] text-slate-400 text-center">
        Left-most points represent high risk-aversion (&lambda; high, fast execution, low market risk). Right-most points represent low risk-aversion (&lambda; low, slow execution, higher market risk).
      </p>
    </div>
  );
};
