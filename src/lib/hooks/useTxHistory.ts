import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Address } from "viem";
import { Tx } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { usePoolsStore } from "@store/poolsStore";

type ReturnTxHistory = {
  data: Tx[] | undefined;
  isLoading: boolean;
  refetch: () => Promise<void>;
};

/**
 * useTxHistory fetches connected user's Transaction history in the current Pool
 * @returns data, isLoading, refetch
 */
export function useTxHistory(paused = false): ReturnTxHistory {
  const [txHistory, setTxHistory] = useState<Tx[]>();
  const [isLoadingTxH, setIsLoadingTxH] = useState<boolean>(false);
  const { selectedPool } = usePoolsStore();

  const { address } = useAccount();
  const { potentia } = usePotentiaSdk();

  async function refetch() {
    try {
      setIsLoadingTxH(true);
      const result = await potentia?.getUserTxHistory(
        selectedPool()?.poolAddr! as Address, // pool
        address as Address // user
      );
      // console.log("txHistory", result);
      setTxHistory(result);
    } catch (error) {
      console.error("Error -- fetching transaction history", error);
    } finally {
      setIsLoadingTxH(false);
    }
  }

  useEffect(() => {
    if (address && potentia && selectedPool() && !paused) {
      refetch();
    }
  }, [address, potentia, selectedPool]);

  return { data: txHistory, isLoading: isLoadingTxH, refetch };
}
