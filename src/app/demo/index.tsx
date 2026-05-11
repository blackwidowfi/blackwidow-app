import { useWallet } from "@solana/wallet-adapter-react";
import { createFileRoute } from "@tanstack/react-router";

import { env } from "#/env";
import { useI18n } from "#/lib/translation/useI18n";

import { ActiveSystemsCard } from "./-components/active-systems-card";
import { DeployOverlay } from "./-components/deploy-overlay";
import { DevnetTerminal } from "./-components/devnet-terminal";
import { PositionsList } from "./-components/positions-list";
import { WalletCard } from "./-components/wallet-card";
import { useSimulation } from "./-hooks/use-simulation";
import { SIMULATION_PHASES } from "./-utils/entities";

export const Route = createFileRoute("/demo/")({
  component: DemoPage,
});

function DemoPage() {
  const { t } = useI18n("common");
  const { connected } = useWallet();
  const simulation = useSimulation(connected);
  const { phase, allocationStep, riskTargetProtocol } = simulation.state;

  return (
    <main className="bg-background text-foreground relative container min-h-svh">
      <DeployOverlay visible={phase === SIMULATION_PHASES.ALLOCATING} step={allocationStep} />

      <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,oklch(0.9395_0.2231_120.04/0.04),transparent_70%)]" />

      <div className="page-wrap px-4 py-16">
        <div className="mb-12">
          <p className="text-primary mb-3 font-mono text-[0.68rem] font-medium tracking-[0.18em] uppercase">
            {t("demo.kicker", { network: env.SOLANA_NETWORK })}
          </p>
          <h1 className="font-display mb-3 text-3xl font-bold text-white sm:text-4xl">
            {t("demo.heading")}
          </h1>
          <p className="text-muted-foreground max-w-lg text-sm leading-7">{t("demo.body")}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <WalletCard simulationPhase={phase} onDeploy={simulation.deploy} />
            <PositionsList
              phase={phase}
              riskTargetProtocol={riskTargetProtocol}
              allocations={simulation.allocations}
            />
          </div>

          <div className="space-y-4">
            <ActiveSystemsCard />
            <DevnetTerminal phase={phase} />
          </div>
        </div>
      </div>
    </main>
  );
}
