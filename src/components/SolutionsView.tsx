'use client';

import React from 'react';
import { Cpu, ShieldCheck, Zap, Layers, DollarSign, CheckCircle2, ArrowRight } from 'lucide-react';

interface SolutionsViewProps {
  tab: string;
}

export const SolutionsView: React.FC<SolutionsViewProps> = ({ tab }) => {
  return (
    <div className="bg-[#12131a] border border-white/5 rounded-2xl p-6 shadow-2xl space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <span className="text-xs text-slate-400 font-mono">AI Finance / Platform Overview</span>
          <h2 className="text-2xl font-bold text-white tracking-tight">{tab} Suite</h2>
        </div>
        <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-white">
          Institutional Grade
        </span>
      </div>

      {tab === 'Solutions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#181924] border border-white/5 space-y-2">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <h3 className="font-bold text-white text-base">Almgren-Chriss Optimization</h3>
            <p className="text-xs text-slate-400">
              Closed-form optimal liquidation trajectories balancing permanent & temporary market impact against risk aversion parameter &lambda;.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#181924] border border-white/5 space-y-2">
            <Zap className="w-6 h-6 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Dynamic Adaptive Slicing</h3>
            <p className="text-xs text-slate-400">
              Real-time feedback algorithm dynamically recalculating order slices upon detecting mid-stream volatility spikes or liquidity drops.
            </p>
          </div>
        </div>
      )}

      {tab === 'Features' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#181924] border border-white/5 space-y-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-white text-sm">Regime Shift Shock Test</h4>
            <p className="text-slate-400">Simulate 3x volatility jumps and 60% liquidity drops mid-challenge.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#181924] border border-white/5 space-y-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h4 className="font-bold text-white text-sm">Efficient Frontier Analysis</h4>
            <p className="text-slate-400">Calculate E[x] vs &sigma;(Cost) trade-off curves in real time.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#181924] border border-white/5 space-y-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            <h4 className="font-bold text-white text-sm">Implementation Shortfall Audit</h4>
            <p className="text-slate-400">Measure slippage in bps, spread costs, and permanent market impact.</p>
          </div>
        </div>
      )}

      {tab === 'Pricing' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#181924] border border-white/5 space-y-4">
            <h3 className="font-bold text-white text-lg">Hedge Fund Plan</h3>
            <div className="text-3xl font-extrabold text-white">$499 <span className="text-xs text-slate-400 font-normal">/ mo</span></div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited Trade Simulations</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Almgren-Chriss & Dynamic Adaptive RL</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Mid-way Regime Shock Tester</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-[#181924] border border-white/20 space-y-4">
            <h3 className="font-bold text-white text-lg">Institutional Enterprise</h3>
            <div className="text-3xl font-extrabold text-white">Custom <span className="text-xs text-slate-400 font-normal">API & FIX protocol</span></div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Direct Exchange API Connections</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Custom Machine Learning Models</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
