'use client';

import React from 'react';
import { SimulationResult } from '@/lib/engine/types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Activity, Sparkles, TrendingUp } from 'lucide-react';

interface MainHeroChartCardProps {
  result: SimulationResult;
}

export const MainHeroChartCard: React.FC<MainHeroChartCardProps> = ({ result }) => {
  const { marketData, config } = result;

  const chartData = marketData.map((m) => ({
    timeLabel: m.timeLabel,
    price: m.midPrice,
    vwap: Number((m.midPrice * 0.999).toFixed(2)),
  }));

  const latestPrice = marketData[marketData.length - 1]?.midPrice || config.arrivalPrice;
  const initialPrice = marketData[0]?.midPrice || config.arrivalPrice;
  const priceChangeBps = Number((((latestPrice - initialPrice) / initialPrice) * 100).toFixed(2));
  const isBuy = config.side === 'BUY';

  return (
    <div className="space-y-3">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-[11px] font-medium text-slate-400 font-mono">
            Kaggle Feed / {config.symbol} Intraday Session
          </span>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            {config.symbol} Main Execution Terminal
            <span
              className={`text-[10px] px-3 py-0.5 rounded-full font-mono font-bold border backdrop-blur-md transition ${
                isBuy
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
              }`}
            >
              {config.side} ORDER ACTIVE
            </span>
          </h2>
        </div>
      </div>

      {/* Main Liquid Glass Hero Card */}
      <div className="apple-glass-panel rounded-3xl p-6 space-y-4 relative overflow-hidden">
        {/* Subtle Liquid Lighting Blob */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Price Metrics Row */}
        <div className="flex items-center justify-between relative z-10">
          <div>
            <span className="text-xs text-slate-400 font-medium">Kaggle Benchmark Mid Price ({config.side})</span>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono">
                ₹{latestPrice.toLocaleString()}
              </span>
              <span
                className={`text-xs font-extrabold px-2.5 py-1 rounded-full border backdrop-blur-md flex items-center gap-1 ${
                  priceChangeBps >= 0
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                {priceChangeBps >= 0 ? '+' : ''}{priceChangeBps}%
              </span>
            </div>
          </div>
        </div>

        {/* Liquid Area Chart */}
        <div className="h-[220px] w-full pt-2 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="appleGlassGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                  <stop offset="50%" stopColor="#818cf8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="timeLabel" stroke="#64748b" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} hide />

              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(20px)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '1rem',
                  fontSize: '12px',
                  color: '#ffffff',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
                }}
                itemStyle={{ color: '#ffffff', fontWeight: 600 }}
                labelStyle={{ color: '#ffffff', fontWeight: 600 }}
                formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Price']}
              />

              <Area
                type="monotone"
                dataKey="price"
                stroke="#38bdf8"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#appleGlassGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
