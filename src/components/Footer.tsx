'use client';

import React from 'react';
import { ArrowRight, GitBranch, Sparkles, Shield, Mail, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  setActiveNavTab?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveNavTab }) => {
  return (
    <footer className="w-full relative mt-16 pt-20 pb-12 border-t border-white/10 overflow-hidden bg-gradient-to-b from-transparent via-[#08090f] to-[#050508]">
      {/* Ambient Soft Cyan/Blue Lighting Aura */}
      <div className="absolute top-4 right-12 sm:right-1/4 w-72 sm:w-[450px] h-72 sm:h-[450px] rounded-full bg-gradient-to-br from-cyan-400/20 via-blue-600/10 to-transparent blur-3xl pointer-events-none animate-pulse" />

      {/* Elegant Thin Indian Rupee (₹) Symbol placed in the exact spot of the circle */}
      <div className="absolute top-2 right-8 sm:right-1/4 w-72 sm:w-[360px] h-72 sm:h-[360px] flex items-center justify-center pointer-events-none hidden md:flex z-0">
        <span className="text-[280px] sm:text-[340px] font-extralight leading-none bg-clip-text text-transparent bg-gradient-to-br from-cyan-300/35 via-blue-400/25 to-indigo-600/10 drop-shadow-[0_0_50px_rgba(6,182,212,0.25)] font-sans select-none">
          ₹
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-20 relative z-10">
        {/* Top Hero CTA Section */}
        <div className="space-y-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-medium backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Institutional Trade Execution Engine</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
            Grow with AI Finance.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
              Start your journey today.
            </span>
          </h2>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveNavTab?.('Dashboard')}
              className="group flex items-center gap-3 px-7 py-3.5 rounded-full bg-white text-black font-bold text-xs shadow-2xl hover:bg-slate-200 transition-all duration-200 transform active:scale-95"
            >
              <span>Get Started</span>
              <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center font-bold text-[10px] group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3 h-3 stroke-[3]" />
              </div>
            </button>

            <a
              href="https://github.com/Viidhyanshu/OPTIMAL-TRADE.git"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/10 backdrop-blur-md transition-all duration-200"
            >
              <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
              <span>Explore GitHub Repo</span>
            </a>
          </div>
        </div>

        {/* Bottom Multi-Column Footer Section */}
        <div className="pt-12 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info (Cols 1-2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white text-black font-extrabold flex items-center justify-center text-xs shadow-lg">
                AI
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                AI Finance
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Next-generation optimal trade execution platform powered by Almgren-Chriss market impact modeling, dynamic regime shock adaptation, and Kaggle NIFTY 50 live telemetry.
            </p>

            <div className="flex items-center gap-4 pt-2 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>contact@ai-finance.com</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>NSE / BSE Audited</span>
              </div>
            </div>
          </div>

          {/* Link Column 1: Platform Engine */}
          <div className="space-y-3 text-xs">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px] block font-mono">
              Execution Engine
            </span>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <a href="#dashboard" className="hover:text-white transition flex items-center gap-1 group">
                  <span>Dynamic Adaptive</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                </a>
              </li>
              <li>
                <a href="#dashboard" className="hover:text-white transition flex items-center gap-1 group">
                  <span>Almgren-Chriss Risk</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                </a>
              </li>
              <li>
                <a href="#dashboard" className="hover:text-white transition flex items-center gap-1 group">
                  <span>VWAP Volume Profile</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                </a>
              </li>
              <li>
                <a href="#dashboard" className="hover:text-white transition flex items-center gap-1 group">
                  <span>TWAP Slicing</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                </a>
              </li>
            </ul>
          </div>

          {/* Link Column 2: Kaggle Data */}
          <div className="space-y-3 text-xs">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px] block font-mono">
              Kaggle Data Feed
            </span>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <a
                  href="https://www.kaggle.com/datasets/rohanrao/nifty50-stock-market-data"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition flex items-center gap-1 group"
                >
                  <span>NIFTY 50 Benchmark</span>
                  <ArrowUpRight className="w-3 h-3 text-cyan-400" />
                </a>
              </li>
              <li>
                <span className="text-slate-300 font-semibold">Reliance Industries (NSE)</span>
              </li>
              <li>
                <span className="text-slate-300 font-semibold">TCS & Infosys IT</span>
              </li>
              <li>
                <span className="text-slate-300 font-semibold">HDFC & ICICI Banking</span>
              </li>
            </ul>
          </div>

          {/* Link Column 3: Connect & Resources */}
          <div className="space-y-3 text-xs">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px] block font-mono">
              Connect
            </span>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <a
                  href="https://github.com/Viidhyanshu/OPTIMAL-TRADE.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                  <span>GitHub Repository</span>
                </a>
              </li>
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
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <span>© 2026 AI Finance Inc. All rights reserved. Optimal Trade Execution Platform.</span>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-300 transition">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-300 transition">Terms of Service</a>
            <a href="#security" className="hover:text-slate-300 transition">Security Audit</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
