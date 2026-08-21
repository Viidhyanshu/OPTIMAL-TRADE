'use client';

import React, { useState } from 'react';
import { KAGGLE_INDIAN_DATASETS, KaggleDatasetRecord } from '@/lib/engine/kaggleDataStore';
import { Database, Upload, ExternalLink, CheckCircle, Table, Sparkles } from 'lucide-react';

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

  const activeDataset: KaggleDatasetRecord = KAGGLE_INDIAN_DATASETS[selectedStockSymbol] || KAGGLE_INDIAN_DATASETS['RELIANCE'];

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
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">
                Kaggle Indian Stock Market Data Engine
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800/60">
                LIVE KAGGLE DATA
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Directly streaming time-series records from Kaggle NIFTY-50 dataset.
            </p>
          </div>
        </div>

        <a
          href={activeDataset.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 transition"
        >
          <span>View Kaggle Source</span>
          <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
        </a>
      </div>

      {/* Dataset Selection Tabs */}
      <div className="space-y-2">
        <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
          <Table className="w-3.5 h-3.5 text-white" />
          Select Kaggle Stock Dataset:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.values(KAGGLE_INDIAN_DATASETS).map((dataset) => {
            const isSelected = selectedStockSymbol === dataset.symbol;
            const firstRecord = dataset.records[0];

            return (
              <button
                key={dataset.symbol}
                onClick={() => onSelectStock(dataset.symbol, firstRecord.close)}
                className={`p-3.5 rounded-xl border text-left transition relative ${
                  isSelected
                    ? 'bg-white text-black border-white font-bold shadow-xl'
                    : 'bg-[#181924] border-white/5 text-slate-300 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold font-mono text-sm">{dataset.symbol}</span>
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded bg-black text-white text-[9px] font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono font-extrabold mt-1">
                  ₹{firstRecord.close.toLocaleString()}
                </div>
                <div className="text-[10px] opacity-70 truncate mt-0.5">
                  {dataset.datasetName}
                </div>
                <div className="text-[9px] opacity-60 font-mono mt-1">
                  {dataset.totalRecords} records | {dataset.timeframe}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upload Custom Kaggle CSV Button */}
      <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#181924] p-3.5 rounded-xl border border-white/5 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/10 text-white border border-white/10">
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white block">
              Import Custom Kaggle Dataset (.csv)
            </span>
            <p className="text-[10px] text-slate-400">
              Drag & drop any Kaggle stock market CSV file to run optimal trade execution algorithms directly.
            </p>
          </div>
        </div>

        <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-xs shadow-lg cursor-pointer transition shrink-0">
          <Upload className="w-3.5 h-3.5" />
          <span>{csvFileName ? `Loaded: ${csvFileName}` : 'Choose Kaggle CSV File'}</span>
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
