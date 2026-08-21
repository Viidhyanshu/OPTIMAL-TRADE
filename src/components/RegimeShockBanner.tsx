import React from 'react';
import { SimulationResult } from '@/lib/engine/types';
import { ShieldAlert, Zap, Cpu } from 'lucide-react';

interface RegimeShockBannerProps {
  result: SimulationResult;
}

export const RegimeShockBanner: React.FC<RegimeShockBannerProps> = ({ result }) => {
  const { config, marketData, strategyResults } = result;

  if (!config.enableShock) {
    return (
      <div className="bg-[#12131a] border border-white/5 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-white" />
          <span>Stationary Market Simulation Mode (No Shock Injected)</span>
        </div>
        <span className="text-slate-500">Toggle "Regime Shock Active" in navbar to test mid-challenge volatility shocks.</span>
      </div>
    );
  }

  const shockData = marketData.find((m) => m.isShockActive);
  const shockIntervalIndex = shockData ? shockData.interval : config.shockInterval;

  const twapCost = strategyResults.TWAP.implementationShortfall;
  const adaptiveCost = strategyResults.DYNAMIC_ADAPTIVE.implementationShortfall;
  const alphaDollars = twapCost - adaptiveCost;

  return (
    <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/60 animate-pulse">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              Mid-Stream Market Regime Shift Triggered
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700 font-mono">
                Interval #{shockIntervalIndex} ({shockData?.timeLabel})
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Volatility spiked <strong className="text-white">{config.shockVolatilityMultiplier}x</strong> & Bid-Ask spread widened <strong className="text-white">{config.shockSpreadMultiplier}x</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181924] border border-white/5 text-xs text-emerald-400 font-medium">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>Dynamic Slicing Adaptation Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#181924] p-3.5 rounded-xl border border-white/5 space-y-1.5">
          <span className="text-slate-400 font-medium block">Static TWAP Behavior</span>
          <p className="text-slate-300 text-[11px]">
            Continued slicing equal size ({Math.round(config.totalQuantity / config.totalIntervals)} shares) blindly during peak illiquidity, paying high market impact.
          </p>
          <div className="text-rose-400 font-mono font-bold pt-1">
            Total Shortfall: ${twapCost.toLocaleString()}
          </div>
        </div>

        <div className="bg-[#181924] p-3.5 rounded-xl border border-white/5 space-y-1.5">
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" />
            Dynamic Adaptive Behavior
          </span>
          <p className="text-slate-300 text-[11px]">
            Detected spread spike instantly, throttled order size to 55% during shock peak, then accelerated fill when volatility normalized.
          </p>
          <div className="text-emerald-400 font-mono font-bold pt-1">
            Total Shortfall: ${adaptiveCost.toLocaleString()}
          </div>
        </div>

        <div className="bg-[#181924] p-3.5 rounded-xl border border-white/5 space-y-1 flex flex-col justify-between">
          <span className="text-slate-300 font-semibold">Shock Mitigation Alpha</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            +${alphaDollars.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">
            Prevented adverse selection & excess slippage under stress.
          </p>
        </div>
      </div>
    </div>
  );
};
