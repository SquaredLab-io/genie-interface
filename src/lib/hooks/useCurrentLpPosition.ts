import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Address, getAddress } from "viem";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { usePoolsStore } from "@store/poolsStore";
import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { REFETCH_INTERVAL } from "@lib/constants";
import { UserCurrentLpPosition } from "@squaredlab-io/sdk";

interface PropsType {
    poolAddress: Address | undefined;
    paused?: boolean;
};

type ReturnTxHistory = {
  data: UserCurrentLpPosition | undefined;
  isFetching: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<UserCurrentLpPosition | undefined, Error>>;
};

/**
 * useTxHistory fetches connected user's Transaction history in the current Pool
 * @returns data, isLoading, refetch
 */
export function useCurrentLpPosition({poolAddress, paused = false} : PropsType): ReturnTxHistory {
  const { address } = useAccount();
  const { potentia } = usePotentiaSdk();
  console.log('useCurrentLpPosition');
//   const { selectedPool } = usePoolsStore();

  async function getLpPosition() {
    try {
      const result = await potentia?.ponderClient.getCurrentLpPositions(
        // getAddress(selectedPool()?.poolAddr!), // pool
        poolAddress as Address,
        address as Address // user
      );
      console.log("current Lp position : ", result?.userCurrentLpPoss.items[0]);
      return result?.userCurrentLpPoss.items[0];
      // setTxHistory(result);
    } catch (error) {
      console.error("Error -- fetching current Lp position", error);
    }
  }

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["userCurrentLpPosition", poolAddress, address],
    queryFn: getLpPosition,
    refetchInterval: REFETCH_INTERVAL,
    enabled: !paused && !!poolAddress && !!potentia && !!address
  });

  return { data, isFetching, refetch };
}
