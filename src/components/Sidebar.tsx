'use client';

import React from 'react';
import {
  LayoutGrid,
  Coins,
  TrendingUp,
  ArrowLeftRight,
  User,
  Settings,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-52 shrink-0 hidden md:flex flex-col justify-between py-2 pr-4 border-r border-white/5 font-sans">
      {/* Top Menu Section */}
      <div className="space-y-1.5">
        <button
          onClick={() => setActiveTab('Dashboard')}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium transition ${
            activeTab === 'Dashboard'
              ? 'bg-[#181922] text-white border border-white/10 shadow-lg font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-3">
            <LayoutGrid className={`w-4 h-4 ${activeTab === 'Dashboard' ? 'text-white' : 'text-slate-400'}`} />
            <span>Dashboard</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('Assets')}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium transition ${
            activeTab === 'Assets'
              ? 'bg-[#181922] text-white border border-white/10 shadow-lg font-semibold'
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
              ? 'bg-[#181922] text-white border border-white/10 shadow-lg font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="w-4 h-4 text-slate-400" />
            <span>Market</span>
          </div>
          <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-white/10 text-slate-300 uppercase">
            New
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Trade')}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium transition ${
            activeTab === 'Trade'
              ? 'bg-[#181922] text-white border border-white/10 shadow-lg font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-3">
            <ArrowLeftRight className="w-4 h-4 text-slate-400" />
            <span>Trade</span>
          </div>
        </button>
      </div>

      {/* Bottom Menu Section */}
      <div className="space-y-1.5 pt-4 border-t border-white/5">
        <button
          onClick={() => setActiveTab('Profile')}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-medium transition ${
            activeTab === 'Profile' ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4 text-slate-400" />
          <span>Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('Settings')}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-medium transition ${
            activeTab === 'Settings' ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('Support')}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-medium transition ${
            activeTab === 'Support' ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Support</span>
        </button>

        {/* Bottom Promo Card: Unlock CryptoAI */}
        <div className="mt-3 p-3 rounded-2xl bg-[#14151e] border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Unlock CryptoAI</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Your personal crypto assistant
          </p>
        </div>
      </div>
    </aside>
  );
};
