import { useWallet } from "@solana/wallet-adapter-react";

export function DevnetTerminal() {
  const { connected } = useWallet();

  return (
    <div className="border-ring/35 text-primary/50 rounded-xl border bg-neutral-950 p-5 font-mono text-xs">
      <div className="border-border mb-3 flex items-center gap-2 border-b pb-3">
        <span className="size-1.5 rounded-full bg-[oklch(0.59_0.19_25)] shadow-[0_0_5px_oklch(0.59_0.19_25/0.4)]" />
        <span className="size-1.5 rounded-full bg-[oklch(0.79_0.15_85)] shadow-[0_0_5px_oklch(0.79_0.15_85/0.4)]" />
        <span className="bg-primary size-1.5 rounded-full shadow-[0_0_5px_oklch(0.9395_0.2231_120.04/0.2)]" />
        <span className="text-muted-foreground/50 ml-3">blackwidow — devnet</span>
      </div>
      <div className="space-y-1.5">
        <p>
          <span className="text-primary/40">$</span> cluster: devnet
        </p>
        <p>
          <span className="text-primary/40">$</span> risk-engine: RUNNING
        </p>
        <p>
          <span className="text-primary/40">$</span> auto-exit: ARMED
        </p>
        <p>
          <span className="text-primary/40">$</span>{" "}
          {connected ? (
            <span className="text-primary">wallet: CONNECTED</span>
          ) : (
            <span className="text-white/30">wallet: AWAITING</span>
          )}
        </p>
      </div>
    </div>
  );
}
