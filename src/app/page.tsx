'use client';

import React, { useState, useMemo } from 'react';
import { DEFAULT_CONFIG, runFullSimulation } from '@/lib/engine/runner';
import { OrderConfig } from '@/lib/engine/types';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
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
import { CustomDataModal } from '@/components/CustomDataModal';
import { FileUp, BookOpen } from 'lucide-react';

export default function OptimalTradeApp() {
  const [config, setConfig] = useState<OrderConfig>(DEFAULT_CONFIG);
  const [seed, setSeed] = useState<number>(42);
  const [activeNavTab, setActiveNavTab] = useState<string>('Dashboard');
  const [activeSidebarTab, setActiveSidebarTab] = useState<string>('Dashboard');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  const simulationResult = useMemo(() => {
    return runFullSimulation(config, seed);
  }, [config, seed]);

  const handleRunSimulation = () => {
    setSeed(Math.floor(Math.random() * 100000));
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
      {/* Outer Floating Glass Container matching reference screenshot */}
      <div className="max-w-7xl mx-auto bg-[#0c0d12] border border-white/10 rounded-[32px] p-4 sm:p-6 shadow-2xl backdrop-blur-2xl space-y-4">
        {/* Header Navbar */}
        <Header
          activeNavTab={activeNavTab}
          setActiveNavTab={(tab) => {
            setActiveNavTab(tab);
            if (tab === 'Dashboard') setActiveSidebarTab('Dashboard');
          }}
          isShockActive={config.enableShock}
          onToggleShock={handleToggleShock}
        />

        {/* Main Dashboard Layout with Sidebar */}
        <div className="flex gap-6 pt-2">
          {/* Left Sidebar Menu */}
          <Sidebar
            activeTab={activeSidebarTab}
            setActiveTab={(tab) => {
              setActiveSidebarTab(tab);
              setActiveNavTab('Dashboard');
            }}
          />

          {/* Main Content Body */}
          <div className="flex-1 space-y-6 overflow-hidden">
            {isNavViewActive ? (
              <SolutionsView tab={activeNavTab} />
            ) : (
              <>
                {/* Row 1: Main Hero Chart + Quick Swap Card */}
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

                {/* Mid-Way Market Regime Shift Shock Adaptation Banner */}
                <RegimeShockBanner result={simulationResult} />

                {/* Row 2: Strategy Trajectory Chart & Efficient Frontier */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <PriceTrajectoryChart result={simulationResult} />
                  </div>
                  <div className="lg:col-span-1">
                    <EfficientFrontierChart config={config} />
                  </div>
                </div>

                {/* Row 3: Assets Table + Repartition Pie */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <AssetsTableCard result={simulationResult} />
                  </div>
                  <div className="lg:col-span-1">
                    <RepartitionPieCard />
                  </div>
                </div>

                {/* Row 4: Bottom Grid Cards (Recent Transactions, Market, Articles) */}
                <BottomCards />

                {/* Row 5: Trade Slicing Distribution Bar Chart */}
                <SliceBreakdownChart result={simulationResult} />

                {/* Row 6: Detailed Execution Audit Log Table */}
                <TradeTable result={simulationResult} />

                {/* Footer Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#12131a] border border-white/5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span>Problem Statement: <strong>Optimal Trade Execution Platform (FinTech Challenge)</strong></span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsExportOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition"
                    >
                      <FileUp className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Export Report</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Export Report Modal */}
      <CustomDataModal
        result={simulationResult}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
