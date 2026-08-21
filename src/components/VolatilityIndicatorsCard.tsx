'use client';

import React, { useState } from 'react';
import { SimulationResult } from '@/lib/engine/types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ReferenceLine } from 'recharts';
import { Activity, Flame, ShieldAlert, Sparkles, TrendingUp, Zap } from 'lucide-react';

interface VolatilityIndicatorsCardProps {
  result: SimulationResult;
}

export const VolatilityIndicatorsCard: React.FC<VolatilityIndicatorsCardProps> = ({ result }) => {
  const { marketData, config } = result;

  const latest = marketData[marketData.length - 1] || marketData[0];
  const avgRealized = (marketData.reduce((acc, m) => acc + m.realizedVol, 0) / marketData.length).toFixed(4);
  const avgEWMA = (marketData.reduce((acc, m) => acc + m.ewmaVol, 0) / marketData.length).toFixed(4);
  const avgGARCH = (marketData.reduce((acc, m) => acc + m.garchVol, 0) / marketData.length).toFixed(4);
  const avgParkinson = (marketData.reduce((acc, m) => acc + m.parkinsonVol, 0) / marketData.length).toFixed(4);

  const chartData = marketData.map((m) => ({
    timeLabel: m.timeLabel,
    Realized: m.realizedVol,
    EWMA: m.ewmaVol,
    GARCH: m.garchVol,
    Parkinson: m.parkinsonVol,
    isElevated: m.isVolElevated,
  }));

  const elevatedCount = marketData.filter((m) => m.isVolElevated).length;

  return (
    <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-950/80 text-purple-400 border border-purple-800/60">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">
              Quantitative Volatility & Regime Detection Engine — {config.symbol}
            </h3>
            <p className="text-xs text-slate-400">
              Formulas A, B, C & D (Realized, EWMA λ=0.94, GARCH(1,1) & Parkinson High-Low).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {elevatedCount > 0 && (
            <span className="px-3 py-1 rounded-full bg-rose-950 text-rose-300 text-[11px] font-bold border border-rose-800 flex items-center gap-1.5 animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-rose-300" />
              REGIME SHIFT TRIGGERED ({elevatedCount} Intervals)
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full bg-white/5 text-slate-300 text-[11px] font-mono border border-white/10">
            GARCH(1,1) Active
          </span>
        </div>
      </div>

      {/* 4 Volatility Metric Cards (Formulas A, B, C, D) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Formula A: Realized Volatility */}
        <div className="bg-[#181924] border border-white/5 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-slate-300" />
              A. Realized Vol (Rolling)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">std_dev(r_t)</span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-extrabold text-white font-mono">
              {(latest?.realizedVol * 100).toFixed(2)}%
            </span>
            <span className="text-xs text-slate-400 font-mono">σ = {latest?.realizedVol}</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-white/5">
            Rolling 10-interval std dev • Avg: {(Number(avgRealized) * 100).toFixed(2)}%
          </div>
        </div>

        {/* Formula B: EWMA Volatility */}
        <div className="bg-[#181924] border border-white/5 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              B. EWMA Volatility
            </span>
            <span className="text-[10px] text-slate-400 font-mono">λ = 0.94</span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-extrabold text-cyan-400 font-mono">
              {(latest?.ewmaVol * 100).toFixed(2)}%
            </span>
            <span className="text-xs text-cyan-400/80 font-mono">Fast Shock</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-white/5">
            Reacts instantly to regime shifts • Avg: {(Number(avgEWMA) * 100).toFixed(2)}%
          </div>
        </div>

        {/* Formula C: GARCH(1,1) Volatility */}
        <div className="bg-[#181924] border border-white/5 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              C. GARCH(1,1) Forward
            </span>
            <span className="text-[10px] text-slate-400 font-mono">σ_(t+1)^2</span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-extrabold text-purple-300 font-mono">
              {(latest?.garchVol * 100).toFixed(2)}%
            </span>
            <span className="text-xs text-purple-400 font-mono">Forward</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-white/5">
            Volatility clustering model • Avg: {(Number(avgGARCH) * 100).toFixed(2)}%
          </div>
        </div>

        {/* Formula D: Parkinson High-Low Volatility */}
        <div className="bg-[#181924] border border-white/5 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              D. Parkinson Range Vol
            </span>
            <span className="text-[10px] text-slate-400 font-mono">ln(High/Low)</span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-2xl font-extrabold text-amber-300 font-mono">
              {(latest?.parkinsonVol * 100).toFixed(2)}%
            </span>
            <span className="text-xs text-amber-400 font-mono">OHLC</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-white/5">
            Intra-interval range estimate • Avg: {(Number(avgParkinson) * 100).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Multi-Line Volatility Comparison Time-Series Chart */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium">Volatility Estimators & Regime Detection Curve:</span>
          <span className="text-[10px] text-slate-500 font-mono">
            Elevated Vol Trigger Threshold = 2.0x Baseline
          </span>
        </div>

        <div className="h-[210px] w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2230" vertical={false} />
              <XAxis dataKey="timeLabel" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => `${(v * 100).toFixed(1)}%`}
              />

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
                formatter={(val: any, name: any) => [`${(Number(val) * 100).toFixed(2)}%`, name]}
              />

              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />

              <Line type="monotone" dataKey="Realized" name="A. Realized Vol" stroke="#94a3b8" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="EWMA" name="B. EWMA Vol (λ=0.94)" stroke="#38bdf8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="GARCH" name="C. GARCH(1,1) Vol" stroke="#c084fc" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Parkinson" name="D. Parkinson Range" stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
