'use client';

import React from 'react';

interface FooterProps {
  setActiveNavTab?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="w-full relative mt-16 pt-16 pb-8 overflow-hidden bg-black">
      {/* Ambient Soft Grey Lighting Aura */}
      <div className="absolute top-4 right-12 sm:right-1/4 w-72 sm:w-[450px] h-72 sm:h-[450px] rounded-full bg-gradient-to-br from-white/10 via-slate-700/5 to-transparent blur-3xl pointer-events-none" />

      {/* Monochrome Indian Rupee (₹) Symbol */}
      <div className="absolute top-2 right-8 sm:right-1/4 w-72 sm:w-[360px] h-72 sm:h-[360px] flex items-center justify-center pointer-events-none hidden md:flex z-0">
        <span className="text-[280px] sm:text-[340px] font-bold leading-none bg-clip-text text-transparent bg-gradient-to-br from-white/40 via-slate-300/25 to-slate-700/10 drop-shadow-[0_0_50px_rgba(255,255,255,0.15)] font-sans select-none">
          ₹
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16 relative z-10">
        {/* Top Hero Heading */}
        <div className="space-y-4 max-w-2xl">
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
            Grow with Optimal Trade.<br />
            Start your journey today.
          </h2>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 pt-8">
          {/* Left Brand & Contact Info */}
          <div className="space-y-1.5">
            <h3 className="font-sans font-medium text-xl text-white tracking-tight">
              Optimal Trade
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              contact@optimal-trade.com
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
