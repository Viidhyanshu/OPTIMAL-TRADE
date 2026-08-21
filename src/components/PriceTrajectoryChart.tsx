'use client';

import React, { useState } from 'react';
import { SimulationResult, StrategyType } from '@/lib/engine/types';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { LineChart as LineChartIcon, Eye, Zap } from 'lucide-react';

interface PriceTrajectoryChartProps {
  result: SimulationResult;
}

export const PriceTrajectoryChart: React.FC<PriceTrajectoryChartProps> = ({ result }) => {
  const [activeStrategies, setActiveStrategies] = useState<Record<StrategyType, boolean>>({
    TWAP: true,
    VWAP: true,
    ALMGREN_CHRISS: true,
    DYNAMIC_ADAPTIVE: true,
  });

  const toggleStrategy = (strat: StrategyType) => {
    setActiveStrategies((prev) => ({ ...prev, [strat]: !prev[strat] }));
  };

  const { marketData, strategyResults, config } = result;

  // Prepare chart data merging market prices and execution prices across strategies
  const chartData = marketData.map((m, idx) => {
    return {
      interval: m.interval,
      timeLabel: m.timeLabel,
      midPrice: m.midPrice,
      bidPrice: m.bidPrice,
      askPrice: m.askPrice,
      spread: m.spread,
      isShock: m.isShockActive,
      TWAP: strategyResults.TWAP.steps[idx]?.executionPrice,
      VWAP: strategyResults.VWAP.steps[idx]?.executionPrice,
      ALMGREN_CHRISS: strategyResults.ALMGREN_CHRISS.steps[idx]?.executionPrice,
      DYNAMIC_ADAPTIVE: strategyResults.DYNAMIC_ADAPTIVE.steps[idx]?.executionPrice,
    };
  });

  const shockStep = config.enableShock ? chartData.find((d) => d.isShock) : null;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Chart Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <LineChartIcon className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-base">
            Price Trajectory & Strategy Execution Slices
          </h3>
        </div>

        {/* Strategy Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => toggleStrategy('TWAP')}
            className={`px-2.5 py-1 rounded-md border transition ${
              activeStrategies.TWAP
                ? 'bg-amber-950/80 border-amber-600 text-amber-300 font-semibold'
                : 'bg-slate-950 border-slate-800 text-slate-500 opacity-60'
            }`}
          >
            TWAP
          </button>
          <button
            onClick={() => toggleStrategy('VWAP')}
            className={`px-2.5 py-1 rounded-md border transition ${
              activeStrategies.VWAP
                ? 'bg-purple-950/80 border-purple-600 text-purple-300 font-semibold'
                : 'bg-slate-950 border-slate-800 text-slate-500 opacity-60'
            }`}
          >
            VWAP
          </button>
          <button
            onClick={() => toggleStrategy('ALMGREN_CHRISS')}
            className={`px-2.5 py-1 rounded-md border transition ${
              activeStrategies.ALMGREN_CHRISS
                ? 'bg-blue-950/80 border-blue-600 text-blue-300 font-semibold'
                : 'bg-slate-950 border-slate-800 text-slate-500 opacity-60'
            }`}
          >
            Almgren-Chriss
          </button>
          <button
            onClick={() => toggleStrategy('DYNAMIC_ADAPTIVE')}
            className={`px-2.5 py-1 rounded-md border transition ${
              activeStrategies.DYNAMIC_ADAPTIVE
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-semibold shadow shadow-emerald-500/20'
                : 'bg-slate-950 border-slate-800 text-slate-500 opacity-60'
            }`}
          >
            Dynamic Adaptive ★
          </button>
        </div>
      </div>

      {/* Main Recharts Area */}
      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="timeLabel" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis
              domain={['auto', 'auto']}
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `$${v.toFixed(1)}`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: '#f8fafc',
              }}
              formatter={(value: any, name: any) => [`$${Number(value).toFixed(2)}`, name]}
            />

            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

            {/* Arrival Price Reference Line */}
            <ReferenceLine
              y={config.arrivalPrice}
              stroke="#94a3b8"
              strokeDasharray="4 4"
              label={{
                value: `Arrival $${config.arrivalPrice}`,
                fill: '#94a3b8',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />

            {/* Shock Interval Vertical Marker */}
            {shockStep && (
              <ReferenceLine
                x={shockStep.timeLabel}
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="2 2"
                label={{
                  value: '⚡ MARKET SHOCK',
                  fill: '#f59e0b',
                  fontSize: 11,
                  fontWeight: 'bold',
                  position: 'top',
                }}
              />
            )}

            {/* Underlying Market Mid Price */}
            <Area
              type="monotone"
              dataKey="midPrice"
              name="Market Mid Price"
              stroke="#38bdf8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMid)"
            />

            {/* Strategy Execution Price Paths */}
            {activeStrategies.TWAP && (
              <Line
                type="monotone"
                dataKey="TWAP"
                name="TWAP Exec"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            )}

            {activeStrategies.VWAP && (
              <Line
                type="monotone"
                dataKey="VWAP"
                name="VWAP Exec"
                stroke="#a855f7"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            )}

            {activeStrategies.ALMGREN_CHRISS && (
              <Line
                type="monotone"
                dataKey="ALMGREN_CHRISS"
                name="Almgren-Chriss Exec"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            )}

            {activeStrategies.DYNAMIC_ADAPTIVE && (
              <Line
                type="monotone"
                dataKey="DYNAMIC_ADAPTIVE"
                name="Dynamic Adaptive Exec"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 3, fill: '#10b981' }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
