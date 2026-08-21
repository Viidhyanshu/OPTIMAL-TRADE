'use client';

import React from 'react';
import { SimulationResult } from '@/lib/engine/types';

interface AssetsTableCardProps {
  result: SimulationResult;
}

export const AssetsTableCard: React.FC<AssetsTableCardProps> = ({ result }) => {
  const { strategyResults, config } = result;

  const strategies = [
    {
      key: 'DYNAMIC_ADAPTIVE',
      name: 'Dynamic Adaptive',
      symbol: 'AI ★',
      iconBg: 'bg-emerald-950 text-emerald-400 border-emerald-800',
      data: strategyResults.DYNAMIC_ADAPTIVE,
    },
    {
      key: 'ALMGREN_CHRISS',
      name: 'Almgren-Chriss',
      symbol: 'AC',
      iconBg: 'bg-blue-950 text-blue-400 border-blue-800',
      data: strategyResults.ALMGREN_CHRISS,
    },
    {
      key: 'VWAP',
      name: 'VWAP Engine',
      symbol: 'VOL',
      iconBg: 'bg-purple-950 text-purple-400 border-purple-800',
      data: strategyResults.VWAP,
    },
    {
      key: 'TWAP',
      name: 'TWAP Engine',
      symbol: 'TIME',
      iconBg: 'bg-amber-950 text-amber-400 border-amber-800',
      data: strategyResults.TWAP,
    },
  ];

  return (
    <div className="bg-[#12131b]/90 border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white text-base">Assets & Strategy Audit</h3>
        <span className="text-xs text-slate-400">Microstructure Breakdown</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="text-slate-400 border-b border-white/5 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="pb-3 font-semibold">Name</th>
              <th className="pb-3 text-right font-semibold">Quantity</th>
              <th className="pb-3 text-right font-semibold">APP</th>
              <th className="pb-3 text-right font-semibold">Exec Price</th>
              <th className="pb-3 text-right font-semibold">Total Shortfall</th>
              <th className="pb-3 text-right font-semibold">+/- Slippage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {strategies.map((strat) => {
              const totalVal = strat.data.totalExecutedQuantity * strat.data.avgExecutionPrice;
              const isPositiveSavings = strat.data.implementationShortfallBps <= 0;

              return (
                <tr key={strat.key} className="hover:bg-white/5 transition">
                  {/* Name with Icon Badge */}
                  <td className="py-3 font-sans">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-[10px] ${strat.iconBg}`}>
                        {strat.symbol}
                      </div>
                      <div>
                        <span className="font-bold text-white block">{strat.name}</span>
                        <span className="text-[10px] text-slate-500">{config.symbol}</span>
                      </div>
                    </div>
                  </td>

                  {/* Quantity */}
                  <td className="py-3 text-right text-slate-300">
                    {strat.data.totalExecutedQuantity.toLocaleString()}
                  </td>

                  {/* APP (Arrival Price) */}
                  <td className="py-3 text-right text-slate-400">
                    ${config.arrivalPrice.toFixed(2)}
                  </td>

                  {/* Exec Price */}
                  <td className="py-3 text-right text-white font-bold">
                    ${strat.data.avgExecutionPrice.toFixed(2)}
                  </td>

                  {/* Value / Total Shortfall */}
                  <td className="py-3 text-right text-slate-200 font-bold">
                    ${strat.data.implementationShortfall.toLocaleString()}
                  </td>

                  {/* +/- Slippage */}
                  <td className={`py-3 text-right font-bold ${
                    isPositiveSavings ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {strat.data.implementationShortfallBps > 0 ? '+' : ''}{strat.data.implementationShortfallBps} bps
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
