import { MarketIntervalData, OrderConfig } from './types';

// Pseudo-random seed generator for deterministic yet realistic simulations
function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Box-Muller transform for Gaussian random numbers
function randomGaussian(randFn: () => number): number {
  let u = 0, v = 0;
  while (u === 0) u = randFn();
  while (v === 0) v = randFn();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function generateMarketData(config: OrderConfig, seed: number = 42): MarketIntervalData[] {
  const rand = seededRandom(seed);
  const data: MarketIntervalData[] = [];
  
  const N = config.totalIntervals;
  const initialPrice = config.arrivalPrice;
  const baseVolatility = 0.015; // 1.5% annual volatility per slice
  const baseSpread = initialPrice * 0.0005; // 5 bps initial spread
  const baseLiquidity = 250000; // Base market depth

  let currentPrice = initialPrice;

  // Generate 30 intervals simulating a 6.5 hour trading day (approx 13-min slices)
  const startHour = 9;
  const startMinute = 30;

  for (let i = 1; i <= N; i++) {
    // Check if shock is active
    const isShock = config.enableShock && i >= config.shockInterval;

    // Volatility and Liquidity adjustments
    const currentVol = baseVolatility * (isShock ? config.shockVolatilityMultiplier : 1.0);
    const currentLiquidity = baseLiquidity * (isShock ? (1.0 - config.shockLiquidityDrop) : 1.0);
    const currentSpreadMultiplier = isShock ? config.shockSpreadMultiplier : 1.0;

    // U-shaped intraday volume profile: V(t) = Base * (1 + 0.7 * cos(2*pi*(t - N/2)/N))
    const normalizedTime = (i - 1) / (N - 1);
    const uCurve = 1.0 + 0.7 * Math.cos(2 * Math.PI * (normalizedTime - 0.5));
    const marketVolume = Math.round(50000 * uCurve * (isShock ? 0.6 : 1.0) * (0.9 + 0.2 * rand()));

    // Random walk with drift and jump during shock
    const shockJump = (isShock && i === config.shockInterval) ? (config.side === 'BUY' ? 0.012 : -0.012) : 0;
    const returnZ = randomGaussian(rand);
    const priceChange = currentPrice * (currentVol * returnZ / Math.sqrt(N) + shockJump);
    
    currentPrice = Math.max(1.0, currentPrice + priceChange);

    // Bid-Ask Spread calculation
    const spreadNoise = (rand() - 0.5) * 0.2 * baseSpread;
    const spread = Math.max(0.01, baseSpread * currentSpreadMultiplier + spreadNoise);
    const bidPrice = Number((currentPrice - spread / 2).toFixed(4));
    const askPrice = Number((currentPrice + spread / 2).toFixed(4));
    const midPrice = Number(currentPrice.toFixed(4));

    // Time label calculation
    const totalMinutesFromStart = Math.floor(((i - 1) / N) * 390); // 390 mins in trading day
    const minuteVal = startMinute + totalMinutesFromStart;
    const h = startHour + Math.floor(minuteVal / 60);
    const m = minuteVal % 60;
    const timeLabel = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

    data.push({
      interval: i,
      timeLabel,
      midPrice,
      bidPrice,
      askPrice,
      spread: Number(spread.toFixed(4)),
      marketVolume,
      volatility: Number(currentVol.toFixed(4)),
      liquidityDepth: Math.round(currentLiquidity),
      isShockActive: isShock,
    });
  }

  return data;
}

export function calculateMarketVWAP(data: MarketIntervalData[]): number {
  let totalPV = 0;
  let totalV = 0;
  for (const d of data) {
    totalPV += d.midPrice * d.marketVolume;
    totalV += d.marketVolume;
  }
  return totalV > 0 ? Number((totalPV / totalV).toFixed(4)) : 0;
}
