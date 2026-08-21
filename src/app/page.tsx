'use client';

import React, { useState, useEffect, useMemo } from 'react';
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

  // Mouse Parallax Offset State
  const [parallaxOffset, setParallaxOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth - 0.5) * 2;
      const normY = (e.clientY / innerHeight - 0.5) * 2;

      setParallaxOffset({
        x: normX * 25,
        y: normY * 25,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      {/* Background Subtle Mouse Parallax Noise Shader Layer (z-0 behind main container) */}
      <div
        className="fixed inset-0 pointer-events-none opacity-15 mix-blend-screen z-0 bg-repeat bg-noise-shader transition-transform duration-200 ease-out"
        style={{
          transform: `translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0) scale(1.1)`,
        }}
      />

      {/* Subtle Monochrome Ambient Radial Lighting Glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-white/10 via-slate-800/5 to-transparent blur-3xl pointer-events-none z-0 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${parallaxOffset.x * 0.5}px, ${parallaxOffset.y * 0.5}px, 0)`,
        }}
      />

      {/* Outer Main Container Card - Sleek Monochrome Dark Black (z-10 above background noise) */}
      <div className="max-w-7xl mx-auto bg-[#0a0b10] border border-white/10 rounded-[32px] p-5 sm:p-7 shadow-2xl backdrop-blur-2xl space-y-6 overflow-hidden relative z-10">
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
