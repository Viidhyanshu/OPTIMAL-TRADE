'use client';

import React from 'react';
import { ArrowRight, GitBranch } from 'lucide-react';

interface FooterProps {
  setActiveNavTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveNavTab }) => {
  return (
    <footer className="w-full relative mt-12 pt-12 pb-8 rounded-[32px] overflow-hidden bg-gradient-to-b from-[#0e111d] to-[#07080d] border border-white/10 shadow-2xl">
      {/* Background 3D Orb Effect */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 sm:px-10 space-y-16 relative z-10">
        {/* Top Hero CTA Section */}
        <div className="space-y-6 max-w-2xl">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Grow with AI Finance.<br />
            Start your journey today.
          </h2>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveNavTab('Dashboard')}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-black hover:bg-slate-950 text-white font-medium text-xs border border-white/10 shadow-xl transition transform active:scale-95"
            >
              <span>Get Started</span>
              <div className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center font-bold text-[10px]">
                <ArrowRight className="w-2.5 h-2.5 stroke-[3]" />
              </div>
            </button>

            <button
              onClick={() => setActiveNavTab('Solutions')}
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/10 backdrop-blur-md transition"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Bottom Columns Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 pt-8 border-t border-white/5">
          {/* Left Brand & Contact Info */}
          <div className="space-y-2">
            <h3 className="font-sans font-medium text-xl text-white tracking-tight">
              AI Finance
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              contact@ai-finance.com
            </p>
          </div>

          {/* Right Link Columns */}
          <div className="flex items-start gap-16 text-xs">
            {/* Column 1: Menu */}
            <div className="space-y-2.5">
              <span className="font-semibold text-white block">Menu</span>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <button onClick={() => setActiveNavTab('Solutions')} className="hover:text-white transition">
                    Solutions
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveNavTab('Features')} className="hover:text-white transition">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveNavTab('Services')} className="hover:text-white transition">
                    Services
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveNavTab('Pricing')} className="hover:text-white transition">
                    Pricing
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Connect */}
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
                  <a href="https://github.com/Viidhyanshu/OPTIMAL-TRADE.git" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">
                    <GitBranch className="w-3 h-3 text-cyan-400" />
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
