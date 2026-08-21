'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const RepartitionPieCard: React.FC = () => {
  const data = [
    { name: 'RELIANCE (NSE)', value: 50, color: '#38bdf8' },
    { name: 'TCS (IT)', value: 30, color: '#818cf8' },
    { name: 'HDFC BANK', value: 20, color: '#c084fc' },
  ];

  return (
    <div className="apple-glass-panel rounded-3xl p-6 space-y-4 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="font-extrabold text-white text-base tracking-tight">Portfolio Repartition</h3>
        <span className="text-[10px] text-slate-400 font-mono apple-glass-pill px-2.5 py-0.5 rounded-full">
          NIFTY 50 Weights
        </span>
      </div>

      {/* Pie Chart */}
      <div className="h-[185px] w-full relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={0}
              outerRadius={78}
              paddingAngle={2}
              dataKey="value"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth={1.5}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="transition-all duration-200 hover:opacity-90 cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(20px)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '1rem',
                fontSize: '12px',
                color: '#ffffff',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
              }}
              itemStyle={{ color: '#ffffff', fontWeight: 600 }}
              labelStyle={{ color: '#ffffff', fontWeight: 600 }}
              formatter={(val: any) => [`${val}%`, 'Weight']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-around text-xs text-slate-300 font-sans pt-1 border-t border-white/10 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
          <span>RELIANCE</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]" />
          <span>TCS</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]" />
          <span>HDFC BANK</span>
        </div>
      </div>
    </div>
  );
};
