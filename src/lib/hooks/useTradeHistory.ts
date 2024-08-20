import { Address, getAddress } from "viem";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { usePoolsStore } from "@store/poolsStore";
import { Tx } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { REFETCH_INTERVAL } from "@lib/constants";

type ReturnTxHistory = {
  data: Tx[] | undefined;
  isFetching: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Tx[] | undefined, Error>>;
};

/**
 * useTradeHistory hook fetches connected user's Transaction history in the current Pool
 * @returns data, isLoading, refetch
 */
export function useTradeHistory(paused = false): ReturnTxHistory {
  const { selectedPool } = usePoolsStore();
  const { potentia } = usePotentiaSdk();

  async function getTradeHistory() {
    try {
      const result = await potentia?.getTradeHistory(
        getAddress(selectedPool()?.poolAddr!) // pool
      ); 
      // console.log("trade history --\n", result);
      return result;
    } catch (error) {
      console.error("Error -- fetching trade history", error);
    }
  }

  const { data, status, isFetching, refetch } = useQuery({
    queryKey: ["tradeHistory", selectedPool()?.underlying],
    queryFn: getTradeHistory,
    refetchInterval: REFETCH_INTERVAL,
    enabled: !!selectedPool() && !!potentia && !paused,
    staleTime: 0
  });
  
  return { data, isFetching, refetch };
}
