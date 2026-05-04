export function formatSol(balance: number | undefined, decimals = 4): string {
  if (balance === undefined) return "—";
  return `${balance.toFixed(decimals)} SOL`;
}
