'use client';

import React from 'react';
import { ArrowRight, GitBranch } from 'lucide-react';

interface FooterProps {
  setActiveNavTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveNavTab }) => {
  return (
    <footer className="w-full relative mt-16 pt-16 pb-8 border-t border-white/10 overflow-hidden">
      {/* Background 3D Metallic Orb Sphere Graphic */}
      <div className="absolute -top-12 right-12 sm:right-1/4 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-br from-cyan-400/30 via-blue-600/20 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-4 right-1/4 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-500/30 to-indigo-600/40 border border-white/10 shadow-[0_0_60px_rgba(6,182,212,0.25)] pointer-events-none hidden md:block" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-20 relative z-10">
        {/* Top Hero CTA Section */}
        <div className="space-y-6 max-w-2xl">
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Grow with AI Finance.<br />
            Start your journey today.
          </h2>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveNavTab('Dashboard')}
              className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-black hover:bg-slate-950 text-white font-medium text-xs border border-white/10 shadow-2xl transition transform active:scale-95"
            >
              <span>Get Started</span>
              <div className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center font-bold text-[10px]">
                <ArrowRight className="w-2.5 h-2.5 stroke-[3]" />
              </div>
            </button>

            <button
              onClick={() => setActiveNavTab('Solutions')}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/10 backdrop-blur-md transition"
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
                    <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
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
