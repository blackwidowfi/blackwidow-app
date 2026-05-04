import { Activity, Bot, KeyRound, ShieldAlert, type LucideIcon } from "lucide-react";

import { Card } from "#/lib/ui/card";

const FEATURES: readonly { icon: LucideIcon; label: string }[] = [
  { icon: ShieldAlert, label: "Risk engine active" },
  { icon: Activity, label: "Live on-chain signals" },
  { icon: Bot, label: "Autonomous rebalancing" },
  { icon: KeyRound, label: "Non-custodial" },
];

export function ActiveSystemsCard() {
  return (
    <Card className="bg-card border-border gap-0 rounded-2xl border p-6">
      <p className="text-primary mb-4 font-mono text-[0.68rem] font-medium tracking-[0.18em] uppercase">
        Active Systems
      </p>
      <div className="space-y-3">
        {FEATURES.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="border-border flex size-8 items-center justify-center rounded-lg border">
              <Icon size={14} className="text-muted-foreground" />
            </div>
            <span className="text-sm text-white/70">{label}</span>
            <span className="pulse-dot bg-primary ml-auto size-1.5 rounded-full shadow-[0_0_5px_oklch(0.9395_0.2231_120.04/0.3)]" />
          </div>
        ))}
      </div>
    </Card>
  );
}
