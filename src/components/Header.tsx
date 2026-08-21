'use client';

import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full flex items-center justify-between py-2 px-1">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white text-black font-extrabold flex items-center justify-center text-sm shadow-xl">
          AI
        </div>
        <div>
          <span className="font-bold text-white text-base tracking-tight block">
            AI Finance
          </span>
          <span className="text-[10px] text-slate-400 block font-mono">
            Optimal Trade Execution Engine
          </span>
        </div>
      </div>
    </header>
  );
};
