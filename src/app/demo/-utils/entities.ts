export const SIMULATION_PHASES = {
  IDLE: "idle",
  ALLOCATING: "allocating",
  MONITORING: "monitoring",
  RISK_DETECTED: "risk_detected",
  REALLOCATING: "reallocating",
} as const;

export type SimulationPhase = (typeof SIMULATION_PHASES)[keyof typeof SIMULATION_PHASES];

export const ALLOCATION_STEPS = {
  SCANNING: 0,
  OPTIMIZING: 1,
  DEPLOYING: 2,
} as const;

export type AllocationStep = (typeof ALLOCATION_STEPS)[keyof typeof ALLOCATION_STEPS];

export const RISK_LEVELS = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
} as const;

export type RiskLevel = (typeof RISK_LEVELS)[keyof typeof RISK_LEVELS];
