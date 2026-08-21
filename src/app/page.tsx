'use client';

import React, { useState, useMemo } from 'react';
import { DEFAULT_CONFIG, runFullSimulation } from '@/lib/engine/runner';
import { OrderConfig } from '@/lib/engine/types';
import { TimeframePeriod } from '@/lib/engine/kaggleDataStore';
import { Header } from '@/components/Header';
import { MainHeroChartCard } from '@/components/MainHeroChartCard';
import { AssetsTableCard } from '@/components/AssetsTableCard';
import { RepartitionPieCard } from '@/components/RepartitionPieCard';
import { LiquidityIndicatorsCard } from '@/components/LiquidityIndicatorsCard';
import { VolatilityIndicatorsCard } from '@/components/VolatilityIndicatorsCard';
import { PriceTrajectoryChart } from '@/components/PriceTrajectoryChart';
import { SliceBreakdownChart } from '@/components/SliceBreakdownChart';
import { TradeTable } from '@/components/TradeTable';
import { EfficientFrontierChart } from '@/components/EfficientFrontierChart';
import { BottomCards } from '@/components/BottomCards';
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

  return (
    <div className="min-h-screen text-slate-100 font-sans antialiased selection:bg-white selection:text-black py-4 px-3 sm:px-6 relative">
      {/* Background Liquid Light Mesh Ambient Blobs */}
      <div className="fixed top-12 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-transparent blur-3xl pointer-events-none" />
      <div className="fixed bottom-24 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* Main Apple Liquid Glass Outer Wrapper Container */}
      <div className="max-w-7xl mx-auto apple-liquid-glass rounded-[40px] p-5 sm:p-8 shadow-2xl space-y-6 overflow-hidden relative z-10 border border-white/15">
        {/* Header Navbar */}
        <Header />

        {/* Main Content Body */}
        <div className="w-full space-y-6">
          {/* Row 0: Kaggle Multi-Company Dropdown & Timeframe Importer */}
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

          {/* Row 3: User Volatility Indicators Component (Formulas A, B, C, D) */}
          <VolatilityIndicatorsCard result={simulationResult} />

          {/* Row 4: User Liquidity Indicators Component (Formulas A, B, D) */}
          <LiquidityIndicatorsCard result={simulationResult} />

          {/* Row 5: Price Trajectory & Efficient Frontier */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PriceTrajectoryChart result={simulationResult} />
            </div>
            <div className="lg:col-span-1">
              <EfficientFrontierChart config={config} />
            </div>
          </div>

          {/* Row 6: Assets Table + Repartition Pie */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AssetsTableCard result={simulationResult} />
            </div>
            <div className="lg:col-span-1">
              <RepartitionPieCard />
            </div>
          </div>

          {/* Row 7: Bottom Grid Cards (Recent Transactions, Market) */}
          <BottomCards />

          {/* Row 8: Trade Slicing Distribution Bar Chart */}
          <SliceBreakdownChart result={simulationResult} />

          {/* Row 9: Granular Execution Log Table */}
          <TradeTable result={simulationResult} />
        </div>

        {/* Footer */}
        <Footer setActiveNavTab={setActiveNavTab} />
      </div>
    </div>
  );
}
