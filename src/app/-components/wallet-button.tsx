import { useWallet } from "@solana/wallet-adapter-react";
import { Loader2, Wallet } from "lucide-react";

import { Button } from "#/lib/ui/button";
import { cn } from "#/lib/ui/utils";

function truncate(address: string) {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

export function WalletButton({ className, ...rest }: React.ComponentProps<"button">) {
  const wallet = useWallet();

  if (wallet.connecting) {
    return (
      <Button size="sm" disabled className="rounded px-4 text-xs">
        <Loader2 size={13} className="animate-spin" />
        Connecting…
      </Button>
    );
  }

  if (wallet.connected && wallet.publicKey) {
    return (
      <Button
        size="sm"
        variant="outline"
        className={cn("rounded px-4 font-mono text-xs", className)}
        onClick={() => wallet.disconnect()}
        {...rest}
      >
        <Wallet size={13} />
        {truncate(wallet.publicKey.toBase58())}
      </Button>
    );
  }

  const phantom = wallet.wallets.find((w) => w.adapter.name === "Phantom");

  return (
    <Button
      size="sm"
      className="rounded px-4 text-xs"
      onClick={() => {
        if (phantom) wallet.select(phantom.adapter.name);
      }}
    >
      <Wallet size={13} />
      Connect Wallet
    </Button>
  );
}
