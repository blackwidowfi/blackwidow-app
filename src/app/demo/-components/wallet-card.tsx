import { useCallback, useState } from "react";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Wallet } from "lucide-react";

import { useI18n } from "#/lib/translation/useI18n";
import { Button } from "#/lib/ui/button";
import { Card } from "#/lib/ui/card";

import { solBalanceKey, useSolBalance } from "../-hooks/use-sol-balance";
import { formatSol } from "../-utils/format-sol";
import { WalletButton } from "../../-components/wallet-button";

export function WalletCard() {
  const { t } = useI18n("common");
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const queryClient = useQueryClient();

  const { data: balance, isFetching: balanceLoading } = useSolBalance();
  const balanceKey = solBalanceKey(publicKey?.toBase58());

  const [airdropState, setAirdropState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  const requestAirdrop = useCallback(async () => {
    if (!publicKey) return;
    setAirdropState("loading");
    try {
      const sig = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight });
      await queryClient.invalidateQueries({ queryKey: balanceKey });
      setAirdropState("success");
      setTimeout(() => setAirdropState("idle"), 3000);
    } catch {
      setAirdropState("error");
      setTimeout(() => setAirdropState("idle"), 3000);
    }
  }, [publicKey, connection, queryClient, balanceKey]);

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
        <span className="text-muted-foreground font-mono text-xs">{t("demo.network")}</span>
      </div>

      {connected && publicKey ? (
        <div className="space-y-4">
          <div>
            <p className="text-muted-foreground mb-1 font-mono text-xs">Address</p>
            <p className="font-mono text-xs break-all text-white/70">{publicKey.toBase58()}</p>
          </div>

          <div className="border-border flex items-end justify-between border-t pt-4">
            <div>
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

            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              disabled={airdropState === "loading"}
              onClick={requestAirdrop}
            >
              {airdropState === "loading" ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  {t("demo.airdrop_loading")}
                </>
              ) : airdropState === "success" ? (
                t("demo.airdrop_success")
              ) : airdropState === "error" ? (
                t("demo.airdrop_error")
              ) : (
                t("demo.airdrop_button")
              )}
            </Button>
          </div>
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
