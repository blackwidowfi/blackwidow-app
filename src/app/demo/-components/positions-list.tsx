import { useWallet } from "@solana/wallet-adapter-react";

import { useI18n } from "#/lib/translation/useI18n";
import { Card } from "#/lib/ui/card";

const MOCK_POSITIONS = [
  {
    protocol: "Jupiter",
    allocation: "40%",
    apy: "8.2%",
    risk: "Low",
    riskColor: "text-primary",
    status: "green" as const,
  },
  {
    protocol: "Orca Whirlpool",
    allocation: "35%",
    apy: "14.7%",
    risk: "Medium",
    riskColor: "text-[oklch(0.79_0.15_85)]",
    status: "yellow" as const,
  },
  {
    protocol: "Raydium CLMM",
    allocation: "25%",
    apy: "22.1%",
    risk: "Medium",
    riskColor: "text-[oklch(0.79_0.15_85)]",
    status: "green" as const,
  },
] as const;

const STATUS_DOT: Record<"green" | "yellow", string> = {
  green: "bg-primary shadow-[0_0_5px_oklch(0.9395_0.2231_120.04/0.3)]",
  yellow: "bg-[oklch(0.79_0.15_85)] shadow-[0_0_5px_oklch(0.79_0.15_85/0.4)]",
};

export function PositionsList() {
  const { t } = useI18n("common");
  const { connected } = useWallet();

  return (
    <div>
      <h2 className="mb-4 font-semibold text-white">{t("demo.positions_heading")}</h2>
      {connected ? (
        <div className="space-y-3">
          {MOCK_POSITIONS.map((pos) => (
            <Card
              key={pos.protocol}
              className="bg-card border-border hover:border-ring gap-0 rounded-xl border p-4 transition-[border-color,transform] duration-200 ease-out hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`size-1.5 rounded-full ${STATUS_DOT[pos.status]}`} />
                  <span className="text-sm font-medium text-white">{pos.protocol}</span>
                </div>
                <div className="flex items-center gap-6 font-mono text-xs">
                  <div className="text-right">
                    <p className="text-muted-foreground">{t("demo.allocation_label")}</p>
                    <p className="text-white">{pos.allocation}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">{t("demo.apy_label")}</p>
                    <p className="text-primary">{pos.apy}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">{t("demo.risk_score_label")}</p>
                    <p className={pos.riskColor}>{pos.risk}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-card border-border gap-0 rounded-xl border p-6 text-center">
          <p className="text-muted-foreground text-sm">{t("demo.positions_empty")}</p>
        </Card>
      )}
    </div>
  );
}
