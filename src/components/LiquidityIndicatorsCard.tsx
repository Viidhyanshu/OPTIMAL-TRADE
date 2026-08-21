'use client';

import React from 'react';
import { SimulationResult } from '@/lib/engine/types';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Droplets, Activity, Layers, ArrowUpRight, ArrowDownRight, ShieldAlert, Sparkles } from 'lucide-react';

interface LiquidityIndicatorsCardProps {
  result: SimulationResult;
}

export const LiquidityIndicatorsCard: React.FC<LiquidityIndicatorsCardProps> = ({ result }) => {
  const { marketData, config } = result;

  // Calculate current average indicators across dataset
  const latestInterval = marketData[marketData.length - 1] || marketData[0];
  const avgSpread = (marketData.reduce((acc, m) => acc + m.spread, 0) / marketData.length).toFixed(2);
  const avgRelativeSpreadBps = (marketData.reduce((acc, m) => acc + m.relativeSpreadBps, 0) / marketData.length).toFixed(1);
  const avgDepth = Math.round(marketData.reduce((acc, m) => acc + m.orderBookDepth, 0) / marketData.length);
  const avgLiquidityScore = (marketData.reduce((acc, m) => acc + m.volumeLiquidityScore, 0) / marketData.length).toFixed(2);

  // Time-series data for chart
  const chartData = marketData.map((m) => ({
    timeLabel: m.timeLabel,
    score: m.volumeLiquidityScore,
    spreadBps: m.relativeSpreadBps,
    depth: m.orderBookDepth,
    status: m.liquidityStatus,
  }));

  return (
    <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">
              Microstructure Liquidity Indicators — {config.symbol} Dataset
            </h3>
            <p className="text-xs text-slate-400">
              Quantitative indicators computed directly from Kaggle time-series telemetry.
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-white/5 text-slate-300 text-[11px] font-mono border border-white/10">
          Formula A, B & D Engine
        </span>
      </div>

      {/* 3 Liquidity Indicator Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Indicator A: Bid-Ask Spread & Relative Spread */}
        <div className="bg-[#181924] border border-white/5 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              A. Bid-Ask Spread
            </span>
            <span className="text-[10px] text-slate-400 font-mono">spread_t / mid_t</span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-extrabold text-white font-mono">
              ₹{latestInterval?.spread.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-cyan-400 font-mono">
              {latestInterval?.relativeSpreadBps} bps
            </span>
          </div>

          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-white/5">
            <span>Avg Spread: ₹{avgSpread}</span>
            <span>Rel: {avgRelativeSpreadBps} bps</span>
          </div>
        </div>

        {/* Indicator B: Market Depth / Order Book Size */}
        <div className="bg-[#181924] border border-white/5 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              B. Order Book Depth
            </span>
            <span className="text-[10px] text-slate-400 font-mono">bid_size + ask_size</span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-extrabold text-white font-mono">
              {latestInterval?.orderBookDepth.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-400 font-mono">shares</span>
          </div>

          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-white/5">
            <span>Bid: {latestInterval?.bidSize.toLocaleString()}</span>
            <span>Ask: {latestInterval?.askSize.toLocaleString()}</span>
          </div>
        </div>

        {/* Indicator D: Trailing Volume Liquidity Proxy Score */}
        <div className="bg-[#181924] border border-white/5 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-emerald-400" />
              D. Liquidity Proxy Score
            </span>
            <span className="text-[10px] text-slate-400 font-mono">volume_t / avg_volume</span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-extrabold text-white font-mono">
              {latestInterval?.volumeLiquidityScore}x
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                latestInterval?.liquidityStatus === 'HIGH'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : latestInterval?.liquidityStatus === 'MODERATE'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}
            >
              {latestInterval?.liquidityStatus}
            </span>
          </div>

          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-white/5">
            <span>Avg Proxy Score: {avgLiquidityScore}x</span>
            <span>Trailing Window</span>
          </div>
        </div>
      </div>

      {/* Liquidity Score Time-Series Chart */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium">Interval Liquidity Score Time-Series (Formula D):</span>
          <div className="flex items-center gap-4 text-[10px]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> High Liquidity (&ge;1.0x)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Moderate (0.65x - 1.0x)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Thin / Illiquid (&lt;0.65x)
            </span>
          </div>
        </div>

        <div className="h-[180px] w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2230" vertical={false} />
              <XAxis dataKey="timeLabel" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 'auto']} />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#181a24',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#ffffff',
                }}
                itemStyle={{ color: '#ffffff', fontWeight: 600 }}
                labelStyle={{ color: '#ffffff', fontWeight: 600 }}
                formatter={(val: any) => [`${val}x`, 'Liquidity Proxy Score']}
              />

              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.status === 'HIGH'
                        ? '#10b981'
                        : entry.status === 'MODERATE'
                        ? '#f59e0b'
                        : '#f43f5e'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
