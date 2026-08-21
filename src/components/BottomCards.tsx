'use client';

import React from 'react';

export const BottomCards: React.FC = () => {
  const recentTransactions = [
    { label: 'Slice #28 Executed (2,840 shares)', time: '15:21 IST', price: '₹3,074.80' },
    { label: 'Slice #27 Executed (2,840 shares)', time: '15:08 IST', price: '₹3,066.40' },
    { label: 'Slice #26 Executed (2,840 shares)', time: '14:53 IST', price: '₹3,058.00' },
  ];

  const marketHighlights = [
    { symbol: 'RELIANCE', name: 'Reliance Ind.', price: '₹3,048.20', change: '+1.42%' },
    { symbol: 'TCS', name: 'Tata Consultancy', price: '₹4,218.50', change: '+0.88%' },
    { symbol: 'NIFTY50', name: 'NIFTY Index', price: '₹24,438.50', change: '+0.65%' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Recent Transactions Card */}
      <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base">Recent Execution Slices</h3>
          <span className="text-[11px] text-slate-400 font-mono">NSE Feed</span>
        </div>

        <div className="space-y-2">
          {recentTransactions.map((tx, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#181924] border border-white/5 text-xs">
              <div className="truncate pr-2">
                <span className="font-medium text-white block truncate">{tx.label}</span>
                <span className="text-[10px] text-slate-400">{tx.time}</span>
              </div>
              <span className="font-mono font-bold text-white shrink-0">{tx.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Market Highlights Card */}
      <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base">NIFTY 50 Benchmark Equities</h3>
          <span className="text-[11px] text-slate-400 font-mono">Live Prices</span>
        </div>

        <div className="space-y-2">
          {marketHighlights.map((m, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#181924] border border-white/5 text-xs">
              <div>
                <span className="font-bold text-white font-mono block">{m.symbol}</span>
                <span className="text-[10px] text-slate-400">{m.name}</span>
              </div>
              <div className="text-right font-mono">
                <span className="font-bold text-white block">{m.price}</span>
                <span className="text-[10px] text-[#10b981] font-bold">{m.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
