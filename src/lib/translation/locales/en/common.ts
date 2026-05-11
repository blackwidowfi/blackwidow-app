export default {
  titles: {
    site: "Blackwidow: Autonomous Yield Optimization on Solana",
    site_short: "Blackwidow",
    not_found: "Position Not Found",
  },
  descriptions: {
    site: "Blackwidow is an autonomous, risk-aware yield aggregation layer on Solana. Maximize returns while minimizing exposure — without manual monitoring.",
    site_short:
      "Autonomous, risk-aware yield aggregation on Solana. Maximize returns while minimizing exposure.",
    not_found: "This route doesn't exist. The capital was probably redeployed somewhere safer.",
  },
  nav: {
    brand: "Blackwidow",
    how_it_works: "How It Works",
    features: "Features",
    solana: "Solana",
    docs: "Docs",
    demo: "Demo",
  },
  footer: {
    copyright: "Blackwidow. All rights reserved.",
    disclaimer:
      "Blackwidow is in development. This is not financial advice. DeFi protocols carry inherent risks. Always do your own research.",
    follow_on_x: "Follow Blackwidow on X",
    github_label: "Blackwidow on GitHub",
  },
  hero: {
    badge: "Solana · Early Access",
    headline_1: "Autonomous Yield.",
    headline_2: "Zero Compromises.",
    body: "Blackwidow allocates capital across Solana DeFi protocols for maximum yield — while a real-time risk engine monitors threats and exits positions before damage is done.",
  },
  problem: {
    kicker: "The Problem",
    heading: "DeFi is NOT safe",
    stat: "$600,000,000+",
    stat_label: "lost across DeFi protocols in April 2026 alone",
    points: [
      {
        title: "No real-time risk protection",
        desc: "Protocols get exploited in seconds. Existing optimizers have no live anomaly detection — by the time anyone notices, capital is gone.",
      },
      {
        title: "Manual monitoring",
        desc: "Users are expected to track oracle prices, TVL shifts, and liquidation risks across dozens of protocols simultaneously. It's impossible.",
      },
      {
        title: "Yield without defense",
        desc: "Yield optimizers maximize APY but treat risk as static. There is no integrated layer that actively defends capital in real time.",
      },
    ],
  },
  how_it_works: {
    kicker: "How It Works",
    heading: "Simple by Design",
    steps: [
      {
        title: "Deploy capital",
        desc: "Connect your wallet and select your risk tolerance. Blackwidow handles the rest.",
      },
      {
        title: "Autonomous allocation",
        desc: "Capital is continuously routed across Solana DeFi protocols to maximize yield within your parameters.",
      },
      {
        title: "Risk engine guards",
        desc: "Our proprietary engine monitors on-chain signals 24/7, auto-exiting positions the moment a threat is detected.",
      },
    ],
  },
  features: {
    kicker: "Core Features",
    heading: "Built to Protect and Grow",
    items: [
      {
        title: "Risk engine",
        desc: "Proprietary real-time anomaly detection across oracle prices, TVL shifts, and contract interactions.",
      },
      {
        title: "Auto-exit",
        desc: "Positions closed automatically the moment a threat threshold is crossed — no manual intervention needed.",
      },
      {
        title: "Yield optimization",
        desc: "Continuous allocation across Solana DeFi protocols, rebalancing to maximize APY within risk parameters.",
      },
      {
        title: "On-chain signals",
        desc: "Live monitoring of protocol health: TVL, liquidation cascades, oracle deviations, and contract spikes.",
      },
      {
        title: "Agent-ready",
        desc: "Purpose-built for AI agents deploying capital autonomously at scale — full programmatic control via API.",
      },
      {
        title: "Non-custodial",
        desc: "You always hold your keys. Blackwidow never takes custody of your assets.",
      },
    ],
  },
  risk_engine: {
    kicker: "Risk Engine",
    heading_1: "While Others Sleep,",
    heading_2: "We Watch.",
    body: "Blackwidow's risk engine continuously monitors every protocol it touches — tracking oracle deviations, TVL anomalies, smart contract interaction spikes, and liquidation cascade signals in real time.",
    signals: [
      "Oracle price deviation (>2σ)",
      "TVL contraction velocity",
      "Smart contract interaction spikes",
      "Liquidation cascade probability",
      "Stablecoin depeg signals",
    ],
    terminal_title: "Blackwidow — risk-monitor",
    rows: [
      { label: "DRIFT/SOL oracle", value: "NOMINAL", time: "00:00:01" },
      { label: "KelpDAO TVL", value: "NOMINAL", time: "00:00:01" },
      { label: "Raydium pool depth", value: "WARN −4%", time: "00:00:02" },
      { label: "Orca whirlpool", value: "NOMINAL", time: "00:00:02" },
      { label: "mSOL depeg signal", value: "CLEAR", time: "00:00:03" },
    ],
  },
  solana: {
    kicker: "Built for Solana",
    heading: "Speed. Cost. Conviction.",
    body: "Solana's throughput and sub-cent fees make it the only viable chain for real-time autonomous yield management at scale.",
    protocols_label: "Active protocol monitoring",
    protocols: ["Jupiter"],
    stats: [
      { value: "< 400ms", label: "average block time" },
      { value: "< $0.001", label: "median transaction fee" },
      { value: "50,000+", label: "TPS theoretical throughput" },
    ],
  },
  waitlist: {
    kicker: "Early Access",
    heading: "Get Early Access",
    body: "Blackwidow is in private beta. Join the waitlist to be among the first to deploy capital through the protocol.",
    note: "MVP stage · Solana {{network}} · Non-custodial · Audit in progress",
  },
  demo: {
    kicker: "{{network}} Demo",
    heading: "Deploy Capital",
    body: "Connect your Phantom wallet and explore Blackwidow's autonomous yield engine on Solana devnet.",
    connect_prompt: "Connect your wallet to get started.",
    wallet_connected: "Wallet connected",
    network: "Solana {{network}}",
    balance_label: "SOL Balance",
    balance_loading: "Loading…",
    airdrop_button: "Request 1 SOL Airdrop",
    airdrop_loading: "Requesting…",
    airdrop_success: "Airdrop confirmed",
    airdrop_error: "Airdrop failed — try again",
    positions_heading: "Active Positions",
    positions_empty: "No active positions. Deploy capital to get started.",
    risk_score_label: "Risk Score",
    apy_label: "Est. APY",
    allocation_label: "Allocation",
    terminal_title: "Blackwidow — {{network}}",
    stats: [
      { label: "Total Value Locked", value: "—" },
      { label: "Est. APY", value: "—" },
      { label: "Risk Score", value: "—" },
    ],
    deploy_status_allocating: "Deploying...",
    deploy_status_monitoring: "Monitoring active",
    deploy_status_risk: "Risk detected",
    deploy_status_reallocating: "Reallocating...",
    overlay_title: "Deploying Capital",
    overlay_step_0: "Scanning DeFi protocols...",
    overlay_step_1: "Optimizing yield allocation...",
    overlay_step_2: "Deploying to Jupiter, Meteora & Kamino...",
    terminal_positions_active: "positions: ACTIVE",
    terminal_risk_detected: "risk: DETECTED — EXITING",
    terminal_reallocating: "reallocating: IN PROGRESS",
  },
  not_found: {
    kicker: "404",
    back_to_home: "Back to Home",
  },
  meta: {
    keywords:
      "Blackwidow, DeFi, Solana, yield aggregator, autonomous yield, risk management, crypto",
    og_site_name: "Blackwidow",
  },
} as const;
