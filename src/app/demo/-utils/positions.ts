export const MOCK_POSITIONS = [
  {
    protocol: "Jupiter",
    allocation: "40%",
    apy: "8.2%",
    risk: "Low" as const,
  },
  {
    protocol: "Meteora",
    allocation: "35%",
    apy: "14.7%",
    risk: "Medium" as const,
  },
  {
    protocol: "Kamino",
    allocation: "25%",
    apy: "22.1%",
    risk: "Medium" as const,
  },
] as const;

export type { RiskLevel } from "./entities";
export { RISK_LEVELS } from "./entities";
