'use client';

import React from 'react';
import { ArrowRight, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
  isShockActive: boolean;
  onToggleShock: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeNavTab,
  setActiveNavTab,
  isShockActive,
  onToggleShock,
}) => {
  return (
    <header className="w-full flex items-center justify-between py-2 px-1 z-30 mb-4">
      {/* Left Logo */}
      <div className="flex items-center gap-3">
        <span className="font-sans font-medium text-2xl text-white tracking-tight">
          AI Finance
        </span>
        {isShockActive && (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-600 text-amber-300 text-[10px] font-semibold animate-pulse">
            ⚡ Market Shock
          </span>
        )}
      </div>

      {/* Right Floating Translucent Glass Navbar */}
      <div className="flex items-center">
        <div className="flex items-center gap-1 sm:gap-2 p-1.5 rounded-2xl bg-[#151722]/80 border border-white/10 backdrop-blur-xl shadow-2xl">
          {(['Solutions', 'Features', 'Services', 'Pricing'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveNavTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
                activeNavTab === tab
                  ? 'text-white bg-white/10 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}

          {/* Black Pill Button: Get Started */}
          <button
            onClick={() => setActiveNavTab('Dashboard')}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-black hover:bg-slate-950 text-white font-medium text-xs border border-white/10 shadow-lg transition transform active:scale-95 ml-2"
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
