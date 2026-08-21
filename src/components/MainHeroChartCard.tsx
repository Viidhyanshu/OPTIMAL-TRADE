'use client';

import React, { useState } from 'react';
import { SimulationResult } from '@/lib/engine/types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface MainHeroChartCardProps {
  result: SimulationResult;
}

export const MainHeroChartCard: React.FC<MainHeroChartCardProps> = ({ result }) => {
  const [timeframe, setTimeframe] = useState<'1D' | '7D' | '1M' | '1Y'>('1Y');

  // Generate 12 months simulated data points for silver chart matching reference image
  const monthsData = [
    { month: 'Sep', val: 18200 },
    { month: 'Oct', val: 17500 },
    { month: 'Nov', val: 18900 },
    { month: 'Dec', val: 19400 },
    { month: 'Jan', val: 19100 },
    { month: 'Feb', val: 20200 },
    { month: 'Mar', val: 19800 },
    { month: 'Apr', val: 21100 },
    { month: 'May', val: 20600 },
    { month: 'Jun', val: 21500 },
    { month: 'Jul', val: 21200 },
    { month: 'Aug', val: 22193.05 },
  ];

  return (
    <div className="space-y-3">
      {/* Breadcrumb & Title */}
      <div>
        <span className="text-[11px] font-medium text-slate-400">Trading / Dashboard</span>
        <h2 className="text-xl font-bold text-white tracking-tight">Main Dashboard</h2>
      </div>

      {/* Main Dark Hero Card */}
      <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-4 relative overflow-hidden">
        {/* Top Info Row */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Balance</span>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white tracking-tight font-sans">
                €22,193.05
              </span>
              <span className="text-xs font-bold text-[#10b981]">
                +47.3%
              </span>
            </div>
          </div>

          {/* Timeframe selector pill tabs */}
          <div className="flex items-center gap-1 bg-[#181924] p-1 rounded-xl border border-white/5 text-xs font-medium text-slate-400">
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

        {/* Silver Monochrome Line Chart */}
        <div className="h-[210px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="silverGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={['auto', 'auto']} stroke="#475569" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} hide />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#181a24',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#ffffff',
                }}
                formatter={(val: any) => [`€${Number(val).toLocaleString()}`, 'Balance']}
              />

              <Area
                type="monotone"
                dataKey="val"
                stroke="#ffffff"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#silverGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
