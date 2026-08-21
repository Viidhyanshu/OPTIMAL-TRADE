'use client';

import React from 'react';
import { ArrowRight, Sparkles, ShieldAlert, GitBranch } from 'lucide-react';

interface HeaderProps {
  isShockActive: boolean;
  onToggleShock: () => void;
  onResetToDefaults: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isShockActive,
  onToggleShock,
  onResetToDefaults,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="w-full px-4 sm:px-8 py-4 flex items-center justify-between z-40">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
            AI Finance <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono border border-cyan-800/60">v2.4</span>
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Optimal Trade Execution Engine</span>
        </div>
      </div>

      {/* Top Glass Floating Nav Bar */}
      <div className="hidden lg:flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#12131b]/90 border border-white/10 backdrop-blur-md shadow-2xl text-xs font-medium text-slate-300">
        <button
          onClick={() => setActiveTab('Dashboard')}
          className={`px-3 py-1.5 rounded-full transition ${
            activeTab === 'Dashboard' ? 'bg-white/10 text-white font-semibold' : 'hover:text-white'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('Strategies')}
          className={`px-3 py-1.5 rounded-full transition ${
            activeTab === 'Strategies' ? 'bg-white/10 text-white font-semibold' : 'hover:text-white'
          }`}
        >
          Solutions
        </button>
        <button
          onClick={() => setActiveTab('Analytics')}
          className={`px-3 py-1.5 rounded-full transition ${
            activeTab === 'Analytics' ? 'bg-white/10 text-white font-semibold' : 'hover:text-white'
          }`}
        >
          Features
        </button>
        <button
          onClick={() => setActiveTab('Audit')}
          className={`px-3 py-1.5 rounded-full transition ${
            activeTab === 'Audit' ? 'bg-white/10 text-white font-semibold' : 'hover:text-white'
          }`}
        >
          Services
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <a
          href="https://github.com/Viidhyanshu/OPTIMAL-TRADE.git"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-medium backdrop-blur-sm transition"
        >
          <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
          <span>GitHub</span>
        </a>

        <button
          onClick={onToggleShock}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition ${
            isShockActive
              ? 'bg-amber-950/80 border-amber-600 text-amber-300 animate-pulse'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>{isShockActive ? 'Shock Active ⚡' : 'Inject Shock'}</span>
        </button>

        <button
          onClick={() => setActiveTab('Dashboard')}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black hover:bg-slate-200 text-xs font-bold shadow-lg transition transform active:scale-95"
        >
          <span>Get Started</span>
          <div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center">
            <ArrowRight className="w-2.5 h-2.5" />
          </div>
        </button>
      </div>
    </header>
  );
};
