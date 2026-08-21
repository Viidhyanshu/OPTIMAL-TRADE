import { MarketIntervalData, OrderConfig } from './types';

export type TimeframePeriod = '1D' | '7D' | '1M' | '1Y';

export interface CompanyMetadata {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  basePrice: number; // in INR ₹
  sector: 'Banking' | 'IT' | 'Energy' | 'Automobile' | 'FMCG' | 'Infrastructure' | 'Index';
  volume: number;
}

export const KAGGLE_COMPANIES_LIST: CompanyMetadata[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', exchange: 'NSE', basePrice: 3048.20, sector: 'Energy', volume: 6850000 },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', exchange: 'NSE', basePrice: 4218.50, sector: 'IT', volume: 2840000 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', exchange: 'NSE', basePrice: 1684.30, sector: 'Banking', volume: 12500000 },
  { symbol: 'INFY', name: 'Infosys Ltd.', exchange: 'NSE', basePrice: 1862.10, sector: 'IT', volume: 4920000 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', exchange: 'NSE', basePrice: 1092.40, sector: 'Automobile', volume: 8900000 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', exchange: 'NSE', basePrice: 1215.60, sector: 'Banking', volume: 9800000 },
  { symbol: 'SBIN', name: 'State Bank of India', exchange: 'NSE', basePrice: 842.10, sector: 'Banking', volume: 14200000 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', exchange: 'NSE', basePrice: 1480.50, sector: 'IT', volume: 5400000 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.', exchange: 'NSE', basePrice: 2750.80, sector: 'FMCG', volume: 1950000 },
  { symbol: 'ITC', name: 'ITC Ltd.', exchange: 'NSE', basePrice: 512.40, sector: 'FMCG', volume: 11200000 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.', exchange: 'NSE', basePrice: 1795.00, sector: 'Banking', volume: 3800000 },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd.', exchange: 'NSE', basePrice: 3680.20, sector: 'Infrastructure', volume: 2150000 },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', exchange: 'NSE', basePrice: 1175.40, sector: 'Banking', volume: 7600000 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.', exchange: 'NSE', basePrice: 12450.00, sector: 'Automobile', volume: 890000 },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd.', exchange: 'NSE', basePrice: 1720.90, sector: 'FMCG', volume: 3100000 },
  { symbol: 'NIFTY50', name: 'NIFTY 50 Index Benchmark', exchange: 'NSE', basePrice: 24438.50, sector: 'Index', volume: 25000000 },
];

/**
 * Generates multi-timeframe Kaggle market data for any Indian company across 1D, 7D, 1M, 1Y
 * Computing exact User-Specified Volatility Indicators:
 * A. Realized Volatility: returns_t = ln(price_t / price_(t-1)), std_dev(returns) rolling window
 * B. EWMA Volatility: sigma_t^2 = lambda * sigma_(t-1)^2 + (1 - lambda) * return_t^2 (lambda = 0.94)
 * C. GARCH(1,1) Volatility: sigma_(t+1)^2 = omega + alpha * return_t^2 + beta * sigma_t^2
 * D. Parkinson High-Low Volatility: sigma^2 = (1 / (4 * ln 2)) * [ln(high/low)]^2
 */
export function getKaggleCompanyData(
  symbol: string,
  timeframe: TimeframePeriod,
  config: OrderConfig
): {
  company: CompanyMetadata;
  marketData: MarketIntervalData[];
} {
  const company = KAGGLE_COMPANIES_LIST.find((c) => c.symbol === symbol) || KAGGLE_COMPANIES_LIST[0];

  let intervalsCount = 30;
  switch (timeframe) {
    case '1D':
      intervalsCount = 30;
      break;
    case '7D':
      intervalsCount = 28;
      break;
    case '1M':
      intervalsCount = 30;
      break;
    case '1Y':
      intervalsCount = 32;
      break;
  }

  const avgMarketVolume = Math.round(company.volume / intervalsCount);

  const rawSteps: {
    interval: number;
    timeLabel: string;
    midPrice: number;
    bidPrice: number;
    askPrice: number;
    highPrice: number;
    lowPrice: number;
    spread: number;
    marketVolume: number;
    volatility: number;
    isShockActive: boolean;
  }[] = [];

  let currentPrice = company.basePrice;
  let s = (symbol.charCodeAt(0) * 100 + timeframe.charCodeAt(0)) % 2147483647;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  const baseVolParam = timeframe === '1D' ? 0.012 : timeframe === '7D' ? 0.025 : timeframe === '1M' ? 0.045 : 0.085;

  for (let i = 1; i <= intervalsCount; i++) {
    const isShock = config.enableShock && i >= Math.floor(intervalsCount / 2);
    const currentVol = baseVolParam * (isShock ? config.shockVolatilityMultiplier : 1.0);
    const spreadBps = 4.0 * (isShock ? config.shockSpreadMultiplier : 1.0);

    const normT = (i - 1) / (intervalsCount - 1);
    const uCurve = 1.0 + 0.75 * Math.cos(2 * Math.PI * (normT - 0.5));
    const marketVolume = Math.round(avgMarketVolume * uCurve * (isShock ? (1.0 - config.shockLiquidityDrop) : 1.0) * (0.9 + 0.2 * rand()));

    const z = (rand() + rand() + rand() - 1.5) * 1.6;
    const priceMove = currentPrice * (currentVol * z / Math.sqrt(intervalsCount));
    currentPrice = Math.max(10.0, currentPrice + priceMove);

    const midPrice = Number(currentPrice.toFixed(2));
    const highPrice = Number((midPrice * (1 + Math.abs(z) * currentVol * 0.5)).toFixed(2));
    const lowPrice = Number((midPrice * (1 - Math.abs(z) * currentVol * 0.5)).toFixed(2));

    const spread = Number(((midPrice * spreadBps) / 10000).toFixed(2));
    const bidPrice = Number((midPrice - spread / 2).toFixed(2));
    const askPrice = Number((midPrice + spread / 2).toFixed(2));

    let timeLabel = '';
    if (timeframe === '1D') {
      const mins = Math.floor(((i - 1) / intervalsCount) * 375);
      const totalM = 15 + mins;
      const h = 9 + Math.floor(totalM / 60);
      const m = totalM % 60;
      timeLabel = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} IST`;
    } else if (timeframe === '7D') {
      const dayNum = Math.floor((i - 1) / 4) + 1;
      const slot = ((i - 1) % 4) + 1;
      timeLabel = `Day ${dayNum} S${slot}`;
    } else if (timeframe === '1M') {
      timeLabel = `Day ${i}`;
    } else {
      timeLabel = `Wk ${i}`;
    }

    rawSteps.push({
      interval: i,
      timeLabel,
      midPrice,
      bidPrice,
      askPrice,
      highPrice,
      lowPrice,
      spread,
      marketVolume,
      volatility: Number(currentVol.toFixed(4)),
      isShockActive: isShock,
    });
  }

  // State trackers for EWMA and GARCH(1,1) recursive updates
  let ewmaVariance = Math.pow(baseVolParam, 2);
  let garchVariance = Math.pow(baseVolParam, 2);
  const lambda = 0.94; // EWMA decay factor
  const omega = 0.00001; // GARCH omega
  const alphaGarch = 0.10; // GARCH alpha
  const betaGarch = 0.85;  // GARCH beta

  // Compute User Volatility Indicators A, B, C, D & Liquidity Indicators A, B, D
  const returnsList: number[] = [0];

  const marketData: MarketIntervalData[] = rawSteps.map((step, idx) => {
    // Calculate log return: returns_t = ln(price_t / price_(t-1))
    const prevPrice = idx > 0 ? rawSteps[idx - 1].midPrice : step.midPrice;
    const logReturn = Number(Math.log(step.midPrice / prevPrice).toFixed(6));
    returnsList.push(logReturn);

    // Formula A: Realized Volatility (Rolling Std Dev over 10-interval window)
    const windowSize = 10;
    const startIdx = Math.max(0, returnsList.length - windowSize);
    const rollingReturns = returnsList.slice(startIdx);
    const meanRet = rollingReturns.reduce((a, b) => a + b, 0) / rollingReturns.length;
    const varianceRet = rollingReturns.reduce((a, b) => a + Math.pow(b - meanRet, 2), 0) / rollingReturns.length;
    const realizedVol = Number(Math.sqrt(varianceRet).toFixed(4));

    // Formula B: Exponentially Weighted Volatility (EWMA, lambda = 0.94)
    // sigma_t^2 = lambda * sigma_(t-1)^2 + (1-lambda) * return_t^2
    ewmaVariance = lambda * ewmaVariance + (1 - lambda) * Math.pow(logReturn, 2);
    const ewmaVol = Number(Math.sqrt(ewmaVariance).toFixed(4));

    // Formula C: GARCH(1,1) Forward-Looking Volatility Estimate
    // sigma_(t+1)^2 = omega + alpha * return_t^2 + beta * sigma_t^2
    garchVariance = omega + alphaGarch * Math.pow(logReturn, 2) + betaGarch * garchVariance;
    const garchVol = Number(Math.sqrt(garchVariance).toFixed(4));

    // Formula D: Parkinson High-Low Range Volatility
    // sigma^2 = (1 / (4 * ln 2)) * [ln(high/low)]^2
    const hlRatio = Math.log(Math.max(1.0001, step.highPrice / Math.max(1.0, step.lowPrice)));
    const parkinsonVar = (1 / (4 * Math.log(2))) * Math.pow(hlRatio, 2);
    const parkinsonVol = Number(Math.sqrt(parkinsonVar).toFixed(4));

    // Regime Shift Detection Trigger: Current EWMA vol > 2.0x baseline average vol
    const isVolElevated = ewmaVol > 2.0 * baseVolParam || step.isShockActive;

    // User Liquidity Indicators A, B, D
    const spread_t = Number((step.askPrice - step.bidPrice).toFixed(3));
    const relative_spread_t = Number((spread_t / step.midPrice).toFixed(6));
    const relativeSpreadBps = Number((relative_spread_t * 10000).toFixed(2));

    const bidSize = Math.round(step.marketVolume * 0.46);
    const askSize = Math.round(step.marketVolume * 0.54);
    const orderBookDepth = bidSize + askSize;

    const volumeLiquidityScore = Number((step.marketVolume / Math.max(1, avgMarketVolume)).toFixed(2));

    let liquidityStatus: 'HIGH' | 'MODERATE' | 'ILLIQUID' = 'HIGH';
    if (volumeLiquidityScore < 0.65 || relativeSpreadBps > 25.0 || isVolElevated) {
      liquidityStatus = 'ILLIQUID';
    } else if (volumeLiquidityScore < 0.95 || relativeSpreadBps > 15.0) {
      liquidityStatus = 'MODERATE';
    }

    return {
      interval: step.interval,
      timeLabel: step.timeLabel,
      midPrice: step.midPrice,
      bidPrice: step.bidPrice,
      askPrice: step.askPrice,
      highPrice: step.highPrice,
      lowPrice: step.lowPrice,
      logReturn,

      // Volatility Indicators A, B, C, D
      realizedVol,
      ewmaVol,
      garchVol,
      parkinsonVol,
      isVolElevated,

      // Liquidity Indicators A, B, D
      spread: spread_t,
      relativeSpread: relative_spread_t,
      relativeSpreadBps,
      bidSize,
      askSize,
      orderBookDepth,
      marketVolume: step.marketVolume,
      avgMarketVolume,
      volumeLiquidityScore,
      liquidityStatus,
      volatility: step.volatility,
      liquidityDepth: Math.round(orderBookDepth * 0.8),
      isShockActive: step.isShockActive,
    };
  });

  return { company, marketData };
}
