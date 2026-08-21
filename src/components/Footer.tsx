'use client';

import React from 'react';
import { GitBranch } from 'lucide-react';

interface FooterProps {
  setActiveNavTab?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="w-full relative mt-16 pt-16 pb-8 overflow-hidden apple-glass-panel rounded-[40px] px-8 sm:px-12">
      {/* Ambient Soft Golden/Cyan Lighting Aura */}
      <div className="absolute top-4 right-12 sm:right-1/4 w-72 sm:w-[450px] h-72 sm:h-[450px] rounded-full bg-gradient-to-br from-amber-400/20 via-yellow-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Golden Yellow Semi-Bold Indian Rupee (₹) Symbol */}
      <div className="absolute top-2 right-8 sm:right-1/4 w-72 sm:w-[360px] h-72 sm:h-[360px] flex items-center justify-center pointer-events-none hidden md:flex z-0">
        <span className="text-[280px] sm:text-[340px] font-bold leading-none bg-clip-text text-transparent bg-gradient-to-br from-amber-300/50 via-yellow-500/35 to-amber-700/15 drop-shadow-[0_0_50px_rgba(245,158,11,0.3)] font-sans select-none">
          ₹
        </span>
      </div>

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Top Hero Heading */}
        <div className="space-y-4 max-w-2xl">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.08]">
            Grow with AI Finance.<br />
            Start your journey today.
          </h2>
        </div>

        {/* Bottom Columns Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 pt-8">
          {/* Left Brand & Contact Info */}
          <div className="space-y-1.5">
            <h3 className="font-sans font-extrabold text-xl text-white tracking-tight">
              AI Finance
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              contact@ai-finance.com
            </p>
          </div>

          {/* Right Link Columns */}
          <div className="flex items-start gap-16 text-xs">
            {/* Menu Column */}
            <div className="space-y-2.5">
              <span className="font-extrabold text-white block">Menu</span>
              <ul className="space-y-2 text-slate-400 font-medium">
                <li className="hover:text-white transition cursor-pointer">Solutions</li>
                <li className="hover:text-white transition cursor-pointer">Features</li>
                <li className="hover:text-white transition cursor-pointer">Services</li>
                <li className="hover:text-white transition cursor-pointer">Pricing</li>
              </ul>
            </div>

            {/* Connect Column */}
            <div className="space-y-2.5">
              <span className="font-extrabold text-white block">Connect</span>
              <ul className="space-y-2 text-slate-400 font-medium">
                <li>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Viidhyanshu/OPTIMAL-TRADE.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition flex items-center gap-1.5 text-amber-400 font-bold"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
