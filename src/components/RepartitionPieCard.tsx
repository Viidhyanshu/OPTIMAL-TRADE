'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const RepartitionPieCard: React.FC = () => {
  // High contrast distinct slice colors with clear visual separation
  const data = [
    { name: 'Bitcoin', value: 68, color: '#94a3b8', label: '68%' },
    { name: 'Ethereum', value: 24, color: '#38bdf8', label: '24%' },
    { name: 'Tether', value: 8, color: '#10b981', label: '8%' },
  ];

  return (
    <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-3 flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white text-base">Repartition</h3>
        <span className="text-[11px] text-slate-400 font-mono">Portfolio Slices</span>
      </div>

      {/* Pie Chart Container with Distinct Slice Gaps */}
      <div className="h-[180px] w-full relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={30}
              outerRadius={75}
              paddingAngle={5}
              dataKey="value"
              stroke="#12131a"
              strokeWidth={3}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="transition-all duration-200 hover:opacity-80"
                />
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
              formatter={(val: any) => [`${val}%`, 'Allocation']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with Matching Colors and Percentage Badges */}
      <div className="flex items-center justify-around text-xs text-slate-300 font-medium pt-1">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-white font-medium">{item.name}</span>
            <span className="text-[10px] text-slate-400 font-mono">({item.label})</span>
          </div>
        ))}
      </div>
    </div>
  );
};
