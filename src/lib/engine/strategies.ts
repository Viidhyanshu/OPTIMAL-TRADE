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
  
  // Participation rate = tradeQty / marketVolume
  const participationRate = Math.min(1.0, tradeQty / Math.max(1, marketVolume));
  
  // Temporary Impact (Power law model: eta * (q/V)^alpha)
  // Higher participation rate leads to superlinear temporary impact
  const eta = 0.1;
  const temporaryImpact = midPrice * eta * Math.pow(participationRate, 0.6) * (100000 / Math.max(1000, liquidityDepth));
  
  // Permanent Impact (Linear model: gamma * q)
  const gamma = 0.02;
  const permanentImpact = midPrice * gamma * participationRate;

  return {
    temporaryImpact: Number(temporaryImpact.toFixed(4)),
    permanentImpact: Number(permanentImpact.toFixed(4)),
  };
}

/**
 * Strategy 1: Time-Weighted Average Price (TWAP)
 * Uniform order distribution across time slices
 */
export function runTWAP(config: OrderConfig, marketData: MarketIntervalData[]): StrategyResult {
  const steps: ExecutionStep[] = [];
  const N = config.totalIntervals;
  const sliceSize = config.totalQuantity / N;
  let remainingQuantity = config.totalQuantity;

  let totalExecutedQty = 0;
  let totalCashSpent = 0;
  let spreadCostTotal = 0;
  let impactCostTotal = 0;

  for (let i = 0; i < N; i++) {
    const market = marketData[i];
    const targetQty = (i === N - 1) ? remainingQuantity : sliceSize;
    const executedQty = Math.min(remainingQuantity, Math.round(targetQty));
    
    remainingQuantity -= executedQty;
    totalExecutedQty += executedQty;

    // Market impact & execution price
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
 * Slices proportional to expected historical volume profile
 */
export function runVWAP(config: OrderConfig, marketData: MarketIntervalData[]): StrategyResult {
  const steps: ExecutionStep[] = [];
  const N = config.totalIntervals;
  const totalMarketVol = marketData.reduce((acc, m) => acc + m.marketVolume, 0);
  
  let remainingQuantity = config.totalQuantity;
  let totalExecutedQty = 0;
  let totalCashSpent = 0;
  let spreadCostTotal = 0;
  let impactCostTotal = 0;

  for (let i = 0; i < N; i++) {
    const market = marketData[i];
    const volumeRatio = market.marketVolume / totalMarketVol;
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
 * Balances market impact against risk aversion parameter lambda
 */
export function runAlmgrenChriss(config: OrderConfig, marketData: MarketIntervalData[]): StrategyResult {
  const steps: ExecutionStep[] = [];
  const N = config.totalIntervals;
  
  // Almgren-Chriss kappa = sqrt(lambda * sigma^2 / eta)
  const lambda = config.riskAversion;
  const sigma = 0.02; // Average volatility
  const eta = 1e-6;   // Temporary impact coefficient
  
  const kappa = Math.sqrt(Math.max(1e-6, (lambda * Math.pow(sigma, 2)) / eta));

  // Closed form trajectory: x(t) = Q * sinh(kappa*(T - t)) / sinh(kappa*T)
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
 * Strategy 4: Dynamic Adaptive Execution (Flagship Solution)
 * Dynamically recalibrates order sizing at every interval based on live market shock,
 * liquidity contraction, and volatility spikes.
 */
export function runDynamicAdaptive(config: OrderConfig, marketData: MarketIntervalData[]): StrategyResult {
  const steps: ExecutionStep[] = [];
  const N = config.totalIntervals;
  
  let remainingQuantity = config.totalQuantity;
  let totalExecutedQty = 0;
  let totalCashSpent = 0;
  let spreadCostTotal = 0;
  let impactCostTotal = 0;

  const baselineSpread = marketData[0].spread;
  const baselineVol = marketData[0].volatility;

  for (let i = 0; i < N; i++) {
    const market = marketData[i];
    const intervalsRemaining = N - i;

    // Detect live regime shift indicators
    const spreadRatio = market.spread / Math.max(0.001, baselineSpread);
    const volRatio = market.volatility / Math.max(0.001, baselineVol);

    // Adaptive Slicing Factor:
    // When spread is extremely wide (shock hit), throttle volume temporarily to avoid paying massive spread/impact
    // If volatility is high but spread is moderate, accelerate to avoid inventory risk.
    let adaptiveMultiplier = 1.0;

    if (market.isShockActive) {
      if (spreadRatio > 2.0 && volRatio > 2.0) {
        // Severe shock: throttle to 50% during the initial shock spike to avoid peak impact
        adaptiveMultiplier = 0.55;
      } else if (volRatio > 1.8) {
        // High volatility post-shock recovery: accelerate execution to reduce inventory risk
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

/**
 * Format and summarize execution performance metrics
 */
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
  
  // Implementation Shortfall IS = Side * (AvgExecPrice - ArrivalPrice) * Q
  const sideMultiplier = config.side === 'BUY' ? 1 : -1;
  const implementationShortfall = sideMultiplier * (avgExecutionPrice - config.arrivalPrice) * config.totalQuantity;
  const implementationShortfallBps = (implementationShortfall / (config.arrivalPrice * config.totalQuantity)) * 10000;

  // Calculate cost variance across steps
  const costs = steps.map(s => s.totalStepCost);
  const meanCost = costs.reduce((a, b) => a + b, 0) / costs.length;
  const variance = costs.reduce((a, b) => a + Math.pow(b - meanCost, 2), 0) / costs.length;

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
