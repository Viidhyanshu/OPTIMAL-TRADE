'use client';

import React, { useState } from 'react';
import { SimulationResult, StrategyType } from '@/lib/engine/types';
import { Table, Zap, Droplets } from 'lucide-react';

interface TradeTableProps {
  result: SimulationResult;
}

export const TradeTable: React.FC<TradeTableProps> = ({ result }) => {
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>('DYNAMIC_ADAPTIVE');
  const { marketData, strategyResults } = result;

  const currentStrategyResult = strategyResults[selectedStrategy];

  return (
    <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Table className="w-5 h-5 text-white" />
          <h3 className="font-bold text-white text-base">
            Granular Execution Log & Microstructure Audit
          </h3>
        </div>

        {/* Strategy Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#181924] border border-white/5 text-xs font-medium text-slate-400">
          {(['TWAP', 'VWAP', 'ALMGREN_CHRISS', 'DYNAMIC_ADAPTIVE'] as StrategyType[]).map((strat) => {
            const isSelected = selectedStrategy === strat;
            const labels: Record<StrategyType, string> = {
              TWAP: 'TWAP',
              VWAP: 'VWAP',
              ALMGREN_CHRISS: 'Almgren-Chriss',
              DYNAMIC_ADAPTIVE: 'Dynamic ★',
            };

            return (
              <button
                key={strat}
                onClick={() => setSelectedStrategy(strat)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  isSelected ? 'bg-white text-black font-bold shadow' : 'hover:text-white'
                }`}
              >
                {labels[strat]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Execution Log Table with User Formulas A, B, and D */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#181924] text-[10px] uppercase tracking-wider text-slate-400 font-mono border-b border-white/5">
            <tr>
              <th className="py-3 px-3">Interval</th>
              <th className="py-3 px-3">Time</th>
              <th className="py-3 px-3">Mid Price</th>
              <th className="py-3 px-3">Spread (A)</th>
              <th className="py-3 px-3">Rel Spread (bps)</th>
              <th className="py-3 px-3">Book Depth (B)</th>
              <th className="py-3 px-3">Liquidity Score (D)</th>
              <th className="py-3 px-3">Exec Qty</th>
              <th className="py-3 px-3">Exec Price</th>
              <th className="py-3 px-3">Impact Cost (₹)</th>
              <th className="py-3 px-3">Slippage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono text-[11px]">
            {currentStrategyResult.steps.map((step, idx) => {
              const market = marketData[idx] || {};
              const isShock = step.isShockActive;

              return (
                <tr
                  key={step.interval}
                  className={`hover:bg-white/5 transition ${isShock ? 'bg-amber-950/20' : ''}`}
                >
                  <td className="py-2.5 px-3 font-semibold text-white">#{step.interval}</td>
                  <td className="py-2.5 px-3 text-slate-400">{step.timeLabel}</td>
                  <td className="py-2.5 px-3 text-slate-200">₹{market.midPrice?.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-slate-400">₹{market.spread?.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-cyan-400 font-semibold">{market.relativeSpreadBps} bps</td>
                  <td className="py-2.5 px-3 text-purple-300">{market.orderBookDepth?.toLocaleString()}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        market.liquidityStatus === 'HIGH'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                          : market.liquidityStatus === 'MODERATE'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                          : 'bg-rose-950 text-rose-300 border border-rose-800/50'
                      }`}
                    >
                      {market.volumeLiquidityScore}x ({market.liquidityStatus})
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-white">{step.executedQuantity.toLocaleString()}</td>
                  <td className="py-2.5 px-3 font-semibold text-white">₹{step.executionPrice.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-amber-400 font-semibold">₹{step.totalStepCost.toLocaleString()}</td>
                  <td
                    className={`py-2.5 px-3 font-bold ${
                      step.slippageBps > 0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {step.slippageBps > 0 ? `+${step.slippageBps}` : step.slippageBps} bps
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
