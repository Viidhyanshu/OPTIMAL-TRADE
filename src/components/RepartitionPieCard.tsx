'use client';

import React from 'react';
import { SimulationResult } from '@/lib/engine/types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface RepartitionPieCardProps {
  result: SimulationResult;
}

export const RepartitionPieCard: React.FC<RepartitionPieCardProps> = ({ result }) => {
  const { strategyResults } = result;

  const data = [
    { name: 'Dynamic Adaptive', value: strategyResults.DYNAMIC_ADAPTIVE.totalExecutedQuantity, color: '#10b981' },
    { name: 'Almgren-Chriss', value: strategyResults.ALMGREN_CHRISS.totalExecutedQuantity, color: '#3b82f6' },
    { name: 'VWAP Engine', value: strategyResults.VWAP.totalExecutedQuantity, color: '#a855f7' },
    { name: 'TWAP Engine', value: strategyResults.TWAP.totalExecutedQuantity, color: '#f59e0b' },
  ];

  return (
    <div className="bg-[#12131b]/90 border border-white/10 rounded-2xl p-5 shadow-2xl space-y-3 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white text-base">Repartition</h3>
        <span className="text-xs text-slate-400">Share Allocation</span>
      </div>

      <div className="h-[180px] w-full relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
              stroke="#0d0e15"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#181a24',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: '#ffffff',
              }}
              formatter={(val: any) => [`${Number(val).toLocaleString()} shares`, 'Executed']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px]">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
