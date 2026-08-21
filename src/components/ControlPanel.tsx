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
            onClick={() => updateField('enableShock', !config.enableShock)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
              config.enableShock
                ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow'
                : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{config.enableShock ? 'Market Shock Active' : 'Enable Shock'}</span>
          </button>

          <button
            onClick={onRunSimulation}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-xs shadow-lg transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Recalibrate</span>
          </button>
        </div>
      </div>

      {/* Control Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Order Side */}
        <div className="space-y-1.5">
          <label className="text-slate-400 font-medium block">Order Side</label>
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#181924] rounded-xl border border-white/5">
            {(['BUY', 'SELL'] as OrderSide[]).map((side) => (
              <button
                key={side}
                onClick={() => updateField('side', side)}
                className={`py-1.5 font-bold rounded-lg transition ${
                  config.side === side
                    ? side === 'BUY'
                      ? 'bg-emerald-500 text-black shadow'
                      : 'bg-rose-500 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {side}
              </button>
            ))}
          </div>
        </div>

        {/* Total Quantity */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-slate-400 font-medium">
            <span>Order Quantity</span>
            <span className="font-mono text-white">{config.totalQuantity.toLocaleString()}</span>
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
            <span className="font-mono text-white">{config.riskAversion}</span>
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
            onChange={(e) => updateField('arrivalPrice', Number(e.target.value))}
            className="w-full bg-[#181924] border border-white/5 rounded-xl px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-white/20"
          />
        </div>
      </div>
    </div>
  );
};
