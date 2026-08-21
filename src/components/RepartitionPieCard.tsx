'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const RepartitionPieCard: React.FC = () => {
  const data = [
    { name: 'Bitcoin', value: 72, color: '#4a4d61' },
    { name: 'Ethereum', value: 20, color: '#2b2d3d font-sans' },
    { name: 'Tether', value: 8, color: '#1a1c27' },
  ];

  return (
    <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-3 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white text-base">Repartition</h3>
      </div>

      <div className="h-[170px] w-full relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={0}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
              stroke="#12131a"
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
              formatter={(val: any) => [`${val}%`, 'Allocation']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-around text-xs text-slate-400 font-medium pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#4a4d61]" />
          <span>Bitcoin</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#2b2d3d]" />
          <span>Ethereum</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#1a1c27]" />
          <span>Tether</span>
        </div>
      </div>
    </div>
  );
};
