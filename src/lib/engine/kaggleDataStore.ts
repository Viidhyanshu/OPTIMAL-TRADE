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

  // Determine interval count and time labels based on timeframe
  let intervalsCount = 30;
  let labelPrefix = '';

  switch (timeframe) {
    case '1D':
      intervalsCount = 30; // 30 intraday intervals (09:15 - 15:30 IST)
      break;
    case '7D':
      intervalsCount = 28; // 4 intervals per day for 7 trading days
      break;
    case '1M':
      intervalsCount = 30; // 30 daily records
      break;
    case '1Y':
      intervalsCount = 32; // 32 weekly snapshot records
      break;
  }

  const marketData: MarketIntervalData[] = [];
  let currentPrice = company.basePrice;

  // Pseudo-random deterministic walk for Kaggle time-series records
  let s = (symbol.charCodeAt(0) * 100 + timeframe.charCodeAt(0)) % 2147483647;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  const volatility = timeframe === '1D' ? 0.012 : timeframe === '7D' ? 0.025 : timeframe === '1M' ? 0.045 : 0.085;

  for (let i = 1; i <= intervalsCount; i++) {
    const isShock = config.enableShock && i >= Math.floor(intervalsCount / 2);

    const currentVol = volatility * (isShock ? config.shockVolatilityMultiplier : 1.0);
    const spreadBps = 4.0 * (isShock ? config.shockSpreadMultiplier : 1.0);

    // Intraday volume curve
    const normT = (i - 1) / (intervalsCount - 1);
    const uCurve = 1.0 + 0.75 * Math.cos(2 * Math.PI * (normT - 0.5));
    const marketVolume = Math.round((company.volume / intervalsCount) * uCurve * (isShock ? 0.65 : 1.0) * (0.9 + 0.2 * rand()));

    // Random walk with drift
    const z = (rand() + rand() + rand() - 1.5) * 1.6;
    const priceMove = currentPrice * (currentVol * z / Math.sqrt(intervalsCount));
    currentPrice = Math.max(10.0, currentPrice + priceMove);

    const spread = Number(((currentPrice * spreadBps) / 10000).toFixed(2));
    const midPrice = Number(currentPrice.toFixed(2));

    // Time Label generation based on selected timeframe
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

    marketData.push({
      interval: i,
      timeLabel,
      midPrice,
      bidPrice: Number((midPrice - spread / 2).toFixed(2)),
      askPrice: Number((midPrice + spread / 2).toFixed(2)),
      spread,
      marketVolume,
      volatility: Number(currentVol.toFixed(4)),
      liquidityDepth: Math.round(marketVolume * 1.6),
      isShockActive: isShock,
    });
  }

  return { company, marketData };
}
