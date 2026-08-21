'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const RepartitionPieCard: React.FC = () => {
  // Dark metallic monochrome slices matching exact screenshot palette
  const data = [
    { name: 'Bitcoin', value: 62, color: '#252736' },
    { name: 'Ethereum', value: 25, color: '#1a1b26' },
    { name: 'Tether', value: 13, color: '#12131b' },
  ];

  return (
    <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-3 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-sans text-lg font-normal text-white tracking-tight">Repartition</h3>
      </div>

      {/* Pie Chart with Crisp Thin White Outline Borders matching screenshot */}
      <div className="h-[185px] w-full relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={0}
              outerRadius={78}
              paddingAngle={1.5}
              dataKey="value"
              stroke="rgba(255, 255, 255, 0.55)"
              strokeWidth={1.5}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="transition-all duration-200 hover:opacity-90"
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
              formatter={(val: any) => [`${val}%`, 'Share']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Muted Legend matching reference screenshot */}
      <div className="flex items-center justify-around text-xs text-slate-400 font-sans pt-1 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span>Bitcoin</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-600" />
          <span>Ethereum</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-800" />
          <span>Tether</span>
        </div>
      </div>
    </div>
  );
};
