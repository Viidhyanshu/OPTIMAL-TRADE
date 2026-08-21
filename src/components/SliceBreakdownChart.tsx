'use client';

import React, { useState } from 'react';
import { SimulationResult } from '@/lib/engine/types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  BarChart3,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  SlidersHorizontal,
} from 'lucide-react';

interface SliceBreakdownChartProps {
  result: SimulationResult;
}

export const SliceBreakdownChart: React.FC<SliceBreakdownChartProps> = ({ result }) => {
  const { marketData, strategyResults } = result;

  // Zoom and range states
  const totalSteps = marketData.length;
  const [range, setRange] = useState<[number, number]>([0, totalSteps]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [capSpikes, setCapSpikes] = useState<boolean>(false);

  // Full dataset formatted for charting
  const fullChartData = marketData.map((m, idx) => ({
    timeLabel: m.timeLabel,
    interval: m.interval,
    TWAP: strategyResults.TWAP.steps[idx]?.executedQuantity || 0,
    VWAP: strategyResults.VWAP.steps[idx]?.executedQuantity || 0,
    'Almgren-Chriss': strategyResults.ALMGREN_CHRISS.steps[idx]?.executedQuantity || 0,
    'Dynamic Adaptive': strategyResults.DYNAMIC_ADAPTIVE.steps[idx]?.executedQuantity || 0,
  }));

  // Slice dataset based on zoom range
  const visibleData = fullChartData.slice(range[0], range[1]);

  // Zoom In: Focus on middle 50% of current range
  const handleZoomIn = () => {
    const currentSpan = range[1] - range[0];
    if (currentSpan <= 5) return; // Minimum 5 intervals
    const mid = Math.floor((range[0] + range[1]) / 2);
    const newHalf = Math.max(3, Math.floor(currentSpan * 0.3));
    setRange([Math.max(0, mid - newHalf), Math.min(totalSteps, mid + newHalf)]);
  };

  // Zoom Out: Expand view range by 50%
  const handleZoomOut = () => {
    const currentSpan = range[1] - range[0];
    const newHalf = Math.floor(currentSpan * 0.8);
    const mid = Math.floor((range[0] + range[1]) / 2);
    setRange([Math.max(0, mid - newHalf), Math.min(totalSteps, mid + newHalf)]);
  };

  // Reset Zoom: Full view
  const handleResetZoom = () => {
    setRange([0, totalSteps]);
    setCapSpikes(false);
  };

  return (
    <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header & Zoom Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-white" />
          <h3 className="font-bold text-white text-base">
            Trade Slicing Breakdown (Shares Traded Per Interval)
          </h3>
        </div>

        {/* Zoom & View Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Zoom In Button */}
          <button
            onClick={handleZoomIn}
            title="Zoom In (Focus Slices)"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#181924] hover:bg-white hover:text-black border border-white/5 text-slate-200 transition font-medium"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Zoom In</span>
          </button>

          {/* Zoom Out Button */}
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#181924] hover:bg-white hover:text-black border border-white/5 text-slate-200 transition font-medium"
          >
            <ZoomOut className="w-3.5 h-3.5" />
            <span>Zoom Out</span>
          </button>

          {/* Reset Zoom Button */}
          <button
            onClick={handleResetZoom}
            title="Reset Zoom"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#181924] hover:bg-white hover:text-black border border-white/5 text-slate-200 transition font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {/* Spike Focus Toggle */}
          <button
            onClick={() => setCapSpikes(!capSpikes)}
            title="Focus Small Slices"
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border transition font-medium ${
              capSpikes
                ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                : 'bg-[#181924] border-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{capSpikes ? 'Auto-Y Scale On' : 'Focus Small Bars'}</span>
          </button>

          {/* Height Expand Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title="Toggle Expand Chart Height"
            className="p-1.5 rounded-xl bg-[#181924] hover:bg-white hover:text-black border border-white/5 text-slate-300 transition"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Interval Range Slider Bar */}
      <div className="bg-[#181924] border border-white/5 rounded-xl p-2.5 flex items-center justify-between gap-4 text-xs">
        <span className="text-slate-400 font-mono text-[11px] shrink-0">
          Slice Range: <strong className="text-white">#{range[0] + 1}</strong> to <strong className="text-white">#{range[1]}</strong> ({range[1] - range[0]} intervals)
        </span>
        <div className="flex-1 flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono">Start</span>
          <input
            type="range"
            min="0"
            max={totalSteps - 5}
            value={range[0]}
            onChange={(e) => {
              const start = Number(e.target.value);
              if (start < range[1] - 2) setRange([start, range[1]]);
            }}
            className="w-full accent-white cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 font-mono">End</span>
          <input
            type="range"
            min={range[0] + 5}
            max={totalSteps}
            value={range[1]}
            onChange={(e) => {
              const end = Number(e.target.value);
              if (end > range[0] + 2) setRange([range[0], end]);
            }}
            className="w-full accent-white cursor-pointer"
          />
        </div>
      </div>

      {/* Main Bar Chart with Dynamic Height */}
      <div className={`w-full transition-all duration-300 ${isExpanded ? 'h-[480px]' : 'h-[300px]'}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={visibleData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2230" vertical={false} />
            <XAxis dataKey="timeLabel" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis
              domain={capSpikes ? [0, 20000] : ['auto', 'auto']}
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#181a24',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: '#ffffff',
              }}
              formatter={(val: any) => [`${Number(val).toLocaleString()} shares`, 'Qty']}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

            <Bar dataKey="TWAP" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="VWAP" fill="#a855f7" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="Almgren-Chriss" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="Dynamic Adaptive" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
