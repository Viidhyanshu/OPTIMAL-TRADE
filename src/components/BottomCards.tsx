'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownLeft, FileText, Activity } from 'lucide-react';

export const BottomCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
      {/* Card 1: Recent transactions */}
      <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-slate-300 text-sm">Recent transactions</h4>
          <span className="text-[10px] text-slate-500 font-mono">View All</span>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#181924] border border-white/5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-400">
                <ArrowDownLeft className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold text-white block">Bought BTC</span>
                <span className="text-[10px] text-slate-500">TWAP Slice #12</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-emerald-400 block">+0.012 BTC</span>
              <span className="text-[10px] text-slate-500">€1,208.50</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-[#181924] border border-white/5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-950/80 text-blue-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold text-white block">Sold ETH</span>
                <span className="text-[10px] text-slate-500">Almgren-Chriss</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-300 block">-0.45 ETH</span>
              <span className="text-[10px] text-slate-500">€1,444.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Market Dynamics */}
      <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-slate-300 text-sm">Market</h4>
          <span className="text-[10px] text-slate-500 font-mono">Microstructure</span>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#181924] border border-white/5">
            <span className="text-slate-400">Baseline Volatility (&sigma;)</span>
            <span className="font-mono font-bold text-white">1.50%</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#181924] border border-white/5">
            <span className="text-slate-400">Bid-Ask Spread</span>
            <span className="font-mono font-bold text-emerald-400">5.0 bps</span>
          </div>
        </div>
      </div>

      {/* Card 3: Articles / Strategy Insights */}
      <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-slate-300 text-sm">Articles</h4>
          <span className="text-[10px] text-slate-500 font-mono">Research</span>
        </div>
        <div className="space-y-2 text-xs">
          <div className="p-2 rounded-xl bg-[#181924] border border-white/5 space-y-1">
            <span className="font-bold text-white block text-[11px]">
              Almgren-Chriss Framework for Institutional Execution
            </span>
            <p className="text-[10px] text-slate-400">
              Balancing temporary vs permanent market impact against volatility risk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
