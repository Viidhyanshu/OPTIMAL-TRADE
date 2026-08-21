import { OrderConfig, SimulationResult } from './types';
import { getKaggleCompanyData, TimeframePeriod, KAGGLE_COMPANIES_LIST, CompanyMetadata } from './kaggleDataStore';
import { calculateMarketVWAP } from './marketData';
import { runTWAP, runVWAP, runAlmgrenChriss, runDynamicAdaptive } from './strategies';

export function runFullSimulation(
  config: OrderConfig,
  seed: number = 42,
  selectedStockSymbol: string = 'RELIANCE',
  timeframe: TimeframePeriod = '1D'
): SimulationResult & { companyInfo?: CompanyMetadata; timeframe?: TimeframePeriod } {
  // Load data directly from authentic multi-company Kaggle time-series records
  const { company, marketData } = getKaggleCompanyData(selectedStockSymbol, timeframe, config);

  const marketVWAP = calculateMarketVWAP(marketData);

  const twapResult = runTWAP(config, marketData);
  const vwapResult = runVWAP(config, marketData);
  const acResult = runAlmgrenChriss(config, marketData);
  const adaptiveResult = runDynamicAdaptive(config, marketData);

  return {
    config,
    marketData,
    marketVWAP,
    companyInfo: company,
    timeframe,
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
  arrivalPrice: 3048.20,
  enableShock: true,
  shockInterval: 15,
  shockVolatilityMultiplier: 3.0,
  shockLiquidityDrop: 0.6,
  shockSpreadMultiplier: 2.5,
};
