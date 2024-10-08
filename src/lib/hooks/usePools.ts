import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { PoolInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { usePoolsStore } from "@store/poolsStore";

export interface PoolMapping {
  power: number;
  underlying: string;
  decimals: number;
  poolAddr: string;
}

interface ReturnType {
  pools: PoolInfo[] | undefined;
  isFetching: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<PoolInfo[] | undefined, Error>>;
  status: "error" | "success" | "pending";
}

function createPoolMapping(
  pools: PoolInfo[] | undefined
): Record<string, PoolMapping> | undefined {
  if (!pools) return undefined;
  return pools.reduce(
    (mapping, pool) => {
      mapping[pool.poolAddr] = {
        power: pool.power,
        underlying: pool.underlying,
        decimals: pool.underlyingDecimals,
        poolAddr: pool.poolAddr
      };
      return mapping;
    },
    {} as Record<string, PoolMapping>
  );
}

export function usePools(paused = false): ReturnType {
  const { potentia } = usePotentiaSdk();

  // Using this poolsData for global instance
  const { updatePoolsData, updatePoolMap } = usePoolsStore();

  const getPools = async () => {
    try {
      const data = await potentia?.getPools();
      updatePoolsData(data);
      updatePoolMap(createPoolMapping(data));
      return data;
    } catch (error) {
      console.error("Failed to fetch pools.");
    }
  };

  const { data, isFetching, refetch, status } = useQuery({
    queryKey: ["geniePools"],
    queryFn: getPools,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 3,
    // This sets the retry delay for failed queries using an exponential backoff strategy, doubling the delay each attempt
    // It caps the maximum delay at 30 seconds (30000ms)
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !paused && !!potentia
  });

  return {
    pools: data,
    isFetching,
    refetch,
    status
  } satisfies ReturnType;
}
