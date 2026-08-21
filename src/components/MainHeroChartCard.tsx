'use client';

import React from 'react';
import { SimulationResult } from '@/lib/engine/types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface MainHeroChartCardProps {
  result: SimulationResult;
}

export const MainHeroChartCard: React.FC<MainHeroChartCardProps> = ({ result }) => {
  const { marketData, config } = result;

  // Chart data loaded directly from Kaggle records
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
      {/* Breadcrumb & Title */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-medium text-slate-400">Kaggle Dataset / {config.symbol} Market Feed</span>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            {config.symbol} Main Execution Dashboard
            <span
              className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold border transition ${
                isBuy
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-rose-950 text-rose-300 border-rose-800'
              }`}
            >
              {config.side} ORDER ACTIVE
            </span>
          </h2>
        </div>
      </div>

      {/* Main Dark Hero Card */}
      <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-4 relative overflow-hidden">
        {/* Top Info Row */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Kaggle {config.symbol} Market Price ({config.side})</span>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
                ₹{latestPrice.toLocaleString()}
              </span>
              <span className={`text-xs font-bold ${priceChangeBps >= 0 ? 'text-[#10b981]' : 'text-rose-400'}`}>
                {priceChangeBps >= 0 ? '+' : ''}{priceChangeBps}%
              </span>
            </div>
          </div>
        </div>

        {/* Silver Monochrome Line Chart loaded directly from Kaggle */}
        <div className="h-[210px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="silverGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="timeLabel" stroke="#475569" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={['auto', 'auto']} stroke="#475569" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} hide />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#181a24',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#ffffff',
                }}
                itemStyle={{ color: '#ffffff', fontWeight: 600 }}
                labelStyle={{ color: '#ffffff', fontWeight: 600 }}
                formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Price']}
              />

              <Area
                type="monotone"
                dataKey="price"
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
