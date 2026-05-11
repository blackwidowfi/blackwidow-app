import { useWallet } from "@solana/wallet-adapter-react";

import { useI18n } from "#/lib/translation/useI18n";
import { Card } from "#/lib/ui/card";
import { cn } from "#/lib/ui/utils";

import type { Allocations } from "../-hooks/use-simulation";
import {
  RISK_LEVELS,
  SIMULATION_PHASES,
  type RiskLevel,
  type SimulationPhase,
} from "../-utils/entities";
import { MOCK_POSITIONS } from "../-utils/positions";

interface PositionsListProps {
  phase: SimulationPhase;
  riskTargetProtocol: string | null;
  allocations: Allocations;
}

const RISK_DOT: Record<RiskLevel, string> = {
  [RISK_LEVELS.LOW]: "bg-primary shadow-[0_0_5px_oklch(0.9395_0.2231_120.04/0.3)]",
  [RISK_LEVELS.MEDIUM]: "bg-[oklch(0.79_0.15_85)] shadow-[0_0_5px_oklch(0.79_0.15_85/0.4)]",
  [RISK_LEVELS.HIGH]: "bg-destructive-foreground shadow-[0_0_5px_oklch(0.577_0.245_27.325/0.5)]",
};

const RISK_TEXT: Record<RiskLevel, string> = {
  [RISK_LEVELS.LOW]: "text-primary",
  [RISK_LEVELS.MEDIUM]: "text-[oklch(0.79_0.15_85)]",
  [RISK_LEVELS.HIGH]: "text-destructive-foreground",
};

export function PositionsList({ phase, riskTargetProtocol, allocations }: PositionsListProps) {
  const { t } = useI18n("common");
  const { connected } = useWallet();

  const showPositions =
    connected && phase !== SIMULATION_PHASES.IDLE && phase !== SIMULATION_PHASES.ALLOCATING;

  return (
    <div>
      <h2 className="mb-4 font-semibold text-white">{t("demo.positions_heading")}</h2>
      {showPositions ? (
        <div className="space-y-3">
          {MOCK_POSITIONS.map((pos, index) => {
            const isRiskTarget = riskTargetProtocol === pos.protocol;
            return (
              <Card
                key={pos.protocol}
                className={cn(
                  "bg-card border-border relative gap-0 overflow-hidden rounded-xl border p-4 transition-[border-color,opacity,transform] duration-300 ease-out hover:-translate-y-0.5",
                  phase === SIMULATION_PHASES.MONITORING && "hover:border-ring",
                  phase === SIMULATION_PHASES.RISK_DETECTED &&
                    isRiskTarget &&
                    "animate-risk-flash border-destructive/50",
                  phase === SIMULATION_PHASES.REALLOCATING &&
                    isRiskTarget &&
                    "border-[oklch(0.79_0.15_85)]/50 opacity-70",
                )}
              >
                {phase === SIMULATION_PHASES.MONITORING && (
                  <span
                    className="animate-scan-line pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,oklch(0.9395_0.2231_120.04/0.05)_50%,transparent_100%)]"
                    style={{ animationDelay: `${index * 0.4}s` }}
                  />
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "size-1.5 rounded-full transition-colors duration-300",
                        phase === SIMULATION_PHASES.RISK_DETECTED && isRiskTarget
                          ? RISK_DOT[RISK_LEVELS.HIGH]
                          : RISK_DOT[pos.risk],
                      )}
                    />
                    <span className="text-sm font-medium text-white">{pos.protocol}</span>
                  </div>
                  <div className="flex items-center gap-6 font-mono text-xs">
                    <div className="text-right">
                      <p className="text-muted-foreground">{t("demo.allocation_label")}</p>
                      <p className="text-white transition-all duration-700">
                        {allocations[pos.protocol]}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">{t("demo.apy_label")}</p>
                      <p className="text-primary">{pos.apy}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">{t("demo.risk_score_label")}</p>
                      <p
                        className={cn(
                          "transition-colors duration-300",
                          phase === SIMULATION_PHASES.RISK_DETECTED && isRiskTarget
                            ? RISK_TEXT[RISK_LEVELS.HIGH]
                            : RISK_TEXT[pos.risk],
                        )}
                      >
                        {phase === SIMULATION_PHASES.RISK_DETECTED && isRiskTarget
                          ? RISK_LEVELS.HIGH
                          : pos.risk}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-card border-border gap-0 rounded-xl border p-6 text-center">
          <p className="text-muted-foreground text-sm">{t("demo.positions_empty")}</p>
        </Card>
      )}
    </div>
  );
}
