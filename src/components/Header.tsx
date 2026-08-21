'use client';

import React from 'react';
import { ShieldAlert, GitBranch } from 'lucide-react';

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
          {(['Dashboard', 'Solutions', 'Features', 'Services', 'Pricing'] as const).map((tab) => (
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

          <a
            href="https://github.com/Viidhyanshu/OPTIMAL-TRADE.git"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white transition"
          >
            <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};
