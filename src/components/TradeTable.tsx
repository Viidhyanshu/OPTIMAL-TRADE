'use client';

import React, { useState } from 'react';
import { SimulationResult, StrategyType } from '@/lib/engine/types';
import { Table, Droplets } from 'lucide-react';

interface TradeTableProps {
  result: SimulationResult;
}

export const TradeTable: React.FC<TradeTableProps> = ({ result }) => {
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>('DYNAMIC_ADAPTIVE');
  const { marketData, strategyResults } = result;

  const currentStrategyResult = strategyResults[selectedStrategy];

  return (
    <div className="apple-glass-panel rounded-3xl p-6 space-y-5">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 backdrop-blur-md">
            <Table className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base tracking-tight">
              Granular Execution Log & Microstructure Audit
            </h3>
            <p className="text-xs text-slate-400">
              Interval-by-interval trade executions with user formulas A, B, and D.
            </p>
          </div>
        </div>

        {/* Strategy Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 apple-glass-pill rounded-2xl text-xs font-medium text-slate-400">
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
                className={`px-3.5 py-1.5 rounded-xl font-bold transition duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black shadow-lg scale-[1.02]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {labels[strat]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Execution Log Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="apple-glass-pill text-[10px] uppercase tracking-wider text-slate-400 font-mono border-b border-white/10">
            <tr>
              <th className="py-3.5 px-3 rounded-l-xl">Interval</th>
              <th className="py-3.5 px-3">Time</th>
              <th className="py-3.5 px-3">Mid Price</th>
              <th className="py-3.5 px-3">Spread (A)</th>
              <th className="py-3.5 px-3">Rel Spread (bps)</th>
              <th className="py-3.5 px-3">Book Depth (B)</th>
              <th className="py-3.5 px-3">Liquidity Score (D)</th>
              <th className="py-3.5 px-3">Exec Qty</th>
              <th className="py-3.5 px-3">Exec Price</th>
              <th className="py-3.5 px-3">Impact Cost (₹)</th>
              <th className="py-3.5 px-3 rounded-r-xl">Slippage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono text-[11px]">
            {currentStrategyResult.steps.map((step, idx) => {
              const market = marketData[idx] || {};
              const isShock = step.isShockActive;

              return (
                <tr
                  key={step.interval}
                  className={`hover:bg-white/5 transition ${isShock ? 'bg-amber-500/10' : ''}`}
                >
                  <td className="py-3 px-3 font-extrabold text-white">#{step.interval}</td>
                  <td className="py-3 px-3 text-slate-400">{step.timeLabel}</td>
                  <td className="py-3 px-3 text-slate-200">₹{market.midPrice?.toFixed(2)}</td>
                  <td className="py-3 px-3 text-slate-400">₹{market.spread?.toFixed(2)}</td>
                  <td className="py-3 px-3 text-cyan-400 font-bold">{market.relativeSpreadBps} bps</td>
                  <td className="py-3 px-3 text-purple-300">{market.orderBookDepth?.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${
                        market.liquidityStatus === 'HIGH'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : market.liquidityStatus === 'MODERATE'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {market.volumeLiquidityScore}x ({market.liquidityStatus})
                    </span>
                  </td>
                  <td className="py-3 px-3 font-extrabold text-white">{step.executedQuantity.toLocaleString()}</td>
                  <td className="py-3 px-3 font-bold text-white">₹{step.executionPrice.toFixed(2)}</td>
                  <td className="py-3 px-3 text-amber-300 font-bold">₹{step.totalStepCost.toLocaleString()}</td>
                  <td
                    className={`py-3 px-3 font-black ${
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
