'use client';

import React, { useState } from 'react';
import { SimulationResult } from '@/lib/engine/types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { Bell, Search, TrendingUp } from 'lucide-react';

interface MainHeroChartCardProps {
  result: SimulationResult;
}

export const MainHeroChartCard: React.FC<MainHeroChartCardProps> = ({ result }) => {
  const [timeframe, setTimeframe] = useState<'1D' | '7D' | '1M' | '1Y'>('1Y');

  const { marketData, strategyResults, config } = result;
  const adaptiveResult = strategyResults.DYNAMIC_ADAPTIVE;

  // Chart data formatted for dark monochrome curve matching reference image
  const chartData = marketData.map((m, idx) => ({
    timeLabel: m.timeLabel,
    price: m.midPrice,
    execPrice: adaptiveResult.steps[idx]?.executionPrice || m.midPrice,
  }));

  const totalExecutedValue = adaptiveResult.totalExecutedQuantity * adaptiveResult.avgExecutionPrice;

  return (
    <div className="flex flex-col space-y-4">
      {/* Top Header Row inside Main Area: Breadcrumb + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-medium text-slate-400">Trading / Dashboard</span>
          <h2 className="text-xl font-bold text-white tracking-tight">Main Dashboard</h2>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="p-2 rounded-xl bg-[#181a24] border border-white/5 text-slate-400 hover:text-white transition">
            <Bell className="w-4 h-4" />
          </button>

          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search strategy or asset..."
              className="w-full bg-[#181a24] border border-white/5 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-white/20"
            />
          </div>
        </div>
      </div>

      {/* Main Dark Hero Chart Card */}
      <div className="bg-[#12131b]/90 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 relative overflow-hidden">
        {/* Top Card Info Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400 font-medium">Balance / Executed Value</span>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
                €{(totalExecutedValue / 1000).toFixed(2)}k
              </span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 text-xs font-bold border border-emerald-800/60">
                <TrendingUp className="w-3 h-3" />
                +47.3%
              </span>
            </div>
          </div>

          {/* Timeframe Selector Pill Tabs */}
          <div className="flex items-center gap-1 bg-[#1a1c29] p-1 rounded-xl border border-white/5 text-xs font-medium text-slate-400">
            {(['1D', '7D', '1M', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg transition ${
                  timeframe === tf ? 'bg-white text-black font-bold shadow' : 'hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Monochromatic Glowing Area Chart */}
        <div className="h-[220px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="timeLabel" stroke="#475569" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={['auto', 'auto']} stroke="#475569" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#181a24',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#ffffff',
                }}
                formatter={(val: any) => [`$${Number(val).toFixed(2)}`, 'Exec Price']}
              />

              <Area
                type="monotone"
                dataKey="execPrice"
                stroke="#ffffff"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#heroGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
