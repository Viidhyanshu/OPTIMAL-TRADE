export type OrderSide = 'BUY' | 'SELL';

export type StrategyType = 'TWAP' | 'VWAP' | 'ALMGREN_CHRISS' | 'DYNAMIC_ADAPTIVE';

export interface OrderConfig {
  symbol: string;
  side: OrderSide;
  totalQuantity: number;
  totalIntervals: number; // e.g. 30 time slices
  riskAversion: number;   // lambda (0.0001 to 0.1)
  arrivalPrice: number;   // P0 e.g. 150.00
  enableShock: boolean;   // Mid-way market condition change toggle
  shockInterval: number; // Interval index where shock hits (e.g. 15)
  shockVolatilityMultiplier: number; // Volatility jump (e.g. 3.0x)
  shockLiquidityDrop: number;        // Liquidity drop (e.g. 0.6 = 60% drop)
  shockSpreadMultiplier: number;     // Spread widening (e.g. 2.5x)
}

export interface MarketIntervalData {
  interval: number;
  timeLabel: string;
  midPrice: number;
  bidPrice: number;
  askPrice: number;
  spread: number;
  marketVolume: number;
  volatility: number;
  liquidityDepth: number; // Shares available per $1 price move
  isShockActive: boolean;
}

export interface ExecutionStep {
  interval: number;
  timeLabel: string;
  strategy: StrategyType;
  targetQuantity: number;
  executedQuantity: number;
  remainingQuantity: number;
  executionPrice: number;
  spreadCost: number;
  impactCost: number;
  totalStepCost: number;
  slippageBps: number;
  isShockActive: boolean;
}

export interface StrategyResult {
  strategy: StrategyType;
  strategyName: string;
  steps: ExecutionStep[];
  totalExecutedQuantity: number;
  avgExecutionPrice: number;
  implementationShortfall: number; // In currency ($)
  implementationShortfallBps: number; // In basis points
  spreadCostTotal: number;
  impactCostTotal: number;
  vwapDeviationBps: number;
  costVariance: number;
  fillRate: number; // 0 to 100%
  sharpeRatio: number;
}

export interface SimulationResult {
  config: OrderConfig;
  marketData: MarketIntervalData[];
  marketVWAP: number;
  strategyResults: Record<StrategyType, StrategyResult>;
}
