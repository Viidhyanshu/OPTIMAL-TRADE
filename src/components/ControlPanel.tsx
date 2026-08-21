'use client';

import React from 'react';
import { OrderConfig, OrderSide } from '@/lib/engine/types';
import { SlidersHorizontal, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ControlPanelProps {
  config: OrderConfig;
  onChangeConfig: (newConfig: OrderConfig) => void;
  onRunSimulation: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  onChangeConfig,
  onRunSimulation,
}) => {
  const handleSideToggle = (side: OrderSide) => {
    onChangeConfig({
      ...config,
      side,
    });
  };

  const updateField = (field: keyof OrderConfig, val: any) => {
    onChangeConfig({
      ...config,
      [field]: val,
    });
  };

  return (
    <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-white" />
          <h3 className="font-bold text-white text-base">
            Trade Execution Parameters & Risk Calibration
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => updateField('enableShock', !config.enableShock)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer active:scale-95 ${
              config.enableShock
                ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow'
                : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{config.enableShock ? 'Market Shock Active' : 'Enable Shock'}</span>
          </button>

          <button
            type="button"
            onClick={onRunSimulation}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-xs shadow-lg transition cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Recalibrate</span>
          </button>
        </div>
      </div>

      {/* Control Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
        {/* Order Side (BUY / SELL Buttons with High Contrast Active Feedback) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-slate-400 font-medium block">Order Side</label>
            <span className="font-mono text-[10px] font-bold text-white uppercase">
              Active: {config.side}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#181924] rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => handleSideToggle('BUY')}
              className={`py-2 text-xs font-black rounded-lg transition-all duration-150 cursor-pointer active:scale-95 ${
                config.side === 'BUY'
                  ? 'bg-[#10b981] text-black shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              BUY
            </button>

            <button
              type="button"
              onClick={() => handleSideToggle('SELL')}
              className={`py-2 text-xs font-black rounded-lg transition-all duration-150 cursor-pointer active:scale-95 ${
                config.side === 'SELL'
                  ? 'bg-[#f43f5e] text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              SELL
            </button>
          </div>
        </div>

        {/* Total Quantity */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-slate-400 font-medium">
            <span>Order Quantity</span>
            <span className="font-mono text-white font-bold">{config.totalQuantity.toLocaleString()} shares</span>
          </div>
          <input
            type="range"
            min={10000}
            max={1000000}
            step={10000}
            value={config.totalQuantity}
            onChange={(e) => updateField('totalQuantity', Number(e.target.value))}
            className="w-full accent-white cursor-pointer"
          />
        </div>

        {/* Risk Aversion Lambda */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-slate-400 font-medium">
            <span>Risk Aversion (λ)</span>
            <span className="font-mono text-white font-bold">{config.riskAversion}</span>
          </div>
          <input
            type="range"
            min={0.0001}
            max={0.05}
            step={0.001}
            value={config.riskAversion}
            onChange={(e) => updateField('riskAversion', Number(e.target.value))}
            className="w-full accent-white cursor-pointer"
          />
        </div>

        {/* Benchmark Arrival Price */}
        <div className="space-y-1.5">
          <label className="text-slate-400 font-medium block">Arrival Benchmark (₹)</label>
          <input
            type="number"
            step="0.10"
            value={config.arrivalPrice}
            onChange={(e) => updateField('arrivalPrice', Number(e.target.value) || 100.0)}
            className="w-full bg-[#181924] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-white/20"
          />
        </div>
      </div>
    </div>
  );
};
