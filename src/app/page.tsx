'use client';

import React, { useState, useMemo } from 'react';
import { DEFAULT_CONFIG, runFullSimulation } from '@/lib/engine/runner';
import { OrderConfig } from '@/lib/engine/types';
import { TimeframePeriod } from '@/lib/engine/kaggleDataStore';
import { Header } from '@/components/Header';
import { MainHeroChartCard } from '@/components/MainHeroChartCard';
import { AssetsTableCard } from '@/components/AssetsTableCard';
import { RepartitionPieCard } from '@/components/RepartitionPieCard';
import { PriceTrajectoryChart } from '@/components/PriceTrajectoryChart';
import { SliceBreakdownChart } from '@/components/SliceBreakdownChart';
import { TradeTable } from '@/components/TradeTable';
import { EfficientFrontierChart } from '@/components/EfficientFrontierChart';
import { BottomCards } from '@/components/BottomCards';
import { SolutionsView } from '@/components/SolutionsView';
import { ControlPanel } from '@/components/ControlPanel';
import { KaggleDataImporter } from '@/components/KaggleDataImporter';
import { Footer } from '@/components/Footer';

export default function OptimalTradeApp() {
  const [config, setConfig] = useState<OrderConfig>(DEFAULT_CONFIG);
  const [seed, setSeed] = useState<number>(42);
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string>('RELIANCE');
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframePeriod>('1D');
  const [activeNavTab, setActiveNavTab] = useState<string>('Dashboard');

  const simulationResult = useMemo(() => {
    return runFullSimulation(config, seed, selectedStockSymbol, selectedTimeframe);
  }, [config, seed, selectedStockSymbol, selectedTimeframe]);

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
              {/* Row 0: Kaggle Multi-Company & 1D/7D/1M/1Y Timeframe Menu Importer */}
              <KaggleDataImporter
                selectedStockSymbol={selectedStockSymbol}
                selectedTimeframe={selectedTimeframe}
                onSelectStock={handleSelectIndianStock}
                onSelectTimeframe={setSelectedTimeframe}
              />

              {/* Row 1: Hero Chart (Full Width) */}
              <div className="w-full">
                <MainHeroChartCard result={simulationResult} />
              </div>

              {/* Row 2: Control Panel */}
              <ControlPanel
                config={config}
                onChangeConfig={setConfig}
                onRunSimulation={handleRunSimulation}
              />

              {/* Row 3: Price Trajectory & Efficient Frontier */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <PriceTrajectoryChart result={simulationResult} />
                </div>
                <div className="lg:col-span-1">
                  <EfficientFrontierChart config={config} />
                </div>
              </div>

              {/* Row 4: Assets Table + Repartition Pie */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <AssetsTableCard result={simulationResult} />
                </div>
                <div className="lg:col-span-1">
                  <RepartitionPieCard />
                </div>
              </div>

              {/* Row 5: Bottom Grid Cards (Recent Transactions, Market, Articles) */}
              <BottomCards />

              {/* Row 6: Trade Slicing Distribution Bar Chart */}
              <SliceBreakdownChart result={simulationResult} />

              {/* Row 7: Granular Execution Log Table */}
              <TradeTable result={simulationResult} />
            </>
          )}
        </div>

        {/* Footer */}
        <Footer setActiveNavTab={setActiveNavTab} />
      </div>
    </div>
  );
}
