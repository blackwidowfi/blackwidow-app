export function formatLogs(logs: string[] | null | undefined) {
  if (!logs?.length) return "";
  return ` Logs: ${logs.slice(-4).join(" | ")}`;
}

export function formatSimulationError(error: unknown, logs: string[] | null | undefined) {
  const details = typeof error === "string" ? error : JSON.stringify(error);
  return `Transaction simulation failed: ${details}.${formatLogs(logs)}`;
}

export function formatWalletError(error: unknown) {
  const walletError = error as {
    message?: unknown;
    name?: unknown;
    error?: { message?: unknown; code?: unknown };
    logs?: string[];
  };
  const innerMessage =
    typeof walletError.error?.message === "string" ? walletError.error.message : null;
  const innerCode = walletError.error?.code;
  const message = typeof walletError.message === "string" ? walletError.message : null;
  const label = typeof walletError.name === "string" ? walletError.name : "Solana transaction";

  if (innerMessage && innerCode !== undefined) {
    const code =
      typeof innerCode === "string" || typeof innerCode === "number"
        ? innerCode
        : JSON.stringify(innerCode);
    return `${label}: ${innerMessage} (code ${code}).${formatLogs(walletError.logs)}`;
  }

  if (message) {
    return `${label}: ${message}.${formatLogs(walletError.logs)}`;
  }

  return "Solana transaction failed.";
}
