'use client';

import React, { useState, useMemo } from 'react';
import { DEFAULT_CONFIG, runFullSimulation } from '@/lib/engine/runner';
import { OrderConfig } from '@/lib/engine/types';
import { Header } from '@/components/Header';
import { ControlPanel } from '@/components/ControlPanel';
import { MetricsOverview } from '@/components/MetricsOverview';
import { RegimeShockBanner } from '@/components/RegimeShockBanner';
import { PriceTrajectoryChart } from '@/components/PriceTrajectoryChart';
import { SliceBreakdownChart } from '@/components/SliceBreakdownChart';
import { TradeTable } from '@/components/TradeTable';
import { EfficientFrontierChart } from '@/components/EfficientFrontierChart';
import { CustomDataModal } from '@/components/CustomDataModal';
import { FileUp, BookOpen, Layers } from 'lucide-react';

export default function OptimalTradeApp() {
  const [config, setConfig] = useState<OrderConfig>(DEFAULT_CONFIG);
  const [seed, setSeed] = useState<number>(42);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Run simulation engine whenever config or seed changes
  const simulationResult = useMemo(() => {
    return runFullSimulation(config, seed);
  }, [config, seed]);

  const handleRunSimulation = () => {
    // Generate new market seed for a fresh simulation run
    setSeed(Math.floor(Math.random() * 100000));
  };

  const handleResetToDefaults = () => {
    setConfig(DEFAULT_CONFIG);
    setSeed(42);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-slate-950">
      {/* Navigation Header */}
      <Header
        isShockActive={config.enableShock}
        onResetToDefaults={handleResetToDefaults}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Top Control Panel */}
        <ControlPanel
          config={config}
          onChangeConfig={setConfig}
          onRunSimulation={handleRunSimulation}
        />

        {/* Key Metrics Overview Stat Cards */}
        <MetricsOverview result={simulationResult} />

        {/* Mid-Way Regime Shock Banner */}
        <RegimeShockBanner result={simulationResult} />

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PriceTrajectoryChart result={simulationResult} />
          </div>
          <div className="lg:col-span-1">
            <EfficientFrontierChart config={config} />
          </div>
        </div>

        {/* Trade Slicing Distribution Chart */}
        <SliceBreakdownChart result={simulationResult} />

        {/* Detailed Execution Audit Table */}
        <TradeTable result={simulationResult} />

        {/* Additional Actions & Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Problem Statement: <strong>Optimal Trade Execution (FinTech Algorithmic Challenge)</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <FileUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Simulation Report</span>
            </button>
          </div>
        </div>
      </main>

      {/* Custom Data / Export Modal */}
      <CustomDataModal
        result={simulationResult}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
