import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";

import { getWithdrawAvailability } from "../-lib/blackwidow-solana";

export const withdrawAvailabilityKey = (address: string | undefined) =>
  ["blackwidow-withdraw-availability", address] as const;

export function useWithdrawAvailability() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  return useQuery({
    queryKey: withdrawAvailabilityKey(publicKey?.toBase58()),
    queryFn: () => getWithdrawAvailability({ connection, owner: publicKey! }),
    enabled: connected && !!publicKey,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}
