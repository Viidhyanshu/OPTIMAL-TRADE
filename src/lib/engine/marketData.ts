import { MarketIntervalData, OrderConfig } from './types';

/**
 * Geometric Brownian Motion generator with intraday U-shaped volume profile & user liquidity indicators
 */
export function generateMarketData(config: OrderConfig, seed: number = 42): MarketIntervalData[] {
  const N = config.totalIntervals;
  const basePrice = config.arrivalPrice;
  const avgDailyVolume = 500000;
  const avgVolPerInterval = Math.round(avgDailyVolume / N);
  const baseVolatility = 0.015;

  let s = seed % 2147483647;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  const data: MarketIntervalData[] = [];
  let currentPrice = basePrice;

  for (let i = 1; i <= N; i++) {
    const isShock = config.enableShock && i >= config.shockInterval;

    const currentVol = baseVolatility * (isShock ? config.shockVolatilityMultiplier : 1.0);
    const spreadBps = 5.0 * (isShock ? config.shockSpreadMultiplier : 1.0);

    const normT = (i - 1) / (N - 1);
    const uCurve = 1.0 + 0.8 * Math.cos(2 * Math.PI * (normT - 0.5));
    const marketVolume = Math.round(avgVolPerInterval * uCurve * (isShock ? (1.0 - config.shockLiquidityDrop) : 1.0) * (0.9 + 0.2 * rand()));

    const z = (rand() + rand() + rand() - 1.5) * 1.5;
    const priceMove = currentPrice * (currentVol * z / Math.sqrt(N));
    currentPrice = Math.max(1.0, currentPrice + priceMove);

    const midPrice = Number(currentPrice.toFixed(2));
    const spread_t = Number(((midPrice * spreadBps) / 10000).toFixed(3));
    const relative_spread_t = Number((spread_t / midPrice).toFixed(6));
    const relativeSpreadBps = Number((relative_spread_t * 10000).toFixed(2));

    const bidSize = Math.round(marketVolume * 0.45);
    const askSize = Math.round(marketVolume * 0.55);
    const orderBookDepth = bidSize + askSize;

    const volumeLiquidityScore = Number((marketVolume / Math.max(1, avgVolPerInterval)).toFixed(2));

    let liquidityStatus: 'HIGH' | 'MODERATE' | 'ILLIQUID' = 'HIGH';
    if (volumeLiquidityScore < 0.65 || relativeSpreadBps > 25.0 || isShock) {
      liquidityStatus = 'ILLIQUID';
    } else if (volumeLiquidityScore < 0.95 || relativeSpreadBps > 15.0) {
      liquidityStatus = 'MODERATE';
    }

    const startMinute = 15 + Math.floor(((i - 1) / N) * 375);
    const h = 9 + Math.floor(startMinute / 60);
    const m = startMinute % 60;
    const timeLabel = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} IST`;

    data.push({
      interval: i,
      timeLabel,
      midPrice,
      bidPrice: Number((midPrice - spread_t / 2).toFixed(2)),
      askPrice: Number((midPrice + spread_t / 2).toFixed(2)),
      spread: spread_t,
      relativeSpread: relative_spread_t,
      relativeSpreadBps,
      bidSize,
      askSize,
      orderBookDepth,
      marketVolume,
      avgMarketVolume: avgVolPerInterval,
      volumeLiquidityScore,
      liquidityStatus,
      volatility: Number(currentVol.toFixed(4)),
      liquidityDepth: Math.round(orderBookDepth * 0.8),
      isShockActive: isShock,
    });
  }

  return data;
}

export function calculateMarketVWAP(marketData: MarketIntervalData[]): number {
  let totalVolume = 0;
  let totalVolumePrice = 0;

  for (const m of marketData) {
    totalVolume += m.marketVolume;
    totalVolumePrice += m.midPrice * m.marketVolume;
  }

  return totalVolume > 0 ? Number((totalVolumePrice / totalVolume).toFixed(4)) : 0;
}
