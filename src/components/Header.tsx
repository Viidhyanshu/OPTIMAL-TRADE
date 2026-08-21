import React from 'react';
import { TrendingUp, GitBranch, Zap, ShieldAlert, Cpu } from 'lucide-react';

interface HeaderProps {
  isShockActive: boolean;
  onResetToDefaults: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isShockActive, onResetToDefaults }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                OPTIMAL TRADE
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                FinTech Algorithmic Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Institutional Trade Slicing & Market Microstructure Simulator
            </p>
          </div>
        </div>

        {/* Status Indicators & Links */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Engine: <strong className="text-white">Almgren-Chriss & Dynamic RL</strong></span>
          </div>

          {isShockActive && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-800/80 text-amber-300 text-xs font-medium animate-pulse">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Regime Shift Shock Enabled</span>
            </div>
          )}

          <a
            href="https://github.com/Viidhyanshu/OPTIMAL-TRADE.git"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
            <span>GitHub Repository</span>
          </a>

          <button
            onClick={onResetToDefaults}
            className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition"
          >
            Reset Presets
          </button>
        </div>
      </div>
    </header>
  );
};
