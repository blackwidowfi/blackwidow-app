import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { type PublicKey } from "@solana/web3.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { env } from "#/env";

import {
  buildWithdrawSolTransaction,
  parseSolAmountToLamports,
  type WithdrawSolTransaction,
} from "../-lib/blackwidow-solana";
import { formatSimulationError, formatWalletError } from "./solana-transaction-errors";
import { solBalanceKey } from "./use-sol-balance";
import { withdrawAvailabilityKey } from "./use-withdraw-availability";

export interface WithdrawSolResult extends WithdrawSolTransaction {
  owner: PublicKey;
  signature: string;
  explorerUrl: string;
}

function getExplorerUrl(signature: string) {
  const clusterParam =
    env.SOLANA_NETWORK === "mainnet-beta" ? "" : `?cluster=${env.SOLANA_NETWORK}`;
  return `https://explorer.solana.com/tx/${signature}${clusterParam}`;
}

export function useWithdrawSol() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amountSol: string): Promise<WithdrawSolResult> => {
      if (!publicKey) {
        throw new Error("Connect your wallet before withdrawing.");
      }

      try {
        const amountLamports = parseSolAmountToLamports(amountSol);
        const withdraw = await buildWithdrawSolTransaction({
          connection,
          owner: publicKey,
          amountLamports,
        });
        const latestBlockhash = await connection.getLatestBlockhash("confirmed");

        withdraw.transaction.feePayer = publicKey;
        withdraw.transaction.recentBlockhash = latestBlockhash.blockhash;
        withdraw.transaction.partialSign(...withdraw.signers);

        const simulation = await connection.simulateTransaction(withdraw.transaction);
        if (simulation.value.err) {
          throw new Error(formatSimulationError(simulation.value.err, simulation.value.logs));
        }

        const signature = await sendTransaction(withdraw.transaction, connection, {
          preflightCommitment: "confirmed",
          signers: withdraw.signers,
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
          ...withdraw,
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
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: solBalanceKey(result.owner.toBase58()),
        }),
        queryClient.invalidateQueries({
          queryKey: withdrawAvailabilityKey(result.owner.toBase58()),
        }),
      ]);
    },
  });
}
