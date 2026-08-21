'use client';

import React, { useState } from 'react';
import { SimulationResult, StrategyType } from '@/lib/engine/types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { LineChart as LineChartIcon, Activity } from 'lucide-react';

interface PriceTrajectoryChartProps {
  result: SimulationResult;
}

export const PriceTrajectoryChart: React.FC<PriceTrajectoryChartProps> = ({ result }) => {
  const { marketData, strategyResults, config } = result;

  const [activeStrategies, setActiveStrategies] = useState<Record<StrategyType, boolean>>({
    TWAP: true,
    VWAP: true,
    ALMGREN_CHRISS: true,
    DYNAMIC_ADAPTIVE: true,
  });

  const toggleStrategy = (strat: StrategyType) => {
    setActiveStrategies((prev) => ({
      ...prev,
      [strat]: !prev[strat],
    }));
  };

  const chartData = marketData.map((m, idx) => ({
    timeLabel: m.timeLabel,
    Benchmark: m.midPrice,
    TWAP: strategyResults.TWAP.steps[idx]?.executionPrice || m.midPrice,
    VWAP: strategyResults.VWAP.steps[idx]?.executionPrice || m.midPrice,
    'Almgren-Chriss': strategyResults.ALMGREN_CHRISS.steps[idx]?.executionPrice || m.midPrice,
    'Dynamic Adaptive': strategyResults.DYNAMIC_ADAPTIVE.steps[idx]?.executionPrice || m.midPrice,
  }));

  return (
    <div className="apple-glass-panel rounded-3xl p-6 space-y-5">
      {/* Header & Strategy Toggles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 backdrop-blur-md">
            <LineChartIcon className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base tracking-tight">
              Execution Price Trajectory Comparison
            </h3>
            <p className="text-xs text-slate-400">
              Live interval execution prices vs benchmark mid price trajectories (₹).
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 apple-glass-pill rounded-2xl text-[11px]">
          {(['TWAP', 'VWAP', 'ALMGREN_CHRISS', 'DYNAMIC_ADAPTIVE'] as StrategyType[]).map((strat) => {
            const isActive = activeStrategies[strat];
            const labels: Record<StrategyType, string> = {
              TWAP: 'TWAP',
              VWAP: 'VWAP',
              ALMGREN_CHRISS: 'A-C Risk',
              DYNAMIC_ADAPTIVE: 'Dynamic ★',
            };

            return (
              <button
                key={strat}
                onClick={() => toggleStrategy(strat)}
                className={`px-3 py-1 rounded-xl font-bold transition duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {labels[strat]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-[260px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
            <XAxis dataKey="timeLabel" stroke="#64748b" tick={{ fontSize: 10 }} />
            <YAxis domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 10 }} />

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
              formatter={(val: any, name: any) => [`₹${Number(val).toFixed(2)}`, name]}
            />

            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

            <Line type="monotone" dataKey="Benchmark" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />

            {activeStrategies.TWAP && (
              <Line type="monotone" dataKey="TWAP" stroke="#60a5fa" strokeWidth={2} dot={false} />
            )}
            {activeStrategies.VWAP && (
              <Line type="monotone" dataKey="VWAP" stroke="#a78bfa" strokeWidth={2} dot={false} />
            )}
            {activeStrategies.ALMGREN_CHRISS && (
              <Line type="monotone" dataKey="Almgren-Chriss" stroke="#f59e0b" strokeWidth={2} dot={false} />
            )}
            {activeStrategies.DYNAMIC_ADAPTIVE && (
              <Line type="monotone" dataKey="Dynamic Adaptive" stroke="#10b981" strokeWidth={2.5} dot={false} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
