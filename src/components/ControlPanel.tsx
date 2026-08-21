import React from 'react';
import { OrderConfig } from '@/lib/engine/types';
import { Play, Sliders, ShieldAlert, Layers } from 'lucide-react';

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
  const handleChange = (field: keyof OrderConfig, value: any) => {
    onChangeConfig({
      ...config,
      [field]: value,
    });
  };

  const applyPreset = (preset: 'NORMAL' | 'HIGH_VOLATILITY' | 'THIN_LIQUIDITY' | 'SEVERE_SHOCK') => {
    switch (preset) {
      case 'NORMAL':
        onChangeConfig({
          ...config,
          enableShock: false,
          riskAversion: 0.005,
        });
        break;
      case 'HIGH_VOLATILITY':
        onChangeConfig({
          ...config,
          enableShock: true,
          shockInterval: 10,
          shockVolatilityMultiplier: 4.0,
          shockLiquidityDrop: 0.4,
          shockSpreadMultiplier: 2.0,
        });
        break;
      case 'THIN_LIQUIDITY':
        onChangeConfig({
          ...config,
          enableShock: true,
          shockInterval: 12,
          shockVolatilityMultiplier: 2.0,
          shockLiquidityDrop: 0.75,
          shockSpreadMultiplier: 3.5,
        });
        break;
      case 'SEVERE_SHOCK':
        onChangeConfig({
          ...config,
          enableShock: true,
          shockInterval: 15,
          shockVolatilityMultiplier: 3.5,
          shockLiquidityDrop: 0.65,
          shockSpreadMultiplier: 3.0,
        });
        break;
    }
  };

  return (
    <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-5">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-white" />
          <h2 className="font-bold text-white text-base">Execution Order & Market Parameters</h2>
        </div>
        <button
          onClick={onRunSimulation}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-xs shadow-lg transition transform active:scale-95"
        >
          <Play className="w-4 h-4 fill-current text-black" />
          <span>Run Execution Engine</span>
        </button>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-1.5">
        <span className="text-xs font-medium text-slate-400">Market Presets</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => applyPreset('NORMAL')}
            className={`px-3 py-1.5 text-xs rounded-xl border transition ${
              !config.enableShock
                ? 'bg-white text-black border-white font-bold'
                : 'bg-[#181924] border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            Normal Market
          </button>
          <button
            onClick={() => applyPreset('HIGH_VOLATILITY')}
            className={`px-3 py-1.5 text-xs rounded-xl border transition ${
              config.enableShock && config.shockVolatilityMultiplier >= 4.0
                ? 'bg-white text-black border-white font-bold'
                : 'bg-[#181924] border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            High Volatility
          </button>
          <button
            onClick={() => applyPreset('THIN_LIQUIDITY')}
            className={`px-3 py-1.5 text-xs rounded-xl border transition ${
              config.enableShock && config.shockLiquidityDrop >= 0.7
                ? 'bg-white text-black border-white font-bold'
                : 'bg-[#181924] border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            Thin Liquidity
          </button>
          <button
            onClick={() => applyPreset('SEVERE_SHOCK')}
            className={`px-3 py-1.5 text-xs rounded-xl border transition ${
              config.enableShock && config.shockInterval === 15
                ? 'bg-amber-950 border-amber-600 text-amber-300 font-bold'
                : 'bg-[#181924] border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            Mid-Way Shock ⚡
          </button>
        </div>
      </div>

      {/* Main Order Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Order Side */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400">Order Side</label>
          <div className="flex rounded-xl overflow-hidden border border-white/5 bg-[#181924] p-1">
            <button
              onClick={() => handleChange('side', 'BUY')}
              className={`flex-1 py-1 text-xs font-bold rounded-lg transition ${
                config.side === 'BUY'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              BUY
            </button>
            <button
              onClick={() => handleChange('side', 'SELL')}
              className={`flex-1 py-1 text-xs font-bold rounded-lg transition ${
                config.side === 'SELL'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SELL
            </button>
          </div>
        </div>

        {/* Total Quantity */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400">Total Order Size (Shares)</label>
          <input
            type="number"
            value={config.totalQuantity}
            onChange={(e) => handleChange('totalQuantity', Math.max(1000, Number(e.target.value)))}
            className="w-full bg-[#181924] border border-white/5 rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-white/20"
          />
        </div>

        {/* Arrival Price */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400">Arrival Price ($)</label>
          <input
            type="number"
            step="0.5"
            value={config.arrivalPrice}
            onChange={(e) => handleChange('arrivalPrice', Number(e.target.value))}
            className="w-full bg-[#181924] border border-white/5 rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-white/20"
          />
        </div>

        {/* Execution Intervals */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400">Time Slices (Intervals)</label>
          <input
            type="number"
            min="10"
            max="60"
            value={config.totalIntervals}
            onChange={(e) => handleChange('totalIntervals', Number(e.target.value))}
            className="w-full bg-[#181924] border border-white/5 rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-white/20"
          />
        </div>
      </div>

      {/* Advanced Risk & Shock Controls */}
      <div className="pt-2 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 bg-[#181924] p-3 rounded-xl border border-white/5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-white" />
              Risk Aversion Factor (&lambda;)
            </span>
            <span className="font-mono text-white font-bold">{config.riskAversion}</span>
          </div>
          <input
            type="range"
            min="0.0001"
            max="0.05"
            step="0.0005"
            value={config.riskAversion}
            onChange={(e) => handleChange('riskAversion', parseFloat(e.target.value))}
            className="w-full accent-white cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Low Risk (Slow)</span>
            <span>High Risk (Fast)</span>
          </div>
        </div>

        <div className="space-y-2 bg-[#181924] p-3 rounded-xl border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Mid-Way Market Regime Shift
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enableShock}
                onChange={(e) => handleChange('enableShock', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#222433] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          {config.enableShock ? (
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">Shock Slice</span>
                <input
                  type="number"
                  min="5"
                  max={config.totalIntervals - 2}
                  value={config.shockInterval}
                  onChange={(e) => handleChange('shockInterval', Number(e.target.value))}
                  className="w-full bg-[#12131a] border border-white/5 rounded px-1.5 py-0.5 text-white font-mono"
                />
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Vol Jump (x)</span>
                <input
                  type="number"
                  step="0.5"
                  value={config.shockVolatilityMultiplier}
                  onChange={(e) => handleChange('shockVolatilityMultiplier', Number(e.target.value))}
                  className="w-full bg-[#12131a] border border-white/5 rounded px-1.5 py-0.5 text-white font-mono"
                />
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Spread Widening</span>
                <input
                  type="number"
                  step="0.5"
                  value={config.shockSpreadMultiplier}
                  onChange={(e) => handleChange('shockSpreadMultiplier', Number(e.target.value))}
                  className="w-full bg-[#12131a] border border-white/5 rounded px-1.5 py-0.5 text-white font-mono"
                />
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500">
              Stationary market conditions throughout trading horizon.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
