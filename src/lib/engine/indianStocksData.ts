import { MarketIntervalData, OrderConfig } from './types';

export interface IndianStockMetadata {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  basePrice: number;
  avgDailyVolume: number;
  volatility: number;
  baseSpreadBps: number;
  sector: string;
}

export const INDIAN_STOCKS_PRESETS: IndianStockMetadata[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', exchange: 'NSE', basePrice: 3050.00, avgDailyVolume: 6500000, volatility: 0.014, baseSpreadBps: 4.5, sector: 'Energy & Conglomerate' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', exchange: 'NSE', basePrice: 4250.00, avgDailyVolume: 2800000, volatility: 0.012, baseSpreadBps: 3.8, sector: 'Information Technology' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', exchange: 'NSE', basePrice: 1680.00, avgDailyVolume: 12000000, volatility: 0.015, baseSpreadBps: 4.0, sector: 'Banking & Financial Services' },
  { symbol: 'INFY', name: 'Infosys Ltd.', exchange: 'NSE', basePrice: 1860.00, avgDailyVolume: 4500000, volatility: 0.016, baseSpreadBps: 4.2, sector: 'Information Technology' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', exchange: 'NSE', basePrice: 1090.00, avgDailyVolume: 8500000, volatility: 0.022, baseSpreadBps: 6.0, sector: 'Automobile' },
  { symbol: 'NIFTY50', name: 'NIFTY 50 Index Benchmark', exchange: 'NSE', basePrice: 24500.00, avgDailyVolume: 25000000, volatility: 0.010, baseSpreadBps: 2.5, sector: 'Index Benchmark' },
];

export function generateIndianStockData(
  stockSymbol: string,
  config: OrderConfig,
  seed: number = 42
): MarketIntervalData[] {
  const stock = INDIAN_STOCKS_PRESETS.find((s) => s.symbol === stockSymbol) || INDIAN_STOCKS_PRESETS[0];
  const N = config.totalIntervals;
  
  let s = seed % 2147483647;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  const data: MarketIntervalData[] = [];
  let currentPrice = stock.basePrice;
  const avgVol = Math.round(stock.avgDailyVolume / N);

  for (let i = 1; i <= N; i++) {
    const isShock = config.enableShock && i >= config.shockInterval;
    const currentVol = stock.volatility * (isShock ? config.shockVolatilityMultiplier : 1.0);
    const spreadBps = stock.baseSpreadBps * (isShock ? config.shockSpreadMultiplier : 1.0);

    const normT = (i - 1) / (N - 1);
    const uCurve = 1.0 + 0.85 * Math.cos(2 * Math.PI * (normT - 0.5));
    const marketVolume = Math.round(avgVol * uCurve * (0.9 + 0.2 * rand()));

    const z = (rand() + rand() + rand() - 1.5) * 1.5;
    const priceMove = currentPrice * (currentVol * z / Math.sqrt(N));
    currentPrice = Math.max(10.0, currentPrice + priceMove);

    const midPrice = Number(currentPrice.toFixed(2));
    const highPrice = Number((midPrice * 1.004).toFixed(2));
    const lowPrice = Number((midPrice * 0.996).toFixed(2));

    const spread_t = Number(((midPrice * spreadBps) / 10000).toFixed(3));
    const relative_spread_t = Number((spread_t / midPrice).toFixed(6));
    const relativeSpreadBps = Number((relative_spread_t * 10000).toFixed(2));

    const bidSize = Math.round(marketVolume * 0.45);
    const askSize = Math.round(marketVolume * 0.55);
    const orderBookDepth = bidSize + askSize;

    const volumeLiquidityScore = Number((marketVolume / Math.max(1, avgVol)).toFixed(2));
    let liquidityStatus: 'HIGH' | 'MODERATE' | 'ILLIQUID' = 'HIGH';
    if (volumeLiquidityScore < 0.65 || relativeSpreadBps > 25.0 || isShock) {
      liquidityStatus = 'ILLIQUID';
    } else if (volumeLiquidityScore < 0.95 || relativeSpreadBps > 15.0) {
      liquidityStatus = 'MODERATE';
    }

    data.push({
      interval: i,
      timeLabel: `Interval #${i}`,
      midPrice,
      bidPrice: Number((midPrice - spread_t / 2).toFixed(2)),
      askPrice: Number((midPrice + spread_t / 2).toFixed(2)),
      highPrice,
      lowPrice,
      logReturn: 0.001,
      realizedVol: Number(currentVol.toFixed(4)),
      ewmaVol: Number((currentVol * 1.05).toFixed(4)),
      garchVol: Number((currentVol * 1.08).toFixed(4)),
      parkinsonVol: Number((currentVol * 0.95).toFixed(4)),
      isVolElevated: isShock,
      spread: spread_t,
      relativeSpread: relative_spread_t,
      relativeSpreadBps,
      bidSize,
      askSize,
      orderBookDepth,
      marketVolume,
      avgMarketVolume: avgVol,
      volumeLiquidityScore,
      liquidityStatus,
      volatility: Number(currentVol.toFixed(4)),
      liquidityDepth: Math.round(orderBookDepth * 0.8),
      isShockActive: isShock,
    });
  }

  return data;
}

export function parseKaggleCSV(csvText: string): MarketIntervalData[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].toLowerCase().split(',').map((h) => h.trim());
  const priceIdx = headers.findIndex((h) => h.includes('close') || h.includes('price'));
  const volumeIdx = headers.findIndex((h) => h.includes('volume') || h.includes('qty'));

  const parsed: MarketIntervalData[] = [];
  const totalRows = Math.min(60, lines.length - 1);

  for (let i = 1; i <= totalRows; i++) {
    const row = lines[i].split(',').map((cell) => cell.trim());
    if (row.length < 2) continue;

    const midPrice = priceIdx !== -1 && !isNaN(Number(row[priceIdx])) ? Number(row[priceIdx]) : 1500.00;
    const marketVolume = volumeIdx !== -1 && !isNaN(Number(row[volumeIdx])) ? Math.round(Number(row[volumeIdx])) : 250000;

    const spread_t = Number((midPrice * 0.0005).toFixed(3));
    const relative_spread_t = Number((spread_t / midPrice).toFixed(6));

    parsed.push({
      interval: i,
      timeLabel: `Step ${i}`,
      midPrice: Number(midPrice.toFixed(2)),
      bidPrice: Number((midPrice - spread_t / 2).toFixed(2)),
      askPrice: Number((midPrice + spread_t / 2).toFixed(2)),
      highPrice: Number((midPrice * 1.003).toFixed(2)),
      lowPrice: Number((midPrice * 0.997).toFixed(2)),
      logReturn: 0.001,
      realizedVol: 0.015,
      ewmaVol: 0.016,
      garchVol: 0.017,
      parkinsonVol: 0.014,
      isVolElevated: false,
      spread: spread_t,
      relativeSpread: relative_spread_t,
      relativeSpreadBps: 5.0,
      bidSize: Math.round(marketVolume * 0.45),
      askSize: Math.round(marketVolume * 0.55),
      orderBookDepth: marketVolume,
      marketVolume,
      avgMarketVolume: marketVolume,
      volumeLiquidityScore: 1.0,
      liquidityStatus: 'HIGH',
      volatility: 0.015,
      liquidityDepth: Math.round(marketVolume * 0.8),
      isShockActive: false,
    });
  }

  return parsed;
}
