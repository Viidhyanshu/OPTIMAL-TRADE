'use client';

import React, { useState } from 'react';
import { SimulationResult, StrategyType } from '@/lib/engine/types';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { LineChart as LineChartIcon, ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';

interface PriceTrajectoryChartProps {
  result: SimulationResult;
}

export const PriceTrajectoryChart: React.FC<PriceTrajectoryChartProps> = ({ result }) => {
  const [activeStrategies, setActiveStrategies] = useState<Record<StrategyType, boolean>>({
    TWAP: true,
    VWAP: true,
    ALMGREN_CHRISS: true,
    DYNAMIC_ADAPTIVE: true,
  });

  const { marketData, strategyResults, config } = result;
  const totalSteps = marketData.length;

  const [range, setRange] = useState<[number, number]>([0, totalSteps]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleStrategy = (strat: StrategyType) => {
    setActiveStrategies((prev) => ({ ...prev, [strat]: !prev[strat] }));
  };

  const chartData = marketData.map((m, idx) => ({
    interval: m.interval,
    timeLabel: m.timeLabel,
    midPrice: m.midPrice,
    bidPrice: m.bidPrice,
    askPrice: m.askPrice,
    spread: m.spread,
    isShock: m.isShockActive,
    TWAP: strategyResults.TWAP.steps[idx]?.executionPrice,
    VWAP: strategyResults.VWAP.steps[idx]?.executionPrice,
    ALMGREN_CHRISS: strategyResults.ALMGREN_CHRISS.steps[idx]?.executionPrice,
    DYNAMIC_ADAPTIVE: strategyResults.DYNAMIC_ADAPTIVE.steps[idx]?.executionPrice,
  }));

  const visibleData = chartData.slice(range[0], range[1]);
  const shockStep = config.enableShock ? visibleData.find((d) => d.isShock) : null;

  const handleZoomIn = () => {
    const currentSpan = range[1] - range[0];
    if (currentSpan <= 5) return;
    const mid = Math.floor((range[0] + range[1]) / 2);
    const newHalf = Math.max(3, Math.floor(currentSpan * 0.3));
    setRange([Math.max(0, mid - newHalf), Math.min(totalSteps, mid + newHalf)]);
  };

  const handleZoomOut = () => {
    const currentSpan = range[1] - range[0];
    const newHalf = Math.floor(currentSpan * 0.8);
    const mid = Math.floor((range[0] + range[1]) / 2);
    setRange([Math.max(0, mid - newHalf), Math.min(totalSteps, mid + newHalf)]);
  };

  const handleResetZoom = () => {
    setRange([0, totalSteps]);
  };

  return (
    <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Chart Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <LineChartIcon className="w-5 h-5 text-white" />
          <h3 className="font-bold text-white text-base">
            Price Trajectory & Strategy Execution Slices
          </h3>
        </div>

        {/* Strategy Toggles & Zoom Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <button
            onClick={() => toggleStrategy('TWAP')}
            className={`px-2.5 py-1 rounded-xl border transition ${
              activeStrategies.TWAP
                ? 'bg-[#181924] border-amber-500/50 text-amber-300 font-semibold'
                : 'bg-white/5 border-white/5 text-slate-500 opacity-60'
            }`}
          >
            TWAP
          </button>
          <button
            onClick={() => toggleStrategy('VWAP')}
            className={`px-2.5 py-1 rounded-xl border transition ${
              activeStrategies.VWAP
                ? 'bg-[#181924] border-purple-500/50 text-purple-300 font-semibold'
                : 'bg-white/5 border-white/5 text-slate-500 opacity-60'
            }`}
          >
            VWAP
          </button>
          <button
            onClick={() => toggleStrategy('ALMGREN_CHRISS')}
            className={`px-2.5 py-1 rounded-xl border transition ${
              activeStrategies.ALMGREN_CHRISS
                ? 'bg-[#181924] border-slate-400/50 text-slate-200 font-semibold'
                : 'bg-white/5 border-white/5 text-slate-500 opacity-60'
            }`}
          >
            Almgren-Chriss
          </button>
          <button
            onClick={() => toggleStrategy('DYNAMIC_ADAPTIVE')}
            className={`px-2.5 py-1 rounded-xl border transition ${
              activeStrategies.DYNAMIC_ADAPTIVE
                ? 'bg-[#181924] border-emerald-500 text-emerald-300 font-semibold shadow'
                : 'bg-white/5 border-white/5 text-slate-500 opacity-60'
            }`}
          >
            Dynamic Adaptive ★
          </button>

          <div className="h-4 w-px bg-white/10 mx-1" />

          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded-xl bg-[#181924] hover:bg-white hover:text-black border border-white/5 text-slate-300 transition"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded-xl bg-[#181924] hover:bg-white hover:text-black border border-white/5 text-slate-300 transition"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleResetZoom}
            title="Reset Zoom"
            className="p-1.5 rounded-xl bg-[#181924] hover:bg-white hover:text-black border border-white/5 text-slate-300 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title="Toggle Expand Height"
            className="p-1.5 rounded-xl bg-[#181924] hover:bg-white hover:text-black border border-white/5 text-slate-300 transition"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className={`w-full transition-all duration-300 ${isExpanded ? 'h-[480px]' : 'h-[340px]'}`}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={visibleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="midGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e2230" vertical={false} />
            <XAxis dataKey="timeLabel" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis
              domain={['auto', 'auto']}
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `₹${v.toFixed(1)}`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#181a24',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: '#ffffff',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
              }}
              itemStyle={{ color: '#ffffff', fontWeight: 600 }}
              labelStyle={{ color: '#ffffff', fontWeight: 600 }}
              formatter={(value: any, name: any) => [`₹${Number(value).toFixed(2)}`, name]}
            />

            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

            <ReferenceLine
              y={config.arrivalPrice}
              stroke="#64748b"
              strokeDasharray="4 4"
              label={{
                value: `Arrival ₹${config.arrivalPrice}`,
                fill: '#94a3b8',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />

            {shockStep && (
              <ReferenceLine
                x={shockStep.timeLabel}
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="2 2"
                label={{
                  value: '⚡ MARKET SHOCK',
                  fill: '#f59e0b',
                  fontSize: 11,
                  fontWeight: 'bold',
                  position: 'top',
                }}
              />
            )}

            <Area
              type="monotone"
              dataKey="midPrice"
              name="Market Mid Price"
              stroke="#ffffff"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#midGradient)"
            />

            {activeStrategies.TWAP && (
              <Line
                type="monotone"
                dataKey="TWAP"
                name="TWAP Exec"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            )}

            {activeStrategies.VWAP && (
              <Line
                type="monotone"
                dataKey="VWAP"
                name="VWAP Exec"
                stroke="#a855f7"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            )}

            {activeStrategies.ALMGREN_CHRISS && (
              <Line
                type="monotone"
                dataKey="ALMGREN_CHRISS"
                name="Almgren-Chriss Exec"
                stroke="#94a3b8"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            )}

            {activeStrategies.DYNAMIC_ADAPTIVE && (
              <Line
                type="monotone"
                dataKey="DYNAMIC_ADAPTIVE"
                name="Dynamic Adaptive Exec"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 3, fill: '#10b981' }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
