import { MarketIntervalData, OrderConfig } from './types';

export interface IndianStockMetadata {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  basePrice: number; // In INR (₹)
  avgDailyVolume: number;
  volatility: number;
  baseSpreadBps: number;
  sector: string;
}

export const INDIAN_STOCKS_PRESETS: IndianStockMetadata[] = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    exchange: 'NSE',
    basePrice: 3050.00,
    avgDailyVolume: 6500000,
    volatility: 0.014,
    baseSpreadBps: 4.5,
    sector: 'Energy & Conglomerate',
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd.',
    exchange: 'NSE',
    basePrice: 4250.00,
    avgDailyVolume: 2800000,
    volatility: 0.012,
    baseSpreadBps: 3.8,
    sector: 'Information Technology',
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    exchange: 'NSE',
    basePrice: 1680.00,
    avgDailyVolume: 12000000,
    volatility: 0.015,
    baseSpreadBps: 4.0,
    sector: 'Banking & Financial Services',
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd.',
    exchange: 'NSE',
    basePrice: 1860.00,
    avgDailyVolume: 4500000,
    volatility: 0.016,
    baseSpreadBps: 4.2,
    sector: 'Information Technology',
  },
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd.',
    exchange: 'NSE',
    basePrice: 1090.00,
    avgDailyVolume: 8500000,
    volatility: 0.022,
    baseSpreadBps: 6.0,
    sector: 'Automobile',
  },
  {
    symbol: 'NIFTY50',
    name: 'NIFTY 50 Index Benchmark',
    exchange: 'NSE',
    basePrice: 24500.00,
    avgDailyVolume: 25000000,
    volatility: 0.010,
    baseSpreadBps: 2.5,
    sector: 'Index Benchmark',
  },
];

/**
 * Generate Kaggle-format Indian Stock Market Intraday Data
 */
export function generateIndianStockData(
  stockSymbol: string,
  config: OrderConfig,
  seed: number = 42
): MarketIntervalData[] {
  const stock = INDIAN_STOCKS_PRESETS.find((s) => s.symbol === stockSymbol) || INDIAN_STOCKS_PRESETS[0];
  const N = config.totalIntervals;
  
  // Seeded random walk generator for Kaggle simulation
  let s = seed % 2147483647;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  const data: MarketIntervalData[] = [];
  let currentPrice = stock.basePrice;

  // Indian Stock Market Trading Hours: 09:15 IST to 15:30 IST
  const startHour = 9;
  const startMinute = 15;
  const totalTradingMinutes = 375; // 6 hours 15 minutes

  for (let i = 1; i <= N; i++) {
    const isShock = config.enableShock && i >= config.shockInterval;

    const currentVol = stock.volatility * (isShock ? config.shockVolatilityMultiplier : 1.0);
    const currentLiquidity = (stock.avgDailyVolume / N) * (isShock ? (1.0 - config.shockLiquidityDrop) : 1.0);
    const spreadBps = stock.baseSpreadBps * (isShock ? config.shockSpreadMultiplier : 1.0);

    // Indian Market U-shaped Intraday Volume Curve (High at 09:15 open & 15:30 close)
    const normT = (i - 1) / (N - 1);
    const uCurve = 1.0 + 0.85 * Math.cos(2 * Math.PI * (normT - 0.5));
    const marketVolume = Math.round((stock.avgDailyVolume / N) * uCurve * (0.9 + 0.2 * rand()));

    // Arithmetic Brownian random return in INR (₹)
    const z = (rand() + rand() + rand() - 1.5) * 1.5;
    const priceMove = currentPrice * (currentVol * z / Math.sqrt(N));
    currentPrice = Math.max(10.0, currentPrice + priceMove);

    const spread = (currentPrice * spreadBps) / 10000;
    const midPrice = Number(currentPrice.toFixed(2));

    // Calculate Indian Standard Time (IST) timestamp
    const minsFromStart = Math.floor((i - 1) / N * totalTradingMinutes);
    const totalMins = startMinute + minsFromStart;
    const h = startHour + Math.floor(totalMins / 60);
    const m = totalMins % 60;
    const timeLabel = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

    data.push({
      interval: i,
      timeLabel: `${timeLabel} IST`,
      midPrice,
      bidPrice: Number((midPrice - spread / 2).toFixed(2)),
      askPrice: Number((midPrice + spread / 2).toFixed(2)),
      spread: Number(spread.toFixed(2)),
      marketVolume,
      volatility: Number(currentVol.toFixed(4)),
      liquidityDepth: Math.round(currentLiquidity),
      isShockActive: isShock,
    });
  }

  return data;
}

/**
 * Kaggle CSV Parser: Parse uploaded Kaggle Indian Stock Market CSV
 */
export function parseKaggleCSV(csvText: string): MarketIntervalData[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].toLowerCase().split(',').map((h) => h.trim());
  
  // Find column indices
  const priceIdx = headers.findIndex((h) => h.includes('close') || h.includes('price') || h.includes('mid') || h.includes('trade'));
  const volumeIdx = headers.findIndex((h) => h.includes('volume') || h.includes('qty') || h.includes('trades'));
  const timeIdx = headers.findIndex((h) => h.includes('date') || h.includes('time') || h.includes('timestamp'));
  const spreadIdx = headers.findIndex((h) => h.includes('spread'));

  const parsed: MarketIntervalData[] = [];
  const totalRows = Math.min(60, lines.length - 1);

  for (let i = 1; i <= totalRows; i++) {
    const row = lines[i].split(',').map((cell) => cell.trim());
    if (row.length < 2) continue;

    const midPrice = priceIdx !== -1 && !isNaN(Number(row[priceIdx])) ? Number(row[priceIdx]) : 1500.00;
    const marketVolume = volumeIdx !== -1 && !isNaN(Number(row[volumeIdx])) ? Math.round(Number(row[volumeIdx])) : 250000;
    const timeLabel = timeIdx !== -1 ? row[timeIdx].slice(-8) : `Step ${i}`;
    const spread = spreadIdx !== -1 && !isNaN(Number(row[spreadIdx])) ? Number(row[spreadIdx]) : Number((midPrice * 0.0005).toFixed(2));

    parsed.push({
      interval: i,
      timeLabel,
      midPrice: Number(midPrice.toFixed(2)),
      bidPrice: Number((midPrice - spread / 2).toFixed(2)),
      askPrice: Number((midPrice + spread / 2).toFixed(2)),
      spread,
      marketVolume,
      volatility: 0.015,
      liquidityDepth: marketVolume * 2,
      isShockActive: false,
    });
  }

  return parsed;
}
