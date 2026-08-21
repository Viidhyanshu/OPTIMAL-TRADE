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
import GradientWaves from '@/components/GradientWaves';

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
      {/* React-Bits GradientWaves Full Viewport WebGL Background Shader */}
      <div className="fixed inset-0 pointer-events-none z-0 w-full h-full opacity-60 mix-blend-screen">
        <GradientWaves
          horizonColor="#5227FF"
          waveColor="#FF9FFC"
          crestColor="#FFFFFF"
          speed={0.4}
          amplitude={2.5}
          waveScale={0.6}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1}
          height={5.5}
          fogDepth={15}
          detail="medium"
          brightness={1}
          opacity={1}
          mouseInteraction={false}
          parallaxStrength={0}
          grain
          grainIntensity={0.05}
        />
      </div>

      {/* Outer Main Container Card - Sleek Monochrome Dark Black (z-10 above background GradientWaves shader) */}
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
