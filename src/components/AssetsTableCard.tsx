'use client';

import React from 'react';
import { SimulationResult, StrategyType } from '@/lib/engine/types';
import { Award, Zap } from 'lucide-react';

interface AssetsTableCardProps {
  result: SimulationResult;
}

export const AssetsTableCard: React.FC<AssetsTableCardProps> = ({ result }) => {
  const { strategyResults, config } = result;
  const strategies: StrategyType[] = ['TWAP', 'VWAP', 'ALMGREN_CHRISS', 'DYNAMIC_ADAPTIVE'];

  const sortedByShortfall = [...strategies].sort(
    (a, b) => strategyResults[a].implementationShortfall - strategyResults[b].implementationShortfall
  );
  const bestStrategy = sortedByShortfall[0];

  const formatShortfall = (val: number) => {
    const sign = val > 0 ? '+' : '';
    return `${sign}₹${val.toLocaleString()}`;
  };

  const isBuy = config.side === 'BUY';

  return (
    <div className="apple-glass-panel rounded-3xl p-6 space-y-4">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
            <Award className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base tracking-tight">
              Strategy Execution Performance & Shortfall Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Quantitative comparison of Implementation Shortfall across algorithms.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold border backdrop-blur-md ${
              isBuy
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}
          >
            {config.side} ORDER
          </span>

          <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5 backdrop-blur-md shadow">
            <Zap className="w-3.5 h-3.5 fill-emerald-400" />
            Optimal: {strategyResults[bestStrategy].strategyName}
          </span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="apple-glass-pill text-[10px] uppercase tracking-wider text-slate-400 font-mono border-b border-white/10">
            <tr>
              <th className="py-3.5 px-4 rounded-l-xl">Execution Strategy</th>
              <th className="py-3.5 px-4">Avg Exec Price</th>
              <th className="py-3.5 px-4">Impl. Shortfall (₹)</th>
              <th className="py-3.5 px-4">Slippage (bps)</th>
              <th className="py-3.5 px-4">Market Impact</th>
              <th className="py-3.5 px-4 rounded-r-xl">Sharpe Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono text-[11px]">
            {strategies.map((stratKey) => {
              const res = strategyResults[stratKey];
              const isBest = stratKey === bestStrategy;

              return (
                <tr
                  key={stratKey}
                  className={`hover:bg-white/5 transition ${isBest ? 'bg-emerald-500/10' : ''}`}
                >
                  <td className="py-3.5 px-4 font-extrabold text-white flex items-center gap-2">
                    {res.strategyName}
                    {isBest && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-400 text-black font-black font-sans shadow">
                        BEST
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    ₹{res.avgExecutionPrice.toFixed(2)}
                  </td>
                  <td
                    className={`py-3.5 px-4 font-extrabold ${
                      res.implementationShortfall > 0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {formatShortfall(res.implementationShortfall)}
                  </td>
                  <td
                    className={`py-3.5 px-4 font-extrabold ${
                      res.implementationShortfallBps > 0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {res.implementationShortfallBps > 0 ? `+${res.implementationShortfallBps}` : res.implementationShortfallBps} bps
                  </td>
                  <td className="py-3.5 px-4 text-amber-300 font-bold">
                    ₹{res.impactCostTotal.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-cyan-400 font-extrabold">
                    {res.sharpeRatio.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
