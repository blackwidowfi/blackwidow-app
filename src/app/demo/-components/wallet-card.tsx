import { type FormEvent, useState } from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import { ExternalLink, Loader2, Wallet, Zap } from "lucide-react";

import { env } from "#/env";
import { useI18n } from "#/lib/translation/useI18n";
import { Button } from "#/lib/ui/button";
import { Card } from "#/lib/ui/card";
import { cn } from "#/lib/ui/utils";

import { useDepositSol, type DepositSolResult } from "../-hooks/use-deposit-sol";
import { useSolBalance } from "../-hooks/use-sol-balance";
import { SIMULATION_PHASES, type SimulationPhase } from "../-utils/entities";
import { formatSol } from "../-utils/format-sol";
import { WalletButton } from "../../-components/wallet-button";

interface WalletCardProps {
  simulationPhase: SimulationPhase;
  onDeploy: () => void;
}

const PHASE_DOT: Record<Exclude<SimulationPhase, "idle">, string> = {
  allocating: "",
  monitoring: "bg-primary shadow-[0_0_5px_oklch(0.9395_0.2231_120.04/0.3)] animate-pulse-dot",
  risk_detected:
    "bg-destructive-foreground shadow-[0_0_5px_oklch(0.577_0.245_27.325/0.5)] animate-risk-flash",
  reallocating:
    "bg-[oklch(0.79_0.15_85)] shadow-[0_0_5px_oklch(0.79_0.15_85/0.4)] animate-pulse-dot",
};

const PHASE_LABEL_KEY = {
  allocating: "demo.deploy_status_allocating",
  monitoring: "demo.deploy_status_monitoring",
  risk_detected: "demo.deploy_status_risk",
  reallocating: "demo.deploy_status_reallocating",
} as const;

export function WalletCard({ simulationPhase, onDeploy }: WalletCardProps) {
  const { t } = useI18n(["common", "form"]);
  const { publicKey, connected } = useWallet();
  const { data: balance, isFetching: balanceLoading } = useSolBalance();
  const depositSol = useDepositSol();
  const [amountSol, setAmountSol] = useState("0.05");
  const [lastDeposit, setLastDeposit] = useState<DepositSolResult | null>(null);

  const isAllocating = simulationPhase === SIMULATION_PHASES.ALLOCATING;
  const isDepositing = depositSol.isPending;
  const submitDisabled = isAllocating || isDepositing || amountSol.trim().length === 0;
  const depositError = depositSol.error instanceof Error ? depositSol.error.message : null;

  async function handleDeposit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLastDeposit(null);

    try {
      const result = await depositSol.mutateAsync(amountSol);
      setLastDeposit(result);
      onDeploy();
    } catch {
      // The mutation state renders the actionable error below the button.
    }
  }

  return (
    <Card className="bg-card border-border gap-0 rounded-2xl border p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Wallet size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-white">
            {connected ? t("demo.wallet_connected") : "Wallet"}
          </span>
          {connected && (
            <span className="bg-primary size-1.5 rounded-full shadow-[0_0_5px_oklch(0.9395_0.2231_120.04/0.3)]" />
          )}
        </div>
        <span className="text-muted-foreground font-mono text-xs">
          {t("demo.network", { network: env.SOLANA_NETWORK })}
        </span>
      </div>

      {connected && publicKey ? (
        <div className="space-y-4">
          <div>
            <p className="text-muted-foreground mb-1 font-mono text-xs">Address</p>
            <p className="font-mono text-xs break-all text-white/70">{publicKey.toBase58()}</p>
          </div>

          <div className="border-border border-t pt-4">
            <p className="text-muted-foreground mb-1 font-mono text-xs">
              {t("demo.balance_label")}
            </p>
            <p className="font-mono text-2xl font-medium text-white">
              {balanceLoading ? (
                <span className="text-muted-foreground text-sm">{t("demo.balance_loading")}</span>
              ) : (
                formatSol(balance)
              )}
            </p>
          </div>

          <form className="border-border space-y-3 border-t pt-4" onSubmit={handleDeposit}>
            <div>
              <label
                htmlFor="deposit-sol-amount"
                className="text-muted-foreground mb-2 block font-mono text-xs"
              >
                {t("demo.deposit_amount_label")}
              </label>
              <div className="border-input focus-within:ring-ring/40 flex h-10 items-center rounded-md border bg-white/[0.03] px-3 transition focus-within:ring-2">
                <input
                  id="deposit-sol-amount"
                  type="text"
                  inputMode="decimal"
                  value={amountSol}
                  onChange={(event) => setAmountSol(event.target.value)}
                  disabled={isAllocating || isDepositing}
                  className="min-w-0 flex-1 bg-transparent font-mono text-sm text-white outline-none disabled:opacity-60"
                  placeholder="0.05"
                />
                <span className="text-muted-foreground font-mono text-xs">SOL</span>
              </div>
              <p className="text-muted-foreground mt-2 text-xs leading-5">
                {t("demo.deposit_helper")}
              </p>
            </div>

            <Button className="w-full" type="submit" disabled={submitDisabled}>
              {isDepositing ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  {t("demo.deposit_status_pending")}
                </>
              ) : isAllocating ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  {t("demo.deploy_status_allocating")}
                </>
              ) : (
                <>
                  <Zap size={14} />
                  {t("form:actions.deploy_capital")}
                </>
              )}
            </Button>

            {depositError && (
              <p className="text-destructive font-mono text-xs leading-5">{depositError}</p>
            )}

            {lastDeposit && (
              <a
                href={lastDeposit.explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary inline-flex items-center gap-1.5 font-mono text-xs hover:underline"
              >
                {t("demo.deposit_status_confirmed")}
                <ExternalLink size={12} />
              </a>
            )}

            {simulationPhase !== SIMULATION_PHASES.IDLE && !isAllocating && (
              <div className={cn("flex items-center gap-2.5", isAllocating && "opacity-50")}>
                <span className={cn("size-1.5 rounded-full", PHASE_DOT[simulationPhase])} />
                <span className="font-mono text-xs text-white/70">
                  {t(PHASE_LABEL_KEY[simulationPhase])}
                </span>
              </div>
            )}
          </form>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-4">
          <p className="text-muted-foreground text-sm">{t("demo.connect_prompt")}</p>
          <WalletButton />
        </div>
      )}
    </Card>
  );
}
