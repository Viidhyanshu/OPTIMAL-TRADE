import React from 'react';
import { SimulationResult, StrategyType } from '@/lib/engine/types';
import { DollarSign, Percent, Activity, Award, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricsOverviewProps {
  result: SimulationResult;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ result }) => {
  const { strategyResults, config, marketVWAP } = result;

  // Find best strategy based on lowest Implementation Shortfall
  const strategies: StrategyType[] = ['TWAP', 'VWAP', 'ALMGREN_CHRISS', 'DYNAMIC_ADAPTIVE'];
  let bestStrategy: StrategyType = 'DYNAMIC_ADAPTIVE';
  let minIS = Infinity;

  strategies.forEach((strat) => {
    const res = strategyResults[strat];
    if (res.implementationShortfall < minIS) {
      minIS = res.implementationShortfall;
      bestStrategy = strat;
    }
  });

  const bestResult = strategyResults[bestStrategy];
  const twapResult = strategyResults['TWAP'];
  const adaptiveResult = strategyResults['DYNAMIC_ADAPTIVE'];

  const savingsVersusTWAP = twapResult.implementationShortfall - adaptiveResult.implementationShortfall;
  const savingsBpsVersusTWAP = twapResult.implementationShortfallBps - adaptiveResult.implementationShortfallBps;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Implementation Shortfall (IS) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Implementation Shortfall
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white font-mono">
                ${adaptiveResult.implementationShortfall.toLocaleString()}
              </span>
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                adaptiveResult.implementationShortfallBps > 0 ? 'bg-rose-950 text-rose-400' : 'bg-emerald-950 text-emerald-400'
              }`}>
                {adaptiveResult.implementationShortfallBps > 0 ? '+' : ''}{adaptiveResult.implementationShortfallBps} bps
              </span>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Arrival P: <strong className="text-slate-200">${config.arrivalPrice.toFixed(2)}</strong></span>
          <span>Avg Exec: <strong className="text-slate-200">${adaptiveResult.avgExecutionPrice.toFixed(2)}</strong></span>
        </div>
      </div>

      {/* Card 2: Market VWAP Comparison */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Market VWAP Benchmark
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white font-mono">
                ${marketVWAP.toFixed(2)}
              </span>
              <span className="text-xs font-medium text-slate-400">
                (Baseline)
              </span>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-blue-950/80 text-blue-400 border border-blue-800/50">
            <Activity className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>VWAP Slippage:</span>
          <span className="font-mono text-cyan-400 font-semibold">{adaptiveResult.vwapDeviationBps} bps</span>
        </div>
      </div>

      {/* Card 3: Dynamic Strategy Savings */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Dynamic Strategy Alpha
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className={`text-2xl font-extrabold font-mono ${savingsVersusTWAP >= 0 ? 'text-emerald-400' : 'text-slate-200'}`}>
                ${Math.abs(savingsVersusTWAP).toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">saved vs TWAP</span>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Cost Savings:</span>
          <span className="font-mono font-semibold text-emerald-400">
            {savingsBpsVersusTWAP > 0 ? '+' : ''}{savingsBpsVersusTWAP.toFixed(1)} bps
          </span>
        </div>
      </div>

      {/* Card 4: Strategy Winner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-900/60 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Optimal Strategy Winner
            </span>
            <div className="mt-1 text-lg font-black text-white tracking-tight">
              {bestResult.strategyName}
            </div>
          </div>
          <div className="px-2 py-1 rounded-lg bg-amber-950/80 border border-amber-700/60 text-amber-300 text-[10px] font-bold">
            MIN COST
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Fill Completion:</span>
          <span className="font-mono font-bold text-emerald-400">{bestResult.fillRate}%</span>
        </div>
      </div>
    </div>
  );
};
