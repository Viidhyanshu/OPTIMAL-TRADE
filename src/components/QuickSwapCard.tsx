'use client';

import React from 'react';
import { OrderConfig } from '@/lib/engine/types';
import { ArrowDownUp, ChevronRight, Play } from 'lucide-react';

interface QuickSwapCardProps {
  config: OrderConfig;
  onChangeConfig: (newConfig: OrderConfig) => void;
  onRunSimulation: () => void;
}

export const QuickSwapCard: React.FC<QuickSwapCardProps> = ({
  config,
  onChangeConfig,
  onRunSimulation,
}) => {
  const toggleSide = () => {
    onChangeConfig({
      ...config,
      side: config.side === 'BUY' ? 'SELL' : 'BUY',
    });
  };

  return (
    <div className="bg-[#12131b]/90 border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white text-base">Quick execution</h3>
        <span className="text-xs text-slate-400 font-mono">Order Router</span>
      </div>

      {/* Input Box 1: Order Quantity & Side */}
      <div className="bg-[#181a24] border border-white/5 rounded-xl p-3 space-y-1">
        <div className="flex justify-between items-center text-[11px] text-slate-400">
          <span>Order Size</span>
          <span>Balance: 500,000 {config.symbol}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <input
            type="number"
            value={config.totalQuantity}
            onChange={(e) => onChangeConfig({ ...config, totalQuantity: Number(e.target.value) })}
            className="w-full bg-transparent text-lg font-mono font-bold text-white focus:outline-none"
          />
          <button
            onClick={toggleSide}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              config.side === 'BUY'
                ? 'bg-emerald-600/80 text-white border border-emerald-500'
                : 'bg-rose-600/80 text-white border border-rose-500'
            }`}
          >
            {config.side}
          </button>
        </div>
      </div>

      {/* Direction Swap Icon */}
      <div className="flex justify-center -my-2 z-10">
        <button
          onClick={toggleSide}
          className="p-2 rounded-full bg-[#1e202e] border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition shadow-lg"
        >
          <ArrowDownUp className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Input Box 2: Arrival Price & Strategy Parameter */}
      <div className="bg-[#181a24] border border-white/5 rounded-xl p-3 space-y-1">
        <div className="flex justify-between items-center text-[11px] text-slate-400">
          <span>Arrival Price ($)</span>
          <span>Risk &lambda;: {config.riskAversion}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <input
            type="number"
            step="0.5"
            value={config.arrivalPrice}
            onChange={(e) => onChangeConfig({ ...config, arrivalPrice: Number(e.target.value) })}
            className="w-full bg-transparent text-lg font-mono font-bold text-white focus:outline-none"
          />
          <span className="px-2.5 py-1 rounded-lg bg-white/5 text-xs text-slate-300 font-mono">
            USD
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onRunSimulation}
        className="w-full py-3 rounded-xl bg-[#181a24] hover:bg-white hover:text-black border border-white/10 font-bold text-xs text-white transition flex items-center justify-center gap-1.5 shadow-lg"
      >
        <span>Visualize execution</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
