'use client';

import React from 'react';
import { SimulationResult } from '@/lib/engine/types';
import { ChevronDown } from 'lucide-react';

interface AssetsTableCardProps {
  result: SimulationResult;
}

export const AssetsTableCard: React.FC<AssetsTableCardProps> = ({ result }) => {
  const assets = [
    {
      name: 'Bitcoin',
      ticker: 'BTC',
      iconBg: 'bg-amber-500 text-black',
      iconChar: '₿',
      quantity: '0.172634',
      app: '€22,000',
      currentPrice: '€100,710',
      value: '€17,379.60',
      change: '+€13,581.65',
      isPositive: true,
    },
    {
      name: 'Ethereum',
      ticker: 'ETH',
      iconBg: 'bg-[#627eea] text-white',
      iconChar: 'Ξ',
      quantity: '1.3519',
      app: '€1,200',
      currentPrice: '€3,208.93',
      value: '€4,338.45',
      change: '+€2,716.17',
      isPositive: true,
    },
    {
      name: 'Tether',
      ticker: 'USDT',
      iconBg: 'bg-emerald-500 text-black',
      iconChar: 'T',
      quantity: '500',
      app: '€0.96',
      currentPrice: '€0.95',
      value: '€475',
      change: '-€5.00',
      isPositive: false,
    },
  ];

  return (
    <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white text-base">Assets</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="text-slate-400 border-b border-white/5 text-[11px] font-medium">
            <tr>
              <th className="pb-3 font-medium">
                <div className="flex items-center gap-1">
                  <span>Name</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="pb-3 text-left font-medium">
                <div className="flex items-center gap-1">
                  <span>Quantity</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="pb-3 text-left font-medium">APP</th>
              <th className="pb-3 text-left font-medium">Current Price</th>
              <th className="pb-3 text-left font-medium">
                <div className="flex items-center gap-1">
                  <span>Value</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="pb-3 text-right font-medium">
                <div className="flex items-center justify-end gap-1">
                  <span>+/- Value</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono text-[11px]">
            {assets.map((asset) => (
              <tr key={asset.ticker} className="hover:bg-white/5 transition">
                {/* Name */}
                <td className="py-3 font-sans">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${asset.iconBg}`}>
                      {asset.iconChar}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-white">{asset.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono uppercase">{asset.ticker}</span>
                    </div>
                  </div>
                </td>

                {/* Quantity */}
                <td className="py-3 text-slate-300 font-sans">
                  {asset.quantity}
                </td>

                {/* APP */}
                <td className="py-3 text-slate-300 font-sans">
                  {asset.app}
                </td>

                {/* Current Price */}
                <td className="py-3 text-slate-300 font-sans">
                  {asset.currentPrice}
                </td>

                {/* Value */}
                <td className="py-3 text-slate-200 font-sans">
                  {asset.value}
                </td>

                {/* +/- Value */}
                <td className={`py-3 text-right font-sans font-medium ${
                  asset.isPositive ? 'text-[#10b981]' : 'text-rose-500'
                }`}>
                  {asset.change}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
