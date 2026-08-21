'use client';

import React, { useState } from 'react';
import { SimulationResult } from '@/lib/engine/types';
import { Download, Upload, FileText, Check, X } from 'lucide-react';

interface CustomDataModalProps {
  result: SimulationResult;
  isOpen: boolean;
  onClose: () => void;
  onImportCustomData?: (csvContent: string) => void;
}

export const CustomDataModal: React.FC<CustomDataModalProps> = ({
  result,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `optimal_trade_execution_${result.config.symbol}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    let csv = 'Interval,Time,MidPrice,Spread,TWAP_Qty,VWAP_Qty,AC_Qty,Adaptive_Qty,Adaptive_ExecPrice,Adaptive_SlippageBps\n';
    result.marketData.forEach((m, idx) => {
      const twap = result.strategyResults.TWAP.steps[idx];
      const vwap = result.strategyResults.VWAP.steps[idx];
      const ac = result.strategyResults.ALMGREN_CHRISS.steps[idx];
      const adaptive = result.strategyResults.DYNAMIC_ADAPTIVE.steps[idx];

      csv += `${m.interval},${m.timeLabel},${m.midPrice},${m.spread},${twap?.executedQuantity},${vwap?.executedQuantity},${ac?.executedQuantity},${adaptive?.executedQuantity},${adaptive?.executionPrice},${adaptive?.slippageBps}\n`;
    });

    const dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `optimal_trade_log_${result.config.symbol}_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-slate-100 text-lg">
              Data Management & Report Export
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-slate-300">
            Export granular execution simulation results, trade schedules, and microstructure data for audit and backtesting:
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={exportCSV}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export CSV Execution Log</span>
            </button>

            <button
              onClick={exportJSON}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export JSON Simulation</span>
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
