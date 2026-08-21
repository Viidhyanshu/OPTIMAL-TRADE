import React from 'react';
import { SimulationResult } from '@/lib/engine/types';
import { ShieldAlert, Zap, ArrowRight, Activity, TrendingUp, Cpu } from 'lucide-react';

interface RegimeShockBannerProps {
  result: SimulationResult;
}

export const RegimeShockBanner: React.FC<RegimeShockBannerProps> = ({ result }) => {
  const { config, marketData, strategyResults } = result;

  if (!config.enableShock) {
    return (
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Stationary Market Simulation Mode (No Shock Injected)</span>
        </div>
        <span className="text-slate-500">Toggle "Mid-Way Market Regime Shift" in control panel to simulate volatility shocks.</span>
      </div>
    );
  }

  const shockData = marketData.find((m) => m.isShockActive);
  const shockIntervalIndex = shockData ? shockData.interval : config.shockInterval;

  const twapCost = strategyResults.TWAP.implementationShortfall;
  const adaptiveCost = strategyResults.DYNAMIC_ADAPTIVE.implementationShortfall;
  const alphaDollars = twapCost - adaptiveCost;

  return (
    <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-cyan-950/40 border border-amber-800/60 rounded-2xl p-5 shadow-xl relative overflow-hidden space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-900/50 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-900/60 text-amber-400 border border-amber-700/80 animate-pulse">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              Mid-Stream Market Regime Shift Triggered
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700 font-mono">
                Interval #{shockIntervalIndex} ({shockData?.timeLabel})
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Volatility spiked <strong className="text-amber-300">{config.shockVolatilityMultiplier}x</strong> & Bid-Ask spread widened <strong className="text-amber-300">{config.shockSpreadMultiplier}x</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-emerald-800/60 text-xs text-emerald-400 font-medium">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>Dynamic Slicing Adaptation Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 font-medium block">Static TWAP Behavior</span>
          <p className="text-slate-300">
            Continued slicing equal size ({Math.round(config.totalQuantity / config.totalIntervals)} shares) blindly during peak illiquidity, paying high market impact.
          </p>
          <div className="text-rose-400 font-mono font-bold pt-1">
            Total Shortfall: ${twapCost.toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" />
            Dynamic Adaptive Behavior
          </span>
          <p className="text-slate-300">
            Detected spread spike instantly, throttled order size to 55% during shock peak, then accelerated fill when volatility normalized.
          </p>
          <div className="text-emerald-400 font-mono font-bold pt-1">
            Total Shortfall: ${adaptiveCost.toLocaleString()}
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-950/60 to-slate-950 p-3 rounded-xl border border-emerald-800/60 space-y-1 flex flex-col justify-between">
          <span className="text-slate-300 font-semibold">Shock Mitigation Alpha</span>
          <div className="text-xl font-extrabold text-emerald-400 font-mono">
            +${alphaDollars.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">
            Successfully prevented adverse selection & excess slippage under stress.
          </p>
        </div>
      </div>
    </div>
  );
};
