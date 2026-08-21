'use client';

import React, { useState } from 'react';
import { OrderConfig } from '@/lib/engine/types';
import { ArrowDownUp, ChevronRight, ChevronDown } from 'lucide-react';

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
  const [tokenFrom, setTokenFrom] = useState<'BTC' | 'ETH' | 'USDT'>('BTC');
  const [tokenTo, setTokenTo] = useState<'USDT' | 'BTC' | 'ETH'>('USDT');

  const toggleSwap = () => {
    const temp = tokenFrom;
    setTokenFrom(tokenTo as any);
    setTokenTo(temp as any);
  };

  return (
    <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-4 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white text-base">Quick swap</h3>
      </div>

      {/* Input Box 1 */}
      <div className="bg-[#181924] border border-white/5 rounded-2xl p-3.5 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <input
            type="text"
            defaultValue="0.00181682"
            className="w-full bg-transparent text-lg font-mono font-medium text-white focus:outline-none"
          />
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#222433] border border-white/5 text-xs text-white font-medium cursor-pointer shrink-0">
            <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[9px] font-bold text-black">
              ₿
            </div>
            <span>{tokenFrom}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>
        </div>
        <div className="text-[11px] text-slate-400 font-medium">
          Balance: 0.01742682 {tokenFrom}
        </div>
      </div>

      {/* Swap Center Icon */}
      <div className="flex justify-center -my-2 z-10">
        <button
          onClick={toggleSwap}
          className="p-2 rounded-full bg-[#1c1e2b] border border-white/10 text-slate-300 hover:text-white transition shadow-lg"
        >
          <ArrowDownUp className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Input Box 2 */}
      <div className="bg-[#181924] border border-white/5 rounded-2xl p-3.5 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <input
            type="text"
            defaultValue="193.4604"
            className="w-full bg-transparent text-lg font-mono font-medium text-white focus:outline-none"
          />
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#222433] border border-white/5 text-xs text-white font-medium cursor-pointer shrink-0">
            <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[9px] font-bold text-black">
              T
            </div>
            <span>{tokenTo}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>
        </div>
        <div className="text-[11px] text-slate-400 font-medium">
          Balance: 500 {tokenTo}
        </div>
      </div>

      {/* Full width dark action button */}
      <button
        onClick={onRunSimulation}
        className="w-full py-3 rounded-2xl bg-[#181924] hover:bg-white hover:text-black border border-white/10 font-medium text-xs text-white transition flex items-center justify-center gap-1.5 shadow-lg mt-1"
      >
        <span>Visualize swap</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
