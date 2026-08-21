'use client';

import React from 'react';
import { SimulationResult, StrategyType } from '@/lib/engine/types';
import { ShieldCheck, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface AssetsTableCardProps {
  result: SimulationResult;
}

export const AssetsTableCard: React.FC<AssetsTableCardProps> = ({ result }) => {
  const { strategyResults, config } = result;

  const strategies: { key: StrategyType; name: string }[] = [
    { key: 'DYNAMIC_ADAPTIVE', name: 'Dynamic Adaptive Execution' },
    { key: 'ALMGREN_CHRISS', name: 'Almgren-Chriss Optimal' },
    { key: 'VWAP', name: 'Volume-Weighted (VWAP)' },
    { key: 'TWAP', name: 'Time-Weighted (TWAP)' },
  ];

  return (
    <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white text-base">Execution Slicing Strategy Audit</h3>
          <p className="text-xs text-slate-400">Implementation Shortfall & Cost Slippage Comparison</p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 text-[10px] font-bold border border-emerald-800/60 font-mono">
          NIFTY 50 FEED
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#181924] text-[10px] uppercase tracking-wider text-slate-400 font-mono border-b border-white/5">
            <tr>
              <th className="py-2.5 px-3">Strategy</th>
              <th className="py-2.5 px-3 text-right">Exec Qty</th>
              <th className="py-2.5 px-3 text-right">Avg Price</th>
              <th className="py-2.5 px-3 text-right">Shortfall (₹)</th>
              <th className="py-2.5 px-3 text-right">Slippage</th>
              <th className="py-2.5 px-3 text-right">Sharpe</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono text-[11px]">
            {strategies.map(({ key, name }) => {
              const res = strategyResults[key];
              const isAdaptive = key === 'DYNAMIC_ADAPTIVE';
              const isPositiveSlippage = res.implementationShortfallBps > 0;

              return (
                <tr
                  key={key}
                  className={`hover:bg-white/5 transition ${
                    isAdaptive ? 'bg-emerald-950/20 font-semibold' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      {isAdaptive && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                      <span className={isAdaptive ? 'text-emerald-300 font-bold' : 'text-white'}>
                        {name}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right text-slate-200">
                    {res.totalExecutedQuantity.toLocaleString()}
                  </td>

                  <td className="py-3 px-3 text-right text-white font-bold">
                    ₹{res.avgExecutionPrice.toFixed(2)}
                  </td>

                  <td
                    className={`py-3 px-3 text-right font-bold ${
                      isPositiveSlippage ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    ₹{res.implementationShortfall.toLocaleString()}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <span
                      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                        isPositiveSlippage
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                          : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                      }`}
                    >
                      {isPositiveSlippage ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {res.implementationShortfallBps} bps
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right text-slate-300 font-bold">
                    {res.sharpeRatio}
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
