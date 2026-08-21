import React from 'react';
import { OrderConfig, OrderSide } from '@/lib/engine/types';
import { Play, Sliders, Zap, ShieldAlert, DollarSign, Layers } from 'lucide-react';

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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <h2 className="font-bold text-slate-100 text-base">Execution Order & Market Parameters</h2>
        </div>
        <button
          onClick={onRunSimulation}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/25 transition transform active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Run Execution Engine</span>
        </button>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-1.5">
        <span className="text-xs font-medium text-slate-400">Market Presets</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => applyPreset('NORMAL')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition ${
              !config.enableShock
                ? 'bg-cyan-950 border-cyan-700 text-cyan-300 font-semibold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Normal Market
          </button>
          <button
            onClick={() => applyPreset('HIGH_VOLATILITY')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition ${
              config.enableShock && config.shockVolatilityMultiplier >= 4.0
                ? 'bg-cyan-950 border-cyan-700 text-cyan-300 font-semibold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            High Volatility
          </button>
          <button
            onClick={() => applyPreset('THIN_LIQUIDITY')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition ${
              config.enableShock && config.shockLiquidityDrop >= 0.7
                ? 'bg-cyan-950 border-cyan-700 text-cyan-300 font-semibold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Thin Liquidity
          </button>
          <button
            onClick={() => applyPreset('SEVERE_SHOCK')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition ${
              config.enableShock && config.shockInterval === 15
                ? 'bg-amber-950 border-amber-700 text-amber-300 font-semibold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Mid-Way Shock ⚡
          </button>
        </div>
      </div>

      {/* Main Order Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Symbol & Side */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400">Order Side</label>
          <div className="flex rounded-lg overflow-hidden border border-slate-800 bg-slate-950 p-1">
            <button
              onClick={() => handleChange('side', 'BUY')}
              className={`flex-1 py-1 text-xs font-bold rounded-md transition ${
                config.side === 'BUY'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              BUY
            </button>
            <button
              onClick={() => handleChange('side', 'SELL')}
              className={`flex-1 py-1 text-xs font-bold rounded-md transition ${
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
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
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
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
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
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Advanced Parameters: Risk Aversion & Shock Control */}
      <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Risk Aversion Slider */}
        <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Risk Aversion Factor (&lambda;)
            </span>
            <span className="font-mono text-cyan-400 font-bold">{config.riskAversion}</span>
          </div>
          <input
            type="range"
            min="0.0001"
            max="0.05"
            step="0.0005"
            value={config.riskAversion}
            onChange={(e) => handleChange('riskAversion', parseFloat(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Low Risk (Slow Execution)</span>
            <span>High Risk (Fast Execution)</span>
          </div>
        </div>

        {/* Mid-Way Regime Change Shock Toggle */}
        <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
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
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          {config.enableShock ? (
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">Shock Interval</span>
                <input
                  type="number"
                  min="5"
                  max={config.totalIntervals - 2}
                  value={config.shockInterval}
                  onChange={(e) => handleChange('shockInterval', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-slate-200 font-mono"
                />
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Vol Jump (x)</span>
                <input
                  type="number"
                  step="0.5"
                  value={config.shockVolatilityMultiplier}
                  onChange={(e) => handleChange('shockVolatilityMultiplier', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-slate-200 font-mono"
                />
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Spread Widening</span>
                <input
                  type="number"
                  step="0.5"
                  value={config.shockSpreadMultiplier}
                  onChange={(e) => handleChange('shockSpreadMultiplier', Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-slate-200 font-mono"
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
