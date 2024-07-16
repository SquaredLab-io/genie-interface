import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Address } from "viem";
import { Tx } from "@lib/types/portfolio";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { useTradeStore } from "@store/tradeStore";

type ReturnTxHistory = {
  data: Tx[] | undefined;
  isLoading: boolean;
  refetch: () => Promise<void>;
};

/**
 * Hook that fetches connected user's Transaction history in the current Pool
 * @returns data, isLoading, refetch
 */
export function useTxHistory(): ReturnTxHistory {
  const [txHistory, setTxHistory] = useState<Tx[]>();
  const [isLoadingTxH, setIsLoadingTxH] = useState<boolean>(false);
  const { selectedPool } = useTradeStore();

  const { address } = useAccount();
  const { potentia } = usePotentiaSdk();

  async function refetch() {
    try {
      console.log("fetching txHistory...", {
        address,
        poolAddress: selectedPool.poolAddress
      });
      setIsLoadingTxH(true);
      const result = await potentia?.getUserTxHistory(
        address as Address,
        selectedPool.poolAddress
      );
      console.log('txHistory', result);
      setTxHistory(result);
    } catch (error) {
      console.error("Error -- fetching transaction history", error);
    } finally {
      setIsLoadingTxH(false);
    }
  }

  useEffect(() => {
    if (address && potentia) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, potentia, selectedPool]);

  return { data: txHistory, isLoading: isLoadingTxH, refetch };
}
