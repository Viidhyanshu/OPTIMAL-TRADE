'use client';

import React from 'react';
import { GitBranch } from 'lucide-react';

interface FooterProps {
  setActiveNavTab?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="w-full relative mt-16 pt-16 pb-8 border-t border-white/10 overflow-hidden">
      {/* Ambient Soft Cyan/Blue Aura */}
      <div className="absolute top-4 right-12 sm:right-1/4 w-72 sm:w-[450px] h-72 sm:h-[450px] rounded-full bg-gradient-to-br from-cyan-400/20 via-blue-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Elegant Non-Bold Thin Indian Rupee (₹) Symbol in exact position of circle */}
      <div className="absolute top-2 right-8 sm:right-1/4 w-72 sm:w-[360px] h-72 sm:h-[360px] flex items-center justify-center pointer-events-none hidden md:flex z-0">
        <span className="text-[280px] sm:text-[340px] font-extralight leading-none bg-clip-text text-transparent bg-gradient-to-br from-cyan-300/35 via-blue-400/25 to-indigo-600/10 drop-shadow-[0_0_50px_rgba(6,182,212,0.25)] font-sans select-none">
          ₹
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16 relative z-10">
        {/* Top Hero Heading */}
        <div className="space-y-4 max-w-2xl">
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
            Grow with AI Finance.<br />
            Start your journey today.
          </h2>
        </div>

        {/* Bottom Columns Section matching reference image */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 pt-8 border-t border-white/10">
          {/* Left Brand & Contact Info */}
          <div className="space-y-1.5">
            <h3 className="font-sans font-medium text-xl text-white tracking-tight">
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
              <span className="font-semibold text-white block">Menu</span>
              <ul className="space-y-2 text-slate-400">
                <li className="hover:text-white transition cursor-pointer">Solutions</li>
                <li className="hover:text-white transition cursor-pointer">Features</li>
                <li className="hover:text-white transition cursor-pointer">Services</li>
                <li className="hover:text-white transition cursor-pointer">Pricing</li>
              </ul>
            </div>

            {/* Connect Column */}
            <div className="space-y-2.5">
              <span className="font-semibold text-white block">Connect</span>
              <ul className="space-y-2 text-slate-400">
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
                    className="hover:text-white transition flex items-center gap-1.5 text-cyan-400"
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
