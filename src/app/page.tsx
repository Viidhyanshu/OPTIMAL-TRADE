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
import MoltenMetal from '@/components/MoltenMetal';

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
    <div className="min-h-screen bg-black text-slate-100 font-sans antialiased selection:bg-white selection:text-black py-4 px-3 sm:px-6 relative overflow-hidden">
      {/* React-Bits MoltenMetal WebGL Background Shader */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-screen">
        <MoltenMetal
          color1="#5227FF"
          color2="#FF9FFC"
          color3="#FFFFFF"
          speed={0.35}
          scale={4}
          detail={3}
          glow={1.6}
          coreSize={0.1}
          swirl={1}
          fold={-0.2}
          blackPoint={0.05}
          brightness={1.3}
          colorMode="molten"
          grain
          grainIntensity={0.05}
          mouseInteraction
          mouseStrength={0.3}
          opacity={1}
        />
      </div>

      {/* Outer Main Container Card - Sleek Monochrome Dark Black (z-10 above background MoltenMetal shader) */}
      <div className="max-w-7xl mx-auto bg-[#0a0b10]/95 border border-white/10 rounded-[32px] p-5 sm:p-7 shadow-2xl backdrop-blur-2xl space-y-6 overflow-hidden relative z-10">
        {/* Header Navbar */}
        <Header />

        {/* Main Content Body */}
        <div className="w-full space-y-6">
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

          {/* Row 3: Volatility Indicators Component (Formulas A, B, C, D) */}
          <VolatilityIndicatorsCard result={simulationResult} />

          {/* Row 4: Liquidity Indicators Component (Formulas A, B, D) */}
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
