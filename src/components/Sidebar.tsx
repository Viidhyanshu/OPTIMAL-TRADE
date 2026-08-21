'use client';

import React from 'react';
import {
  LayoutGrid,
  Coins,
  TrendingUp,
  ArrowLeftRight,
  User,
  Zap,
  Sliders,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-56 shrink-0 hidden md:flex flex-col justify-between py-4 pr-4 border-r border-white/5 font-sans">
      {/* Top Menu Items */}
      <div className="space-y-1.5">
        <button
          onClick={() => setActiveTab('Dashboard')}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'Dashboard'
              ? 'bg-[#1a1b26] text-white border border-white/10 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-3">
            <LayoutGrid className={`w-4 h-4 ${activeTab === 'Dashboard' ? 'text-cyan-400' : 'text-slate-400'}`} />
            <span>Dashboard</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('Assets')}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium transition ${
            activeTab === 'Assets'
              ? 'bg-[#1a1b26] text-white border border-white/10 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-3">
            <Coins className="w-4 h-4 text-slate-400" />
            <span>Assets</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('Market')}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium transition ${
            activeTab === 'Market'
              ? 'bg-[#1a1b26] text-white border border-white/10 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="w-4 h-4 text-slate-400" />
            <span>Market</span>
          </div>
          <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-white/10 text-slate-200 uppercase tracking-wide">
            New
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Trade')}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium transition ${
            activeTab === 'Trade'
              ? 'bg-[#1a1b26] text-white border border-white/10 shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-3">
            <ArrowLeftRight className="w-4 h-4 text-slate-400" />
            <span>Trade</span>
          </div>
        </button>
      </div>

      {/* Bottom Profile Item */}
      <div className="pt-4 border-t border-white/5">
        <button
          onClick={() => setActiveTab('Profile')}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition"
        >
          <User className="w-4 h-4 text-slate-400" />
          <span>Profile</span>
        </button>
      </div>
    </aside>
  );
};
