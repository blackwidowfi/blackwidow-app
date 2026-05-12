import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { type PublicKey } from "@solana/web3.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { env } from "#/env";

import {
  buildDepositSolTransaction,
  parseSolAmountToLamports,
  type DepositSolTransaction,
} from "../-lib/blackwidow-solana";
import { solBalanceKey } from "./use-sol-balance";

export interface DepositSolResult extends DepositSolTransaction {
  owner: PublicKey;
  signature: string;
  explorerUrl: string;
}

function getExplorerUrl(signature: string) {
  const clusterParam =
    env.SOLANA_NETWORK === "mainnet-beta" ? "" : `?cluster=${env.SOLANA_NETWORK}`;
  return `https://explorer.solana.com/tx/${signature}${clusterParam}`;
}

function formatLogs(logs: string[] | null | undefined) {
  if (!logs?.length) return "";
  return ` Logs: ${logs.slice(-4).join(" | ")}`;
}

function formatSimulationError(error: unknown, logs: string[] | null | undefined) {
  const details = typeof error === "string" ? error : JSON.stringify(error);
  return `Transaction simulation failed: ${details}.${formatLogs(logs)}`;
}

function formatWalletError(error: unknown) {
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

export function useDepositSol() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amountSol: string): Promise<DepositSolResult> => {
      if (!publicKey) {
        throw new Error("Connect your wallet before depositing.");
      }

      try {
        const amountLamports = parseSolAmountToLamports(amountSol);
        const deposit = await buildDepositSolTransaction({
          connection,
          owner: publicKey,
          amountLamports,
        });
        const latestBlockhash = await connection.getLatestBlockhash("confirmed");

        deposit.transaction.feePayer = publicKey;
        deposit.transaction.recentBlockhash = latestBlockhash.blockhash;

        const simulation = await connection.simulateTransaction(deposit.transaction);
        if (simulation.value.err) {
          throw new Error(formatSimulationError(simulation.value.err, simulation.value.logs));
        }

        const signature = await sendTransaction(deposit.transaction, connection, {
          preflightCommitment: "confirmed",
        });

        const confirmation = await connection.confirmTransaction(
          {
            signature,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
          },
          "confirmed",
        );

        if (confirmation.value.err) {
          throw new Error(formatSimulationError(confirmation.value.err, null));
        }

        return {
          ...deposit,
          owner: publicKey,
          signature,
          explorerUrl: getExplorerUrl(signature),
        };
      } catch (error) {
        if (error instanceof Error && error.message.startsWith("Transaction simulation failed")) {
          throw error;
        }

        throw new Error(formatWalletError(error));
      }
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({
        queryKey: solBalanceKey(result.owner.toBase58()),
      });
    },
  });
}
