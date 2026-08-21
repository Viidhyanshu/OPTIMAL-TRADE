'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const RepartitionPieCard: React.FC = () => {
  // Dark metallic silver/slate palette matching NIFTY 50 equities weighting
  const data = [
    { name: 'RELIANCE (NSE)', value: 50, color: '#2b2d42' },
    { name: 'TCS (IT)', value: 30, color: '#1e202e' },
    { name: 'HDFC BANK', value: 20, color: '#141520' },
  ];

  return (
    <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-3 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-sans text-lg font-normal text-white tracking-tight">Portfolio Repartition</h3>
        <span className="text-[10px] text-slate-400 font-mono">NIFTY 50 Allocation</span>
      </div>

      {/* Pie Chart with Crisp Thin White Outline Borders */}
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
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: '#ffffff',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
              }}
              itemStyle={{ color: '#ffffff', fontWeight: 600 }}
              labelStyle={{ color: '#ffffff', fontWeight: 600 }}
              formatter={(val: any) => [`${val}%`, 'Weight']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Muted Legend matching NIFTY 50 Indian Equities */}
      <div className="flex items-center justify-around text-xs text-slate-400 font-sans pt-1 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-300" />
          <span>RELIANCE</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-500" />
          <span>TCS</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-700" />
          <span>HDFC BANK</span>
        </div>
      </div>
    </div>
  );
};
