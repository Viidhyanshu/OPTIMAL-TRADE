'use client';

import React from 'react';
import { Activity, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full flex items-center justify-between py-3 px-6 apple-liquid-glass rounded-3xl border border-white/15 shadow-2xl backdrop-blur-3xl relative z-20">
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-[0_0_20px_rgba(56,189,248,0.4)] border border-white/20">
          <Activity className="w-4 h-4 text-white stroke-[2.5]" />
        </div>
        <div>
          <span className="font-extrabold text-white text-base tracking-tight block leading-none font-sans">
            OPTIMAL TRADE
          </span>
          <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block mt-1">
            Institutional Algorithmic Engine
          </span>
        </div>
      </div>

      {/* Right Live Status Badge */}
      <div className="flex items-center gap-2">
        <div className="px-3 py-1 rounded-full apple-glass-pill text-xs text-slate-200 font-medium border border-white/15 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-4" />
          <span className="font-mono text-[11px] text-emerald-300 font-bold">NIFTY 50 LIVE TELEMETRY</span>
        </div>
      </div>
    </header>
  );
};
