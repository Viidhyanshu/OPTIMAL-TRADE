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
    const updated = {
      ...config,
      side,
    };
    onChangeConfig(updated);
    onRunSimulation();
  };

  const updateField = (field: keyof OrderConfig, val: any) => {
    onChangeConfig({
      ...config,
      [field]: val,
    });
  };

  return (
    <div className="apple-glass-panel rounded-3xl p-6 space-y-5">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 backdrop-blur-md">
            <SlidersHorizontal className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base tracking-tight">
              Execution Risk Calibration & Parameters
            </h3>
            <p className="text-xs text-slate-400">
              Interactive Almgren-Chriss risk-aversion (λ) and order slicing engine.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              updateField('enableShock', !config.enableShock);
              onRunSimulation();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 backdrop-blur-md ${
              config.enableShock
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                : 'apple-glass-pill text-slate-300 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{config.enableShock ? 'Market Shock Active' : 'Enable Shock'}</span>
          </button>

          <button
            type="button"
            onClick={onRunSimulation}
            className="flex items-center gap-1.5 px-5 py-1.5 rounded-full bg-white hover:bg-slate-200 text-black font-extrabold text-xs shadow-xl transition-all duration-200 cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Recalibrate</span>
          </button>
        </div>
      </div>

      {/* Control Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
        {/* Order Side Toggle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-slate-400 font-medium block">Order Side</label>
            <span
              className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md ${
                config.side === 'BUY'
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              }`}
            >
              {config.side} ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 p-1.5 apple-glass-pill rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => handleSideToggle('BUY')}
              className={`py-2 text-xs font-black rounded-xl transition-all duration-200 cursor-pointer active:scale-95 ${
                config.side === 'BUY'
                  ? 'bg-emerald-400 text-black shadow-[0_0_20px_rgba(52,211,153,0.5)] scale-[1.03]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              BUY
            </button>

            <button
              type="button"
              onClick={() => handleSideToggle('SELL')}
              className={`py-2 text-xs font-black rounded-xl transition-all duration-200 cursor-pointer active:scale-95 ${
                config.side === 'SELL'
                  ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.5)] scale-[1.03]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SELL
            </button>
          </div>
        </div>

        {/* Total Quantity */}
        <div className="space-y-2">
          <div className="flex justify-between text-slate-400 font-medium">
            <span>Order Quantity</span>
            <span className="font-mono text-white font-extrabold">{config.totalQuantity.toLocaleString()} shares</span>
          </div>
          <input
            type="range"
            min={10000}
            max={1000000}
            step={10000}
            value={config.totalQuantity}
            onChange={(e) => updateField('totalQuantity', Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
          />
        </div>

        {/* Risk Aversion Lambda */}
        <div className="space-y-2">
          <div className="flex justify-between text-slate-400 font-medium">
            <span>Risk Aversion (λ)</span>
            <span className="font-mono text-white font-extrabold">{config.riskAversion}</span>
          </div>
          <input
            type="range"
            min={0.0001}
            max={0.05}
            step={0.001}
            value={config.riskAversion}
            onChange={(e) => updateField('riskAversion', Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
          />
        </div>

        {/* Benchmark Arrival Price */}
        <div className="space-y-2">
          <label className="text-slate-400 font-medium block">Arrival Benchmark (₹)</label>
          <input
            type="number"
            step="0.10"
            value={config.arrivalPrice}
            onChange={(e) => updateField('arrivalPrice', Number(e.target.value) || 100.0)}
            className="w-full apple-glass-pill rounded-xl px-3.5 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-white/30"
          />
        </div>
      </div>
    </div>
  );
};
