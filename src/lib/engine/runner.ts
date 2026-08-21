import { OrderConfig, SimulationResult } from './types';
import { generateMarketData, calculateMarketVWAP } from './marketData';
import { generateIndianStockData } from './indianStocksData';
import { runTWAP, runVWAP, runAlmgrenChriss, runDynamicAdaptive } from './strategies';

export function runFullSimulation(
  config: OrderConfig,
  seed: number = 42,
  selectedStockSymbol: string = 'RELIANCE'
): SimulationResult {
  // Use Indian stock data generator if selected
  const isIndianStock = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'TATAMOTORS', 'NIFTY50'].includes(selectedStockSymbol);
  
  const marketData = isIndianStock
    ? generateIndianStockData(selectedStockSymbol, config, seed)
    : generateMarketData(config, seed);

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
  symbol: 'RELIANCE',
  side: 'BUY',
  totalQuantity: 100000,
  totalIntervals: 30,
  riskAversion: 0.005,
  arrivalPrice: 3050.00,
  enableShock: true,
  shockInterval: 15,
  shockVolatilityMultiplier: 3.0,
  shockLiquidityDrop: 0.6,
  shockSpreadMultiplier: 2.5,
};
