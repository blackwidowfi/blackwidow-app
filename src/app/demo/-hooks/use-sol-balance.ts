import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

export const solBalanceKey = (address: string | undefined) => ["solana-balance", address] as const;

export function useSolBalance() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  return useQuery({
    queryKey: solBalanceKey(publicKey?.toBase58()),
    queryFn: async () => {
      const lamports = await connection.getBalance(publicKey!);
      return lamports / LAMPORTS_PER_SOL;
    },
    enabled: connected && !!publicKey,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}
