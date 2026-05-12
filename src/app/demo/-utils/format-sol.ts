const LAMPORTS_PER_SOL = 1_000_000_000n;

export function formatSol(balance: number | undefined, decimals = 4): string {
  if (balance === undefined) return "—";
  return `${balance.toFixed(decimals)} SOL`;
}

export function formatLamports(lamports: bigint | undefined, decimals = 4): string {
  if (lamports === undefined) return "—";

  const whole = lamports / LAMPORTS_PER_SOL;
  const fraction = (lamports % LAMPORTS_PER_SOL).toString().padStart(9, "0").slice(0, decimals);
  const trimmedFraction = fraction.replace(/0+$/, "");

  return `${whole.toString()}${trimmedFraction ? `.${trimmedFraction}` : ""} SOL`;
}

export function formatLamportsInput(lamports: bigint): string {
  const whole = lamports / LAMPORTS_PER_SOL;
  const fraction = (lamports % LAMPORTS_PER_SOL).toString().padStart(9, "0").replace(/0+$/, "");

  return `${whole.toString()}${fraction ? `.${fraction}` : ""}`;
}
