import { createFileRoute } from "@tanstack/react-router";

import { useI18n } from "#/lib/translation/useI18n";

import { ActiveSystemsCard } from "./-components/active-systems-card";
import { DevnetTerminal } from "./-components/devnet-terminal";
import { PositionsList } from "./-components/positions-list";
import { WalletCard } from "./-components/wallet-card";

export const Route = createFileRoute("/demo/")({
  component: DemoPage,
});

function DemoPage() {
  const { t } = useI18n("common");

  return (
    <main className="bg-background text-foreground relative container min-h-svh">
      <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,oklch(0.9395_0.2231_120.04/0.04),transparent_70%)]" />

      <div className="page-wrap px-4 py-16">
        <div className="mb-12">
          <p className="text-primary mb-3 font-mono text-[0.68rem] font-medium tracking-[0.18em] uppercase">
            {t("demo.kicker")}
          </p>
          <h1 className="font-display mb-3 text-3xl font-bold text-white sm:text-4xl">
            {t("demo.heading")}
          </h1>
          <p className="text-muted-foreground max-w-lg text-sm leading-7">{t("demo.body")}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <WalletCard />
            <PositionsList />
          </div>

          <div className="space-y-4">
            <ActiveSystemsCard />
            <DevnetTerminal />
          </div>
        </div>
      </div>
    </main>
  );
}
