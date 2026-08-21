'use client';

import React, { useState } from 'react';
import { SimulationResult, StrategyType } from '@/lib/engine/types';
import { Table, ShieldAlert } from 'lucide-react';

interface TradeTableProps {
  result: SimulationResult;
}

export const TradeTable: React.FC<TradeTableProps> = ({ result }) => {
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>('DYNAMIC_ADAPTIVE');

  const { strategyResults, marketData } = result;
  const currentResult = strategyResults[selectedStrategy];

  return (
    <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Table className="w-5 h-5 text-white" />
          <h3 className="font-bold text-white text-base">
            Granular Execution Log & Microstructure Audit
          </h3>
        </div>

        {/* Strategy Selector Tabs */}
        <div className="flex items-center gap-1 bg-[#181924] p-1 rounded-xl border border-white/5 text-xs font-medium">
          {(['TWAP', 'VWAP', 'ALMGREN_CHRISS', 'DYNAMIC_ADAPTIVE'] as StrategyType[]).map((strat) => (
            <button
              key={strat}
              onClick={() => setSelectedStrategy(strat)}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedStrategy === strat
                  ? 'bg-white text-black font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {strat === 'ALMGREN_CHRISS' ? 'Almgren-Chriss' : strat === 'DYNAMIC_ADAPTIVE' ? 'Dynamic ★' : strat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#181924] text-slate-400 sticky top-0 uppercase tracking-wider text-[10px] font-semibold border-b border-white/5">
            <tr>
              <th className="py-2.5 px-3">Interval</th>
              <th className="py-2.5 px-3">Time</th>
              <th className="py-2.5 px-3">Mid Price</th>
              <th className="py-2.5 px-3">Bid/Ask Spread</th>
              <th className="py-2.5 px-3 text-right">Target Qty</th>
              <th className="py-2.5 px-3 text-right">Executed Qty</th>
              <th className="py-2.5 px-3 text-right">Exec Price</th>
              <th className="py-2.5 px-3 text-right">Impact Cost ($)</th>
              <th className="py-2.5 px-3 text-right">Slippage (bps)</th>
              <th className="py-2.5 px-3 text-center">Shock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono text-[11px]">
            {currentResult.steps.map((step, idx) => {
              const market = marketData[idx];
              return (
                <tr
                  key={step.interval}
                  className={`hover:bg-white/5 transition ${
                    step.isShockActive ? 'bg-amber-950/20' : ''
                  }`}
                >
                  <td className="py-2 px-3 text-slate-400">#{step.interval}</td>
                  <td className="py-2 px-3 font-sans font-medium text-slate-200">{step.timeLabel}</td>
                  <td className="py-2 px-3 text-slate-300">${market.midPrice.toFixed(2)}</td>
                  <td className="py-2 px-3 text-slate-400">${market.spread.toFixed(3)}</td>
                  <td className="py-2 px-3 text-right text-slate-300">{step.targetQuantity.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right font-bold text-white">{step.executedQuantity.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right font-bold text-white">${step.executionPrice.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right text-amber-400">${step.impactCost.toFixed(2)}</td>
                  <td className={`py-2 px-3 text-right font-semibold ${
                    step.slippageBps > 0 ? 'text-rose-400' : 'text-[#10b981]'
                  }`}>
                    {step.slippageBps > 0 ? '+' : ''}{step.slippageBps}
                  </td>
                  <td className="py-2 px-3 text-center font-sans">
                    {step.isShockActive ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 text-[10px] font-bold border border-amber-800">
                        <ShieldAlert className="w-3 h-3" /> SHOCK
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
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
