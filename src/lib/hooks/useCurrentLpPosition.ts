import { useAccount } from "wagmi";
import { Address } from "viem";
import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { UserCurrentLpPosition } from "@squaredlab-io/sdk";

interface PropsType {
  poolAddress: Address | undefined;
  paused?: boolean;
}

export type ReturnTxHistory = {
  data: UserCurrentLpPosition | undefined;
  isFetching: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<UserCurrentLpPosition | undefined, Error>>;
};

/**
 * useCurrentLpPosition
 */
export function useCurrentLpPosition({
  poolAddress,
  paused = false
}: PropsType): ReturnTxHistory {
  const { address } = useAccount();
  const { potentia } = usePotentiaSdk();

  async function getLpPosition() {
    try {
      const result = await potentia?.ponderClient.getCurrentLpPositions(
        poolAddress as Address, // poolAddress
        address as Address // user
      );
      if (!result?.userCurrentLpPoss.items.length) {
        return {
          pool: poolAddress,
          user: address,
          staked: "0",
          counterLpAmt: "0",
          lpTokenPriceUnderlying: "0",
          oraclePrice: "0"
        };
      }
      return result?.userCurrentLpPoss.items[0];
    } catch (error) {
      console.error("Error -- fetching current Lp position", error);
    }
  }

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["userCurrentLpPosition", poolAddress, address],
    queryFn: getLpPosition,
    enabled: !paused && !!poolAddress && !!potentia && !!address,
    staleTime: 20000,
    refetchOnReconnect: true,
    retry: 3
  });

  return { data, isFetching, refetch };
}
