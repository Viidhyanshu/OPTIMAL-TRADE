'use client';

import React, { useState } from 'react';
import { KAGGLE_COMPANIES_LIST, TimeframePeriod, CompanyMetadata } from '@/lib/engine/kaggleDataStore';
import { Database, ChevronDown, Search, Check, Upload, Calendar, Building2, ExternalLink } from 'lucide-react';

interface KaggleDataImporterProps {
  selectedStockSymbol: string;
  selectedTimeframe: TimeframePeriod;
  onSelectStock: (symbol: string, basePrice: number) => void;
  onSelectTimeframe: (timeframe: TimeframePeriod) => void;
  onImportCSV: (csvText: string) => void;
}

export const KaggleDataImporter: React.FC<KaggleDataImporterProps> = ({
  selectedStockSymbol,
  selectedTimeframe,
  onSelectStock,
  onSelectTimeframe,
  onImportCSV,
}) => {
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [csvFileName, setCsvFileName] = useState<string | null>(null);

  const activeCompany = KAGGLE_COMPANIES_LIST.find((c) => c.symbol === selectedStockSymbol) || KAGGLE_COMPANIES_LIST[0];

  const filteredCompanies = KAGGLE_COMPANIES_LIST.filter((c) => {
    const matchesSearch = c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSector === 'ALL' || c.sector.toLowerCase() === selectedSector.toLowerCase();
    return matchesSearch && matchesSector;
  });

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
          <div className="p-2 rounded-xl bg-[#181924] text-white border border-white/5">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">
                Kaggle Indian Stock Market Engine (NIFTY 50)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800/60">
                16 NIFTY COMPANIED LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Select any Indian company or timeframe (1D, 7D, 1M, 1Y) to stream authentic Kaggle time-series.
            </p>
          </div>
        </div>

        <a
          href="https://www.kaggle.com/datasets/rohanrao/nifty50-stock-market-data"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 transition"
        >
          <span>Kaggle NIFTY 50 Source</span>
          <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
        </a>
      </div>

      {/* Main Selection Controls: Company Dropdown Menu + Timeframe Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Company Dropdown Menu Button */}
        <div className="md:col-span-2 relative">
          <label className="text-xs text-slate-400 font-medium block mb-1.5">
            Select Company (NIFTY 50 Equities):
          </label>

          <button
            onClick={() => setIsOpenMenu(!isOpenMenu)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#181924] border border-white/10 hover:border-white/20 text-white font-medium text-xs transition shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white text-black font-extrabold flex items-center justify-center text-xs font-mono shrink-0">
                {activeCompany.symbol.slice(0, 3)}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm font-mono">{activeCompany.symbol}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                    {activeCompany.sector}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block truncate">
                  {activeCompany.name} • ₹{activeCompany.basePrice.toLocaleString()}
                </span>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpenMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Expanded Company Dropdown Menu */}
          {isOpenMenu && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#141520] border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl space-y-3 animate-fadeIn">
              {/* Search Bar & Sector Tabs */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search 16 NIFTY 50 companies (e.g. TCS, Reliance, Infosys)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#1c1e2b] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/20"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {['ALL', 'Banking', 'IT', 'Energy', 'Automobile', 'FMCG'].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => setSelectedSector(sec)}
                      className={`px-2.5 py-1 rounded-lg border transition ${
                        selectedSector === sec
                          ? 'bg-white text-black font-bold'
                          : 'bg-[#181924] border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {sec}
                    </button>
                  ))}
                </div>
              </div>

              {/* Company List Scroll Area */}
              <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                {filteredCompanies.map((c) => {
                  const isSelected = selectedStockSymbol === c.symbol;

                  return (
                    <button
                      key={c.symbol}
                      onClick={() => {
                        onSelectStock(c.symbol, c.basePrice);
                        setIsOpenMenu(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition ${
                        isSelected
                          ? 'bg-white text-black border-white font-bold'
                          : 'bg-[#181924] border-white/5 text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold font-mono text-xs w-20 shrink-0">{c.symbol}</span>
                        <div className="truncate text-xs">
                          <span className="block truncate">{c.name}</span>
                          <span className="text-[10px] opacity-70">{c.sector} • {c.exchange}</span>
                        </div>
                      </div>
                      <div className="text-right font-mono text-xs shrink-0">
                        ₹{c.basePrice.toLocaleString()}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Timeframe Selector (1D, 7D, 1M, 1Y) */}
        <div>
          <label className="text-xs text-slate-400 font-medium block mb-1.5">
            Select Kaggle Timeframe:
          </label>

          <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-[#181924] border border-white/10">
            {(['1D', '7D', '1M', '1Y'] as TimeframePeriod[]).map((tf) => (
              <button
                key={tf}
                onClick={() => onSelectTimeframe(tf)}
                className={`py-2 text-xs font-bold rounded-lg transition ${
                  selectedTimeframe === tf
                    ? 'bg-white text-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">
            {selectedTimeframe === '1D' ? '30 Intraday Slices (NSE Session)' : selectedTimeframe === '7D' ? '7 Trading Days' : selectedTimeframe === '1M' ? '30 Days Period' : '52 Weeks Horizon'}
          </span>
        </div>
      </div>

      {/* Upload Custom CSV Loader */}
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
              Upload custom Kaggle CSV files for any NIFTY equity to run optimal execution simulation.
            </p>
          </div>
        </div>

        <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-xs shadow-lg cursor-pointer transition shrink-0">
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
