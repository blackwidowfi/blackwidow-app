import { type FormEvent, useState } from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import { ArrowDownToLine, ArrowUpFromLine, ExternalLink, Loader2, Wallet } from "lucide-react";

import { env } from "#/env";
import { useI18n } from "#/lib/translation/useI18n";
import { Button } from "#/lib/ui/button";
import { Card } from "#/lib/ui/card";
import { cn } from "#/lib/ui/utils";

import { useDepositSol } from "../-hooks/use-deposit-sol";
import { useSolBalance } from "../-hooks/use-sol-balance";
import { useWithdrawAvailability } from "../-hooks/use-withdraw-availability";
import { useWithdrawSol } from "../-hooks/use-withdraw-sol";
import { parseSolAmountToLamports } from "../-lib/blackwidow-solana";
import { SIMULATION_PHASES, type SimulationPhase } from "../-utils/entities";
import { formatLamports, formatLamportsInput, formatSol } from "../-utils/format-sol";
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

function tryParseLamports(value: string) {
  if (value.trim().length === 0) return null;

  try {
    return parseSolAmountToLamports(value);
  } catch {
    return null;
  }
}

type LastTransaction = {
  explorerUrl: string;
  labelKey: "demo.deposit_status_confirmed" | "demo.withdraw_status_confirmed";
};

export function WalletCard({ simulationPhase, onDeploy }: WalletCardProps) {
  const { t } = useI18n(["common"]);
  const { publicKey, connected } = useWallet();
  const { data: balance, isFetching: balanceLoading } = useSolBalance();
  const withdrawAvailability = useWithdrawAvailability();
  const depositSol = useDepositSol();
  const withdrawSol = useWithdrawSol();
  const [amountSol, setAmountSol] = useState("0.05");
  const [lastTransaction, setLastTransaction] = useState<LastTransaction | null>(null);

  const isAllocating = simulationPhase === SIMULATION_PHASES.ALLOCATING;
  const isDepositing = depositSol.isPending;
  const isWithdrawing = withdrawSol.isPending;
  const isProcessing = isAllocating || isDepositing || isWithdrawing;
  const amountLamports = tryParseLamports(amountSol);
  const withdrawableLamports = withdrawAvailability.data?.withdrawableLamports ?? 0n;
  const hasWithdrawAvailability = withdrawAvailability.data !== undefined;
  const amountExceedsWithdrawable =
    hasWithdrawAvailability &&
    withdrawableLamports > 0n &&
    amountLamports !== null &&
    amountLamports > withdrawableLamports;
  const depositDisabled = isProcessing || amountLamports === null;
  const withdrawDisabled =
    depositDisabled ||
    withdrawAvailability.isLoading ||
    withdrawAvailability.isError ||
    withdrawableLamports <= 0n ||
    amountExceedsWithdrawable;
  const depositError = depositSol.error instanceof Error ? depositSol.error.message : null;
  const withdrawError = withdrawSol.error instanceof Error ? withdrawSol.error.message : null;
  const transactionError = depositError ?? withdrawError;

  async function handleDeposit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLastTransaction(null);

    try {
      const result = await depositSol.mutateAsync(amountSol);
      setLastTransaction({
        explorerUrl: result.explorerUrl,
        labelKey: "demo.deposit_status_confirmed",
      });
      onDeploy();
    } catch {
      // The mutation state renders the actionable error below the button.
    }
  }

  async function handleWithdraw() {
    if (withdrawDisabled) return;

    setLastTransaction(null);

    try {
      const result = await withdrawSol.mutateAsync(amountSol);
      setLastTransaction({
        explorerUrl: result.explorerUrl,
        labelKey: "demo.withdraw_status_confirmed",
      });
    } catch {
      // The mutation state renders the actionable error below the button.
    }
  }

  function handleUseMaxWithdraw() {
    if (withdrawableLamports > 0n) {
      setAmountSol(formatLamportsInput(withdrawableLamports));
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

          <div className="border-border grid grid-cols-2 gap-3 border-t pt-4">
            <div>
              <p className="text-muted-foreground mb-1 font-mono text-xs">
                {t("demo.allocated_label")}
              </p>
              <p className="font-mono text-sm text-white">
                {withdrawAvailability.isLoading
                  ? t("demo.balance_loading")
                  : formatLamports(withdrawAvailability.data?.allocatedLamports)}
              </p>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="text-muted-foreground font-mono text-xs">
                  {t("demo.withdraw_available_label")}
                </p>
                <button
                  type="button"
                  className="text-primary font-mono text-xs hover:underline disabled:text-white/30 disabled:no-underline"
                  disabled={withdrawableLamports <= 0n || isProcessing}
                  onClick={handleUseMaxWithdraw}
                >
                  {t("demo.max_button")}
                </button>
              </div>
              <p className="font-mono text-sm text-white">
                {withdrawAvailability.isLoading
                  ? t("demo.balance_loading")
                  : formatLamports(withdrawAvailability.data?.withdrawableLamports)}
              </p>
            </div>
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
                  disabled={isProcessing}
                  className="min-w-0 flex-1 bg-transparent font-mono text-sm text-white outline-none disabled:opacity-60"
                  placeholder="0.05"
                />
                <span className="text-muted-foreground font-mono text-xs">SOL</span>
              </div>
              <p className="text-muted-foreground mt-2 text-xs leading-5">
                {t("demo.deposit_helper")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button type="submit" disabled={depositDisabled}>
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
                    <ArrowDownToLine size={14} />
                    {t("demo.deposit_button")}
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={withdrawDisabled}
                onClick={handleWithdraw}
              >
                {isWithdrawing ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    {t("demo.withdraw_status_pending")}
                  </>
                ) : (
                  <>
                    <ArrowUpFromLine size={14} />
                    {t("demo.withdraw_button")}
                  </>
                )}
              </Button>
            </div>

            {transactionError && (
              <p className="text-destructive font-mono text-xs leading-5">{transactionError}</p>
            )}

            {amountExceedsWithdrawable && (
              <p className="text-muted-foreground font-mono text-xs leading-5">
                {t("demo.withdraw_limit_message", {
                  amount: formatLamports(withdrawableLamports),
                })}
              </p>
            )}

            {lastTransaction && (
              <a
                href={lastTransaction.explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary inline-flex items-center gap-1.5 font-mono text-xs hover:underline"
              >
                {t(lastTransaction.labelKey)}
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
