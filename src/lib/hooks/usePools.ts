import { QueryObserverResult, RefetchOptions, useQuery } from "@tanstack/react-query";
import { PoolInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { usePotentiaSdk } from "./usePotentiaSdk";
import { usePoolsStore } from "@store/poolsStore";

interface ReturnType {
  pools: PoolInfo[] | undefined;
  isFetching: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<PoolInfo[] | undefined, Error>>;
  status: "error" | "success" | "pending";
}

export function usePools(paused = false): ReturnType {
  const { potentia } = usePotentiaSdk();

  // Using this poolsData for global instance
  const { updatePoolsData } = usePoolsStore();

  const getPools = async () => {
    try {
      const data = await potentia?.getPools();
      console.log("pools @usePools", data);
      updatePoolsData(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch pools.");
    }
  };

  const { data, isFetching, refetch, isError, error, status } = useQuery({
    queryKey: ["geniePools"],
    queryFn: getPools,
    refetchInterval: false,
    enabled: !paused && !!potentia
  });

  return {
    pools: data,
    isFetching,
    refetch,
    status
  } satisfies ReturnType;
}
