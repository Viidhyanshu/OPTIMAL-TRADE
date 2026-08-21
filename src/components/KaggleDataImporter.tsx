'use client';

import React, { useState } from 'react';
import { INDIAN_STOCKS_PRESETS, parseKaggleCSV } from '@/lib/engine/indianStocksData';
import { OrderConfig } from '@/lib/engine/types';
import { Database, Upload, Download, Check, Sparkles, Building2 } from 'lucide-react';

interface KaggleDataImporterProps {
  selectedStockSymbol: string;
  onSelectStock: (symbol: string, basePrice: number) => void;
  onImportCSV: (csvText: string) => void;
}

export const KaggleDataImporter: React.FC<KaggleDataImporterProps> = ({
  selectedStockSymbol,
  onSelectStock,
  onImportCSV,
}) => {
  const [csvFileName, setCsvFileName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        onImportCSV(text);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-[#12131a] border border-white/5 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-white" />
          <h3 className="font-bold text-white text-base">
            Indian Stock Market Kaggle Data Feed (NSE / BSE)
          </h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[11px] font-mono">
          NIFTY 50 & Equities Feed
        </span>
      </div>

      {/* Preset Stock Selector Grid */}
      <div className="space-y-1.5">
        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5 text-cyan-400" />
          Select Indian Stock Kaggle Preset:
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {INDIAN_STOCKS_PRESETS.map((stock) => {
            const isSelected = selectedStockSymbol === stock.symbol;

            return (
              <button
                key={stock.symbol}
                onClick={() => onSelectStock(stock.symbol, stock.basePrice)}
                className={`p-2.5 rounded-xl border text-left transition relative ${
                  isSelected
                    ? 'bg-white text-black border-white font-bold shadow-lg'
                    : 'bg-[#181924] border-white/5 text-slate-300 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold font-mono">{stock.symbol}</span>
                  <span className="text-[9px] opacity-70 font-semibold">{stock.exchange}</span>
                </div>
                <div className="text-[11px] font-mono mt-1">
                  ₹{stock.basePrice.toLocaleString()}
                </div>
                <div className="text-[9px] opacity-60 truncate">
                  {stock.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Kaggle CSV Drag & Drop / File Upload */}
      <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#181924] p-3.5 rounded-xl border border-white/5 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/10 text-white border border-white/10">
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white block">
              Upload Custom Kaggle CSV Dataset
            </span>
            <p className="text-[10px] text-slate-400">
              Supports Kaggle Indian stock CSVs (NIFTY50, Reliance, TCS, intraday ticks).
            </p>
          </div>
        </div>

        <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-xs shadow-lg cursor-pointer transition">
          <Upload className="w-3.5 h-3.5" />
          <span>{csvFileName ? `Loaded: ${csvFileName}` : 'Choose Kaggle CSV'}</span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};
