import { OrderConfig, SimulationResult } from './types';
import { generateMarketData, calculateMarketVWAP } from './marketData';
import { runTWAP, runVWAP, runAlmgrenChriss, runDynamicAdaptive } from './strategies';

export function runFullSimulation(config: OrderConfig, seed: number = 42): SimulationResult {
  const marketData = generateMarketData(config, seed);
  const marketVWAP = calculateMarketVWAP(marketData);

  const twapResult = runTWAP(config, marketData);
  const vwapResult = runVWAP(config, marketData);
  const acResult = runAlmgrenChriss(config, marketData);
  const adaptiveResult = runDynamicAdaptive(config, marketData);

  return {
    config,
    marketData,
    marketVWAP,
    strategyResults: {
      TWAP: twapResult,
      VWAP: vwapResult,
      ALMGREN_CHRISS: acResult,
      DYNAMIC_ADAPTIVE: adaptiveResult,
    },
  };
}

export const DEFAULT_CONFIG: OrderConfig = {
  symbol: 'AAPL',
  side: 'BUY',
  totalQuantity: 100000,
  totalIntervals: 30,
  riskAversion: 0.005,
  arrivalPrice: 185.50,
  enableShock: true,
  shockInterval: 15,
  shockVolatilityMultiplier: 3.0,
  shockLiquidityDrop: 0.6,
  shockSpreadMultiplier: 2.5,
};
