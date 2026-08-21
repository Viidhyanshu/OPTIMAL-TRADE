import { MarketIntervalData, OrderConfig, ExecutionStep, StrategyResult, StrategyType } from './types';

/**
 * Calculates temporary and permanent market impact based on Almgren-Chriss formulation
 */
function calculateImpactCost(
  tradeQty: number,
  marketVolume: number,
  liquidityDepth: number,
  midPrice: number
): { temporaryImpact: number; permanentImpact: number } {
  if (tradeQty <= 0) return { temporaryImpact: 0, permanentImpact: 0 };
  
  const participationRate = Math.min(1.0, tradeQty / Math.max(1, marketVolume));
  const eta = 0.1;
  const temporaryImpact = midPrice * eta * Math.pow(participationRate, 0.6) * (100000 / Math.max(1000, liquidityDepth));
  const gamma = 0.02;
  const permanentImpact = midPrice * gamma * participationRate;

  return {
    temporaryImpact: Number(temporaryImpact.toFixed(4)),
    permanentImpact: Number(permanentImpact.toFixed(4)),
  };
}

/**
 * Strategy 1: Time-Weighted Average Price (TWAP)
 */
export function runTWAP(config: OrderConfig, marketData: MarketIntervalData[]): StrategyResult {
  const steps: ExecutionStep[] = [];
  const N = marketData.length;
  if (N === 0) return formatEmptyResult('TWAP', 'TWAP (Time-Weighted)', config);

  const sliceSize = config.totalQuantity / N;
  let remainingQuantity = config.totalQuantity;
  let totalExecutedQty = 0;
  let totalCashSpent = 0;
  let spreadCostTotal = 0;
  let impactCostTotal = 0;

  for (let i = 0; i < N; i++) {
    const market = marketData[i];
    if (!market) break;

    const targetQty = (i === N - 1) ? remainingQuantity : sliceSize;
    const executedQty = Math.min(remainingQuantity, Math.round(targetQty));
    
    remainingQuantity -= executedQty;
    totalExecutedQty += executedQty;

    const { temporaryImpact, permanentImpact } = calculateImpactCost(
      executedQty,
      market.marketVolume,
      market.liquidityDepth,
      market.midPrice
    );

    const halfSpread = market.spread / 2;
    const priceAdjustment = config.side === 'BUY'
      ? (halfSpread + temporaryImpact + permanentImpact)
      : -(halfSpread + temporaryImpact + permanentImpact);

    const execPrice = Number((market.midPrice + priceAdjustment).toFixed(4));
    
    const spreadCostStep = executedQty * halfSpread;
    const impactCostStep = executedQty * (temporaryImpact + permanentImpact);
    const totalStepCost = spreadCostStep + impactCostStep;

    spreadCostTotal += spreadCostStep;
    impactCostTotal += impactCostStep;
    totalCashSpent += executedQty * execPrice;

    const slippageBps = Number(
      ((config.side === 'BUY' ? (execPrice - config.arrivalPrice) : (config.arrivalPrice - execPrice)) / config.arrivalPrice * 10000).toFixed(2)
    );

    steps.push({
      interval: market.interval,
      timeLabel: market.timeLabel,
      strategy: 'TWAP',
      targetQuantity: Math.round(targetQty),
      executedQuantity: executedQty,
      remainingQuantity: Math.max(0, remainingQuantity),
      executionPrice: execPrice,
      spreadCost: Number(spreadCostStep.toFixed(2)),
      impactCost: Number(impactCostStep.toFixed(2)),
      totalStepCost: Number(totalStepCost.toFixed(2)),
      slippageBps,
      isShockActive: market.isShockActive,
    });
  }

  return formatStrategyResult('TWAP', 'TWAP (Time-Weighted)', steps, config, totalExecutedQty, totalCashSpent, spreadCostTotal, impactCostTotal);
}

/**
 * Strategy 2: Volume-Weighted Average Price (VWAP)
 */
export function runVWAP(config: OrderConfig, marketData: MarketIntervalData[]): StrategyResult {
  const steps: ExecutionStep[] = [];
  const N = marketData.length;
  if (N === 0) return formatEmptyResult('VWAP', 'VWAP (Volume-Weighted)', config);

  const totalMarketVol = marketData.reduce((acc, m) => acc + (m?.marketVolume || 0), 0);
  
  let remainingQuantity = config.totalQuantity;
  let totalExecutedQty = 0;
  let totalCashSpent = 0;
  let spreadCostTotal = 0;
  let impactCostTotal = 0;

  for (let i = 0; i < N; i++) {
    const market = marketData[i];
    if (!market) break;

    const volumeRatio = totalMarketVol > 0 ? market.marketVolume / totalMarketVol : 1 / N;
    const targetQty = (i === N - 1) ? remainingQuantity : config.totalQuantity * volumeRatio;
    const executedQty = Math.min(remainingQuantity, Math.round(targetQty));

    remainingQuantity -= executedQty;
    totalExecutedQty += executedQty;

    const { temporaryImpact, permanentImpact } = calculateImpactCost(
      executedQty,
      market.marketVolume,
      market.liquidityDepth,
      market.midPrice
    );

    const halfSpread = market.spread / 2;
    const priceAdjustment = config.side === 'BUY'
      ? (halfSpread + temporaryImpact + permanentImpact)
      : -(halfSpread + temporaryImpact + permanentImpact);

    const execPrice = Number((market.midPrice + priceAdjustment).toFixed(4));
    
    const spreadCostStep = executedQty * halfSpread;
    const impactCostStep = executedQty * (temporaryImpact + permanentImpact);
    const totalStepCost = spreadCostStep + impactCostStep;

    spreadCostTotal += spreadCostStep;
    impactCostTotal += impactCostStep;
    totalCashSpent += executedQty * execPrice;

    const slippageBps = Number(
      ((config.side === 'BUY' ? (execPrice - config.arrivalPrice) : (config.arrivalPrice - execPrice)) / config.arrivalPrice * 10000).toFixed(2)
    );

    steps.push({
      interval: market.interval,
      timeLabel: market.timeLabel,
      strategy: 'VWAP',
      targetQuantity: Math.round(targetQty),
      executedQuantity: executedQty,
      remainingQuantity: Math.max(0, remainingQuantity),
      executionPrice: execPrice,
      spreadCost: Number(spreadCostStep.toFixed(2)),
      impactCost: Number(impactCostStep.toFixed(2)),
      totalStepCost: Number(totalStepCost.toFixed(2)),
      slippageBps,
      isShockActive: market.isShockActive,
    });
  }

  return formatStrategyResult('VWAP', 'VWAP (Volume-Weighted)', steps, config, totalExecutedQty, totalCashSpent, spreadCostTotal, impactCostTotal);
}

/**
 * Strategy 3: Almgren-Chriss Optimal Execution
 */
export function runAlmgrenChriss(config: OrderConfig, marketData: MarketIntervalData[]): StrategyResult {
  const steps: ExecutionStep[] = [];
  const N = marketData.length;
  if (N === 0) return formatEmptyResult('ALMGREN_CHRISS', 'Almgren-Chriss Optimal', config);
  
  const lambda = config.riskAversion;
  const sigma = 0.02;
  const eta = 1e-6;
  
  const kappa = Math.sqrt(Math.max(1e-6, (lambda * Math.pow(sigma, 2)) / eta));

  const inventoryTrajectory: number[] = [];
  for (let j = 0; j <= N; j++) {
    const t = j;
    const T = N;
    const num = Math.sinh(Math.min(20, kappa * (T - t)));
    const den = Math.sinh(Math.min(20, kappa * T));
    const ratio = den > 0 ? num / den : (1 - j / N);
    inventoryTrajectory.push(config.totalQuantity * ratio);
  }

  let remainingQuantity = config.totalQuantity;
  let totalExecutedQty = 0;
  let totalCashSpent = 0;
  let spreadCostTotal = 0;
  let impactCostTotal = 0;

  for (let i = 0; i < N; i++) {
    const market = marketData[i];
    if (!market) break;

    const targetQty = (i === N - 1) ? remainingQuantity : (inventoryTrajectory[i] - inventoryTrajectory[i + 1]);
    const executedQty = Math.min(remainingQuantity, Math.max(0, Math.round(targetQty)));

    remainingQuantity -= executedQty;
    totalExecutedQty += executedQty;

    const { temporaryImpact, permanentImpact } = calculateImpactCost(
      executedQty,
      market.marketVolume,
      market.liquidityDepth,
      market.midPrice
    );

    const halfSpread = market.spread / 2;
    const priceAdjustment = config.side === 'BUY'
      ? (halfSpread + temporaryImpact + permanentImpact)
      : -(halfSpread + temporaryImpact + permanentImpact);

    const execPrice = Number((market.midPrice + priceAdjustment).toFixed(4));
    
    const spreadCostStep = executedQty * halfSpread;
    const impactCostStep = executedQty * (temporaryImpact + permanentImpact);
    const totalStepCost = spreadCostStep + impactCostStep;

    spreadCostTotal += spreadCostStep;
    impactCostTotal += impactCostStep;
    totalCashSpent += executedQty * execPrice;

    const slippageBps = Number(
      ((config.side === 'BUY' ? (execPrice - config.arrivalPrice) : (config.arrivalPrice - execPrice)) / config.arrivalPrice * 10000).toFixed(2)
    );

    steps.push({
      interval: market.interval,
      timeLabel: market.timeLabel,
      strategy: 'ALMGREN_CHRISS',
      targetQuantity: Math.round(targetQty),
      executedQuantity: executedQty,
      remainingQuantity: Math.max(0, remainingQuantity),
      executionPrice: execPrice,
      spreadCost: Number(spreadCostStep.toFixed(2)),
      impactCost: Number(impactCostStep.toFixed(2)),
      totalStepCost: Number(totalStepCost.toFixed(2)),
      slippageBps,
      isShockActive: market.isShockActive,
    });
  }

  return formatStrategyResult('ALMGREN_CHRISS', 'Almgren-Chriss Optimal', steps, config, totalExecutedQty, totalCashSpent, spreadCostTotal, impactCostTotal);
}

/**
 * Strategy 4: Dynamic Adaptive Execution
 */
export function runDynamicAdaptive(config: OrderConfig, marketData: MarketIntervalData[]): StrategyResult {
  const steps: ExecutionStep[] = [];
  const N = marketData.length;
  if (N === 0) return formatEmptyResult('DYNAMIC_ADAPTIVE', 'Dynamic Adaptive Execution', config);
  
  let remainingQuantity = config.totalQuantity;
  let totalExecutedQty = 0;
  let totalCashSpent = 0;
  let spreadCostTotal = 0;
  let impactCostTotal = 0;

  const baselineSpread = marketData[0]?.spread || 0.1;
  const baselineVol = marketData[0]?.volatility || 0.015;

  for (let i = 0; i < N; i++) {
    const market = marketData[i];
    if (!market) break;

    const intervalsRemaining = Math.max(1, N - i);

    const spreadRatio = market.spread / Math.max(0.001, baselineSpread);
    const volRatio = market.volatility / Math.max(0.001, baselineVol);

    let adaptiveMultiplier = 1.0;
    if (market.isShockActive) {
      if (spreadRatio > 2.0 && volRatio > 2.0) {
        adaptiveMultiplier = 0.55;
      } else if (volRatio > 1.8) {
        adaptiveMultiplier = 1.35;
      }
    }

    const baseSlice = remainingQuantity / intervalsRemaining;
    const targetQty = (i === N - 1) ? remainingQuantity : baseSlice * adaptiveMultiplier;
    const executedQty = Math.min(remainingQuantity, Math.max(1, Math.round(targetQty)));

    remainingQuantity -= executedQty;
    totalExecutedQty += executedQty;

    const { temporaryImpact, permanentImpact } = calculateImpactCost(
      executedQty,
      market.marketVolume,
      market.liquidityDepth,
      market.midPrice
    );

    const halfSpread = market.spread / 2;
    const priceAdjustment = config.side === 'BUY'
      ? (halfSpread + temporaryImpact + permanentImpact)
      : -(halfSpread + temporaryImpact + permanentImpact);

    const execPrice = Number((market.midPrice + priceAdjustment).toFixed(4));
    
    const spreadCostStep = executedQty * halfSpread;
    const impactCostStep = executedQty * (temporaryImpact + permanentImpact);
    const totalStepCost = spreadCostStep + impactCostStep;

    spreadCostTotal += spreadCostStep;
    impactCostTotal += impactCostStep;
    totalCashSpent += executedQty * execPrice;

    const slippageBps = Number(
      ((config.side === 'BUY' ? (execPrice - config.arrivalPrice) : (config.arrivalPrice - execPrice)) / config.arrivalPrice * 10000).toFixed(2)
    );

    steps.push({
      interval: market.interval,
      timeLabel: market.timeLabel,
      strategy: 'DYNAMIC_ADAPTIVE',
      targetQuantity: Math.round(targetQty),
      executedQuantity: executedQty,
      remainingQuantity: Math.max(0, remainingQuantity),
      executionPrice: execPrice,
      spreadCost: Number(spreadCostStep.toFixed(2)),
      impactCost: Number(impactCostStep.toFixed(2)),
      totalStepCost: Number(totalStepCost.toFixed(2)),
      slippageBps,
      isShockActive: market.isShockActive,
    });
  }

  return formatStrategyResult('DYNAMIC_ADAPTIVE', 'Dynamic Adaptive Execution', steps, config, totalExecutedQty, totalCashSpent, spreadCostTotal, impactCostTotal);
}

function formatEmptyResult(strategy: StrategyType, strategyName: string, config: OrderConfig): StrategyResult {
  return {
    strategy,
    strategyName,
    steps: [],
    totalExecutedQuantity: 0,
    avgExecutionPrice: config.arrivalPrice,
    implementationShortfall: 0,
    implementationShortfallBps: 0,
    spreadCostTotal: 0,
    impactCostTotal: 0,
    vwapDeviationBps: 0,
    costVariance: 0,
    fillRate: 0,
    sharpeRatio: 0,
  };
}

function formatStrategyResult(
  strategy: StrategyType,
  strategyName: string,
  steps: ExecutionStep[],
  config: OrderConfig,
  totalExecutedQuantity: number,
  totalCashSpent: number,
  spreadCostTotal: number,
  impactCostTotal: number
): StrategyResult {
  const avgExecutionPrice = totalExecutedQuantity > 0 ? Number((totalCashSpent / totalExecutedQuantity).toFixed(4)) : config.arrivalPrice;
  
  const sideMultiplier = config.side === 'BUY' ? 1 : -1;
  const implementationShortfall = sideMultiplier * (avgExecutionPrice - config.arrivalPrice) * config.totalQuantity;
  const implementationShortfallBps = (implementationShortfall / (config.arrivalPrice * config.totalQuantity)) * 10000;

  const costs = steps.map(s => s.totalStepCost);
  const meanCost = costs.length > 0 ? costs.reduce((a, b) => a + b, 0) / costs.length : 0;
  const variance = costs.length > 0 ? costs.reduce((a, b) => a + Math.pow(b - meanCost, 2), 0) / costs.length : 0;

  const fillRate = (totalExecutedQuantity / config.totalQuantity) * 100;
  const sharpeRatio = Math.max(0, 3.5 - (implementationShortfallBps / 20));

  return {
    strategy,
    strategyName,
    steps,
    totalExecutedQuantity,
    avgExecutionPrice,
    implementationShortfall: Number(implementationShortfall.toFixed(2)),
    implementationShortfallBps: Number(implementationShortfallBps.toFixed(2)),
    spreadCostTotal: Number(spreadCostTotal.toFixed(2)),
    impactCostTotal: Number(impactCostTotal.toFixed(2)),
    vwapDeviationBps: Number((implementationShortfallBps * 0.7).toFixed(2)),
    costVariance: Number(variance.toFixed(2)),
    fillRate: Number(fillRate.toFixed(1)),
    sharpeRatio: Number(sharpeRatio.toFixed(2)),
  };
}
