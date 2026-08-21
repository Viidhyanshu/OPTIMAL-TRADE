'use client';

import React from 'react';
import { ArrowRight, ShieldAlert, GitBranch } from 'lucide-react';

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
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between z-50">
      {/* Left Logo */}
      <div className="flex items-center gap-4">
        <span className="font-sans font-medium text-xl text-white tracking-tight">
          AI Finance
        </span>

        {/* Shock Indicator Badge */}
        {isShockActive && (
          <button
            onClick={onToggleShock}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-600 text-amber-300 text-[11px] font-semibold animate-pulse"
          >
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            <span>Regime Shock Active</span>
          </button>
        )}
      </div>

      {/* Right Translucent Floating Glass Pill Navigation Bar */}
      <div className="flex items-center">
        <div className="flex items-center gap-1 sm:gap-2 p-1.5 rounded-2xl bg-[#141622]/80 border border-white/10 backdrop-blur-xl shadow-2xl">
          {/* Navigation Links inside container */}
          <button
            onClick={() => setActiveTab('Solutions')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
              activeTab === 'Solutions'
                ? 'text-white bg-white/10 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Solutions
          </button>

          <button
            onClick={() => setActiveTab('Features')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
              activeTab === 'Features'
                ? 'text-white bg-white/10 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Features
          </button>

          <button
            onClick={() => setActiveTab('Services')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
              activeTab === 'Services'
                ? 'text-white bg-white/10 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Services
          </button>

          <button
            onClick={() => setActiveTab('Pricing')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
              activeTab === 'Pricing'
                ? 'text-white bg-white/10 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Pricing
          </button>

          <a
            href="https://github.com/Viidhyanshu/OPTIMAL-TRADE.git"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white transition"
          >
            <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
            <span>GitHub</span>
          </a>

          {/* Black Pill Get Started Button inside right edge */}
          <button
            onClick={() => setActiveTab('Dashboard')}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-black hover:bg-slate-950 text-white font-medium text-xs border border-white/10 shadow-lg transition transform active:scale-95 ml-1"
          >
            <span>Get Started</span>
            <div className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center font-bold text-[10px]">
              <ArrowRight className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
