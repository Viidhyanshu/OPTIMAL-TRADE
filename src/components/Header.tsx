'use client';

import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between py-2 border-b border-white/10">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-white text-black font-extrabold flex items-center justify-center text-xs shadow-lg">
          OT
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">OPTIMAL TRADE</h1>
          <p className="text-[10px] text-slate-400 font-mono">Algorithmic Execution & Market Microstructure Engine</p>
        </div>
      </div>
    </header>
  );
};
