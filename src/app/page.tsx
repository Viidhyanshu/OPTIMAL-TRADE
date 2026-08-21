'use client';

import React, { useState, useMemo } from 'react';
import { DEFAULT_CONFIG, runFullSimulation } from '@/lib/engine/runner';
import { OrderConfig } from '@/lib/engine/types';
import { Header } from '@/components/Header';
import { MainHeroChartCard } from '@/components/MainHeroChartCard';
import { QuickSwapCard } from '@/components/QuickSwapCard';
import { AssetsTableCard } from '@/components/AssetsTableCard';
import { RepartitionPieCard } from '@/components/RepartitionPieCard';
import { RegimeShockBanner } from '@/components/RegimeShockBanner';
import { PriceTrajectoryChart } from '@/components/PriceTrajectoryChart';
import { SliceBreakdownChart } from '@/components/SliceBreakdownChart';
import { TradeTable } from '@/components/TradeTable';
import { EfficientFrontierChart } from '@/components/EfficientFrontierChart';
import { BottomCards } from '@/components/BottomCards';
import { SolutionsView } from '@/components/SolutionsView';
import { ControlPanel } from '@/components/ControlPanel';
import { KaggleDataImporter } from '@/components/KaggleDataImporter';
import { Footer } from '@/components/Footer';
import { CustomDataModal } from '@/components/CustomDataModal';
import { FileUp, BookOpen } from 'lucide-react';

export default function OptimalTradeApp() {
  const [config, setConfig] = useState<OrderConfig>(DEFAULT_CONFIG);
  const [seed, setSeed] = useState<number>(42);
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string>('RELIANCE');
  const [activeNavTab, setActiveNavTab] = useState<string>('Dashboard');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  const simulationResult = useMemo(() => {
    return runFullSimulation(config, seed, selectedStockSymbol);
  }, [config, seed, selectedStockSymbol]);

  const handleRunSimulation = () => {
    setSeed(Math.floor(Math.random() * 100000));
  };

  const handleSelectIndianStock = (symbol: string, basePrice: number) => {
    setSelectedStockSymbol(symbol);
    setConfig((prev) => ({
      ...prev,
      symbol,
      arrivalPrice: basePrice,
    }));
  };

  const handleToggleShock = () => {
    setConfig((prev) => ({
      ...prev,
      enableShock: !prev.enableShock,
    }));
  };

  const isNavViewActive = ['Solutions', 'Features', 'Services', 'Pricing'].includes(activeNavTab);

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 font-sans antialiased selection:bg-white selection:text-black py-4 px-3 sm:px-6">
      {/* Outer Main Container Card */}
      <div className="max-w-7xl mx-auto bg-[#0c0d12] border border-white/10 rounded-[32px] p-5 sm:p-7 shadow-2xl backdrop-blur-2xl space-y-6 overflow-hidden">
        {/* Header Navbar */}
        <Header
          activeNavTab={activeNavTab}
          setActiveNavTab={setActiveNavTab}
          isShockActive={config.enableShock}
          onToggleShock={handleToggleShock}
        />

        {/* Main Content Body */}
        <div className="w-full space-y-6">
          {isNavViewActive ? (
            <SolutionsView tab={activeNavTab} />
          ) : (
            <>
              {/* Row 0: Kaggle Indian Stock Data Importer */}
              <KaggleDataImporter
                selectedStockSymbol={selectedStockSymbol}
                onSelectStock={handleSelectIndianStock}
                onImportCSV={(text) => handleRunSimulation()}
              />

              {/* Row 1: Hero Chart + Quick Swap */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <MainHeroChartCard result={simulationResult} />
                </div>
                <div className="lg:col-span-1">
                  <QuickSwapCard
                    config={config}
                    onChangeConfig={setConfig}
                    onRunSimulation={handleRunSimulation}
                  />
                </div>
              </div>

              {/* Row 2: Control Panel */}
              <ControlPanel
                config={config}
                onChangeConfig={setConfig}
                onRunSimulation={handleRunSimulation}
              />

              {/* Row 3: Mid-Way Regime Shock Banner */}
              <RegimeShockBanner result={simulationResult} />

              {/* Row 4: Price Trajectory & Efficient Frontier */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <PriceTrajectoryChart result={simulationResult} />
                </div>
                <div className="lg:col-span-1">
                  <EfficientFrontierChart config={config} />
                </div>
              </div>

              {/* Row 5: Assets Table + Repartition Pie */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <AssetsTableCard result={simulationResult} />
                </div>
                <div className="lg:col-span-1">
                  <RepartitionPieCard />
                </div>
              </div>

              {/* Row 6: Bottom Grid Cards (Recent Transactions, Market, Articles) */}
              <BottomCards />

              {/* Row 7: Trade Slicing Distribution Bar Chart */}
              <SliceBreakdownChart result={simulationResult} />

              {/* Row 8: Granular Execution Log Table */}
              <TradeTable result={simulationResult} />

              {/* Report Export Sub-Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#12131a] border border-white/5 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-white" />
                  <span>Problem Statement: <strong>Optimal Trade Execution Platform (FinTech Challenge)</strong></span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsExportOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-medium transition"
                  >
                    <FileUp className="w-3.5 h-3.5 text-white" />
                    <span>Export Simulation Report</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Seamless Full-Bleed Footer */}
        <Footer setActiveNavTab={setActiveNavTab} />
      </div>

      {/* Export Modal */}
      <CustomDataModal
        result={simulationResult}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
