# OPTIMAL TRADE — Quantitative Trade Execution & Microstructure Intelligence Platform

![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=for-the-badge&logo=tailwindcss)
![Recharts](https://img.shields.io/badge/Recharts-2.12-22c55e?style=for-the-badge&logo=chartdotjs)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js)
![NSE NIFTY 50](https://img.shields.io/badge/Kaggle_Data-NIFTY_50-orange?style=for-the-badge)

**OPTIMAL TRADE** is an institutional-grade, web-based quantitative trade execution and market microstructure analysis platform. Built with **Next.js 16 (Turbopack)**, **TypeScript**, and **Tailwind CSS**, the system simulates, analyzes, and optimizes large block order execution strategies across **16 NIFTY 50 Indian Stock Market equities** over dynamic timeframes (`1D`, `7D`, `1M`, `1Y`).

The platform incorporates the **Almgren-Chriss Optimal Execution Framework**, **Dynamic Adaptive Market Shock Calibration**, and **Microstructure Volatility & Liquidity Indicators** computed directly from Kaggle time-series telemetry. All pricing, market impact costs, and implementation shortfall metrics are strictly calibrated in **Indian Rupees (₹)**.

---

## 🚀 Key Features

- **16 NIFTY 50 Blue-Chip Equities Data Engine**: Stream authentic Kaggle intraday and historical market telemetry for `RELIANCE`, `TCS`, `HDFCBANK`, `INFY`, `TATAMOTORS`, `ICICIBANK`, `SBIN`, `BHARTIARTL`, `HINDUNILVR`, `ITC`, `KOTAKBANK`, `LT`, `AXISBANK`, `MARUTI`, `SUNPHARMA`, and the `NIFTY 50` Index Benchmark.
- **Multi-Timeframe Granularity (`1D`, `7D`, `1M`, `1Y`)**: Analyze execution performance across 30 intraday slices (`1D`), 28 multi-day slots (`7D`), 30 daily steps (`1M`), or 52 weekly intervals (`1Y`).
- **4 Quantitative Execution Algorithms**:
  1. **TWAP (Time-Weighted Average Price)**: Uniform linear time-slicing order schedule.
  2. **VWAP (Volume-Weighted Average Price)**: Matches the intraday U-shaped volume distribution profile to minimize volume-weighted market impact.
  3. **Almgren-Chriss Optimal Trajectory**: Minimizes total Expected Implementation Shortfall + Variance under specified Risk Aversion ($\lambda$).
  4. **Dynamic Adaptive Strategy**: Real-time regime-shift detection that dynamically accelerates or decelerates order execution when volatility spikes or liquidity thins.
- **Microstructure Volatility Indicators (Formulas A, B, C & D)**:
  - **Formula A (Realized Volatility)**: Rolling window standard deviation of log returns.
  - **Formula B (EWMA Volatility)**: Exponentially weighted volatility ($\lambda = 0.94$) for rapid shock response.
  - **Formula C (GARCH(1,1) Model)**: Forward-looking volatility estimate capturing volatility clustering.
  - **Formula D (Parkinson Range Volatility)**: High-Low range volatility estimator ($\sigma^2 = \frac{1}{4 \ln 2} [\ln(\text{High}/\text{Low})]^2$).
- **Microstructure Liquidity Indicators (Formulas A, B & D)**:
  - **Formula A (Bid-Ask Spread)**: Absolute spread ($\text{Ask} - \text{Bid}$) and Relative Spread in Basis Points ($\text{Spread} / \text{Mid} \times 10000$).
  - **Formula B (Order Book Depth)**: Top-of-book liquidity depth ($\text{Bid Size} + \text{Ask Size}$).
  - **Formula D (Volume Liquidity Proxy)**: Ratio of current interval volume to trailing average volume ($\text{Volume}_t / \text{AvgVolume}$).
- **Interactive Risk & Control Calibration Panel**: Live controls to toggle order direction (`BUY` / `SELL`), adjust block order size (up to 1,000,000 shares), calibrate Risk Aversion ($\lambda$), set Arrival Benchmark Price (₹), and inject synthetic Market Regime Shocks in real-time.

---

## 📐 Mathematical Formulation

### 1. Fundamental Trade Execution Problem
A trader aims to execute a large order of $X_0$ shares over a finite horizon $T$ divided into $N$ discrete intervals $t_1, t_2, \dots, t_N$.

Let $x_j$ be the remaining quantity of shares at interval $t_j$, and $n_j = x_{j-1} - x_j$ be the slice executed at interval $t_j$.

### 2. Market Impact Model (Almgren-Chriss)
The execution price $S_j$ for slice $n_j$ is given by:

$$S_j = S_{j-1} + \sigma \sqrt{\tau} \cdot \xi_j - \tau \gamma(n_j / \tau) - \eta \cdot \left(\frac{n_j}{\tau}\right)$$

where:
- $S_0$ is the **Arrival Price** ($P_0$).
- $\gamma$ is the **permanent market impact** parameter.
- $\eta$ is the **temporary market impact** parameter.
- $\sigma$ is the asset volatility.
- $\xi_j \sim \mathcal{N}(0, 1)$ represents brownian market noise.

### 3. Implementation Shortfall ($x$)
For a **BUY** order, Implementation Shortfall is:

$$\text{IS} = \sum_{j=1}^N n_j (S_j - S_0) = \bar{S} \cdot X_0 - S_0 \cdot X_0$$

For a **SELL** order, Implementation Shortfall is:

$$\text{IS} = \sum_{j=1}^N n_j (S_0 - S_j) = S_0 \cdot X_0 - \bar{S} \cdot X_0$$

### 4. Almgren-Chriss Optimal Trajectory
Minimizing the utility function $U(x) = E[x] + \lambda V[x]$ yields the hyperbolic trajectory:

$$x_j = X_0 \cdot \frac{\sinh(\kappa (T - t_j))}{\sinh(\kappa T)}$$

$$\kappa \approx \sqrt{\frac{\lambda \sigma^2}{\eta}}$$

---

## 📊 Volatility & Liquidity Quantitative Indicators

| Indicator Category | Formula ID | Name | Mathematical Formula | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Volatility** | **Formula A** | Realized Volatility | $r_t = \ln(P_t / P_{t-1}), \quad \sigma_A = \text{std\_dev}(r_{t-10 \dots t})$ | Baseline rolling price variation |
| **Volatility** | **Formula B** | EWMA Volatility | $\sigma_{B, t}^2 = 0.94 \cdot \sigma_{B, t-1}^2 + 0.06 \cdot r_t^2$ | Instantaneous reaction to market shocks |
| **Volatility** | **Formula C** | GARCH(1,1) Model | $\sigma_{C, t+1}^2 = \omega + \alpha \cdot r_t^2 + \beta \cdot \sigma_{C, t}^2$ | Forward-looking volatility clustering |
| **Volatility** | **Formula D** | Parkinson Range Vol | $\sigma_{D}^2 = \frac{1}{4 \ln 2} \left[\ln\left(\frac{\text{High}_t}{\text{Low}_t}\right)\right]^2$ | Intra-interval OHLC range volatility |
| **Liquidity** | **Formula A** | Relative Spread (bps) | $\text{RelSpread}_t = \frac{\text{Ask}_t - \text{Bid}_t}{\text{Mid}_t} \times 10000$ | Microstructure bid-ask friction gauge |
| **Liquidity** | **Formula B** | Order Book Depth | $\text{Depth}_t = \text{BidSize}_t + \text{AskSize}_t$ | Available top-of-book share liquidity |
| **Liquidity** | **Formula D** | Volume Proxy Score | $\text{Score}_t = \frac{\text{Volume}_t}{\text{AvgVolume}_{\text{trailing}}}$ | Detects thinning participant volume |

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Charts & Telemetry**: [Recharts](https://recharts.org/)
- **3D Graphics & Shaders**: [Three.js](https://threejs.org/) (WebGL Renderers)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Source**: Kaggle Indian Stock Market (NIFTY 50 Time-Series Data)

---

## 📁 Repository Structure

```
OPTIMAL-TRADE/
├── src/
│   ├── app/
│   │   ├── globals.css              # Global styles & CSS Grid pattern utility
│   │   ├── layout.tsx               # Root Next.js layout configuration
│   │   └── page.tsx                 # Main Dashboard Application Page
│   ├── components/
│   │   ├── Header.tsx               # Top branding navbar (OT Logo)
│   │   ├── KaggleDataImporter.tsx   # 16 NIFTY 50 dropdown menu & timeframe switcher
│   │   ├── MainHeroChartCard.tsx    # Full-width hero price trajectory card
│   │   ├── ControlPanel.tsx         # BUY/SELL toggle, sliders & risk calibration
│   │   ├── VolatilityIndicatorsCard.tsx # Formulas A, B, C & D volatility indicators
│   │   ├── LiquidityIndicatorsCard.tsx  # Formulas A, B & D liquidity indicators
│   │   ├── PriceTrajectoryChart.tsx # Multi-strategy execution price comparison
│   │   ├── EfficientFrontierChart.tsx# Risk vs Implementation Shortfall frontier
│   │   ├── AssetsTableCard.tsx      # Strategy performance matrix & shortfall audit
│   │   ├── RepartitionPieCard.tsx   # Portfolio asset allocation pie chart
│   │   ├── BottomCards.tsx          # Microstructure market metrics grid
│   │   ├── SliceBreakdownChart.tsx  # Per-interval order slicing bar chart
│   │   ├── TradeTable.tsx           # Granular per-interval execution audit table
│   │   └── Footer.tsx               # Clean branding footer with ₹ graphic
│   └── lib/
│       └── engine/
│           ├── types.ts             # TypeScript interfaces for market telemetry
│           ├── runner.ts            # Simulation orchestration & runner
│           ├── marketData.ts        # Geometric Brownian Motion generator
│           ├── indianStocksData.ts  # Indian Stock presets & Kaggle CSV parser
│           ├── kaggleDataStore.ts   # 16 NIFTY 50 multi-timeframe generator
│           └── strategies.ts        # TWAP, VWAP, Almgren-Chriss & Dynamic Adaptive
├── package.json
├── tsconfig.json
└── README.md
```

---

## 💻 Local Setup & Installation

Follow these steps to run the platform locally on your machine:

### 1. Prerequisites
- Node.js 18.0 or higher
- npm 9.0 or higher

### 2. Clone the Repository
```bash
git clone https://github.com/Viidhyanshu/OPTIMAL-TRADE.git
cd OPTIMAL-TRADE
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 5. Production Build & Type Check
To compile an optimized production build using Next.js Turbopack:
```bash
npm run build
npm run start
```

---

## 🔗 GitHub Repository

- **Repository**: [https://github.com/Viidhyanshu/OPTIMAL-TRADE.git](https://github.com/Viidhyanshu/OPTIMAL-TRADE.git)
- **Branch**: `main`

---

## 📜 License

This project is licensed under the MIT License — feel free to use and modify for quantitative research and algorithmic trade execution benchmarking.
