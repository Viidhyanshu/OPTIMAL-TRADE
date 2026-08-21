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
    <div className="bg-[#0e0f14] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-white" />
          <h3 className="font-bold text-white text-base">
            Strategy Execution Performance & Shortfall Matrix
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold border bg-white/10 text-white border-white/10">
            {config.side} ORDER
          </span>

          <span className="px-3 py-1 rounded-full bg-white text-black text-xs font-bold border border-white flex items-center gap-1.5 shadow">
            <Zap className="w-3.5 h-3.5 fill-black text-black" />
            Optimal: {strategyResults[bestStrategy].strategyName}
          </span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#151620] text-[10px] uppercase tracking-wider text-slate-400 font-mono border-b border-white/10">
            <tr>
              <th className="py-3 px-3">Execution Strategy</th>
              <th className="py-3 px-3">Avg Exec Price</th>
              <th className="py-3 px-3">Impl. Shortfall (₹)</th>
              <th className="py-3 px-3">Slippage (bps)</th>
              <th className="py-3 px-3">Market Impact</th>
              <th className="py-3 px-3">Sharpe Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 font-mono text-[11px]">
            {strategies.map((stratKey) => {
              const res = strategyResults[stratKey];
              const isBest = stratKey === bestStrategy;

              return (
                <tr
                  key={stratKey}
                  className={`hover:bg-white/5 transition ${isBest ? 'bg-white/10' : ''}`}
                >
                  <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                    {res.strategyName}
                    {isBest && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-white text-black font-extrabold font-sans">
                        BEST
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-semibold text-white">
                    ₹{res.avgExecutionPrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 font-bold text-white">
                    {formatShortfall(res.implementationShortfall)}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-300">
                    {res.implementationShortfallBps > 0 ? `+${res.implementationShortfallBps}` : res.implementationShortfallBps} bps
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-semibold">
                    ₹{res.impactCostTotal.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-white font-bold">
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
